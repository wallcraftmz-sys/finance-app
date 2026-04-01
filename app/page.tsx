"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function SplashScreen({ fadeOut = false }: { fadeOut?: boolean }) {
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
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? "scale(1.03)" : "scale(1)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
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
              width: "250px",
              height: "250px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              marginTop: "8px",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "210px",
                height: "210px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(51,120,255,0.10) 0%, rgba(51,120,255,0.05) 40%, rgba(255,166,0,0.04) 58%, transparent 74%)",
                filter: "blur(10px)",
                animation: "haloPulse 3.2s ease-in-out infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "154px",
                height: "154px",
                borderRadius: "50%",
                border: "1px solid rgba(115,170,255,0.18)",
                animation: "ringSpin 15s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "184px",
                height: "184px",
                borderRadius: "50%",
                border: "1px solid rgba(255,176,43,0.16)",
                animation: "ringSpinReverse 18s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "204px",
                height: "204px",
                borderRadius: "50%",
                border: "1px solid rgba(130,180,255,0.10)",
                animation: "ringBreath 4s ease-in-out infinite",
              }}
            />

            <svg
              viewBox="0 0 240 240"
              width="240"
              height="240"
              style={{
                position: "absolute",
                overflow: "visible",
                animation: "sphereFloat 4s ease-in-out infinite",
              }}
            >
              <ellipse
                cx="120"
                cy="120"
                rx="86"
                ry="92"
                fill="none"
                stroke="rgba(88,160,255,0.24)"
                strokeWidth="1.2"
              />
              <ellipse
                cx="120"
                cy="120"
                rx="86"
                ry="92"
                fill="none"
                stroke="rgba(255,176,43,0.18)"
                strokeWidth="1"
                transform="rotate(55 120 120)"
              />
              <ellipse
                cx="120"
                cy="120"
                rx="86"
                ry="92"
                fill="none"
                stroke="rgba(88,160,255,0.16)"
                strokeWidth="1"
                transform="rotate(-55 120 120)"
              />
              <ellipse
                cx="120"
                cy="120"
                rx="92"
                ry="52"
                fill="none"
                stroke="rgba(88,160,255,0.16)"
                strokeWidth="1"
              />
              <ellipse
                cx="120"
                cy="120"
                rx="92"
                ry="30"
                fill="none"
                stroke="rgba(255,176,43,0.14)"
                strokeWidth="1"
              />

              {[
                [120, 28],
                [168, 44],
                [198, 78],
                [206, 120],
                [191, 165],
                [162, 194],
                [120, 210],
                [78, 194],
                [49, 165],
                [34, 120],
                [42, 78],
                [72, 44],
                [92, 86],
                [148, 86],
                [172, 118],
                [154, 156],
                [120, 170],
                [86, 156],
                [68, 118],
              ].map(([cx, cy], i) => (
                <circle
                  key={`node-${i}`}
                  cx={cx}
                  cy={cy}
                  r={i % 3 === 0 ? "4" : "3.2"}
                  fill={i % 2 === 0 ? "#6fd0ff" : "#ffb33b"}
                  style={{
                    filter:
                      i % 2 === 0
                        ? "drop-shadow(0 0 8px rgba(111,208,255,0.95))"
                        : "drop-shadow(0 0 8px rgba(255,179,59,0.95))",
                    animation: `twinkle ${2 + (i % 3) * 0.4}s ease-in-out infinite`,
                    transformOrigin: "center",
                  }}
                />
              ))}

              {[
                [120, 28, 168, 44],
                [168, 44, 198, 78],
                [198, 78, 206, 120],
                [206, 120, 191, 165],
                [191, 165, 162, 194],
                [162, 194, 120, 210],
                [120, 210, 78, 194],
                [78, 194, 49, 165],
                [49, 165, 34, 120],
                [34, 120, 42, 78],
                [42, 78, 72, 44],
                [72, 44, 120, 28],

                [92, 86, 148, 86],
                [148, 86, 172, 118],
                [172, 118, 154, 156],
                [154, 156, 120, 170],
                [120, 170, 86, 156],
                [86, 156, 68, 118],
                [68, 118, 92, 86],

                [72, 44, 92, 86],
                [168, 44, 148, 86],
                [198, 78, 172, 118],
                [191, 165, 154, 156],
                [162, 194, 120, 170],
                [78, 194, 86, 156],
                [49, 165, 68, 118],
                [34, 120, 68, 118],

                [120, 28, 92, 86],
                [120, 28, 148, 86],
                [120, 210, 86, 156],
                [120, 210, 154, 156],
              ].map(([x1, y1, x2, y2], i) => (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? "rgba(95,185,255,0.46)" : "rgba(255,179,59,0.38)"}
                  strokeWidth="1.15"
                />
              ))}

              {[
                [96, 78],
                [152, 70],
                [175, 101],
                [163, 149],
                [120, 176],
                [79, 145],
                [66, 102],
                [109, 54],
                [135, 162],
                [56, 86],
                [184, 146],
              ].map(([cx, cy], i) => (
                <circle
                  key={`spark-${i}`}
                  cx={cx}
                  cy={cy}
                  r="1.8"
                  fill={i % 2 === 0 ? "#ffffff" : "#8fd8ff"}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))",
                    animation: `sparkBlink ${1.8 + (i % 4) * 0.5}s ease-in-out infinite`,
                  }}
                />
              ))}
            </svg>
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
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.03);
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
          0%,
          100% {
            transform: scale(0.985);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.02);
            opacity: 1;
          }
        }

        @keyframes haloPulse {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }

        @keyframes sphereFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes sparkBlink {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

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
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
  const fadeTimer = setTimeout(() => {
    setFadeSplash(true);
  }, 2100);

  const removeTimer = setTimeout(() => {
    setShowSplash(false);
  }, 2800);

  return () => {
    clearTimeout(fadeTimer);
    clearTimeout(removeTimer);
  };
}, []);

  if (showSplash) {
  return <SplashScreen fadeOut={fadeSplash} />;
}

  return <WelcomeScreen />;
}