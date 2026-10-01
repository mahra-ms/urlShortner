import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";

const features = [
  { t: "Short URLs", d: "Create clean and memorable links in seconds.", p: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" },
  { t: "Analytics", d: "Track clicks and understand your audience.", p: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { t: "Fast", d: "Redirect visitors quickly and reliably.", p: "M13 2 4 14h7l-1 8 9-12h-7z" },
];

export default function Home() {
  return (
    <div>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-medium">Login</Link>
          <Link to="/signup" className="btn btn-dark btn-sm">Get Started</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">
            Turn long URLs into <span className="text-gray-600">short links.</span>
          </h1>
          <p className="my-5 max-w-sm text-base text-gray-700">
            Create powerful short URLs, share them anywhere, and track every click from one simple dashboard.
          </p>
          <div className="flex gap-2.5">
            <Link to="/signup" className="btn btn-dark">Create Free Account</Link>
            <Link to="/login" className="btn">Login</Link>
          </div>
        </div>

        <div className="card p-6 shadow-sm" aria-hidden="true">
          <small className="text-xs text-gray-500">Your long URL</small>
          <div className="mb-4 mt-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">https://example.com/my-very-long-url</div>
          <small className="text-xs text-gray-500">Your short URL</small>
          <div className="mt-1.5 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <b>{location.host}/my-url</b><span className="btn btn-dark btn-sm">Copy</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 pt-8 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.t}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={f.p} /></svg>
            <b className="mb-1 mt-2.5 block">{f.t}</b>
            <p className="text-gray-500">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}