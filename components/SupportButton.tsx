"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SupportButton() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/support/unread-count", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (mounted) {
          setCount(Number(data.count || 0));
        }
      } catch (e) {}
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
      onClick={() => router.push("/support")}
      style={{
        position: "fixed",
        right: 20,
        bottom: 170,
        width: 56,
        height: 56,
        borderRadius: "999px",
        border: "none",
        background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
        color: "#fff",
        fontSize: 22,
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
      title="Поддержка"
    >
      💬

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
            color: "#111",
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