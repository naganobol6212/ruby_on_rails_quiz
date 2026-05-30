"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          // 既存ユーザーに新 SW を確実に届けるため、積極的に更新チェック。
          // (PC で古い JS が居座って画面が固まる事故を防ぐ)
          reg.update().catch(() => {});
          reg.addEventListener("updatefound", () => {
            const sw = reg.installing;
            if (!sw) return;
            sw.addEventListener("statechange", () => {
              if (
                sw.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // 新 SW が待機中なら即時アクティブ化を促す (sw.js 側の skipWaiting と併用)
                sw.postMessage({ type: "SKIP_WAITING" });
              }
            });
          });
        })
        .catch((err) => {
          // 失敗は静かに無視 (Safari Private Mode 等)
          console.warn("[PWA] SW register failed:", err);
        });

      // 新 SW がコントロールを取ったら一度だけリロード (古いタブの整合性を保つ)
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloaded) return;
        reloaded = true;
        window.location.reload();
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
