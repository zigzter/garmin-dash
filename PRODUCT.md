# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person: the owner of the Garmin account. They train in mixed sports (strength, running, cycling and others).

They use it in two situations:
- **Morning check:** a quick read of last night's sleep, HRV, Body Battery and resting heart rate, to decide how hard to train today.
- **After a workout:** a review of the activity and its splits, often followed by a CSV export of the splits.

## Product Purpose

A personal dashboard that shows the owner's Garmin health and activity data on one screen. Success: the morning decision takes seconds, and splits for any activity are one click from a CSV file.

## Positioning

Garmin Connect spreads these stats across many cards, tabs and screens, and it has no simple split export. This dashboard puts the daily health stats and recent activities on one dense view, makes split export a first-class action, and runs on infrastructure the owner controls, without ads or upsells.

## Operating Context

- Data comes from Garmin's Personal API, authenticated with the owner's personal API key. The key expires (30 days to 1 year) and must be renewed in Garmin Connect.
- The dashboard will be hosted, not only run locally.
- Exported CSVs go to spreadsheets or other analysis tools.

## Capabilities and Constraints

- Health stats per day: steps, resting HR, average stress, Body Battery low and high, sleep duration, sleep score, HRV (last-night average).
- Activities: recent list with name, type, start time, distance, duration and average HR.
- Splits: read from the activity's FIT file laps (distance, time, pace per km, average and max HR, ascent), exportable to CSV.
- Activity types vary. Strength sessions have no distance and usually a single lap. Distance-based splits only make sense for some sports.
- Days can have missing data (watch not worn, no sleep recorded, HRV not yet available).
- The API key stays server-side. The browser never calls Garmin directly.
- **Open decision:** how the hosted dashboard is protected. It exposes personal health data, so it needs some form of access control before it is deployed.
- **Open decision:** which devices matter. Hosting makes phone access likely, but this is not confirmed.

## Brand Commitments

- Conventional modern dashboard, executed at a high craft level. No metaphor or themed concept; print and paper treatments were rejected.
- Dark, screen-native look.
- Reference bar: Linear (precision, density, restraint), Whoop / Oura (recovery numbers read at a glance), Grafana / Datadog (dense metric panels).

## Evidence on Hand

Real data from the owner's own Garmin account, via `npm run probe` and the running app. No other content, branding or assets exist.

## Product Principles

1. One screen answers the morning question. Recovery status is readable at a glance, without navigation.
2. Data first. Every stat shows real values, with missing data shown as missing, never estimated.
3. Exports are a primary action, not a hidden feature.
4. Respect each sport. Show only the metrics that mean something for the activity type.
5. Private by default. Personal health data is never exposed without the owner's control.
