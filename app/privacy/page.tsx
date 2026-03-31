import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b0b0f 0%, #111111 100%)",
        color: "white",
        fontFamily: "Inter, sans-serif",
        padding: "32px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "760px" }}>

        {/* КНОПКА НАЗАД */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              marginBottom: "20px",
              padding: "10px 14px",
              background: "#1f1f26",
              border: "1px solid #2f2f36",
              borderRadius: "12px",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Назад
          </button>
        </Link>

        <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
          Политика конфиденциальности
        </h1>

        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Moniq уважает конфиденциальность пользователей. Эта политика описывает,
          какие данные мы собираем, как мы их используем и как защищаем.
        </p>

        <h2 style={{ marginTop: "28px" }}>1. Какие данные мы собираем</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Мы можем собирать следующие данные: адрес электронной почты, данные
          авторизации, доходы, расходы, цели, сообщения в AI-чате и технические
          данные, необходимые для работы приложения.
        </p>

        <h2 style={{ marginTop: "28px" }}>2. Для чего используются данные</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Данные используются для работы аккаунта, отображения финансовой
          аналитики, сохранения истории, работы AI-функций и улучшения сервиса.
        </p>

        <h2 style={{ marginTop: "28px" }}>3. Хранение и защита</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Мы принимаем разумные меры для защиты данных пользователей. Доступ к
          данным ограничен технической необходимостью работы приложения.
        </p>

        <h2 style={{ marginTop: "28px" }}>4. AI-функции</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Сообщения, отправленные в AI-чат, могут использоваться для генерации
          ответов и улучшения пользовательского опыта внутри приложения.
        </p>

        <h2 style={{ marginTop: "28px" }}>5. Cookies и сессии</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Приложение использует cookies и сессионные механизмы для входа в
          аккаунт и безопасной работы приложения.
        </p>

        <h2 style={{ marginTop: "28px" }}>6. Права пользователя</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Пользователь может прекратить использование приложения и запросить
          удаление аккаунта или связанных данных, если такая функция будет
          предусмотрена сервисом.
        </p>

        <h2 style={{ marginTop: "28px" }}>7. Изменения политики</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          Мы можем обновлять эту политику. Актуальная версия всегда публикуется
          в приложении.
        </p>

        <h2 style={{ marginTop: "28px" }}>8. Контакты</h2>
        <p style={{ color: "#cfcfd6", lineHeight: 1.7 }}>
          По вопросам, связанным с конфиденциальностью, можно связаться через
          контакты, указанные в приложении или на сайте.
        </p>
      </div>
    </main>
  );
}