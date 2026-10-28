import type { Split } from "../../server/splits.ts";
import { downloadCsv } from "./csv.ts";
import { useJson } from "./useJson.ts";

export function Splits({ activityId }: { activityId: number }) {
  const { data, error } = useJson<Split[]>(`/api/activities/${activityId}/splits`);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading splits…</p>;

  return (
    <div>
      <button onClick={() => downloadCsv(`activity-${activityId}-splits.csv`, data as unknown as Record<string, unknown>[])}>
        Export CSV
      </button>
      <table>
        <thead>
          <tr>
            <th>Lap</th>
            <th>Distance (km)</th>
            <th>Time</th>
            <th>Pace (/km)</th>
            <th>Avg HR</th>
            <th>Max HR</th>
            <th>Ascent (m)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.lap}>
              <td>{s.lap}</td>
              <td>{s.distanceKm.toFixed(2)}</td>
              <td>{formatDuration(s.durationSec)}</td>
              <td>{s.pacePerKm}</td>
              <td>{s.avgHr}</td>
              <td>{s.maxHr}</td>
              <td>{s.elevGainM}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
}
