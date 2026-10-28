const MINUS = "−";

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatHoursMinutes(sec: number): string {
  const total = Math.round(sec / 60);
  if (total < 60) return `${total}m`;
  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, "0")}m`;
}

export function formatSigned(value: number, format: (abs: number) => string = String): string {
  if (value === 0) return "0";
  return `${value > 0 ? "+" : MINUS}${format(Math.abs(value))}`;
}

export function formatDay(date: string, today: string): string {
  if (date === today) return "Today";
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatStart(start: string): string {
  const d = new Date(start.replace(" ", "T"));
  const day = d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${day}, ${time.replace(/\s/g, "\u00a0")}`;
}

export function formatType(typeKey: string): string {
  const words = typeKey.replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export type Effort = "pace" | "pace100" | "speed" | "none";

// Selects the effort measure that makes sense for a sport.
export function effortFor(typeKey: string, distance: number | undefined): Effort {
  if (!distance) return "none";
  if (/cycl|bik|ride/.test(typeKey)) return "speed";
  if (/swim/.test(typeKey)) return "pace100";
  return "pace";
}

export function formatEffort(effort: Effort, distanceM: number, durationSec: number): string | undefined {
  if (effort === "none" || !distanceM || !durationSec) return undefined;
  if (effort === "speed") return `${((distanceM / durationSec) * 3.6).toFixed(1)}\u00a0km/h`;
  const per = effort === "pace100" ? 100 : 1000;
  const sec = Math.round((durationSec / distanceM) * per);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}\u00a0/${effort === "pace100" ? "100m" : "km"}`;
}

export const effortLabel: Record<Effort, string> = {
  pace: "Pace",
  pace100: "Pace",
  speed: "Speed",
  none: "",
};
