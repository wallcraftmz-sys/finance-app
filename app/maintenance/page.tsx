export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b0b0f 0%, #111111 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "390px",
          background: "#17171c",
          border: "1px solid #26262b",
          borderRadius: "24px",
          padding: "28px 22px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 18px",
            borderRadius: "22px",
            background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
            color: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "34px",
          }}
        >
          M
        </div>

        <h1 style={{ margin: "0 0 12px 0", fontSize: "28px" }}>Moniq обновляется</h1>

        <p style={{ margin: 0, color: "#c9c9d2", lineHeight: 1.6 }}>
          Идёт обновление приложения. Попробуй зайти через пару минут.
        </p>
      </div>
    </main>
  );
}