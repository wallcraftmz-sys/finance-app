"use client";

import { useEffect, useState } from "react";

type SplashScreenProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 50);

    const exitTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2300);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-root ${visible ? "show" : ""} ${fadeOut ? "hide" : ""}`}>
      <div className="logo-wrap">
        <div className="logo-box">M</div>
        <div className="brand">moniq</div>
      </div>

      <div className="orb">
        <div className="orb-glow" />
        <div className="orb-core" />
        <span className="ring ring-1" />
        <span className="ring ring-2" />
        <span className="ring ring-3" />
      </div>

      <style jsx>{`
        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 50% 42%, rgba(37, 99, 235, 0.16), transparent 24%),
            radial-gradient(circle at 50% 62%, rgba(245, 158, 11, 0.12), transparent 28%),
            linear-gradient(180deg, #05070d 0%, #090b12 45%, #0b0f17 100%);
          opacity: 0;
          transform: scale(1.02);
          transition: opacity 0.5s ease, transform 0.5s ease;
          overflow: hidden;
        }

        .splash-root.show {
          opacity: 1;
          transform: scale(1);
        }

        .splash-root.hide {
          opacity: 0;
          transform: scale(1.01);
        }

        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 30px;
          z-index: 2;
        }

        .logo-box {
          width: 68px;
          height: 68px;
          border-radius: 18px;
          background: linear-gradient(180deg, #ffd84d 0%, #f7b500 100%);
          color: #111111;
          font-size: 40px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 24px rgba(255, 200, 0, 0.26),
            0 10px 24px rgba(0, 0, 0, 0.35);
        }

        .brand {
          color: white;
          font-size: 44px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .orb {
          position: relative;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation:
            floatOrb 4.6s ease-in-out infinite,
            rotateOrb 16s linear infinite;
          filter: drop-shadow(0 0 20px rgba(45, 125, 255, 0.18))
            drop-shadow(0 0 28px rgba(255, 170, 0, 0.12));
        }

        .orb-glow {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background:
            radial-gradient(circle, rgba(54, 130, 255, 0.22) 0%, rgba(54, 130, 255, 0.08) 38%, transparent 72%),
            radial-gradient(circle, rgba(255, 174, 0, 0.16) 0%, transparent 70%);
          animation: pulseGlow 2.8s ease-in-out infinite;
        }

        .orb-core {
          position: absolute;
          width: 116px;
          height: 116px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 40% 35%, #7ec8ff 0%, #2c7dff 28%, #102342 58%, #09101c 100%);
          box-shadow:
            inset 0 0 26px rgba(255, 255, 255, 0.1),
            0 0 18px rgba(44, 125, 255, 0.3),
            0 0 34px rgba(255, 170, 0, 0.15);
          animation: coreBreath 3.2s ease-in-out infinite;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1.4px solid rgba(88, 164, 255, 0.35);
          box-shadow: 0 0 18px rgba(52, 122, 255, 0.12);
        }

        .ring-1 {
          width: 150px;
          height: 150px;
          border-color: rgba(91, 171, 255, 0.42);
          transform: rotate(18deg);
          animation: ringSpin1 8s linear infinite;
        }

        .ring-2 {
          width: 176px;
          height: 176px;
          border-color: rgba(255, 176, 31, 0.32);
          transform: rotate(72deg);
          animation: ringSpin2 11s linear infinite;
        }

        .ring-3 {
          width: 196px;
          height: 196px;
          border-color: rgba(154, 198, 255, 0.22);
          transform: rotate(-24deg);
          animation: ringSpin3 13s linear infinite;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes rotateOrb {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.96); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes coreBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes ringSpin1 {
          from { transform: rotate(18deg) rotateZ(0deg); }
          to { transform: rotate(18deg) rotateZ(360deg); }
        }

        @keyframes ringSpin2 {
          from { transform: rotate(72deg) rotateZ(360deg); }
          to { transform: rotate(72deg) rotateZ(0deg); }
        }

        @keyframes ringSpin3 {
          from { transform: rotate(-24deg) rotateZ(0deg); }
          to { transform: rotate(-24deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
}