// FromZero · открытый поиск вакансий hh.ru (github.com/hhru/api, docs/vacancies.md).
// GET https://api.hh.ru/vacancies и /vacancies/{id} не требуют ключей. Никаких секретов в этом файле нет и быть не должно.
// В браузере запрос «простой» (без своих заголовков), поэтому обходится без CORS-preflight.
// На сервере (src/lib/hh.ts) тот же код вызывается с заголовком HH-User-Agent и, если есть, токеном приложения.
import { inferSkills } from "./logic.js";

export const HH_API = "https://api.hh.ru";
const KZ_AREAS = new Set(["40", "160", "159", "205"]);

// Если поиск пустой, ищем по направлению (язык запросов hh: OR, кавычки)
export const DIR_QUERY = {
  marketing: "SMM OR маркетолог OR маркетинг OR таргетолог",
  dev: "frontend OR backend OR разработчик OR программист OR python OR javascript",
  design: "дизайнер OR UI OR UX OR figma",
  analytics: "аналитик OR analyst OR SQL OR BI",
  sales: "менеджер по продажам OR продажи OR sales",
  content: "контент OR копирайтер OR редактор OR SMM",
};

export function buildSearchParams(f = {}, { perPage = 40 } = {}) {
  const p = new URLSearchParams();
  const text = (f.q || "").trim() || DIR_QUERY[f.dir] || "стажёр OR стажер OR junior OR младший OR intern";
  p.set("text", text);
  const area = f.area || "40";
  p.set("area", area);
  if (KZ_AREAS.has(area)) p.set("host", "hh.kz");
  if (f.noExp) p.set("experience", "noExperience");
  if (f.intern) p.set("employment", "probation");
  if (f.remote) p.set("schedule", "remote");
  else if (f.schedule) p.set("schedule", f.schedule);
  if (f.salary) {
    p.set("salary", String(+f.salary));
    p.set("only_with_salary", "true");
  }
  p.set("order_by", f.sort === "salary" ? "salary_desc" : "publication_time");
  p.set("per_page", String(perPage));
  return p;
}

const stripHtml = (s = "") => String(s || "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/** Ответ hh → внутренняя форма вакансии FromZero. */
export function mapVacancy(it, dir = "") {
  const req = stripHtml(it.snippet?.requirement);
  const resp = stripHtml(it.snippet?.responsibility || it.description);
  const salary = it.salary || it.salary_range || null;
  const remote = it.schedule?.id === "remote" || (it.work_format || []).some((w) => w.id === "REMOTE");
  const skills = (it.key_skills || []).map((k) => k.name).filter(Boolean);
  return {
    id: String(it.id),
    name: it.name,
    area: { id: String(it.area?.id || ""), name: it.area?.name || "" },
    salary: salary ? { from: salary.from, to: salary.to, currency: salary.currency } : null,
    schedule: { id: remote ? "remote" : it.schedule?.id || "" },
    employment: { id: it.employment?.id || "", name: it.employment?.name || "" },
    experience: { id: it.experience?.id || "" },
    employer: { name: it.employer?.name || "—", logo: it.employer?.logo_urls?.["90"] || "" },
    dir,
    key_skills: skills.length ? skills : inferSkills(`${it.name} ${req} ${resp}`),
    skillsInferred: !skills.length,
    description: resp.slice(0, 700),
    requirements: req ? req.split(/(?<=[.;])\s+/).filter(Boolean).slice(0, 4) : [],
    published: it.published_at || "",
    url: it.alternate_url || `https://hh.ru/vacancy/${it.id}`,
    live: true,
  };
}

/** Поиск. fetchImpl/headers передаёт сервер; в браузере используются значения по умолчанию. */
export async function searchHh(f, { base = HH_API, headers, fetchImpl = fetch, signal } = {}) {
  const res = await fetchImpl(`${base}/vacancies?${buildSearchParams(f)}`, { headers, signal });
  if (!res.ok) throw new Error(`hh ${res.status}`);
  const json = await res.json();
  return { items: (json.items || []).map((it) => mapVacancy(it, f.dir || "")), found: json.found || 0 };
}

export async function vacancyHh(id, { base = HH_API, headers, fetchImpl = fetch } = {}) {
  const res = await fetchImpl(`${base}/vacancies/${encodeURIComponent(id)}`, { headers });
  if (!res.ok) throw new Error(`hh ${res.status}`);
  return mapVacancy(await res.json());
}
