import { ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import type { Activity } from "../../server/api.types.ts";
import { effortFor, formatDuration, formatEffort, formatStart, formatTrainingEffect, formatType } from "./format.ts";
import { Missing } from "./History.tsx";
import { prefetchSplits, Splits } from "./Splits.tsx";

const COLUMNS = 7;

export function Activities({ activities }: { activities: Activity[] }) {
  const [openId, setOpenId] = useState<number>();

  return (
    <section aria-labelledby="activities-title">
      <div className="section-head">
        <h2 id="activities-title">Activities</h2>
        <p>{activities.length} most recent</p>
      </div>
      <div className="panel table-scroll">
        {activities.length === 0 ? (
          <p className="notice">No activities recorded yet. Workouts appear here after your watch syncs.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Time</th>
                <th scope="col" className="p2">Distance</th>
                <th scope="col" className="p2">Pace / speed</th>
                <th scope="col">Avg HR</th>
                <th scope="col" className="p2">Load</th>
                <th scope="col" className="p3">Training effect</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => {
                const open = openId === a.id;
                const effort = effortFor(a.type, a.distance);
                return (
                  <Fragment key={a.id}>
                    <tr
                      className="activity-row"
                      aria-expanded={open}
                      onPointerEnter={() => prefetchSplits(a.id)}
                      onClick={() => setOpenId(open ? undefined : a.id)}
                    >
                      <td className="activity-main">
                        <div className="activity-main-inner">
                          <button
                            className="activity-toggle"
                            aria-expanded={open}
                            aria-controls={`splits-${a.id}`}
                            onFocus={() => prefetchSplits(a.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenId(open ? undefined : a.id);
                            }}
                          >
                            <ChevronRight size={14} aria-hidden />
                            <span className="activity-name">{a.name}</span>
                          </button>
                          <span className="activity-type">
                            {formatStart(a.start)}
                            {!sameWords(a.name, a.type) && ` · ${formatType(a.type)}`}
                            {effort !== "none" && a.distance && (
                              <span className="narrow-only">
                                {`${(a.distance / 1000).toFixed(2)}\u00a0km · ${formatEffort(effort, a.distance, a.duration ?? 0) ?? ""}`}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td>{a.duration === undefined ? <Missing /> : formatDuration(a.duration)}</td>
                      <td className="p2">{effort === "none" ? null : `${((a.distance ?? 0) / 1000).toFixed(2)} km`}</td>
                      <td className="p2">{effort === "none" ? null : formatEffort(effort, a.distance ?? 0, a.duration ?? 0)}</td>
                      <td>{a.avgHr === undefined ? <Missing /> : Math.round(a.avgHr)}</td>
                      <td className="p2">{a.trainingLoad === undefined ? <Missing /> : Math.round(a.trainingLoad)}</td>
                      <td className="p3">
                        {a.aerobicEffect === undefined || a.anaerobicEffect === undefined ? (
                          <Missing />
                        ) : (
                          <>
                            {a.effectLabel && <span className="muted">{formatTrainingEffect(a.effectLabel)} · </span>}
                            {`${a.aerobicEffect.toFixed(1)} / ${a.anaerobicEffect.toFixed(1)}`}
                          </>
                        )}
                      </td>
                    </tr>
                    {open && (
                      <tr id={`splits-${a.id}`}>
                        <td className="splits-cell" colSpan={COLUMNS}>
                          <Splits activity={a} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function sameWords(name: string, typeKey: string): boolean {
  const n = name.toLowerCase();
  const t = typeKey.replaceAll("_", " ");
  return t.includes(n) || n.includes(t);
}
