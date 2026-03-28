import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const income = Number(body.income || 0);
    const expense = Number(body.expense || 0);
    const categories = Array.isArray(body.categories) ? body.categories : [];

    const biggest = categories[0];
    const balance = income - expense;

    let advice = "";

    if (income === 0 && expense === 0) {
      advice =
        "У тебя пока нет данных для разбора. Добавь первый доход и первый расход, и я покажу простую картину: сколько приходит, сколько уходит и что можно улучшить.";
    } else if (income > 0 && expense === 0) {
      advice =
        `Сейчас у тебя есть доход ${income}€. Это хороший старт. Пока расходов нет, значит картина ещё не полная. Когда добавишь траты, я смогу подсказать, где ты теряешь больше всего денег.`;
    } else if (income === 0 && expense > 0) {
      advice =
        `Сейчас у тебя отмечены расходы на ${expense}€, но доходов пока нет. Чтобы видеть реальный баланс, добавь поступления денег. Тогда станет понятно, хватает ли тебе запаса или ты уже уходишь в минус.`;
    } else if (balance < 0) {
      advice =
        `Сейчас расходы выше доходов: ты получил ${income}€, а потратил ${expense}€. Это даёт минус ${Math.abs(
          balance
        )}€. На этом этапе лучше не думать о новых тратах, а сначала уменьшить самую тяжёлую категорию расходов.`;
    } else if (balance === 0) {
      advice =
        `Сейчас у тебя ровный баланс: доходы ${income}€ и расходы ${expense}€. Это значит, что всё заработанное уходит полностью. Даже небольшое сокращение трат поможет начать откладывать деньги.`;
    } else {
      advice =
        `У тебя хороший текущий результат: доход ${income}€, расходы ${expense}€, остаток ${balance}€. Это уже база, от которой можно начинать спокойно копить и планировать цель.`;
    }

    if (biggest) {
      advice += ` Больше всего денег уходит на категорию "${biggest.category}" — ${biggest.amount}€. Именно её стоит проверить первой, если хочешь быстрее почувствовать результат.`;
    }

    if (balance > 0) {
      const softSave = Math.max(5, Math.round(balance * 0.15));
      const normalSave = Math.max(10, Math.round(balance * 0.2));

      advice += ` Мягкий вариант — отложить ${softSave}€ и почти не почувствовать нагрузки. Более уверенный вариант — ${normalSave}€ в накопления.`;
    }

    if (balance > 0 && biggest) {
      advice += ` Если сократить "${biggest.category}" хотя бы немного и часть остатка сразу переносить в цель, прогресс станет заметен намного быстрее.`;
    }

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("AI_ADVICE_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка генерации совета" },
      { status: 500 }
    );
  }
}