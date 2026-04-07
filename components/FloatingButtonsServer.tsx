import { getCurrentUser } from "@/lib/auth";
import FloatingButtonsClient from "@/components/FloatingButtonsClient";

export default async function FloatingButtonsServer() {
  const user = await getCurrentUser();
  const isAdmin = !!user && user.email === process.env.ADMIN_EMAIL;

  return <FloatingButtonsClient isAdmin={isAdmin} />;
}