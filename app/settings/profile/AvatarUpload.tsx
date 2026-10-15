"use client";

import { useRef, useState } from "react";

export default function AvatarUpload({
  initialAvatarUrl,
}: {
  initialAvatarUrl: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;

    setMessage("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Выбери JPG, PNG или WebP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Фотография должна быть меньше 5 МБ");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки");
      }

      setAvatarUrl(data.avatarUrl);
      setMessage("Фотография успешно сохранена!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Ошибка загрузки"
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ textAlign: "center", marginBottom: 42 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          width: 104,
          height: 104,
          borderRadius: "50%",
          border: "none",
          background: "var(--moniq-input)",
          overflow: "hidden",
          cursor: uploading ? "wait" : "pointer",
          display: "block",
          margin: "0 auto 18px",
          padding: 0,
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Фото профиля"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span style={{ fontSize: 40 }}>👤</span>
        )}
      </button>

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          background: "none",
          border: "none",
          color: "var(--moniq-accent)",
          fontSize: 18,
          fontWeight: 700,
          cursor: uploading ? "wait" : "pointer",
        }}
      >
        {uploading ? "Загружаем..." : "Загрузить фотографию"}
      </button>

      <p style={{ color: "var(--moniq-muted)", fontSize: 13, marginTop: 5 }}>
        JPG, PNG или WebP · до 5 МБ
      </p>

      {message && (
        <p
          role="status"
          style={{
            color: message.includes("успешно") ? "#45d6a0" : "#ff655c",
            fontSize: 13,
            marginTop: 10,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
