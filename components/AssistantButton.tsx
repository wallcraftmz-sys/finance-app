"use client";

import { usePathname, useRouter } from "next/navigation";

export default function AssistantButton() {
  const router = useRouter();
  const pathname = usePathname();

  const hiddenPaths = ["/", "/login", "/register", "/privacy", "/maintenance"];

  const shouldHide = hiddenPaths.includes(pathname);

  if (shouldHide) return null;

  return (
    <button
      onClick={() => router.push("/assistant")}
      style={{
        position: "fixed",
        right: "20px",
        bottom: "90px",
        width: "64px",
        height: "64px",
        borderRadius: "999px",
        border: "none",
        background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
        color: "#111",
        fontSize: "26px",
        cursor: "pointer",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        zIndex: 9999,
      }}
      aria-label="Открыть AI помощника"
      title="AI помощник"
    >
      🤖
    </button>
  );
}