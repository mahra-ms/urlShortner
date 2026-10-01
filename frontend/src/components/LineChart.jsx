export default function LineChart({ data }) {
  if (!data.length)
    return (
      <p className="p-7 text-center text-gray-500">
        No clicks in this period yet.
      </p>
    );
  const W = 560,
    H = 220,
    p = { l: 30, r: 10, t: 10, b: 26 };
  const max = Math.max(...data.map((d) => d.clicks), 1);
  const x = (i) =>
    p.l +
    (data.length === 1
      ? (W - p.l - p.r) / 2
      : (i * (W - p.l - p.r)) / (data.length - 1));
  const y = (v) => p.t + (H - p.t - p.b) * (1 - v / max);
  const pts = data.map((d, i) => `${x(i)},${y(d.clicks)}`).join(" ");
  const step = Math.ceil(data.length / 7);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Clicks over time"
    >
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line
            x1={p.l}
            x2={W - p.r}
            y1={y(max * f)}
            y2={y(max * f)}
            stroke="#e5e7eb"
          />
          <text
            x={p.l - 6}
            y={y(max * f) + 4}
            fontSize="10"
            fill="#6b7280"
            textAnchor="end"
          >
            {Math.round(max * f)}
          </text>
        </g>
      ))}
      <polygon
        points={`${x(0)},${H - p.b} ${pts} ${x(data.length - 1)},${H - p.b}`}
        fill="#2563eb"
        opacity=".1"
      />
      <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2" />
      {data.map((d, i) => (
        <g key={d.period}>
          <circle cx={x(i)} cy={y(d.clicks)} r="3" fill="#2563eb">
            <title>{`${d.period}: ${d.clicks}`}</title>
          </circle>
          {i % step === 0 && (
            <text
              x={x(i)}
              y={H - 8}
              fontSize="10"
              fill="#6b7280"
              textAnchor="middle"
            >
              {d.period.slice(-5)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
