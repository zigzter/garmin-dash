import { useState } from "react";
import type { Activity, HealthDay } from "../../server/api.types.ts";
import { Activities } from "./Activities.tsx";
import { ErrorNotice } from "./ErrorNotice.tsx";
import { History } from "./History.tsx";
import { Recovery } from "./Recovery.tsx";
import { useJson } from "./useJson.ts";

const DAYS = 30;

export function App() {
  const health = useJson<HealthDay[]>(`/api/health?days=${DAYS}`);
  const activities = useJson<Activity[]>("/api/activities?limit=30");
  const [cursor, setCursor] = useState<string>();
  const today = new Date().toLocaleDateString("en-CA");

  return (
    <div className="app">
      <header className="topbar">
        <h1>Garmin Dash</h1>
        <span className="topbar-meta">
          {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          {health.data?.length ? ` · ${formatRange(health.data[health.data.length - 1].date, health.data[0].date)}` : ""}
        </span>
      </header>

      <main>
        {health.error ? (
          <div className="panel">
            <ErrorNotice error={health.error} retry={health.retry} />
          </div>
        ) : health.data?.length ? (
          <Recovery days={health.data} today={today} cursor={cursor} onCursor={setCursor} />
        ) : health.data ? (
          <p className="panel notice">Garmin returned no health data for the last {DAYS} days.</p>
        ) : (
          <RecoverySkeleton />
        )}

        <div className="columns">
          {health.data?.length ? (
            <History days={health.data} today={today} cursor={cursor} onCursor={setCursor} />
          ) : (
            !health.error && !health.data && <TableSkeleton title="Daily history" />
          )}
          {activities.error ? (
            <section>
              <div className="section-head">
                <h2>Activities</h2>
              </div>
              <div className="panel">
                <ErrorNotice error={activities.error} retry={activities.retry} />
              </div>
            </section>
          ) : activities.data ? (
            <Activities activities={activities.data} />
          ) : (
            <TableSkeleton title="Activities" />
          )}
        </div>
      </main>
    </div>
  );
}

function RecoverySkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading recovery">
      <div className="section-head">
        <h2>Last night</h2>
      </div>
      <div className="panel recovery">
        {[0, 1, 2, 3].map((i) => (
          <div className="metric" key={i}>
            <div className="skeleton" style={{ height: 14, width: "40%" }} />
            <div className="skeleton" style={{ height: 26, width: "55%", marginTop: 10 }} />
            <div className="skeleton" style={{ height: 14, width: "70%", marginTop: 8 }} />
            <div className="skeleton" style={{ height: 56, marginTop: 12 }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TableSkeleton({ title }: { title: string }) {
  return (
    <section aria-busy="true" aria-label={`Loading ${title.toLowerCase()}`}>
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <div className="panel" style={{ padding: 12 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div className="skeleton" key={i} style={{ height: 18, marginTop: i ? 16 : 0 }} />
        ))}
      </div>
    </section>
  );
}

function formatRange(from: string, to: string): string {
  const format = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  return `${format(from)} – ${format(to)}`;
}
