import { useEffect, useState } from "react";
import LinksTable from "../components/LinksTable.jsx";
import { api } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

export default function Dashboard() {
  const { copy } = useToast();
  const [urls, setUrls] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api("/my-urls").then((d) => setUrls(d.data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function shorten(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const d = await api("/", { method: "POST", body: { url: url.trim() } });
      setUrl("");
      copy(d.shortUrl);
      await load();
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Your short URLs</h1>
      <section className="card mb-5 p-5">
        <h3 className="mb-3.5 font-semibold">Create a short URL</h3>
        <form onSubmit={shorten} className="flex flex-col gap-2.5 sm:flex-row">
          <input className="input" type="url" required placeholder="https://example.com/your-long-url" aria-label="Long URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button className="btn btn-dark" disabled={busy}>Shorten</button>
        </form>
        <p role="alert" className="mt-2.5 min-h-[18px] text-[13px] text-red-700">{error}</p>
      </section>
      <section className="card p-5">
        <h3 className="mb-3.5 font-semibold">Recent URLs</h3>
        {urls ? <LinksTable urls={urls.slice(0, 10)} /> : <p className="p-7 text-center text-gray-500">Loading…</p>}
      </section>
    </>
  );
}