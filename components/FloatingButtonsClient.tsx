"use client";

import { usePathname } from "next/navigation";
import AssistantButton from "@/components/AssistantButton";
import AdminSupportInboxButton from "@/components/AdminSupportInboxButton";
import SupportButton from "@/components/SupportButton";

type Props = {
  isAdmin: boolean;
};

export default function FloatingButtonsClient({ isAdmin }: Props) {
  const pathname = usePathname();

  const hideOnRoutes = ["/", "/login", "/register", "/admin/support"];
  const shouldHide = hideOnRoutes.includes(pathname);

  if (shouldHide) {
    return null;
  }

  if (isAdmin) {
    return (
      <>
        <AdminSupportInboxButton />
        <AssistantButton />
      </>
    );
  }

  return (
    <>
      <SupportButton />
      <AssistantButton />
    </>
  );
}