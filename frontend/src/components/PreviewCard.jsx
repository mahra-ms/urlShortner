import { useState } from "react";

import { api, bare, idOf } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const boxStyle = "rounded-lg border border-gray-200 bg-gray-50 px-4 py-3";

export default function PreviewCard() {
  const { copy } = useToast();
  const { openAuth } = useAuth();

  const [longUrl, setLongUrl] = useState(""); // what the user types
  const [shortUrl, setShortUrl] = useState(""); // result from the server
  const [stats, setStats] = useState(null); // { clicks, createdAt }
  const [series, setSeries] = useState([]); // chart data
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api("/", {
        method: "POST",
        body: { url: longUrl.trim() },
      });
      setShortUrl(res.shortUrl);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg font-mono">
      {/* Top bar with 3 dots */}
      <div className="flex gap-1.5 bg-gray-100 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
      </div>

      <div className="p-4 sm:p-6">
        {/* ---------- Step 1: paste a link + Generate button ---------- */}
        <form onSubmit={handleGenerate}>
          <label
            htmlFor="long-url"
            className="mb-2 block text-[13px] text-gray-600"
          >
            Your long URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <input
              id="long-url"
              type="url"
              required
              className="input min-w-0 flex-1 bg-gray-50 px-4 py-3"
              placeholder="https://example.com/my-very-long-url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
            <button className="btn btn-dark px-5" disabled={busy}>
              {busy ? "Wait…" : "Generate"}
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-2 text-[13px] text-red-700">
              {error}.{" "}
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="cursor-pointer font-semibold underline"
              >
                Login
              </button>{" "}
              to view Analytics
            </p>
          )}
        </form>

        {/* Arrow */}
        <div className="flex justify-center pt-1">
          <span>&#x1F87B;</span>
        </div>

        {/* ---------- Step 2: short URL + Copy button ---------- */}
        <p className="mb-2 text-[13px] text-gray-600">Your short URL</p>
        <div className="flex items-stretch gap-3">
          <div
            className={`${boxStyle} min-w-0 flex-1 truncate ${shortUrl ? "font-semibold" : "text-gray-400"}`}
          >
            {shortUrl ? bare(shortUrl) : "shortUrl"}
          </div>
          <button
            type="button"
            className="btn btn-dark px-6"
            disabled={!shortUrl}
            onClick={() => copy(shortUrl)}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
