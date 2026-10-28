import { Decoder, Stream, type LapMesg } from "@garmin/fitsdk";
import { unzipSync } from "fflate";

export interface Split {
  lap: number;
  distanceKm: number;
  durationSec: number;
  pacePerKm: string;
  avgHr?: number;
  maxHr?: number;
  elevGainM?: number;
}

export function parseSplits(zip: Uint8Array): Split[] {
  const fitFile = Object.entries(unzipSync(zip)).find(([name]) => name.toLowerCase().endsWith(".fit"));
  if (!fitFile) throw new Error("No .fit file in activity download");

  const { messages, errors } = new Decoder(Stream.fromByteArray(fitFile[1])).read();
  if (errors.length) throw errors[0];
  return lapsToSplits(messages.lapMesgs ?? []);
}

export function lapsToSplits(laps: LapMesg[]): Split[] {
  return laps.map((lap, i) => {
    const distance = lap.totalDistance ?? 0;
    const duration = lap.totalTimerTime ?? 0;
    return {
      lap: i + 1,
      distanceKm: Math.round(distance) / 1000,
      durationSec: Math.round(duration),
      pacePerKm: distance > 0 ? formatPace((duration / distance) * 1000) : "",
      avgHr: lap.avgHeartRate,
      maxHr: lap.maxHeartRate,
      elevGainM: lap.totalAscent,
    };
  });
}

function formatPace(secPerKm: number): string {
  const total = Math.round(secPerKm);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
