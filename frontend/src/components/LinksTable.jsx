import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { bare, fmtDate, idOf } from "../lib/api.js";

const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };

export default function LinksTable({ urls, empty }) {
  const navigate = useNavigate();
  const { copy } = useToast();

  if (urls.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-gray-100 text-gray-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
          </svg>
        </div>
        <p className="font-semibold">{empty?.title || "No links yet"}</p>
        <p className="mt-1 text-[13px] text-gray-500">{empty?.hint || "Paste a long URL above to create your first short link."}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
            <th className="px-5 py-3 font-medium">Link</th>
            <th className="px-3 py-3 text-right font-medium">Clicks</th>
            <th className="hidden px-3 py-3 font-medium sm:table-cell">Created</th>
            <th className="w-24 px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {urls.map((u) => (
            <tr key={u.shortUrl} onClick={() => navigate(`/stats/${idOf(u.shortUrl)}`)}
              className="group cursor-pointer transition-colors hover:bg-gray-50">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gray-100 text-xs font-bold uppercase text-gray-600">
                    {hostOf(u.originalUrl).charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-ink">{bare(u.shortUrl)}</div>
                    <div className="max-w-[220px] truncate text-xs text-gray-500 sm:max-w-xs md:max-w-md" title={u.originalUrl}>
                      {u.originalUrl}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3.5 text-right">
                <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-blue-700">
                  {u.clicks}
                </span>
              </td>
              <td className="hidden whitespace-nowrap px-3 py-3.5 text-gray-500 sm:table-cell">{fmtDate(u.createdAt)}</td>
              <td className="px-5 py-3.5 text-right">
                <button className="btn btn-sm" aria-label={`Copy ${bare(u.shortUrl)}`}
                  onClick={(e) => { e.stopPropagation(); copy(u.shortUrl); }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}