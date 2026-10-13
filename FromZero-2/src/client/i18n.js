// FromZero · двуязычность RU / EN. Название продукта на обоих языках: FromZero.
import { useStore } from "./store.js";

export const BRAND = "FromZero";
export const L = (v, lang) => (v == null ? "" : typeof v === "string" ? v : v[lang] ?? v.ru ?? "");

const pluralRu = (n, [one, few, many]) => {
  const a = n % 10, b = n % 100;
  return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? few : many;
};
export const plural = (lang, n, ru, en) => (lang === "en" ? (n === 1 ? en[0] : en[1]) : pluralRu(n, ru));

export function money(s, lang = "ru") {
  if (!s || (!s.from && !s.to)) return lang === "en" ? "salary not specified" : "з/п не указана";
  const cur = { KZT: "₸", RUR: "₽", RUB: "₽", USD: "$", EUR: "€" }[s.currency] || s.currency || "";
  const f = (n) => Number(n).toLocaleString(lang === "en" ? "en-US" : "ru-RU");
  if (s.from && s.to) return `${f(s.from)} – ${f(s.to)} ${cur}`;
  if (s.from) return `${lang === "en" ? "from" : "от"} ${f(s.from)} ${cur}`;
  return `${lang === "en" ? "up to" : "до"} ${f(s.to)} ${cur}`;
}

export function useI18n() {
  const lang = useStore().lang || "ru";
  return {
    lang,
    t: (ru, en) => (lang === "en" ? en : ru),
    L: (v) => L(v, lang),
    pl: (n, ru, en) => plural(lang, n, ru, en),
    fmt: (n) => Number(n).toLocaleString(lang === "en" ? "en-US" : "ru-RU"),
  };
}
