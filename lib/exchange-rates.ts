export const SUPPORTED_CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "PLN",
  "SEK",
  "CHF",
] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export type ExchangeRates = {
  date: string;
  rates: Record<Currency, number>;
};

const ECB_URL =
  "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

export async function getExchangeRates(): Promise<ExchangeRates> {
  const response = await fetch(ECB_URL, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`ECB request failed: ${response.status}`);
  }

  const xml = await response.text();

  const date = xml.match(/time=['"](\d{4}-\d{2}-\d{2})['"]/)?.[1];

  if (!date) {
    throw new Error("ECB rate date not found");
  }

  const rates = {} as Record<Currency, number>;

  for (const currency of SUPPORTED_CURRENCIES) {
    if (currency === "EUR") {
      rates.EUR = 1;
      continue;
    }

    const regex = new RegExp(
      `currency=['"]${currency}['"]\\s+rate=['"]([^'"]+)['"]`
    );

    const match = xml.match(regex);
    const rate = Number(match?.[1]);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Invalid ECB rate for ${currency}`);
    }

    rates[currency] = rate;
  }

  return { date, rates };
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRates["rates"]
): number {
  return (amount / rates[from]) * rates[to];
}
