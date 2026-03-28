
import type { Metadata, Viewport } from "next";
import "./globals.css";
import AssistantButton from "@/components/AssistantButton";
export const metadata: Metadata = {
  title: "FinTrack",
  description: "Учёт доходов, расходов, целей и аналитики",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FinTrack",
  },
};
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}
        <AssistantButton />
      </body>
    </html>
  );
}
