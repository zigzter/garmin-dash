const WIDTH = 100;
const HEIGHT = 40;
const PAD_X = 3;
const PAD_Y = 5;

interface TrendProps {
  label: string;
  values: (number | undefined)[];
  average: number | undefined;
  band: number;
  minSpan: number;
  cursorIndex: number;
  cursorColor: string;
  onCursor: (index: number | undefined) => void;
}

// Draws a 30-day line with gaps for missing days, the normal band around the average, and the shared day cursor.
export function Trend({ label, values, average, band, minSpan, cursorIndex, cursorColor, onCursor }: TrendProps) {
  const present = values.filter((v): v is number => v !== undefined);
  if (present.length === 0) return <svg className="trend" aria-hidden />;

  const all = average === undefined ? present : [...present, average * (1 - band), average * (1 + band)];
  let min = Math.min(...all);
  let max = Math.max(...all);
  if (max - min < minSpan) {
    const mid = (max + min) / 2;
    min = mid - minSpan / 2;
    max = mid + minSpan / 2;
  }
  const x = (i: number) => (values.length === 1 ? WIDTH / 2 : PAD_X + (i / (values.length - 1)) * (WIDTH - PAD_X * 2));
  const y = (v: number) => PAD_Y + (1 - (v - min) / (max - min)) * (HEIGHT - PAD_Y * 2);

  let path = "";
  values.forEach((v, i) => {
    if (v === undefined) return;
    path += `${values[i - 1] === undefined ? "M" : "L"}${x(i)} ${y(v)}`;
  });

  const cursorValue = values[cursorIndex];

  function handlePointer(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const inset = (PAD_X / WIDTH) * rect.width;
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left - inset) / (rect.width - inset * 2)));
    onCursor(Math.round(fraction * (values.length - 1)));
  }

  return (
    <svg
      className="trend"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`${label}, last ${values.length} days`}
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onPointerLeave={(e) => e.pointerType === "mouse" && onCursor(undefined)}
    >
      {average !== undefined && (
        <>
          <rect
            className="trend-band"
            x={0}
            width={WIDTH}
            y={y(average * (1 + band))}
            height={y(average * (1 - band)) - y(average * (1 + band))}
          />
          <line className="trend-avg" x1={0} x2={WIDTH} y1={y(average)} y2={y(average)} vectorEffect="non-scaling-stroke" />
        </>
      )}
      <path className="trend-line" d={path} vectorEffect="non-scaling-stroke" />
      <line className="trend-cursor" x1={x(cursorIndex)} x2={x(cursorIndex)} y1={0} y2={HEIGHT} vectorEffect="non-scaling-stroke" />
      {/* A zero-length path with a round cap draws a circle that preserveAspectRatio="none" cannot stretch. */}
      <path
        d={`M${x(cursorIndex)} ${cursorValue === undefined ? HEIGHT - PAD_Y : y(cursorValue)}h0`}
        stroke={cursorValue === undefined ? "var(--line-strong)" : cursorColor}
        strokeWidth={6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
