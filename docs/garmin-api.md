# Garmin Personal API

Base URL `https://personal.connectapi.garmin.com`. All endpoints are `GET` with a bearer token (see `server/garmin.ts`).
Source: the [Swagger docs](https://developer.garmin.com/gc-developer-program/personal/swagger-docs/), which need a browser and list no response schemas. Use `npm run probe` to see real response fields.

The API has no endpoints for training readiness, training status or VO2 max.

## Activity

| Endpoint | Notes |
|---|---|
| `/activity-service/activity/{activityId}` | |
| `/activity-service/activity/{activityId}/workouts` | |
| `/activitylist-service/activities/search/activities` | Used. Query: `start`, `limit`, `startDate`, `endDate`. |
| `/download-service/files/activity/{activityId}` | Used. Returns a zip with the FIT file. |
| `/wellnessactivity-service/activity/summary/range/{fromDate}/{untilDate}` | |

## Health

| Endpoint | Notes |
|---|---|
| `/biometric-service/heartRateZones/v2` | |
| `/fitnessage-service/fitnessage/v2/{calendarDate}` | |
| `/goal-service/goal/user/effective/weightgoal/{startDate}/{endDate}` | |
| `/hrv-service/hrv/{calendarDate}` | |
| `/hrv-service/hrv/daily/{fromDate}/{toDate}` | Used. Includes `baseline` (balanced range) and `status`. |
| `/nutrition-service/food/logs/{date}` | |
| `/sleep-service/sleep/dailySleep` | Query: `date`. One night; same fields as the summary plus SpO2 (`averageSpO2Value`, `lowestSpO2Value`) and `sleepAlignment`. |
| `/sleep-service/sleep/dailySleepSummariesByDate` | Used. Query: `startDate`, `endDate`. Includes stages, respiration, `sleepNeed`. |
| `/usersummary-service/stats/hydration/daily/{startDate}/{endDate}` | |
| `/usersummary-service/stats/steps/daily/{startDate}/{endDate}` | |
| `/usersummary-service/stats/stress/daily/{startDate}/{endDate}` | |
| `/usersummary-service/usersummary/daily` | |
| `/usersummary-service/v2/dailysummaries` | Used. Query: `startDate`, `endDate`. Includes HR, stress, body battery, respiration, pulse ox, intensity minutes. |
| `/weight-service/weight/all/{startDate}/{endDate}` | |
| `/weight-service/weight/range/{startDate}/{endDate}` | Returns `dailyWeightSummaries` and `totalAverage` (weight, BMI, body composition). |
| `/wellness-service/wellness/bodyBattery/reports/daily` | |
| `/wellness-service/wellness/daily/spo2acclimation/{calendarDate}` | |
| `/wellness-service/wellness/dailyHeartRate` | |

## Women's Health

| Endpoint | Notes |
|---|---|
| `/periodichealth-service/menstrualcycle/summary/{calendarDate}` | |
| `/periodichealth-service/menstrualcycle/dayview/{calendarDate}` | |

## User Profile

| Endpoint | Notes |
|---|---|
| `/userprofile-service/userprofile/settings` | |
