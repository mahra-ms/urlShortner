const getToken = () => localStorage.getItem("token");

const BASE = import.meta.env.VITE_API_URL || "";

export async function api(path, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(BASE + "/api/v1" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const fmtDate = (d) =>
  new Date(d).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
export const bare = (u) => u.replace(/^https?:\/\//, "");
export const idOf = (u) => u.split("/").pop();
