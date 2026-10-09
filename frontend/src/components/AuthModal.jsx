import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const labelCls = "mb-1.5 mt-4 block text-[13px] font-medium";

export default function AuthModal() {
  const { modal, openAuth, closeAuth, signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signup = modal === "signup";
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });


  useEffect(() => { setError(""); setBusy(false); }, [modal]);


  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => e.key === "Escape" && closeAuth();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal, closeAuth]);

  if (!modal) return null;

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const body = { email: form.email.trim(), password: form.password, ...(signup && { name: form.name.trim() }) };
      const d = await api(signup ? "/auth/signup" : "/auth/login", { method: "POST", body });
      signIn(d.token, d.user);
      setForm({ name: "", email: "", password: "" });
      closeAuth();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
  
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50 p-4 sm:p-6"
      onClick={closeAuth}>
  
      <div role="dialog" aria-modal="true" className="card relative m-auto w-full max-w-sm p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Close" onClick={closeAuth}
          className="absolute right-2 top-2 grid h-10 w-10 cursor-pointer place-items-center text-2xl leading-none text-gray-400 hover:text-ink">
          ×
        </button>

        <Logo />
        <h2 className="mb-1 mt-5 text-2xl font-bold tracking-tight">{signup ? "Create your account" : "Welcome back"}</h2>
        <p className="text-[13px] text-gray-500">{signup ? "Start creating and tracking short URLs." : "Login to manage your short URLs."}</p>

        <form onSubmit={submit} noValidate>
          {signup && (
            <>
              <label htmlFor="name" className={labelCls}>Name</label>
              <input id="name" className="input" placeholder="Your Name" autoComplete="name" value={form.name} onChange={set("name")} />
            </>
          )}
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" className="input" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={set("email")} />
          <label htmlFor="password" className={labelCls}>Password</label>
          <input id="password" type="password" className="input" placeholder={signup ? "Minimum 8 characters" : "Your password"}
            autoComplete={signup ? "new-password" : "current-password"} value={form.password} onChange={set("password")} />
          <p role="alert" className="mt-2.5 min-h-[18px] text-[13px] text-red-700">{error}</p>
          <button className="btn btn-dark mt-3 w-full" disabled={busy}>{signup ? "Create account" : "Login"}</button>
        </form>

        <p className="mt-5 text-center text-[13px] text-gray-500">
          {signup ? "Already have an account? " : "Don't have an account? "}
          <button type="button" className="cursor-pointer font-semibold text-ink"
            onClick={() => openAuth(signup ? "login" : "signup")}>
            {signup ? "Login" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}