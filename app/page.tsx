"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 50);

    const exitTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    const finishTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2300);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at 50% 42%, rgba(37, 99, 235, 0.16), transparent 24%), radial-gradient(circle at 50% 62%, rgba(245, 158, 11, 0.12), transparent 28%), linear-gradient(180deg, #05070d 0%, #090b12 45%, #0b0f17 100%)",
            opacity: fadeOut ? 0 : visible ? 1 : 0,
            transform: fadeOut
              ? "scale(1.01)"
              : visible
              ? "scale(1)"
              : "scale(1.02)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              marginBottom: "30px",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "18px",
                background: "linear-gradient(180deg, #ffd84d 0%, #f7b500 100%)",
                color: "#111111",
                fontSize: "40px",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 0 24px rgba(255, 200, 0, 0.26), 0 10px 24px rgba(0, 0, 0, 0.35)",
              }}
            >
              M
            </div>

            <div
              style={{
                color: "white",
                fontSize: "44px",
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              moniq
            </div>
          </div>

          <div
            style={{
              position: "relative",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "floatOrb 4.6s ease-in-out infinite, rotateOrb 16s linear infinite",
              filter:
                "drop-shadow(0 0 20px rgba(45, 125, 255, 0.18)) drop-shadow(0 0 28px rgba(255, 170, 0, 0.12))",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(54, 130, 255, 0.22) 0%, rgba(54, 130, 255, 0.08) 38%, transparent 72%), radial-gradient(circle, rgba(255, 174, 0, 0.16) 0%, transparent 70%)",
                animation: "pulseGlow 2.8s ease-in-out infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "116px",
                height: "116px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 40% 35%, #7ec8ff 0%, #2c7dff 28%, #102342 58%, #09101c 100%)",
                boxShadow:
                  "inset 0 0 26px rgba(255, 255, 255, 0.1), 0 0 18px rgba(44, 125, 255, 0.3), 0 0 34px rgba(255, 170, 0, 0.15)",
                animation: "coreBreath 3.2s ease-in-out infinite",
              }}
            />

            <span
              style={{
                position: "absolute",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border: "1.4px solid rgba(91, 171, 255, 0.42)",
                boxShadow: "0 0 18px rgba(52, 122, 255, 0.12)",
                transform: "rotate(18deg)",
                animation: "ringSpin1 8s linear infinite",
              }}
            />

            <span
              style={{
                position: "absolute",
                width: "176px",
                height: "176px",
                borderRadius: "50%",
                border: "1.4px solid rgba(255, 176, 31, 0.32)",
                boxShadow: "0 0 18px rgba(52, 122, 255, 0.12)",
                transform: "rotate(72deg)",
                animation: "ringSpin2 11s linear infinite",
              }}
            />

            <span
              style={{
                position: "absolute",
                width: "196px",
                height: "196px",
                borderRadius: "50%",
                border: "1.4px solid rgba(154, 198, 255, 0.22)",
                boxShadow: "0 0 18px rgba(52, 122, 255, 0.12)",
                transform: "rotate(-24deg)",
                animation: "ringSpin3 13s linear infinite",
              }}
            />
          </div>

          <style jsx global>{`
            @keyframes floatOrb {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-8px);
              }
            }

            @keyframes rotateOrb {
              from {
                rotate: 0deg;
              }
              to {
                rotate: 360deg;
              }
            }

            @keyframes pulseGlow {
              0%,
              100% {
                transform: scale(0.96);
                opacity: 0.7;
              }
              50% {
                transform: scale(1.05);
                opacity: 1;
              }
            }

            @keyframes coreBreath {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }

            @keyframes ringSpin1 {
              from {
                transform: rotate(18deg) rotateZ(0deg);
              }
              to {
                transform: rotate(18deg) rotateZ(360deg);
              }
            }

            @keyframes ringSpin2 {
              from {
                transform: rotate(72deg) rotateZ(360deg);
              }
              to {
                transform: rotate(72deg) rotateZ(0deg);
              }
            }

            @keyframes ringSpin3 {
              from {
                transform: rotate(-24deg) rotateZ(0deg);
              }
              to {
                transform: rotate(-24deg) rotateZ(360deg);
              }
            }
          `}</style>
        </div>
      )}

      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0b0b0f 0%, #111111 100%)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "390px",
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1c1c22 0%, #111114 100%)",
              border: "1px solid #26262b",
              borderRadius: "28px",
              padding: "28px 22px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "28px",
                marginBottom: "22px",
              }}
            >
              M
            </div>

            <h1
              style={{
                fontSize: "34px",
                lineHeight: 1.1,
                margin: "0 0 14px 0",
                fontWeight: 800,
                letterSpacing: "-1px",
              }}
            >
              moniq
            </h1>

            <p
              style={{
                color: "#d0d0d6",
                fontSize: "15px",
                lineHeight: 1.6,
                margin: "0 0 22px 0",
              }}
            >
              Контролируй доходы и расходы, смотри аналитику, ставь финансовые цели
              и получай умные подсказки в одном приложении.
            </p>

            <div style={{ display: "grid", gap: "12px", marginBottom: "22px" }}>
              <div
                style={{
                  background: "#15151a",
                  border: "1px solid #24242a",
                  borderRadius: "18px",
                  padding: "14px",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                  Доходы и расходы
                </div>
                <div style={{ color: "#9d9da6", fontSize: "14px" }}>
                  Добавляй операции и держи баланс под контролем.
                </div>
              </div>

              <div
                style={{
                  background: "#15151a",
                  border: "1px solid #24242a",
                  borderRadius: "18px",
                  padding: "14px",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>Аналитика</div>
                <div style={{ color: "#9d9da6", fontSize: "14px" }}>
                  Смотри категории, графики и структуру расходов.
                </div>
              </div>

              <div
                style={{
                  background: "#15151a",
                  border: "1px solid #24242a",
                  borderRadius: "18px",
                  padding: "14px",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>Цели и AI</div>
                <div style={{ color: "#9d9da6", fontSize: "14px" }}>
                  Копи на важное и получай полезные подсказки.
                </div>
              </div>
            </div>

            <Link href="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                  border: "none",
                  borderRadius: "18px",
                  color: "#111",
                  fontWeight: 800,
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Войти
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}