"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** モーダルサイズ。デフォルト lg */
  size?: "md" | "lg" | "xl";
};

const sizeClass = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

export function Modal({ open, onClose, title, children, size = "lg" }: Props) {
  // Escape キーでクローズ
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    // body スクロールロック
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* バックドロップ */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70" />

          {/* モーダルコンテンツ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${sizeClass[size]} max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/30 dark:border-zinc-800 dark:bg-zinc-900`}
          >
            {/* ヘッダー */}
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="閉じる"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-rose-300"
                >
                  ✕
                </button>
              </div>
            )}

            {/* スクロール可能ボディ */}
            <div className="max-h-[calc(85vh-3.5rem)] overflow-y-auto p-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
