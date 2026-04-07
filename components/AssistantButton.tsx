"use client";

import { useRouter } from "next/navigation";

export default function AssistantButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/assistant")}
      title="AI помощник"
      aria-label="Открыть AI помощника"
      style={{
        position: "fixed",
        right: 20,
        bottom: 90,
        width: 64,
        height: 64,
        borderRadius: "999px",
        border: "none",
        background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
        color: "#111",
        fontSize: 26,
        cursor: "pointer",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      🤖
    </button>
  );
}