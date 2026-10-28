import { Decoder, Stream, type LapMesg, type SplitMesg } from "@garmin/fitsdk";
import { unzipSync } from "fflate";

export interface Split {
  kind: "lap" | "run" | "walk" | "stand";
  index: number;
  startSec: number;
  distanceKm: number;
  durationSec: number;
  elapsedSec?: number;
  pacePerKm: string;
  bestPacePerKm?: string;
  avgHr?: number;
  maxHr?: number;
  minHr?: number;
  avgCadenceSpm?: number;
  maxCadenceSpm?: number;
  avgPowerW?: number;
  maxPowerW?: number;
  normalizedPowerW?: number;
  groundContactMs?: number;
  verticalOscillationMm?: number;
  verticalRatioPct?: number;
  stepLengthM?: number;
  elevGainM?: number;
  elevLossM?: number;
  calories?: number;
}

const SEGMENT_KINDS = { rwdRun: "run", rwdWalk: "walk", rwdStand: "stand" } as const;

export function parseSplits(zip: Uint8Array): Split[] {
  const fitFile = Object.entries(unzipSync(zip)).find(([name]) => name.toLowerCase().endsWith(".fit"));
  if (!fitFile) throw new Error("No .fit file in activity download");

  const { messages, errors } = new Decoder(Stream.fromByteArray(fitFile[1])).read();
  if (errors.length) throw errors[0];
  return toSplits(messages.lapMesgs ?? [], messages.splitMesgs ?? [], messages.sessionMesgs?.[0]?.startTime);
}

/** Returns the laps, then the run/walk/stand segments in time order. */
export function toSplits(laps: LapMesg[], segments: SplitMesg[], start = laps[0]?.startTime): Split[] {
  const runWalk = segments
    .filter((s) => s.splitType && s.splitType in SEGMENT_KINDS)
    .sort((a, b) => Number(a.startTime) - Number(b.startTime));
  return [
    ...laps.map((lap, i) => toSplit(lap, "lap", i + 1, start)),
    ...runWalk.map((s, i) => toSplit(s, SEGMENT_KINDS[s.splitType as keyof typeof SEGMENT_KINDS], i + 1, start)),
  ];
}

function toSplit(m: Partial<LapMesg> & Partial<SplitMesg>, kind: Split["kind"], index: number, start?: LapMesg["startTime"]): Split {
  const distance = m.totalDistance ?? 0;
  const duration = m.totalTimerTime ?? 0;
  const maxSpeed = m.enhancedMaxSpeed ?? m.maxSpeed;
  return {
    kind,
    index,
    startSec: m.startTime && start ? Math.round((Number(m.startTime) - Number(start)) / 1000) : 0,
    distanceKm: Math.round(distance) / 1000,
    durationSec: Math.round(duration),
    elapsedSec: m.totalElapsedTime === undefined ? undefined : Math.round(m.totalElapsedTime),
    pacePerKm: distance > 0 ? formatPace((duration / distance) * 1000) : "",
    bestPacePerKm: maxSpeed ? formatPace(1000 / maxSpeed) : undefined,
    avgHr: m.avgHeartRate,
    maxHr: m.maxHeartRate,
    minHr: m.minHeartRate,
    // FIT stores running cadence as strides per minute, with the fraction in a separate field on laps.
    avgCadenceSpm: stepsPerMinute(m.avgRunningCadence, m.avgFractionalCadence),
    maxCadenceSpm: stepsPerMinute(m.maxRunningCadence, m.maxFractionalCadence),
    avgPowerW: m.avgPower,
    maxPowerW: m.maxPower,
    normalizedPowerW: m.normalizedPower,
    groundContactMs: m.avgStanceTime,
    verticalOscillationMm: m.avgVerticalOscillation,
    verticalRatioPct: m.avgVerticalRatio,
    stepLengthM: m.avgStepLength === undefined ? undefined : Math.round(m.avgStepLength) / 1000,
    elevGainM: m.totalAscent,
    elevLossM: m.totalDescent,
    calories: m.totalCalories,
  };
}

function stepsPerMinute(strides?: number, fraction = 0): number | undefined {
  return strides === undefined ? undefined : Math.round((strides + fraction) * 2);
}

function formatPace(secPerKm: number): string {
  const total = Math.round(secPerKm);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
