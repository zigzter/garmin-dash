---
version: 1
slug: "web-src-app-tsx"
primary_target: "web/src/App.tsx"
related_targets: []
---

# Dashboard surface

Mode: Operate. One page: last-night recovery vs normal, 30-day history, recent activities with inline splits and CSV export.

Audience and job: the owner, each morning (decide training load in seconds) and after workouts (review and export splits). Missing data shows as missing. Charts only for the four recovery metrics.

Unresolved: access control before hosting; whether phone is a primary device (built to work there regardless).

## Direction contract

THESIS: The morning answer is a departure from your own normal, not a score. Refuses the category default of a grid of rounded stat cards with a chart in each and a hero number.

OWN-WORLD: Near-black cool graphite ground, one panel layer, 1px hairline dividers instead of cards. System sans with tabular figures throughout. One blue accent owns interaction (hover, focus, selection, cursor). Status colours appear only on departures: green when better than normal, amber when worse; direction is per metric (lower resting HR is better).

STORY: The owner sees four recovery readings set against their 30-day average, sees which moved and which way, scans the month beneath, then opens a workout's splits and exports them.

FIRST VIEWPORT: Top bar with product name, date and data range. Below, one full-width recovery strip split by hairlines into Sleep, HRV, Resting HR, Body Battery: label, value, departure vs 30-day average, and a 30-day trend with the average as a dashed reference line. Beneath, the 30-day table starts; the activity list follows. Primary action: Splits on an activity row, then Export CSV inside it.

FORM: Category standard (canon), executed at the craft of Linear, Whoop/Oura and Grafana/Datadog. Seed key 8e4c75a7. Signature interaction: one shared day cursor. Hovering any trend or any table row moves the cursor across all four trends and the strip shows that day's readings. Motion: 150-200 ms, state only; splits expand in place.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
