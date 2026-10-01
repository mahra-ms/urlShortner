import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Svg = ({ d }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const nav = [
  { to: "/dashboard", label: "Dashboard", d: "M3 11 12 3l9 8v10h-6v-6H9v6H3z" },
  { to: "/links", label: "My Links", d: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const link = ({ isActive }) =>
    `flex items-center gap-2.5 rounded-lg px-2.5 py-2 whitespace-nowrap ${isActive ? "bg-[#1b222c] text-white" : "text-gray-300 hover:text-white"}`;

  return (
    <div className="grid min-h-screen md:grid-cols-[230px_1fr]">
      <aside className="flex items-center gap-1.5 overflow-x-auto bg-dark p-3 md:sticky md:top-0 md:h-screen md:flex-col md:items-stretch md:p-4">
        <div className="pr-3 md:px-2.5 md:pb-6"><Logo light /></div>
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} className={link}><Svg d={n.d} />{n.label}</NavLink>
        ))}
        <div className="mt-auto hidden px-2.5 py-2 text-[13px] text-white md:block">
          <div className="truncate">{user?.name || "Account"}</div>
          <div className="truncate text-gray-400">{user?.email}</div>
        </div>
        <button className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-gray-300 hover:text-white md:w-full"
          onClick={() => { signOut(); navigate("/"); }}>
          <Svg d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />Logout
        </button>
      </aside>
      <main className="mx-auto w-full max-w-5xl p-4 md:p-10"><Outlet /></main>
    </div>
  );
}