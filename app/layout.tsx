import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import UpdateNotice from "@/components/UpdateNotice";
import FloatingButtonsServer from "@/components/FloatingButtonsServer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

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
        <ServiceWorkerRegister />
        <ThemeProvider>
          <UpdateNotice />
          {children}
          <FloatingButtonsServer />
        </ThemeProvider>
      </body>
    </html>
  );
}