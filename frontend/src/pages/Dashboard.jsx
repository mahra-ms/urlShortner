import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LinksTable from "../components/LinksTable.jsx";
import { api, bare, idOf } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function Stat({ label, value, sub }) {
  return (
    <div className="min-w-0 px-5 py-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 truncate text-2xl font-bold tracking-tight tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 truncate text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { copy } = useToast();
  const { user } = useAuth();
  const [urls, setUrls] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadUrls = () => api("/my-urls").then((r) => setUrls(r.data)).catch((e) => setError(e.message));
  useEffect(() => { loadUrls(); }, []);

  const stats = useMemo(() => {
    if (!urls) return null;
    const total = urls.reduce((s, u) => s + u.clicks, 0);
    const top = [...urls].sort((a, b) => b.clicks - a.clicks)[0];
    return { count: urls.length, total, top };
  }, [urls]);

  async function handleShorten(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await api("/", { method: "POST", body: { url: url.trim() } });
      setUrl("");
      copy(res.shortUrl);
      loadUrls();
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  const first = user?.name?.split(" ")[0];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{first ? `Welcome back, ${first}` : "Dashboard"}</h1>
        <p className="mt-1 text-gray-500">Create links and see how they perform.</p>
      </header>

      {/* Summary */}
      <section className="card mb-5 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Stat label="Total links" value={stats ? stats.count : "–"} />
        <Stat label="Total clicks" value={stats ? stats.total.toLocaleString() : "–"} />
        <Stat label="Top link" value={stats?.top ? stats.top.clicks.toLocaleString() + " clicks" : "–"}
          sub={stats?.top ? bare(stats.top.shortUrl) : "No links yet"} />
      </section>

      {/* Create */}
      <section className="card mb-5 p-5">
        <h2 className="mb-3 font-semibold">Create a short URL</h2>
        <form onSubmit={handleShorten} className="flex flex-col gap-2.5 sm:flex-row">
          <input className="input flex-1 py-3" type="url" required aria-label="Long URL"
            placeholder="https://example.com/your-long-url"
            value={url} onChange={(e) => setUrl(e.target.value)} />
          <button className="btn btn-dark px-6" disabled={busy}>{busy ? "Shortening…" : "Shorten"}</button>
        </form>
        {error && <p role="alert" className="mt-2.5 text-[13px] text-red-700">{error}</p>}
      </section>

      {/* Recent */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-semibold">Recent links</h2>
          <Link to="/links" className="text-[13px] font-medium text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="border-t border-gray-200">
          {urls
            ? <LinksTable urls={urls.slice(0, 5)} onDeleted={loadUrls} />
            : <p className="p-10 text-center text-gray-500">Loading…</p>}
        </div>
      </section>
    </>
  );
}