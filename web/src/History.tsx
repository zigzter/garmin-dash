import type { HealthDay } from "../../server/api.types.ts";
import { formatDay, formatHoursMinutes } from "./format.ts";

interface HistoryProps {
  days: HealthDay[];
  today: string;
  cursor: string | undefined;
  onCursor: (date: string | undefined) => void;
}

export function History({ days, today, cursor, onCursor }: HistoryProps) {
  return (
    <section aria-labelledby="history-title">
      <div className="section-head">
        <h2 id="history-title">Daily history</h2>
        <p>Last {days.length} days</p>
      </div>
      <div className="panel table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Sleep</th>
              <th scope="col" className="p2">Score</th>
              <th scope="col">HRV</th>
              <th scope="col">RHR</th>
              <th scope="col" className="p2">Body Battery</th>
              <th scope="col" className="p3">Stress</th>
              <th scope="col" className="p3">Steps</th>
            </tr>
          </thead>
          <tbody
            onPointerLeave={(e) => e.pointerType === "mouse" && onCursor(undefined)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onCursor(undefined)}
            onKeyDown={moveFocus}
          >
            {days.map((d) => (
              <tr
                key={d.date}
                className="history-row"
                tabIndex={0}
                data-active={d.date === cursor}
                onPointerEnter={() => onCursor(d.date)}
                onFocus={() => onCursor(d.date)}
              >
                <td>{formatDay(d.date, today)}</td>
                <Cell value={d.sleepSeconds} format={formatHoursMinutes} />
                <Cell value={d.sleepScore} className="p2" />
                <Cell value={d.hrvAvg} />
                <Cell value={d.restingHr} />
                <td className="p2">
                  {d.bodyBatteryLow === undefined || d.bodyBatteryHigh === undefined ? (
                    <Missing />
                  ) : (
                    `${d.bodyBatteryLow}–${d.bodyBatteryHigh}`
                  )}
                </td>
                <Cell value={d.avgStress} className="p3" />
                <Cell value={d.steps} className="p3" format={(v) => v.toLocaleString()} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function moveFocus(e: React.KeyboardEvent<HTMLTableSectionElement>) {
  const row = (e.target as HTMLElement).closest("tr");
  const next = e.key === "ArrowDown" ? row?.nextElementSibling : e.key === "ArrowUp" ? row?.previousElementSibling : null;
  if (next instanceof HTMLElement) {
    e.preventDefault();
    next.focus();
  }
}

function Cell({ value, format = String, className }: { value?: number; format?: (v: number) => string; className?: string }) {
  return <td className={className}>{value === undefined ? <Missing /> : format(value)}</td>;
}

export function Missing() {
  return (
    <span className="missing" aria-label="No data">
      —
    </span>
  );
}
