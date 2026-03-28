"use client";

import { useRouter } from "next/navigation";

export default function AssistantButton() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/assistant")}
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        zIndex: 9999,
      }}
    >
      🤖
    </div>
  );
}