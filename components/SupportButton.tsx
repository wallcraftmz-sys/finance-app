"use client";

import { useRouter } from "next/navigation";

export default function SupportButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/support")}
      style={{
        position: "fixed",
        right: 20,
        bottom: 170, // ВАЖНО: выше ассистента
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
    </button>
  );
}