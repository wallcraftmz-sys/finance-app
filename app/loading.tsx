"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="splash-root">
      <div className={`logo-wrap ${visible ? "show" : ""}`}>
        <div className="logo-box">M</div>
        <div className="brand">moniq</div>
      </div>

      <div className={`orb-wrap ${visible ? "show" : ""}`}>
        <div className="orb">
          <div className="orb-glow" />
          <div className="orb-core" />

          <span className="ring ring-1" />
          <span className="ring ring-2" />
          <span className="ring ring-3" />

          <span className="node node-1" />
          <span className="node node-2" />
          <span className="node node-3" />
          <span className="node node-4" />
          <span className="node node-5" />
          <span className="node node-6" />

          <span className="spark spark-1" />
          <span className="spark spark-2" />
          <span className="spark spark-3" />
          <span className="spark spark-4" />
        </div>
      </div>

      <style jsx>{`
        .splash-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 50% 42%, rgba(37, 99, 235, 0.16), transparent 24%),
            radial-gradient(circle at 50% 62%, rgba(245, 158, 11, 0.12), transparent 28%),
            linear-gradient(180deg, #05070d 0%, #090b12 45%, #0b0f17 100%);
          overflow: hidden;
          position: relative;
        }

        .splash-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 26px 26px;
          opacity: 0.08;
          pointer-events: none;
        }

        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 30px;
          opacity: 0;
          transform: translateY(-10px) scale(0.96);
          transition: opacity 0.55s ease, transform 0.55s ease;
          z-index: 2;
        }

        .logo-wrap.show {
          opacity: 1;
          transform: translateY(0) scale(1);
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
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
        }

        .orb-wrap {
          opacity: 0;
          transform: translateY(16px) scale(0.94);
          transition:
            opacity 0.7s ease 0.18s,
            transform 0.7s ease 0.18s;
          z-index: 2;
        }

        .orb-wrap.show {
          opacity: 1;
          transform: translateY(0) scale(1);
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

        .node,
        .spark {
          position: absolute;
          border-radius: 50%;
        }

        .node {
          width: 8px;
          height: 8px;
          background: #8fd0ff;
          box-shadow: 0 0 10px rgba(143, 208, 255, 0.8);
          animation: twinkle 2.2s ease-in-out infinite;
        }

        .node-1 { top: 28px; left: 100px; animation-delay: 0s; }
        .node-2 { top: 58px; right: 24px; background: #ffbf47; box-shadow: 0 0 10px rgba(255, 191, 71, 0.9); animation-delay: 0.35s; }
        .node-3 { right: 40px; bottom: 54px; animation-delay: 0.75s; }
        .node-4 { bottom: 26px; left: 96px; background: #ffbf47; box-shadow: 0 0 10px rgba(255, 191, 71, 0.9); animation-delay: 1s; }
        .node-5 { left: 26px; top: 88px; animation-delay: 1.25s; }
        .node-6 { left: 46px; top: 38px; background: #ffbf47; box-shadow: 0 0 10px rgba(255, 191, 71, 0.9); animation-delay: 1.55s; }

        .spark {
          width: 3px;
          height: 3px;
          background: white;
          opacity: 0.9;
        }

        .spark-1 { top: 48px; left: 42px; animation: sparkMove1 3.4s linear infinite; }
        .spark-2 { top: 36px; right: 56px; animation: sparkMove2 4s linear infinite; }
        .spark-3 { bottom: 42px; right: 48px; animation: sparkMove3 3.7s linear infinite; }
        .spark-4 { bottom: 54px; left: 54px; animation: sparkMove4 4.2s linear infinite; }

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

        @keyframes twinkle {
          0%, 100% { opacity: 0.45; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.35); }
        }

        @keyframes sparkMove1 {
          0% { transform: translate(0, 0); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translate(90px, 30px); opacity: 0; }
        }

        @keyframes sparkMove2 {
          0% { transform: translate(0, 0); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translate(-80px, 44px); opacity: 0; }
        }

        @keyframes sparkMove3 {
          0% { transform: translate(0, 0); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translate(-88px, -38px); opacity: 0; }
        }

        @keyframes sparkMove4 {
          0% { transform: translate(0, 0); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translate(84px, -44px); opacity: 0; }
        }

        @media (max-width: 640px) {
          .logo-box {
            width: 62px;
            height: 62px;
            font-size: 36px;
          }

          .brand {
            font-size: 38px;
          }

          .orb {
            width: 190px;
            height: 190px;
          }

          .orb-core {
            width: 102px;
            height: 102px;
          }

          .ring-1 { width: 132px; height: 132px; }
          .ring-2 { width: 154px; height: 154px; }
          .ring-3 { width: 172px; height: 172px; }
        }
      `}</style>
    </div>
  );
}