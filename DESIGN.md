---
name: Garmin Dash
description: A dense, dark, single-screen view of one person's recovery and training data.
colors:
  graphite-ground: "oklch(0.16 0.008 255)"
  graphite-panel: "oklch(0.195 0.009 255)"
  graphite-panel-hover: "oklch(0.225 0.01 255)"
  hairline: "oklch(0.28 0.01 255)"
  hairline-strong: "oklch(0.36 0.012 255)"
  text-primary: "oklch(0.94 0.005 255)"
  text-secondary: "oklch(0.76 0.012 255)"
  text-tertiary: "oklch(0.64 0.012 255)"
  signal-blue: "oklch(0.72 0.13 250)"
  signal-blue-wash: "oklch(0.72 0.13 250 / 0.14)"
  signal-blue-hover: "oklch(0.78 0.12 250)"
  signal-blue-pressed: "oklch(0.68 0.13 250)"
  signal-blue-ink: "oklch(0.18 0.03 250)"
  better-green: "oklch(0.79 0.14 155)"
  worse-amber: "oklch(0.81 0.13 75)"
  error-red: "oklch(0.7 0.16 25)"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    fontFeature: "tnum"
  caption:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  mono:
    fontFamily: "ui-monospace, SF Mono, Cascadia Mono, JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
components:
  panel:
    backgroundColor: "{colors.graphite-panel}"
    rounded: "{rounded.md}"
  button:
    backgroundColor: "{colors.graphite-panel}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "30px"
  button-hover:
    backgroundColor: "{colors.graphite-panel-hover}"
  button-active:
    backgroundColor: "{colors.hairline}"
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.signal-blue-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "30px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-hover}"
  button-primary-active:
    backgroundColor: "{colors.signal-blue-pressed}"
  table-header:
    backgroundColor: "{colors.graphite-panel}"
    textColor: "{colors.text-tertiary}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "34px"
  table-row:
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "34px"
  table-row-active:
    backgroundColor: "{colors.signal-blue-wash}"
  activity-row-hover:
    backgroundColor: "{colors.graphite-panel-hover}"
  metric-cell:
    padding: "16px 16px 12px"
---

# Design System: Garmin Dash

## Overview

**Creative North Star: "The Instrument Panel"** *(inferred; no user was available to confirm the name. It follows the PRODUCT.md commitment to a conventional, screen-native dashboard with no themed concept.)*

Garmin Dash is a conventional dark dashboard built to the craft level of Linear, Whoop/Oura and Grafana/Datadog. It has one job: the morning answer reads as a departure from the owner's own normal, not as a score. The page is dense and quiet. A near-black, cool graphite ground holds one raised panel layer. Panels are divided by 1px hairlines instead of separate cards. Numbers are set in the system sans with tabular figures, so columns and readings line up without decoration.

Colour is information, not atmosphere. Most of the screen is neutral graphite and three grey text steps. One blue accent owns interaction. Green and amber appear only when a reading departs from normal, and each metric sets its own direction (lower resting HR is better). Missing data shows as missing (an em dash, "—"). A value that does not apply to the activity type shows as an empty cell.

Print and paper treatments, metaphor and themed concepts were rejected in PRODUCT.md. The world is screen-native and dark only.

**Key Characteristics:**
- Near-black cool graphite ground, one panel layer, 1px hairlines instead of cards.
- System sans with tabular figures everywhere; no display face.
- One blue accent for hover, focus, selection and the day cursor.
- Green and amber only on departures from normal, with direction set per metric.
- Dense rows (34px) and small type (13–14px); one large figure per metric.
- Motion only for state changes, 150–200ms, with one strong ease-out curve.

## Colors

A cool graphite neutral ramp (hue 255) with one blue signal and two status hues reserved for departures.

### Primary
- **Signal Blue** (`signal-blue`): the only interaction colour. It is used for focus rings, links, the text caret, the day-cursor line on every trend, the expanded-row chevron and the primary button fill. Its wash (`signal-blue-wash`, 14% alpha) marks the active history row and text selection. `signal-blue-hover` and `signal-blue-pressed` are the primary button's hover and pressed fills, and `signal-blue-ink` is the dark text on that fill.

### Secondary
- **Better Green** (`better-green`): a metric that is better than normal by more than the normal band (5% of the average, or Garmin's balanced range for HRV). It colours the departure figure and the cursor dot on that metric's trend.
- **Worse Amber** (`worse-amber`): a metric that is worse than normal by more than the normal band. It has the same placement as Better Green.

### Tertiary
- **Error Red** (`error-red`): only the warning icon in an error notice. It never marks a health reading.

### Neutral
- **Graphite Ground** (`graphite-ground`): the page, the sticky recovery strip backing and the inset behind expanded splits.
- **Graphite Panel** (`graphite-panel`): the single raised layer for the recovery strip, tables, table headers and default buttons.
- **Graphite Panel Hover** (`graphite-panel-hover`): hover and expanded state of activity rows, button hover and skeleton fills.
- **Hairline** (`hairline`): every 1px divider, panel border, row rule and metric separator. It is also the pressed fill of a default button.
- **Hairline Strong** (`hairline-strong`): button borders, the scrollbar thumb and the cursor dot on a day with no data.
- **Text Primary** (`text-primary`): values, names and headings.
- **Text Secondary** (`text-secondary`): metric labels, the trend line, emphasised readings and notice body.
- **Text Tertiary** (`text-tertiary`): meta text, table headers, units, averages, the dashed average line and the "—" missing mark.

### Named Rules
**The One Signal Rule.** Blue means "you are interacting with this", and nothing else. Do not use it for status, decoration or headings.

**The Departure-Only Rule.** Green and amber appear only when a reading leaves the normal band, and each metric sets which direction is better. A reading inside the band shows the word "Normal" in Text Primary, not green.

## Typography

**Display Font:** none. The system has no display face.
**Body Font:** system sans (system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif)
**Label/Mono Font:** ui-monospace stack, only for API key names and raw error detail.

**Character:** a neutral, OS-native sans used as an instrument face. Tabular figures are on for the whole body, so every number aligns.

### Hierarchy
- **Headline** (600, 1.75rem, 1.15, -0.02em): the departure figure or the word "Normal" in each recovery metric. It is the only large type on the page. The unit after it drops to the label size in Text Tertiary.
- **Title** (600, 1rem, -0.01em): the product name in the top bar.
- **Title Small** (600, 0.875rem): section headings ("Last night", "Daily history", "Activities") and notice headings.
- **Body** (400, 0.875rem, 1.45): the base size. Notice paragraphs are capped at 65ch.
- **Label** (400, 0.8125rem): table cells, metric labels, readings, section meta and buttons. Table headers and buttons use weight 500. Activity names use weight 500.
- **Caption** (400, 0.75rem): the date and type line under an activity name.

### Named Rules
**The Tabular Rule.** Every figure uses tabular numerals. Do not turn them off for a column or a metric.

**The One Big Number Rule.** Only the per-metric departure is set large. Raw values and averages stay at label size beside it.

## Layout

The page is a single column with a 1600px maximum width, 24px side padding (16px below 600px) and 48px bottom padding. The top bar holds the product name on the left and the date range on the right, baseline-aligned.

The recovery strip is one full-width panel split into four equal metric cells by vertical hairlines. Below 900px it becomes a 2×2 grid with a horizontal hairline between the rows. At 1200px and wider the strip is sticky at the top of the viewport, so the trends stay visible while the owner scrolls the history.

Below the strip, the history and activities sections sit in a two-column grid at 1200px and wider (5fr / 7fr, 32px gap). Below 1200px they stack. Each section has a heading row (title left, meta right) 12px above its panel.

Spacing uses a 4px-based scale (4, 8, 12, 16, 24, 32, 48). Rows are 34px tall (30px inside splits; activity rows grow to at least 44px for the two-line name). Narrow screens hide lower-priority table columns in two steps: one tier at 720px and one at 520px. On narrow screens the activity distance and pace move into the caption line.

## Elevation & Depth

The system is flat. There are no shadows. Depth comes from one tonal step (Graphite Ground to Graphite Panel) and 1px hairlines. Interaction raises a surface by one more tonal step (Graphite Panel Hover) or by the blue wash. Expanded splits sit one step lower, on Graphite Ground, inset inside the panel.

### Named Rules
**The One Layer Rule.** There is one panel layer. Do not nest cards in panels or stack panels on panels; divide with hairlines instead.

## Shapes

Corners are slightly rounded and nest inward: panels use 8px (`rounded.md`), buttons and the nested splits table use 6px (`rounded.sm`), and focus rings and skeleton bars use 4px (`rounded.xs`). Borders are always 1px. Panels clip their contents, so table rows meet the rounded edge cleanly. Trend lines are 1.5px with round joins and caps. The average reference is a 1px dashed line (3 on, 3 off) over a faint normal band (5% of the average, or Garmin's balanced range for HRV).

## Components

### Buttons
Small, quiet and precise.
- **Shape:** gently rounded (6px), 30px tall, 12px side padding, a 6px gap to a 14px line icon.
- **Default:** Graphite Panel fill, a 1px Hairline Strong border, label-size text at weight 500.
- **Primary:** a Signal Blue fill with dark blue ink and no visible border. It is used for the main action in context (Export CSV).
- **Hover / Active:** the fill steps lighter on hover and darker on press. The transition is 150ms on the shared ease-out curve. Disabled buttons drop to 50% opacity.
- **Focus:** a 2px Signal Blue outline, offset 2px.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** Graphite Panel.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline.
- **Internal Padding:** none on the panel itself. Content sets its own padding: metric cells use 16px (12px below 600px) and notices use 24px.

### Tables
- Rows are 34px with 12px cell padding (8px below 600px). The first column is left-aligned and all other columns are right-aligned. Cells do not wrap.
- Headers sit on Graphite Panel in Text Tertiary at weight 500, above a hairline. Rows are separated by hairlines, with no zebra stripes.
- A missing value is "—" in Text Tertiary with the accessible name "No data". A value that does not apply is an empty cell.

### Recovery Metric (signature)
Each cell shows a label row (the metric name, and optional detail such as "Score 80" or "Peak" right-aligned in Text Tertiary). Under it are the headline departure, a one-line reading ("**58 bpm** · avg 55"), and a 56px trend.

### Day Cursor (signature interaction)
One shared day cursor connects the four trends and the history table. Hovering or dragging on any trend, or hovering or focusing any history row, moves a 1px Signal Blue vertical line to that day on all four trends. The strip heading and readings change to that day, and the matching history row takes the blue wash. A 6px dot marks the value on each trend. The dot takes the metric's departure colour (Signal Blue when normal, Hairline Strong when the day has no data). Arrow keys move the focus between history rows. On a mouse, leaving the area returns the cursor to the latest day.

### Expandable Activity Row
The whole row is the hit area, with a chevron button for keyboard use. The chevron turns 90° and becomes Signal Blue when the row opens. The open row and hovered rows take Graphite Panel Hover. The splits open in place below the row, on Graphite Ground, with a 200ms reveal (a 4px rise from 40% opacity). The splits have a lap count and the primary Export CSV button above a nested, hairline-bordered table.

### Notices
Error and empty states sit inside the panel with 24px padding. The heading is Title Small with a 16px line icon (Error Red for errors). The body is in Text Secondary, raw detail is in mono caption, and a default "Try again" button follows. Loading states use skeleton bars in Graphite Panel Hover that pulse over 1.4s.

## Do's and Don'ts

### Do:
- **Do** separate regions with 1px Hairline dividers inside one Graphite Panel layer.
- **Do** keep Signal Blue for interaction only: focus, hover state, selection, cursor and the primary action.
- **Do** colour a reading green or amber only outside the normal band, with the better direction set per metric.
- **Do** show missing data as "—" in Text Tertiary, and leave not-applicable cells empty.
- **Do** keep tabular figures on and right-align numeric columns.
- **Do** limit motion to state changes (150–200ms, `cubic-bezier(0.16, 1, 0.3, 1)`), and turn it off under reduced motion.

### Don't:
- **Don't** build a grid of rounded stat cards with a chart in each and a hero score (the category default this world refuses).
- **Don't** add shadows, gradients or a second panel layer.
- **Don't** use green, amber or red for decoration, and don't use blue for status.
- **Don't** estimate or fill in missing values.
- **Don't** use print, paper or themed-metaphor treatments.
