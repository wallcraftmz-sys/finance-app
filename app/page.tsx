import Link from "next/link";

export default function WelcomePage() {
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
            F
          </div>

          <div style={{ color: "#8f8f95", fontSize: "14px", marginBottom: "8px" }}>
            Финансовый помощник
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