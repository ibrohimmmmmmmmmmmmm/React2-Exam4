import React, { createContext, useContext, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Toast = {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
  actionLabel?: string;
  action?: () => void;
};

const ToastContext = createContext<{
  push: (
    msg: string,
    type?: Toast["type"],
    actionLabel?: string,
    action?: () => void,
  ) => void;
} | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback(
    (message: string, type: Toast["type"] = "info", actionLabel?: string, action?: () => void) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((t) => [...t, { id, message, type, actionLabel, action }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 4500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div id="__toast-root" className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className={`pointer-events-auto max-w-xs rounded-lg px-4 py-2 shadow-lg flex items-center justify-between gap-3 ${
                t.type === "error" ? "bg-rose-600 text-white" : t.type === "success" ? "bg-emerald-600 text-white" : "bg-black/80 text-white"
              }`}
            >
              <div className="flex-1 pr-2">{t.message}</div>
              {t.actionLabel && (
                <button
                  onClick={() => {
                    try {
                      t.action && t.action();
                    } finally {
                      setToasts((s) => s.filter((x) => x.id !== t.id));
                    }
                  }}
                  className="ml-2 rounded-md px-2 py-1 text-xs font-semibold underline"
                >
                  {t.actionLabel}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
