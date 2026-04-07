"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSupportInboxButton() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/admin/support/unread-count", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (mounted) {
          setCount(Number(data.count || 0));
        }
      } catch {}
    };

    load();
    const id = setInterval(load, 10000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <button
      onClick={() => router.push("/admin/support")}
      title="Вопросы поддержки"
      aria-label="Открыть вопросы поддержки"
      style={{
        position: "fixed",
        right: 20,
        bottom: 170,
        width: 58,
        height: 58,
        borderRadius: "999px",
        border: "none",
        background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
        color: "#fff",
        fontSize: 24,
        cursor: "pointer",
        boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ❗
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 22,
            height: 22,
            borderRadius: 999,
            background: "#fff",
            color: "#111827",
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6px",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}