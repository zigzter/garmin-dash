import { Fragment, useState } from "react";
import { formatDuration, Splits } from "./Splits.tsx";
import { useJson } from "./useJson.ts";

interface HealthRow {
  date: string;
  steps?: number;
  restingHr?: number;
  avgStress?: number;
  bodyBatteryHigh?: number;
  bodyBatteryLow?: number;
  sleepSeconds?: number;
  sleepScore?: number;
  hrvAvg?: number;
}

interface Activity {
  id: number;
  name: string;
  type: string;
  start: string;
  distance?: number;
  duration?: number;
  avgHr?: number;
}

export function App() {
  return (
    <main>
      <h1>Garmin Dash</h1>
      <Health />
      <Activities />
    </main>
  );
}

function Health() {
  const { data, error } = useJson<HealthRow[]>("/api/health?days=7");

  return (
    <section>
      <h2>Health (last 7 days)</h2>
      {error && <p>Error: {error}</p>}
      {!data && !error && <p>Loading…</p>}
      {data && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Steps</th>
              <th>Resting HR</th>
              <th>Avg stress</th>
              <th>Body Battery</th>
              <th>Sleep</th>
              <th>Sleep score</th>
              <th>HRV</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date}>
                <td>{d.date}</td>
                <td>{d.steps}</td>
                <td>{d.restingHr}</td>
                <td>{d.avgStress}</td>
                <td>{d.bodyBatteryLow !== undefined && `${d.bodyBatteryLow}–${d.bodyBatteryHigh}`}</td>
                <td>{d.sleepSeconds !== undefined && formatDuration(d.sleepSeconds)}</td>
                <td>{d.sleepScore}</td>
                <td>{d.hrvAvg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function Activities() {
  const { data, error } = useJson<Activity[]>("/api/activities?limit=20");
  const [openId, setOpenId] = useState<number>();

  return (
    <section>
      <h2>Recent activities</h2>
      {error && <p>Error: {error}</p>}
      {!data && !error && <p>Loading…</p>}
      {data && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Type</th>
              <th>Distance (km)</th>
              <th>Time</th>
              <th>Avg HR</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <Fragment key={a.id}>
                <tr>
                  <td>{a.start}</td>
                  <td>{a.name}</td>
                  <td>{a.type}</td>
                  <td>{a.distance !== undefined && (a.distance / 1000).toFixed(2)}</td>
                  <td>{a.duration !== undefined && formatDuration(a.duration)}</td>
                  <td>{a.avgHr && Math.round(a.avgHr)}</td>
                  <td>
                    <button onClick={() => setOpenId(openId === a.id ? undefined : a.id)}>
                      {openId === a.id ? "Hide splits" : "Splits"}
                    </button>
                  </td>
                </tr>
                {openId === a.id && (
                  <tr>
                    <td colSpan={7}>
                      <Splits activityId={a.id} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
