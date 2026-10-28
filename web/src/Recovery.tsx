import type { HealthDay } from "../../server/api.types.ts";
import { formatDay, formatHoursMinutes, formatSigned } from "./format.ts";
import { Trend } from "./Trend.tsx";

interface Metric {
  label: string;
  unit?: string;
  value: (d: HealthDay) => number | undefined;
  format: (v: number) => string;
  better: "higher" | "lower";
  // Smallest vertical range of the trend, so day-to-day noise does not fill the chart.
  minSpan: number;
  detail?: (d: HealthDay) => string | undefined;
}

const METRICS: Metric[] = [
  {
    label: "Sleep",
    value: (d) => d.sleepSeconds,
    format: formatHoursMinutes,
    better: "higher",
    minSpan: 3 * 3600,
    detail: (d) => (d.sleepScore === undefined ? undefined : `Score ${d.sleepScore}`),
  },
  { label: "HRV", unit: "ms", value: (d) => d.hrvAvg, format: (v) => String(Math.round(v)), better: "higher", minSpan: 20 },
  {
    label: "Resting HR",
    unit: "bpm",
    value: (d) => d.restingHr,
    format: (v) => String(Math.round(v)),
    better: "lower",
    minSpan: 12,
  },
  {
    label: "Body Battery",
    value: (d) => d.bodyBatteryHigh,
    format: (v) => String(Math.round(v)),
    better: "higher",
    minSpan: 40,
    detail: () => "Peak",
  },
];

// Departures smaller than this share of the average count as normal.
const NORMAL_BAND = 0.05;

type Tone = "good" | "warn" | "normal";

const toneColor: Record<Tone, string> = { good: "var(--good)", warn: "var(--warn)", normal: "var(--accent)" };

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
        <p>vs your average of the other days</p>
      </div>
      <div className="panel recovery">
        {METRICS.map((m) => {
          const value = m.value(selected);
          const others = chrono
            .filter((d) => d !== selected)
            .map(m.value)
            .filter((v): v is number => v !== undefined);
          const average = others.length ? others.reduce((a, b) => a + b, 0) / others.length : undefined;
          const tone = toneOf(m, value, average);
          return (
            <div className="metric" key={m.label}>
              <div className="metric-label">
                <span>{m.label}</span>
                <span>{m.detail?.(selected)}</span>
              </div>
              <Departure metric={m} value={value} average={average} tone={tone} />
              <div className="metric-reading">
                {value === undefined ? (
                  "No data"
                ) : (
                  <>
                    <strong>
                      {m.format(value)}
                      {m.unit && ` ${m.unit}`}
                    </strong>
                    {average !== undefined && ` · avg ${m.format(average)}`}
                  </>
                )}
              </div>
              <Trend
                label={m.label}
                values={chrono.map(m.value)}
                average={average}
                band={NORMAL_BAND}
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

function toneOf(metric: Metric, value?: number, average?: number): Tone | undefined {
  if (value === undefined || average === undefined) return undefined;
  const delta = value - average;
  if (Math.abs(delta) < average * NORMAL_BAND) return "normal";
  return (metric.better === "higher" ? delta > 0 : delta < 0) ? "good" : "warn";
}

function Departure({ metric, value, average, tone }: { metric: Metric; value?: number; average?: number; tone?: Tone }) {
  if (value === undefined || average === undefined || tone === undefined) {
    return <div className="metric-value missing">{value === undefined ? "No data" : "No average"}</div>;
  }
  if (tone === "normal") return <div className="metric-value" data-tone="normal">Normal</div>;
  return (
    <div className="metric-value" data-tone={tone}>
      {formatSigned(value - average, metric.format)}
      {metric.unit && <small>{metric.unit}</small>}
    </div>
  );
}
