import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import PreviewCard from "../components/PreviewCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  { t: "Short URLs", d: "Create clean and memorable links in seconds.", p: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" },
  { t: "Analytics", d: "Track clicks and understand your audience.", p: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { t: "Fast", d: "Redirect visitors quickly and reliably.", p: "M13 2 4 14h7l-1 8 9-12h-7z" },
];

export default function Home() {
  const { user, openAuth } = useAuth();
  const location = useLocation();

  // Opened here because a protected page needed login
  useEffect(() => {
    if (location.state?.needLogin) openAuth("login");
  }, [location.state, openAuth]);

  return (
    <div>
      <nav className="flex items-center justify-between bg-[#efefef] px-4 py-4 md:px-10 md:py-5">
        <Logo />
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn btn-dark btn-sm">Dashboard</Link>
          ) : (
            <>
              <button onClick={() => openAuth("login")} className="cursor-pointer font-medium">Login</button>
              <button onClick={() => openAuth("signup")} className="btn btn-dark btn-sm">Get Started</button>
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 font-serif md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-5 lg:px-24 lg:py-24">
        <div className="min-w-0 xl:w-2xl">
          <h1 className="mb-2 text-lg font-medium text-gray-400 font-serif md:text-xl">Sample.Fast.Analytics</h1>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl xl:text-6xl">
            Turn long URLs into <span className="text-gray-600">short links.</span>
          </h1>
          <p className="my-5 max-w-sm text-base text-gray-700">
            Create powerful short URLs, share them anywhere, and track every click from one simple dashboard.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {user ? (
              <Link to="/dashboard" className="btn btn-dark">Go to Dashboard</Link>
            ) : (
              <>
                <button onClick={() => openAuth("signup")} className="btn btn-dark">Create Free Account</button>
                <button onClick={() => openAuth("login")} className="btn">Login</button>
              </>
            )}
          </div>
        </div>
        <PreviewCard />
      </section>

      <section className="grid gap-6 bg-[#efefef] px-4 pb-12 pt-6 font-serif md:grid-cols-3 md:gap-10 md:px-10 md:pb-20 lg:px-24">
        {features.map((f) => (
          <div className="pt-2 md:pt-5" key={f.t}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={f.p} /></svg>
            <b className="mb-1 mt-2.5 block">{f.t}</b>
            <p className="text-gray-500">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}