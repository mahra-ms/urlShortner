import { useEffect, useState } from "react";
import LinksTable from "../components/LinksTable.jsx";
import { api } from "../lib/api.js";

export default function Links() {
  const [urls, setUrls] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api("/my-urls").then((d) => setUrls(d.data)).catch((e) => setError(e.message)); }, []);

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold tracking-tight">My Links</h1>
      <section className="card p-5">
        {error ? <p className="p-7 text-center text-gray-500">{error}</p>
          : urls ? <LinksTable urls={urls} /> : <p className="p-7 text-center text-gray-500">Loading…</p>}
      </section>
    </>
  );
}