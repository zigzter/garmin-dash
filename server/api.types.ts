export interface HealthDay {
  date: string;
  steps?: number;
  restingHr?: number;
  avgStress?: number;
  bodyBatteryHigh?: number;
  bodyBatteryLow?: number;
  sleepSeconds?: number;
  sleepScore?: number;
  sleepNeedSeconds?: number;
  hrvAvg?: number;
  hrvBalancedLow?: number;
  hrvBalancedHigh?: number;
  hrvStatus?: string;
  // Sum of activity training load over the 7 days ending on this date.
  weekLoad: number;
}

export interface Activity {
  id: number;
  name: string;
  type: string;
  start: string;
  distance?: number;
  duration?: number;
  avgHr?: number;
  maxHr?: number;
  trainingLoad?: number;
  aerobicEffect?: number;
  anaerobicEffect?: number;
  effectLabel?: string;
}

export interface ApiError {
  error: string;
  kind: "auth" | "upstream";
}
