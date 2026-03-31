
import type { Metadata, Viewport } from "next";
import UpdateNotice from "@/components/UpdateNotice";
import "./globals.css";
import AssistantButton from "@/components/AssistantButton";
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
        {children}
        <AssistantButton />
      </body>
    </html>
  );
}
<body>
  <UpdateNotice />
  {children}
  <AssistantButton />
</body>
