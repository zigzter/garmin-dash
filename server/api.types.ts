export interface HealthDay {
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

export interface Activity {
  id: number;
  name: string;
  type: string;
  start: string;
  distance?: number;
  duration?: number;
  avgHr?: number;
  maxHr?: number;
}

export interface ApiError {
  error: string;
  kind: "auth" | "upstream";
}
