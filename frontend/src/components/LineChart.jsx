import { useId } from "react";

export default function LineChart({ data }) {
  const gid = useId();
  if (!data.length)
    return (
      <div className="px-6 py-14 text-center">
        <p className="font-semibold">No clicks in this period</p>
        <p className="mt-1 text-[13px] text-gray-500">Clicks will show up here as people open your link.</p>
      </div>
    );

  const W = 560, H = 240, p = { l: 34, r: 12, t: 12, b: 28 };
  const max = Math.max(...data.map((d) => d.clicks), 1);
  const x = (i) => p.l + (data.length === 1 ? (W - p.l - p.r) / 2 : (i * (W - p.l - p.r)) / (data.length - 1));
  const y = (v) => p.t + (H - p.t - p.b) * (1 - v / max);
  const pts = data.map((d, i) => `${x(i)},${y(d.clicks)}`).join(" ");
  const step = Math.ceil(data.length / 7);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Clicks over time">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity=".18" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((f) => (
        <g key={f}>
          <line x1={p.l} x2={W - p.r} y1={y(max * f)} y2={y(max * f)} stroke="#f0f1f3" />
          <text x={p.l - 8} y={y(max * f) + 3.5} fontSize="10" fill="#9ca3af" textAnchor="end">{Math.round(max * f)}</text>
        </g>
      ))}
      <polygon points={`${x(0)},${H - p.b} ${pts} ${x(data.length - 1)},${H - p.b}`} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={d.period}>
          <circle cx={x(i)} cy={y(d.clicks)} r="3.5" fill="#fff" stroke="#2563eb" strokeWidth="2">
            <title>{`${d.period}: ${d.clicks} clicks`}</title>
          </circle>
          {i % step === 0 && (
            <text x={x(i)} y={H - 8} fontSize="10" fill="#9ca3af" textAnchor="middle">{d.period.slice(-5)}</text>
          )}
        </g>
      ))}
    </svg>
  );
}