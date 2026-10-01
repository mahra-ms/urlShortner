import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const labelCls = "mb-1.5 mt-4 block text-[13px] font-medium";

export default function AuthPage({ mode }) {
  const signup = mode === "signup";
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const body = { email: form.email.trim(), password: form.password, ...(signup && { name: form.name.trim() }) };
      const d = await api(signup ? "/auth/signup" : "/auth/login", { method: "POST", body });
      signIn(d.token, d.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="card w-full max-w-sm p-8">
        <Logo />
        <h2 className="mb-1 mt-5 text-2xl font-bold tracking-tight">{signup ? "Create your account" : "Welcome back"}</h2>
        <p className="text-[13px] text-gray-500">{signup ? "Start creating and tracking short URLs." : "Login to manage your short URLs."}</p>

        <form onSubmit={submit} noValidate>
          {signup && (
            <>
              <label htmlFor="name" className={labelCls}>Name</label>
              <input id="name" className="input" placeholder="John Doe" autoComplete="name" value={form.name} onChange={set("name")} />
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
          {signup
            ? <>Already have an account? <Link to="/login" className="font-semibold text-ink">Login</Link></>
            : <>Don't have an account? <Link to="/signup" className="font-semibold text-ink">Create one</Link></>}
        </p>
      </div>
    </div>
  );
}