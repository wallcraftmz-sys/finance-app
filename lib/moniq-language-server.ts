import { cookies } from "next/headers";
import { moniqI18n, parseMoniqLanguage } from "./moniq-messages";

export async function getMoniqI18n() {
  return moniqI18n(parseMoniqLanguage((await cookies()).get("moniq_language")?.value));
}
