import MoniqLanguageProvider from "@/components/MoniqLanguageProvider";
import { getMoniqI18n } from "@/lib/moniq-language-server";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import UpdateNotice from "@/components/UpdateNotice";
import FloatingButtonsServer from "@/components/FloatingButtonsServer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export async function generateMetadata(): Promise<Metadata> {
  const { msg } = await getMoniqI18n();
  return {
    title: "Moniq",
    description: msg("AI финансовое приложение"),
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Moniq",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = await getMoniqI18n();
  return (
    <html lang={language}>
      <body>
        <MoniqLanguageProvider initialLanguage={language}>
          <ServiceWorkerRegister />
          <ThemeProvider>
            <UpdateNotice />
            {children}
            <FloatingButtonsServer />
          </ThemeProvider>
        </MoniqLanguageProvider>
      </body>
    </html>
  );
}