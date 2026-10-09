import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api.js";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));
  const [modal, setModal] = useState(null); 

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api("/auth/me").then((d) => setUser(d.user)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const expire = () => setUser(null);
    window.addEventListener("auth:expired", expire);
    return () => window.removeEventListener("auth:expired", expire);
  }, []);

  const signIn = useCallback((token, u) => { localStorage.setItem("token", token); setUser(u); }, []);
  const signOut = useCallback(() => { localStorage.removeItem("token"); setUser(null); }, []);
  const openAuth = useCallback((mode = "login") => setModal(mode), []);
  const closeAuth = useCallback(() => setModal(null), []);

  return (
    <AuthCtx.Provider value={{ user, loading, signIn, signOut, modal, openAuth, closeAuth }}>
      {children}
    </AuthCtx.Provider>
  );
}