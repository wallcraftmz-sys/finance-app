"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function SplashScreen() {
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 50% 40%, rgba(43, 119, 255, 0.18), transparent 18%), radial-gradient(circle at 50% 62%, rgba(245, 158, 11, 0.12), transparent 22%), linear-gradient(180deg, #05070d 0%, #090b12 50%, #0b0f17 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
            transform: "translateY(-12px)",
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "22px",
              background: "linear-gradient(180deg, #ffd84d 0%, #f7b500 100%)",
              color: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "42px",
              boxShadow:
                "0 0 30px rgba(255, 200, 0, 0.22), 0 14px 30px rgba(0,0,0,0.35)",
              animation: "logoFloat 2.4s ease-in-out infinite",
            }}
          >
            M
          </div>

          <div
            style={{
              color: "white",
              fontSize: "52px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              animation: "fadeUp 0.8s ease forwards",
            }}
          >
            moniq
          </div>

          <div
            style={{
              position: "relative",
              width: "220px",
              height: "220px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "50%",
                width: "120px",
                height: "120px",
                marginLeft: "-60px",
                marginTop: "-60px",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 38% 34%, #8fd3ff 0%, #3a86ff 32%, #17335f 68%, #0a1220 100%)",
                boxShadow:
                  "0 0 30px rgba(58,134,255,0.28), 0 0 70px rgba(255,179,0,0.10), inset 0 0 20px rgba(255,255,255,0.08)",
                animation: "corePulse 2.8s ease-in-out infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: "50%",
                width: "150px",
                height: "150px",
                marginLeft: "-75px",
                marginTop: "-75px",
                borderRadius: "999px",
                border: "1px solid rgba(110,170,255,0.24)",
                animation: "ringSpin 10s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "50%",
                width: "176px",
                height: "176px",
                marginLeft: "-88px",
                marginTop: "-88px",
                borderRadius: "999px",
                border: "1px solid rgba(255,183,43,0.22)",
                animation: "ringSpinReverse 14s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "50%",
                width: "202px",
                height: "202px",
                marginLeft: "-101px",
                marginTop: "-101px",
                borderRadius: "999px",
                border: "1px solid rgba(130,180,255,0.14)",
                animation: "ringBreath 3.6s ease-in-out infinite",
              }}
            />

            <span
              style={{
                position: "absolute",
                top: "34px",
                left: "104px",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#9ad6ff",
                boxShadow: "0 0 12px rgba(154,214,255,0.8)",
                animation: "twinkle 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "64px",
                right: "28px",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#ffbf47",
                boxShadow: "0 0 12px rgba(255,191,71,0.8)",
                animation: "twinkle 2.2s ease-in-out infinite 0.4s",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "42px",
                right: "42px",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#9ad6ff",
                boxShadow: "0 0 12px rgba(154,214,255,0.8)",
                animation: "twinkle 2.4s ease-in-out infinite 0.8s",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "28px",
                left: "98px",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#ffbf47",
                boxShadow: "0 0 12px rgba(255,191,71,0.8)",
                animation: "twinkle 2.1s ease-in-out infinite 1.1s",
              }}
            />
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.03);
          }
        }

        @keyframes corePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }

        @keyframes ringSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ringSpinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes ringBreath {
          0%, 100% {
            transform: scale(0.98);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.03);
            opacity: 1;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }
      `}</style>
    </>
  );
}

function WelcomeScreen() {
  return (
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
        animation: "welcomeFade 0.5s ease",
      }}
    >
      <style jsx global>{`
        @keyframes welcomeFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

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
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>Доходы и расходы</div>
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
  );
}

export default function WelcomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <WelcomeScreen />;
}