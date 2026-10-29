import { garminGet } from "./garmin.ts";

const endDate = new Date().toLocaleDateString("en-CA");
const startDate = new Date(Date.now() - 2 * 86_400_000).toLocaleDateString("en-CA");

const calls: [string, Record<string, string | number>?][] = [
  ["/usersummary-service/v2/dailysummaries", { startDate, endDate }],
  ["/sleep-service/sleep/dailySleepSummariesByDate", { startDate, endDate }],
  [`/hrv-service/hrv/daily/${startDate}/${endDate}`],
  ["/activitylist-service/activities/search/activities", { start: 0, limit: 1 }],
  ["/sleep-service/sleep/dailySleep", { date: endDate }],
  [`/weight-service/weight/range/${startDate}/${endDate}`],
];

for (const [path, params] of calls) {
  console.log(`\n=== ${path}`);
  console.log(JSON.stringify(await garminGet(path, params), null, 2));
}
