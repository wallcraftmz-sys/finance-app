import type { Metadata, Viewport } from "next";
import "./globals.css";
import UpdateNotice from "@/components/UpdateNotice";
import FloatingButtonsServer from "@/components/FloatingButtonsServer";

export const metadata: Metadata = {
  title: "Moniq",
  description: "AI финансовое приложение",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Moniq",
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
        <UpdateNotice />
        {children}
        <FloatingButtonsServer />
      </body>
    </html>
  );
}