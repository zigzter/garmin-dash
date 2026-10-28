export interface DailySummaries {
  data: {
    calendarDate: string;
    movement?: { steps?: { value?: number } };
    heartRate?: { restingValue?: number };
    stress?: { avgLevel?: number };
    bodyBattery?: { minValue?: number; maxValue?: number };
  }[];
}

export interface SleepSummary {
  calendarDate: string;
  sleepTimeSeconds?: number;
  sleepScores?: { overall?: { value?: number } };
}

export interface HrvSummaries {
  hrvSummaries: { calendarDate: string; lastNightAvg?: number }[];
}

export interface ActivitySummary {
  activityId: number;
  activityName: string;
  activityType: { typeKey: string };
  startTimeLocal: string;
  distance?: number;
  duration?: number;
  averageHR?: number;
}
