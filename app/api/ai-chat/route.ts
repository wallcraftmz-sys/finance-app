import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

function shouldUseWebSearch(message: string) {
  const m = message.toLowerCase();

  return (
    m.includes("2026") ||
    m.includes("сейчас") ||
    m.includes("новости") ||
    m.includes("курс") ||
    m.includes("инфляция") ||
    m.includes("рынок") ||
    m.includes("экономика") ||
    m.includes("крипто") ||
    m.includes("биткоин") ||
    m.includes("акции") ||
    m.includes("доллар") ||
    m.includes("евро")
  );
}

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

    const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const balance = totalIncome - totalExpense;

    // 🔥 AI БЮДЖЕТ
    let dailyBudget = 0;
    if (balance > 0) {
      const safeBudget = balance * 0.2;
      dailyBudget = Math.floor(safeBudget / 30);
    }

    // 🔥 ТРЕНД (фикс)
    const last7Expenses = expenses.slice(0, 7).reduce((sum, e) => sum + (e.amount || 0), 0);
    const prev7Expenses = expenses.slice(7, 14).reduce((sum, e) => sum + (e.amount || 0), 0);

    let trendHint = "";
    if (last7Expenses > prev7Expenses && prev7Expenses > 0) {
      trendHint = "Расходы растут";
    } else if (last7Expenses < prev7Expenses) {
      trendHint = "Расходы снижаются";
    }

    const expenseByCategory: Record<string, number> = {};
    for (const item of expenses) {
      expenseByCategory[item.category] =
        (expenseByCategory[item.category] || 0) + (item.amount || 0);
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

    const memoryMessages: ChatHistoryItem[] = previousMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const historyText =
      memoryMessages.length > 0
        ? memoryMessages
            .map((m) =>
              `${m.role === "assistant" ? "Ассистент" : "Пользователь"}: ${m.content}`
            )
            .join("\n")
        : "Истории сообщений пока нет.";

    const financeContext = `
Данные пользователя:
- Доходы: ${totalIncome}€
- Расходы: ${totalExpense}€
- Баланс: ${balance}€
- Самая большая категория: ${biggestCategory}
- Все категории: ${categorySummary}
- Цели: ${goalSummary}
- Тренд: ${trendHint || "Нет данных"}
- Дневной бюджет: ${dailyBudget > 0 ? `${dailyBudget}€` : "Нет расчета"}
`.trim();

    const useWeb = shouldUseWebSearch(message);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: `
Сегодня ${currentDate}.

Ты AI Moniq.

- анализируй финансы
- учитывай бюджет и тренд
- не выдумывай данные
- используй интернет только если нужно
      `,
      input: `
${historyText}

${financeContext}

Вопрос:
${message}
      `,
      tools: useWeb ? [{ type: "web_search" }] : [],
      include: ["web_search_call.action.sources"],
      temperature: 0.7,
      max_output_tokens: 900,
    });

    const reply =
      typeof response.output_text === "string" && response.output_text.trim()
        ? response.output_text.trim()
        : "Ошибка ответа";

    await prisma.aiMessage.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: reply,
      },
    });

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("AI_CHAT_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка AI-чата" },
      { status: 500 }
    );
  }
}