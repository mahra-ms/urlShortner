import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { bare, fmtDate, idOf } from "../lib/api.js";

export default function LinksTable({ urls }) {
  const navigate = useNavigate();
  const { copy } = useToast();

  if (!urls.length)
    return (
      <p className="p-7 text-center text-gray-500">
        No links yet. Paste a long URL above to create your first one.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-500">
            {["Original URL", "Short URL", "Clicks", "Created at", ""].map(
              (h) => (
                <th key={h} className="px-3 py-2.5 font-medium">
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {urls.map((u) => (
            <tr
              key={u.shortUrl}
              onClick={() => navigate(`/stats/${idOf(u.shortUrl)}`)}
              className="cursor-pointer border-t border-gray-200 hover:bg-gray-50"
            >
              <td
                className="max-w-[260px] truncate px-3 py-3.5"
                title={u.originalUrl}
              >
                {u.originalUrl}
              </td>
              <td className="px-3 py-3.5 font-semibold">{bare(u.shortUrl)}</td>
              <td className="px-3 py-3.5">{u.clicks}</td>
              <td className="whitespace-nowrap px-3 py-3.5">
                {fmtDate(u.createdAt)}
              </td>
              <td className="px-3 py-3.5">
                <button
                  className="btn btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(u.shortUrl);
                  }}
                >
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
