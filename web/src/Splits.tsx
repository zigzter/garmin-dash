import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import type { Activity, ApiError } from "../../server/api.types.ts";
import type { Split } from "../../server/splits.ts";
import { downloadCsv } from "./csv.ts";
import { ErrorNotice } from "./ErrorNotice.tsx";
import { effortFor, effortLabel, formatDuration, formatEffort } from "./format.ts";
import { Missing } from "./History.tsx";
import { fetchJson } from "./useJson.ts";

const cache = new Map<number, Promise<Split[]>>();

export function prefetchSplits(id: number): Promise<Split[]> {
  let request = cache.get(id);
  if (!request) {
    request = fetchJson<Split[]>(`/api/activities/${id}/splits`);
    request.catch(() => cache.delete(id));
    cache.set(id, request);
  }
  return request;
}

export function Splits({ activity }: { activity: Activity }) {
  const [splits, setSplits] = useState<Split[]>();
  const [error, setError] = useState<ApiError>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setError(undefined);
    prefetchSplits(activity.id).then(setSplits, setError);
  }, [activity.id, attempt]);

  if (error) return <ErrorNotice error={error} retry={() => setAttempt((n) => n + 1)} />;

  const effort = effortFor(activity.type, activity.distance);
  const hasDistance = effort !== "none";
  const laps = splits?.filter((s) => s.kind === "lap");
  const segmentCount = (splits?.length ?? 0) - (laps?.length ?? 0);

  return (
    <div className="splits">
      <div className="splits-head">
        <span>
          {laps ? `${laps.length} ${laps.length === 1 ? "lap" : "laps"}` : "Loading laps…"}
          {segmentCount > 0 && ` · ${segmentCount} run/walk segments in export`}
        </span>
        <button
          className="button button-primary"
          disabled={!splits?.length}
          onClick={() => splits && downloadCsv(csvName(activity), splits as unknown as Record<string, unknown>[])}
        >
          <Download size={14} aria-hidden /> Export CSV
        </button>
      </div>
      {laps === undefined ? (
        <div className="skeleton" style={{ height: 120 }} />
      ) : laps.length === 0 ? (
        <p className="muted">This activity has no lap data.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Lap</th>
                {hasDistance && <th scope="col">Distance</th>}
                <th scope="col">Time</th>
                {hasDistance && <th scope="col">{effortLabel[effort]}</th>}
                <th scope="col">Avg HR</th>
                <th scope="col" className="p2">Max HR</th>
                {hasDistance && <th scope="col" className="p3">Ascent</th>}
              </tr>
            </thead>
            <tbody>
              {laps.map((s) => (
                <tr key={s.index}>
                  <td>{s.index}</td>
                  {hasDistance && <td>{s.distanceKm.toFixed(2)} km</td>}
                  <td>{formatDuration(s.durationSec)}</td>
                  {hasDistance && <td>{formatEffort(effort, s.distanceKm * 1000, s.durationSec) ?? <Missing />}</td>}
                  <td>{s.avgHr ?? <Missing />}</td>
                  <td className="p2">{s.maxHr ?? <Missing />}</td>
                  {hasDistance && <td className="p3">{s.elevGainM === undefined ? <Missing /> : `${s.elevGainM} m`}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function csvName(activity: Activity): string {
  const slug = activity.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${activity.start.slice(0, 10)}-${slug || activity.id}-splits.csv`;
}
