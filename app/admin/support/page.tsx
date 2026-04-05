import { prisma } from "@/lib/prisma";

export default async function AdminSupportPage() {
  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Support messages</h1>

     {messages.map((m: { id: string; email: string; message: string }) => (
        <div key={m.id} style={{ marginBottom: 20 }}>
          <p><b>{m.email}</b></p>
          <p>{m.message}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}