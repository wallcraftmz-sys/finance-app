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
Ты персональный финансовый помощник в приложении FinTrack.

Правила ответа:
- Отвечай простым и понятным русским языком.
- Не используй сложные термины без объяснения.
- Пиши дружелюбно, спокойно и по делу.
- Не пиши слишком сухо и не пиши слишком длинно.
- Учитывай реальные данные пользователя.
- Не выдумывай цифры.
- Если можешь, отвечай по структуре:
  1. Что происходит сейчас
  2. Где слабое место
  3. Что делать дальше
- Если вопрос про накопления, считай реальный пример.
- Если вопрос про траты, покажи самую тяжёлую категорию.
- Если данных мало, честно скажи об этом.
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
        {
          role: "system",
          content: `
Вот реальные данные пользователя:

Доходы всего: ${totalIncome}€
Расходы всего: ${totalExpense}€
Баланс: ${balance}€

Самая большая категория расходов: ${biggestCategory}

Расходы по категориям:
${categorySummary}

Цели:
${goalSummary}
`,
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