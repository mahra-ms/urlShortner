import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LineChart from "../components/LineChart.jsx";
import { api, bare, fmtDate } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

const periods = ["day", "week", "month"];

function Stat({ label, value, sub }) {
  return (
    <div className="min-w-0 bg-white px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 truncate text-xl font-bold tracking-tight tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 truncate text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function Stats() {
  const { id } = useParams();
  const { copy } = useToast();

  const [info, setInfo] = useState(null);
  const [geo, setGeo] = useState([]);
  const [series, setSeries] = useState(null);
  const [period, setPeriod] = useState("day");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api(`/stats/${id}`), api(`/stats/${id}/geo`)])
      .then(([stats, countries]) => { setInfo(stats.data); setGeo(countries.data); })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    setSeries(null);
    api(`/stats/${id}/timeseries?period=${period}`)
      .then((res) => setSeries(res.data))
      .catch(() => setSeries([]));
  }, [id, period]);

  const sortedGeo = useMemo(() => [...geo].sort((a, b) => b.clicks - a.clicks), [geo]);
  const totalGeo = sortedGeo.reduce((s, c) => s + c.clicks, 0) || 1;
  const topClicks = sortedGeo[0]?.clicks || 1;
  const peak = series?.length ? series.reduce((a, b) => (b.clicks > a.clicks ? b : a)) : null;

  return (
    <>
      <Link to="/links" className="mb-4 inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-ink">
        <span aria-hidden>←</span> My links
      </Link>

      {error && <div className="card p-10 text-center text-red-700">{error}</div>}
      {!info && !error && <div className="card p-10 text-center text-gray-500">Loading…</div>}

      {info && (
        <>
          <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">{bare(info.shortUrl)}</h1>
              <a href={info.originalUrl} target="_blank" rel="noopener noreferrer"
                className="mt-1 block max-w-full break-all text-[13px] text-gray-500 hover:text-ink hover:underline">
                {info.originalUrl}
              </a>
            </div>
            <div className="flex gap-2">
              <a href={info.originalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">Visit</a>
              <button className="btn btn-dark btn-sm" onClick={() => copy(info.shortUrl)}>Copy link</button>
            </div>
          </header>

          <section className="card mb-5 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 lg:grid-cols-4">
            <Stat label="Total clicks" value={info.clicks.toLocaleString()} />
            <Stat label="Top country" value={sortedGeo[0]?.country || "–"}
              sub={sortedGeo[0] ? `${Math.round((sortedGeo[0].clicks / totalGeo) * 100)}% of clicks` : "No clicks yet"} />
            <Stat label={`Best ${period}`} value={peak ? `${peak.clicks} clicks` : "–"} sub={peak?.period} />
            <Stat label="Created" value={fmtDate(info.createdAt).split(",").slice(0, 2).join(",")} />
          </section>

          <div className="grid items-start gap-5 lg:grid-cols-[1.6fr_1fr]">
            <section className="card min-w-0 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-semibold">Clicks over time</h2>
                <div className="inline-flex rounded-lg bg-gray-100 p-0.5" role="group" aria-label="Period">
                  {periods.map((p) => (
                    <button key={p} onClick={() => setPeriod(p)} aria-pressed={period === p}
                      className={`cursor-pointer rounded-md px-3 py-1 text-xs font-medium capitalize ${period === p ? "bg-white text-ink shadow-sm" : "text-gray-500 hover:text-ink"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {series ? <LineChart data={series} /> : <p className="p-10 text-center text-gray-500">Loading…</p>}
            </section>

            <section className="card min-w-0 p-5">
              <h2 className="font-semibold">Clicks by country</h2>
              {sortedGeo.length > 0 ? (
                <ul className="mt-2">
                  {sortedGeo.map((c) => (
                    <li key={c.country} className="mt-3.5">
                      <div className="flex justify-between gap-2 text-[13px]">
                        <span className="truncate">{c.country}</span>
                        <span className="shrink-0 tabular-nums">
                          <b>{c.clicks}</b>
                          <span className="ml-1.5 text-xs text-gray-500">{Math.round((c.clicks / totalGeo) * 100)}%</span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${(c.clicks / topClicks) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center text-[13px] text-gray-500">No clicks yet. Share your link to see where visitors come from.</p>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}