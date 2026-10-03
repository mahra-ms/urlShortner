import { useEffect, useMemo, useState } from "react";
import LinksTable from "../components/LinksTable.jsx";
import { api } from "../lib/api.js";

const sorters = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  clicks: (a, b) => b.clicks - a.clicks,
};

export default function Links() {
  const [urls, setUrls] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => { api("/my-urls").then((d) => setUrls(d.data)).catch((e) => setError(e.message)); }, []);

  const shown = useMemo(() => {
    if (!urls) return [];
    const term = q.trim().toLowerCase();
    return urls
      .filter((u) => !term || u.originalUrl.toLowerCase().includes(term) || u.shortUrl.toLowerCase().includes(term))
      .sort(sorters[sort]);
  }, [urls, q, sort]);

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My links</h1>
          <p className="mt-1 text-gray-500">{urls ? `${urls.length} ${urls.length === 1 ? "link" : "links"} in total` : "\u00A0"}</p>
        </div>
        <div className="flex w-full gap-2.5 sm:w-auto">
          <input className="input sm:w-64" type="search" aria-label="Search links" placeholder="Search links"
            value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input w-auto cursor-pointer" aria-label="Sort links" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="clicks">Most clicks</option>
          </select>
        </div>
      </header>

      <section className="card overflow-hidden">
        {error ? <p className="p-10 text-center text-red-700">{error}</p>
          : urls ? <LinksTable urls={shown}
              empty={q ? { title: "No matching links", hint: "Try a different search term." } : undefined} />
          : <p className="p-10 text-center text-gray-500">Loading…</p>}
      </section>
    </>
  );
}