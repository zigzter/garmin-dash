import type { LapMesg } from "@garmin/fitsdk";
import { expect, test } from "vitest";
import { lapsToSplits } from "./splits.ts";

test("converts FIT laps to km splits with pace", () => {
  const laps = [
    { totalDistance: 1000, totalTimerTime: 312.4, avgHeartRate: 150, maxHeartRate: 162, totalAscent: 8 },
    { totalDistance: 0, totalTimerTime: 60 },
  ] as LapMesg[];

  expect(lapsToSplits(laps)).toEqual([
    { lap: 1, distanceKm: 1, durationSec: 312, pacePerKm: "5:12", avgHr: 150, maxHr: 162, elevGainM: 8 },
    { lap: 2, distanceKm: 0, durationSec: 60, pacePerKm: "", avgHr: undefined, maxHr: undefined, elevGainM: undefined },
  ]);
});
