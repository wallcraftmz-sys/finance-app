```tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WelcomeClient from "./WelcomeClient";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("finance_session")?.value;

  if (token) {
    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (session && session.expiresAt >= new Date()) {
      redirect("/dashboard");
    }

    if (session && session.expiresAt < new Date()) {
      await prisma.session.deleteMany({
        where: { token },
      });
    }
  }

  return <WelcomeClient />;
}
```
