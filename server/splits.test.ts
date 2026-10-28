import type { LapMesg, SplitMesg } from "@garmin/fitsdk";
import { expect, test } from "vitest";
import { toSplits } from "./splits.ts";

test("converts FIT laps and run/walk segments to splits", () => {
  const start = new Date("2000-01-01T00:00:00Z");
  const laps = [
    {
      startTime: start,
      totalDistance: 1000,
      totalTimerTime: 312.4,
      avgHeartRate: 150,
      avgRunningCadence: 84,
      avgFractionalCadence: 0.5,
      avgStepLength: 1195.5,
    },
  ] as LapMesg[];
  const segments = [
    { splitType: "rwdWalk", startTime: new Date("2000-01-01T00:01:27Z"), totalDistance: 50, totalTimerTime: 40 },
    { splitType: "intervalActive", startTime: start, totalDistance: 1000, totalTimerTime: 312 },
    { splitType: "rwdRun", startTime: start, totalDistance: 950, totalTimerTime: 272.4, avgRunningCadence: 86.25 },
  ] as SplitMesg[];

  const [lap, run, walk, ...rest] = toSplits(laps, segments);
  expect(lap).toMatchObject({ kind: "lap", index: 1, pacePerKm: "5:12", avgCadenceSpm: 169, stepLengthM: 1.196 });
  expect(run).toMatchObject({ kind: "run", index: 1, startSec: 0, avgCadenceSpm: 173 });
  expect(walk).toMatchObject({ kind: "walk", index: 2, startSec: 87, pacePerKm: "13:20" });
  expect(rest).toEqual([]);
});
