import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState("");
  const timer = useRef();
  const show = useCallback((m) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 1600);
  }, []);
  const copy = useCallback(async (text) => {
    try { await navigator.clipboard.writeText(text); show("Copied"); } catch { show("Copy failed"); }
  }, [show]);

  return (
    <ToastCtx.Provider value={{ show, copy }}>
      {children}
      <div role="status" className={`fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-dark px-4 py-2 text-[13px] text-white transition-opacity ${msg ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {msg}
      </div>
    </ToastCtx.Provider>
  );
}