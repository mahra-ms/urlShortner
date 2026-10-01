import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LineChart from "../components/LineChart.jsx";
import { api, bare, fmtDate } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

const periods = ["day", "week", "month"];

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
      .then(([s, g]) => { setInfo(s.data); setGeo(g.data); })
      .catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    setSeries(null);
    api(`/stats/${id}/timeseries?period=${period}`).then((d) => setSeries(d.data)).catch(() => setSeries([]));
  }, [id, period]);

  const top = Math.max(...geo.map((c) => c.clicks), 1);

  return (
    <>
      <Link to="/links" className="mb-3.5 inline-block text-[13px] text-gray-500">← Back to My Links</Link>
      {error && <div className="card p-7 text-center text-gray-500">{error}</div>}
      {info && (
        <>
          <section className="card mb-5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight">{bare(info.shortUrl)}</h1>
                <a href={info.originalUrl} target="_blank" rel="noopener noreferrer" className="break-all text-[13px] text-gray-500">{info.originalUrl}</a>
              </div>
              <button className="btn btn-sm" onClick={() => copy(info.shortUrl)}>Copy</button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
              <div><b className="block text-xl">{info.clicks}</b><span className="text-xs text-gray-500">Total clicks</span></div>
              <div><b className="block text-xl">{fmtDate(info.createdAt)}</b><span className="text-xs text-gray-500">Created at</span></div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <section className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Clicks overview</h3>
                <div className="flex gap-1">
                  {periods.map((p) => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className={`cursor-pointer rounded-md px-2.5 py-1 text-xs capitalize ${period === p ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-500"}`}>{p}</button>
                  ))}
                </div>
              </div>
              {series ? <LineChart data={series} /> : <p className="p-7 text-center text-gray-500">Loading…</p>}
            </section>

            <section className="card p-5">
              <h3 className="mb-1 font-semibold">Clicks by country</h3>
              {geo.length ? geo.map((c) => (
                <div key={c.country} className="mt-3.5">
                  <div className="flex justify-between text-[13px]"><span>{c.country}</span><b>{c.clicks}</b></div>
                  <div className="mt-1 h-1.5 rounded bg-blue-50"><div className="h-full rounded bg-blue-600" style={{ width: `${(c.clicks / top) * 100}%` }} /></div>
                </div>
              )) : <p className="p-7 text-center text-gray-500">No clicks yet.</p>}
            </section>
          </div>
        </>
      )}
    </>
  );
}