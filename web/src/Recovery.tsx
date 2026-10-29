import type { HealthDay } from "../../server/api.types.ts";
import { formatDay, formatHoursMinutes, formatSigned, formatType } from "./format.ts";
import { Trend } from "./Trend.tsx";

interface Metric {
  label: string;
  unit?: string;
  value: (d: HealthDay) => number | undefined;
  format: (v: number) => string;
  // Metrics without a better direction show departures in a neutral tone.
  better?: "higher" | "lower";
  // Smallest vertical range of the trend, so day-to-day noise does not fill the chart.
  minSpan: number;
  // Normal range from Garmin. Without it, normal is a band around the average of the other days.
  range?: (d: HealthDay) => [number, number] | undefined;
  detail?: (d: HealthDay) => string | undefined;
}

const METRICS: Metric[] = [
  {
    label: "Sleep",
    value: (d) => d.sleepSeconds,
    format: formatHoursMinutes,
    better: "higher",
    minSpan: 3 * 3600,
    detail: (d) =>
      [
        d.sleepScore === undefined ? undefined : `Score ${d.sleepScore}`,
        d.sleepNeedSeconds === undefined ? undefined : `Need ${formatHoursMinutes(d.sleepNeedSeconds)}`,
      ]
        .filter(Boolean)
        .join(" · ") || undefined,
  },
  {
    label: "HRV",
    unit: "ms",
    value: (d) => d.hrvAvg,
    format: (v) => String(Math.round(v)),
    better: "higher",
    minSpan: 20,
    range: (d) =>
      d.hrvBalancedLow === undefined || d.hrvBalancedHigh === undefined ? undefined : [d.hrvBalancedLow, d.hrvBalancedHigh],
    detail: (d) => (d.hrvStatus === undefined ? undefined : formatType(d.hrvStatus.toLowerCase())),
  },
  {
    label: "Resting HR",
    unit: "bpm",
    value: (d) => d.restingHr,
    format: (v) => String(Math.round(v)),
    better: "lower",
    minSpan: 12,
  },
  {
    label: "Load",
    value: (d) => d.weekLoad,
    format: (v) => String(Math.round(v)),
    minSpan: 100,
    detail: () => "7-day",
  },
];

// Departures smaller than this share of the average count as normal.
const NORMAL_BAND = 0.05;

type Tone = "good" | "warn" | "normal" | "neutral";

const toneColor: Record<Tone, string> = {
  good: "var(--good)",
  warn: "var(--warn)",
  normal: "var(--accent)",
  neutral: "var(--accent)",
};

interface RecoveryProps {
  days: HealthDay[];
  today: string;
  cursor: string | undefined;
  onCursor: (date: string | undefined) => void;
}

export function Recovery({ days, today, cursor, onCursor }: RecoveryProps) {
  const chrono = [...days].reverse();
  const selected = days.find((d) => d.date === cursor) ?? days[0];
  const cursorIndex = chrono.indexOf(selected);

  return (
    <section className="recovery-section" aria-labelledby="recovery-title">
      <div className="section-head">
        <h2 id="recovery-title" aria-live="polite">
          {selected.date === today ? "Last night" : formatDay(selected.date, today)}
        </h2>
        <p>vs your normal</p>
      </div>
      <div className="panel recovery">
        {METRICS.map((m) => {
          const value = m.value(selected);
          const others = chrono
            .filter((d) => d !== selected)
            .map(m.value)
            .filter((v): v is number => v !== undefined);
          const average = others.length ? others.reduce((a, b) => a + b, 0) / others.length : undefined;
          const range = m.range?.(selected);
          const band =
            range ?? (average === undefined ? undefined : ([average * (1 - NORMAL_BAND), average * (1 + NORMAL_BAND)] as const));
          const delta = departureOf(value, band);
          const tone = toneOf(m, delta);
          return (
            <div className="metric" key={m.label}>
              <div className="metric-label">
                <span>{m.label}</span>
                <span>{m.detail?.(selected)}</span>
              </div>
              <Departure metric={m} value={value} delta={delta} tone={tone} />
              <div className="metric-reading">
                {value === undefined ? (
                  "No data"
                ) : (
                  <>
                    <strong>
                      {m.format(value)}
                      {m.unit && ` ${m.unit}`}
                    </strong>
                    {range
                      ? ` · balanced ${m.format(range[0])}–${m.format(range[1])}`
                      : average !== undefined && ` · avg ${m.format(average)}`}
                  </>
                )}
              </div>
              <Trend
                label={m.label}
                values={chrono.map(m.value)}
                average={average}
                band={band}
                minSpan={m.minSpan}
                cursorIndex={cursorIndex}
                cursorColor={toneColor[tone ?? "normal"]}
                onCursor={(i) => onCursor(i === undefined ? undefined : chrono[i].date)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Returns the distance from the value to the nearest edge of the band, or 0 inside it.
function departureOf(value: number | undefined, band: readonly [number, number] | undefined): number | undefined {
  if (value === undefined || band === undefined) return undefined;
  if (value < band[0]) return value - band[0];
  if (value > band[1]) return value - band[1];
  return 0;
}

function toneOf(metric: Metric, delta?: number): Tone | undefined {
  if (delta === undefined) return undefined;
  if (delta === 0) return "normal";
  if (metric.better === undefined) return "neutral";
  return (metric.better === "higher" ? delta > 0 : delta < 0) ? "good" : "warn";
}

function Departure({ metric, value, delta, tone }: { metric: Metric; value?: number; delta?: number; tone?: Tone }) {
  if (value === undefined || delta === undefined || tone === undefined) {
    return <div className="metric-value missing">{value === undefined ? "No data" : "No average"}</div>;
  }
  if (tone === "normal") return <div className="metric-value" data-tone="normal">Normal</div>;
  return (
    <div className="metric-value" data-tone={tone}>
      {formatSigned(delta, metric.format)}
      {metric.unit && <small>{metric.unit}</small>}
    </div>
  );
}
