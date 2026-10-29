import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import type { Activity, ApiError, HealthDay } from "./api.types.ts";
import { GarminError, garminDownload, garminGet } from "./garmin.ts";
import type { ActivitySummary, DailySummaries, HrvSummaries, SleepSummary } from "./garmin.types.ts";
import { parseSplits } from "./splits.ts";

const app = new Hono();

app.onError((err, c) => {
  console.error(err);
  if (err instanceof GarminError && err.kind === "auth") {
    return c.json<ApiError>({ error: err.message, kind: "auth" }, 502);
  }
  return c.json<ApiError>({ error: "The Garmin request failed. See the server log for details.", kind: "upstream" }, 502);
});

app.get("/api/health", async (c) => {
  const days = Number(c.req.query("days") ?? 30);
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  // en-CA formats as YYYY-MM-DD in the local timezone.
  const startDate = start.toLocaleDateString("en-CA");
  const endDate = end.toLocaleDateString("en-CA");
  const loadStartDate = new Date(start.getTime() - 6 * 86_400_000).toLocaleDateString("en-CA");

  const [summaries, sleep, hrv, activities] = await Promise.all([
    garminGet<DailySummaries>("/usersummary-service/v2/dailysummaries", { startDate, endDate }),
    garminGet<SleepSummary[]>("/sleep-service/sleep/dailySleepSummariesByDate", { startDate, endDate }),
    garminGet<HrvSummaries>(`/hrv-service/hrv/daily/${startDate}/${endDate}`),
    garminGet<ActivitySummary[]>("/activitylist-service/activities/search/activities", {
      start: 0,
      limit: 1000,
      startDate: loadStartDate,
      endDate,
    }),
  ]);

  const rows = summaries.data.map((s): HealthDay => {
    const sl = sleep.find((x) => x.calendarDate === s.calendarDate);
    const h = hrv.hrvSummaries.find((x) => x.calendarDate === s.calendarDate);
    const day = new Date(`${s.calendarDate}T12:00:00`);
    const weekStart = new Date(day.getTime() - 6 * 86_400_000).toLocaleDateString("en-CA");
    const weekLoad = activities
      .filter((a) => {
        const date = a.startTimeLocal.slice(0, 10);
        return date >= weekStart && date <= s.calendarDate;
      })
      .reduce((sum, a) => sum + (a.activityTrainingLoad ?? 0), 0);
    return {
      date: s.calendarDate,
      steps: s.movement?.steps?.value,
      restingHr: s.heartRate?.restingValue,
      avgStress: s.stress?.avgLevel,
      bodyBatteryHigh: s.bodyBattery?.maxValue,
      bodyBatteryLow: s.bodyBattery?.minValue,
      sleepSeconds: sl?.sleepTimeSeconds,
      sleepScore: sl?.sleepScores?.overall?.value,
      sleepNeedSeconds: sl?.sleepNeed?.actual === undefined ? undefined : sl.sleepNeed.actual * 60,
      hrvAvg: h?.lastNightAvg,
      hrvBalancedLow: h?.baseline?.balancedLow,
      hrvBalancedHigh: h?.baseline?.balancedUpper,
      hrvStatus: h?.status,
      weekLoad,
    };
  });
  return c.json(rows.reverse());
});

app.get("/api/activities", async (c) => {
  const limit = Number(c.req.query("limit") ?? 30);
  const activities = await garminGet<ActivitySummary[]>("/activitylist-service/activities/search/activities", {
    start: 0,
    limit,
  });
  return c.json(
    activities.map((a): Activity => ({
      id: a.activityId,
      name: a.activityName,
      type: a.activityType.typeKey,
      start: a.startTimeLocal,
      distance: a.distance,
      duration: a.duration,
      avgHr: a.averageHR,
      maxHr: a.maxHR,
      trainingLoad: a.activityTrainingLoad,
      aerobicEffect: a.aerobicTrainingEffect,
      anaerobicEffect: a.anaerobicTrainingEffect,
      effectLabel: a.trainingEffectLabel,
    })),
  );
});

app.get("/api/activities/:id{[0-9]+}/splits", async (c) => {
  const zip = await garminDownload(`/download-service/files/activity/${c.req.param("id")}`);
  return c.json(parseSplits(zip));
});

app.use("/*", serveStatic({ root: "./dist" }));

const hostname = process.env.HOST ?? "127.0.0.1";
serve({ fetch: app.fetch, hostname, port: 8787 }, ({ port }) => console.log(`Listening on http://${hostname}:${port}`));
