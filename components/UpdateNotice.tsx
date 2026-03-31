"use client";

import { useEffect, useState } from "react";

export default function UpdateNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const currentVersion = localStorage.getItem("moniq_version");

    async function checkVersion() {
      try {
        const res = await fetch("/version.json", { cache: "no-store" });
        const data = await res.json();

        if (!currentVersion) {
          localStorage.setItem("moniq_version", data.version);
          return;
        }

        if (currentVersion !== data.version) {
          setShow(true);
        }
      } catch {
        // молча игнорируем
      }
    }

    checkVersion();
  }, []);

  function handleReload() {
    localStorage.removeItem("moniq_version");
    window.location.reload();
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92%, 420px)",
        background: "#17171c",
        border: "1px solid #2f2f36",
        borderRadius: "16px",
        padding: "16px",
        zIndex: 10000,
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: "8px", color: "white" }}>
        Доступно обновление
      </div>

      <div style={{ color: "#cfcfd6", fontSize: "14px", lineHeight: 1.5, marginBottom: "12px" }}>
        В приложении появилась новая версия. Закрой и открой приложение заново
        или нажми кнопку ниже.
      </div>

      <button
        onClick={handleReload}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
          border: "none",
          borderRadius: "12px",
          fontWeight: 800,
          color: "#111",
          cursor: "pointer",
        }}
      >
        Обновить приложение
      </button>
    </div>
  );
}