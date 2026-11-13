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
  const isTransactionForm = /^\/(income|expenses)\/(new|[^/]+\/edit)$/.test(pathname);
  const shouldHide = hideOnRoutes.includes(pathname) || isTransactionForm;

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