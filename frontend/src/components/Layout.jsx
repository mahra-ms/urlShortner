import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Icon({ d }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

// To add a page to the menu, add a line here.
const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: "M3 11 12 3l9 8v10h-6v-6H9v6H3z" },
  { to: "/links", label: "My Links", icon: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" },
];

const rowStyle = "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium whitespace-nowrap transition-colors";

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuClass = ({ isActive }) =>
    `${rowStyle} ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`;

  const initial = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  function handleLogout() {
    signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="flex items-center gap-1 overflow-x-auto bg-dark p-3 md:sticky md:top-0 md:h-screen md:flex-col md:items-stretch md:gap-1 md:overflow-visible md:p-4">
        <div className="mr-3 shrink-0 md:mb-5 md:mr-0 md:border-b md:border-white/10 md:px-3 md:pb-5">
          <Logo light />
        </div>

        <p className="mb-1 mt-1 hidden px-3 text-xs text-gray-500 md:block">Menu</p>
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={menuClass}>
            <Icon d={item.icon} />
            {item.label}
          </NavLink>
        ))}

        {/* Account: right side on phone, bottom on desktop */}
        <div className="ml-auto flex items-center gap-2 md:ml-0 md:mt-auto md:flex-col md:items-stretch md:gap-1 md:border-t md:border-white/10 md:pt-4">
          <div className="flex items-center gap-2.5 md:px-3 md:pb-1">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white"
              aria-hidden>{initial}</div>
            <div className="hidden min-w-0 text-[13px] md:block">
              <div className="truncate font-medium text-white">{user?.name || "Account"}</div>
              <div className="truncate text-xs text-gray-400">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className={`${rowStyle} cursor-pointer text-gray-400 hover:bg-white/5 hover:text-white`}>
            <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            Logout
          </button>
        </div>
      </aside>

      <main className="w-full min-w-0 max-w-5xl p-4 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}