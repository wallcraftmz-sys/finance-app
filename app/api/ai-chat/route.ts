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

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
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
        ? goals.map((g) => `${g.title}: цель ${g.targetAmount}€`).join(", ")
        : "Целей пока нет";

    await prisma.aiMessage.create({
      data: {
        userId: user.id,
        role: "user",
        content: message,
      },
    });

    const currentDate = new Date().toISOString().split("T")[0];

    const memoryText =
      previousMessages.length > 0
        ? previousMessages
            .map((m) => `${m.role === "assistant" ? "Ассистент" : "Пользователь"}: ${m.content}`)
            .join("\n")
        : "Истории сообщений пока нет.";

    const financeContext = `
Данные пользователя из Moniq:
- Доходы всего: ${totalIncome}€
- Расходы всего: ${totalExpense}€
- Баланс: ${balance}€
- Самая большая категория расходов: ${biggestCategory}
- Категории расходов: ${categorySummary}
- Финансовые цели: ${goalSummary}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: `
Сегодня ${currentDate}.

Ты умный и живой AI-помощник внутри приложения Moniq.

Твоя задача:
- разговаривать естественно и по-человечески
- отвечать понятно, спокойно и полезно
- помогать по финансам, накоплениям, расходам, целям и планированию
- если вопрос касается текущих событий, 2026 года, новостей, законов, курсов, компаний, экономики или рынка — обязательно используй веб-поиск
- не говори, что твои знания ограничены 2024 годом
- если вопрос не требует интернета, отвечай по контексту приложения и истории переписки
- не выдумывай факты и цифры
- если используешь веб-поиск, опирайся на найденные данные

Когда вопрос про финансы:
1. коротко скажи, что происходит
2. покажи слабое место
3. предложи конкретный шаг

Твой стиль:
- дружелюбный
- не сухой
- без роботских фраз
- можно кратко, но полезно
`,
      input: `
История переписки:
${memoryText}

${financeContext}

Новый вопрос пользователя:
${message}
`,
      tools: [{ type: "web_search" }],
      include: ["web_search_call.action.sources"],
      temperature: 0.7,
      max_output_tokens: 900,
    });

    const reply =
      response.output_text?.trim() || "Пока не удалось подготовить ответ.";

    await prisma.aiMessage.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: reply,
      },
    });

    return NextResponse.json({
      reply,
      sources: response.output ?? null,
    });
  } catch (error) {
    console.error("AI_CHAT_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка AI-чата" },
      { status: 500 }
    );
  }
}