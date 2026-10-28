import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { garminDownload, garminGet } from "./garmin.ts";
import type { ActivitySummary, DailySummaries, HrvSummaries, SleepSummary } from "./garmin.types.ts";
import { parseSplits } from "./splits.ts";

const app = new Hono();

app.get("/api/health", async (c) => {
  const days = Number(c.req.query("days") ?? 7);
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  // en-CA formats as YYYY-MM-DD in the local timezone.
  const startDate = start.toLocaleDateString("en-CA");
  const endDate = end.toLocaleDateString("en-CA");

  const [summaries, sleep, hrv] = await Promise.all([
    garminGet<DailySummaries>("/usersummary-service/v2/dailysummaries", { startDate, endDate }),
    garminGet<SleepSummary[]>("/sleep-service/sleep/dailySleepSummariesByDate", { startDate, endDate }),
    garminGet<HrvSummaries>(`/hrv-service/hrv/daily/${startDate}/${endDate}`),
  ]);

  const rows = summaries.data.map((s) => {
    const sl = sleep.find((x) => x.calendarDate === s.calendarDate);
    const h = hrv.hrvSummaries.find((x) => x.calendarDate === s.calendarDate);
    return {
      date: s.calendarDate,
      steps: s.movement?.steps?.value,
      restingHr: s.heartRate?.restingValue,
      avgStress: s.stress?.avgLevel,
      bodyBatteryHigh: s.bodyBattery?.maxValue,
      bodyBatteryLow: s.bodyBattery?.minValue,
      sleepSeconds: sl?.sleepTimeSeconds,
      sleepScore: sl?.sleepScores?.overall?.value,
      hrvAvg: h?.lastNightAvg,
    };
  });
  return c.json(rows.reverse());
});

app.get("/api/activities", async (c) => {
  const limit = Number(c.req.query("limit") ?? 20);
  const activities = await garminGet<ActivitySummary[]>("/activitylist-service/activities/search/activities", {
    start: 0,
    limit,
  });
  return c.json(
    activities.map((a) => ({
      id: a.activityId,
      name: a.activityName,
      type: a.activityType.typeKey,
      start: a.startTimeLocal,
      distance: a.distance,
      duration: a.duration,
      avgHr: a.averageHR,
    })),
  );
});

app.get("/api/activities/:id/splits", async (c) => {
  const zip = await garminDownload(`/download-service/files/activity/${c.req.param("id")}`);
  return c.json(parseSplits(zip));
});

serve({ fetch: app.fetch, port: 8787 }, ({ port }) => console.log(`API on http://localhost:${port}`));
