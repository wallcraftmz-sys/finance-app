import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await req.json();
    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
    }

    const [goals, incomes, expenses, previousMessages] = await Promise.all([
      prisma.goal.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.income.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.expense.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.aiMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
        take: 12,
      }),
    ]);

    const totalIncome = incomes.reduce((sum: number, item: any) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum: number, item: any) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;

    const expenseByCategory: Record<string, number> = {};
    for (const item of expenses) {
      expenseByCategory[item.category] =
        (expenseByCategory[item.category] || 0) + item.amount;
    }

    const sortedCategories = Object.entries(expenseByCategory).sort(
      (a, b) => b[1] - a[1]
    );

    const categorySummary =
      sortedCategories.length > 0
        ? sortedCategories
            .map(([category, amount]) => `${category}: ${amount}€`)
            .join(", ")
        : "Нет расходов";

    const biggestCategory =
      sortedCategories.length > 0
        ? `${sortedCategories[0][0]} (${sortedCategories[0][1]}€)`
        : "Нет категории";

    const goalSummary =
      goals.length > 0
        ? goals.map((g: any) => `${g.title}: цель ${g.targetAmount}€`).join(", ")
        : "Целей пока нет";

    await prisma.aiMessage.create({
      data: {
        userId: user.id,
        role: "user",
        content: message,
      },
    });

   const systemPrompt = `
Ты умный и живой AI-помощник внутри приложения Moniq.

Твоя задача:
- разговаривать естественно и по-человечески
- отвечать не сухо, а понятно и дружелюбно
- помогать по финансам, накоплениям, расходам, целям и планированию
- отвечать и на обычные вопросы пользователя, если они не противоречат теме приложения
- если вопрос не про финансы, всё равно отвечай нормально, но кратко и дружелюбно

Стиль:
- не будь сухим
- не будь роботом
- объясняй просто
- можно использовать естественные фразы, как живой помощник
- если уместно, давай примеры
- если пользователь переживает, отвечай спокойно и поддерживающе
- если пользователь спрашивает лишнее, не ломайся и не отвечай шаблонно

Когда вопрос про финансы:
1. коротко скажи, что происходит
2. покажи слабое место
3. предложи конкретный шаг

Когда вопрос не про финансы:
- отвечай как обычный дружелюбный AI-ассистент
- не пиши, что "это вне моей функции", если можешь нормально помочь

Не выдумывай цифры. Используй реальные данные пользователя, если они есть.
`;

    const memoryMessages = previousMessages.map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })) as { role: "user" | "assistant"; content: string }[];

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...memoryMessages,
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      response.choices[0]?.message?.content?.trim() ||
      "Пока не удалось подготовить ответ.";

    await prisma.aiMessage.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: reply,
      },
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI_CHAT_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка AI-чата" },
      { status: 500 }
    );
  }
}