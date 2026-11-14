import { getMoniqI18n } from "@/lib/moniq-language-server";

export async function GET() {
  const { language, msg } = await getMoniqI18n();
  return Response.json({
    name: "Moniq",
    short_name: "Moniq",
    lang: language,
    description: msg("Доходы, расходы, цели, аналитика и AI-помощник"),
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }, {
    headers: { "Content-Type": "application/manifest+json", "Cache-Control": "private, no-store" },
  });
}
