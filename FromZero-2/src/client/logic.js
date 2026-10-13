// FromZero · чистая логика без React и сети. Одинаково работает в демо и на сервере (фолбэк для ИИ).
import { ALL_PROJECTS, ALL_SKILLS, CHECKPOINTS, VERB_EN, VERB_RU } from "./data.js";

const cap = (s = "") => s.trim().charAt(0).toUpperCase() + s.trim().slice(1);
const strip = (s = "") => s.trim().replace(/[.!\s]+$/, "");
const hasNum = (s) => /\d/.test(s);
const lower1 = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const T = (lang) => (ru, en) => (lang === "en" ? en : ru);

/** «Что сделал / результат / цифра» → 1-2 варианта пункта резюме. */
export function toBullets({ did = "", result = "", number = "" }, lang = "ru") {
  if (!did.trim()) return [];
  let a = strip(did);
  const first = a.split(" ")[0].toLowerCase();
  const verbs = lang === "en" ? VERB_EN : VERB_RU;
  if (verbs[first]) a = verbs[first] + a.slice(first.length);
  a = cap(a);
  const r = strip(result), n = strip(number);
  if (lang === "en") {
    const v1 = [a, r && `resulting in ${r.replace(/^(that|resulting in)\s+/i, "")}`].filter(Boolean).join(", ") + (n ? ` (${n})` : "");
    const v2 = n ? `${cap(n)}: ${lower1(a)}${r ? `; outcome: ${r}` : ""}` : `${a}${r ? `. Result: ${r}` : ""}`;
    return Array.from(new Set([v1, v2]));
  }
  const v1 = [a, r && `что ${r.replace(/^что\s+/i, "")}`].filter(Boolean).join(", ") + (n ? ` (${n})` : "");
  const v2 = n ? `${cap(n)}: ${lower1(a)}${r ? `; итог: ${r}` : ""}` : `${a}${r ? `. Результат: ${r}` : ""}`;
  return Array.from(new Set([v1, v2]));
}

/** Оценка резюме 0-100 и подсказки, отсортированные по весу. */
export function scoreResume(d, lang = "ru") {
  const t = T(lang), tips = [];
  let s = 0;
  const bullets = [...d.experience, ...d.projects].flatMap((x) => x.bullets || []);
  d.name && d.email ? (s += 10) : tips.push({ t: t("Добавь имя и почту: без них рекрутер не ответит", "Add your name and email: without them nobody can reply"), w: 10 });
  d.title ? (s += 8) : tips.push({ t: t("Напиши желаемую должность в шапке", "Put the role you want in the header"), w: 8 });
  (d.summary || "").length > 80 ? (s += 12) : tips.push({ t: t("О себе: 2-3 предложения, кто ты и чем полезен", "Summary: 2-3 sentences on who you are and why you help"), w: 12 });
  d.education.some((e) => e.school) ? (s += 10) : tips.push({ t: t("Укажи вуз и годы учёбы", "Add your school and years"), w: 10 });
  bullets.length >= 3 ? (s += 15) : tips.push({ t: t(`Нужно минимум 3 пункта опыта или проектов (сейчас ${bullets.length})`, `You need at least 3 experience or project bullets (now ${bullets.length})`), w: 15 });
  const withNum = bullets.filter(hasNum).length;
  if (withNum >= 2) s += 20;
  else {
    s += withNum * 10;
    tips.push({ t: withNum ? t("Ещё один пункт с цифрой, и резюме заметно сильнее", "One more bullet with a number and it gets much stronger") : t("Добавь цифры в пункты: «+30% охвата», «12 заявок»", "Add numbers: “+30% reach”, “12 leads”"), w: 20 - withNum * 10 });
  }
  d.skills.length >= 5 ? (s += 15) : tips.push({ t: t(`Навыков ${d.skills.length}, добавь хотя бы 5 релевантных`, `${d.skills.length} skills, add at least 5 relevant ones`), w: 15 });
  d.links ? (s += 10) : tips.push({ t: t("Ссылка на портфолио или GitHub поднимет доверие", "A portfolio or GitHub link builds trust"), w: 10 });
  return { score: Math.min(100, s), tips: tips.sort((a, b) => b.w - a.w) };
}

/** Живая подсказка под полем ввода. */
export function liveHint(field, value = "", lang = "ru") {
  const t = T(lang), v = value.trim();
  if (!v) return null;
  if (field === "did" && /^(я\s)?(помогал|участвовал|занимался)|^(i\s)?(helped|participated|was involved)/i.test(v)) return t("Слабый глагол. Лучше: «организовал», «запустил», «посчитал»", "Weak verb. Try “organised”, “launched”, “measured”");
  if (field === "result" && v.length < 12) return t("Что изменилось благодаря тебе? Чуть подробнее", "What changed because of you? A bit more detail");
  if (field === "number" && !hasNum(v)) return t("Здесь нужна цифра: сколько, на сколько, за какой срок", "A number goes here: how many, how much, how fast");
  if (field === "summary" && v.length > 400) return t("Слишком длинно. Рекрутер читает 6 секунд", "Too long. A recruiter reads for 6 seconds");
  return null;
}

export const norm = (s) => s.toLowerCase().replace(/[^a-zа-яё0-9+#]/gi, "");

/** Совпадение резюме с вакансией по ключевым навыкам + какие мини-проекты закроют пробелы. */
export function matchVacancy(d, v) {
  const mine = new Set((d?.skills || []).map(norm));
  const need = v.key_skills || [];
  const have = need.filter((k) => mine.has(norm(k)));
  const missing = need.filter((k) => !mine.has(norm(k)));
  return {
    pct: need.length ? Math.round((have.length / need.length) * 100) : 0,
    have, missing,
    fixes: missing.map((skill) => ({ skill, project: ALL_PROJECTS.find((p) => p.skills.some((s) => norm(s) === norm(skill))) })),
  };
}

/** Для живых вакансий hh: навыки из текста, если работодатель не заполнил key_skills. */
export function inferSkills(text = "") {
  const t = " " + text.toLowerCase() + " ";
  return ALL_SKILLS.filter((s) => t.includes(s.toLowerCase())).slice(0, 8);
}

const vacName = (v, lang) => (typeof v.name === "string" ? v.name : v.name?.[lang] || v.name?.ru);

export function coverLetter(d, v, lang = "ru") {
  const { have } = matchVacancy(d, v);
  const proof = [...d.projects, ...d.experience].flatMap((x) => x.bullets || [])[0];
  const name = d.name?.split(" ")[0] || (lang === "en" ? "[name]" : "[имя]");
  const role = vacName(v, lang);
  if (lang === "en")
    return ["Hello!", `My name is ${name}, I'm ${d.title ? `a ${d.title.toLowerCase()}` : "a student"} and I'd love to join ${v.employer.name} as “${role}”.`, have.length ? `I already have what matters to you: ${have.slice(0, 3).join(", ")}.` : "I learn fast and I'm already building skills for this role.", proof ? `For example: ${lower1(proof)}.` : "", "I'd be glad to talk about how I can help. Thank you!"].filter(Boolean).join("\n\n");
  return ["Здравствуйте!", `Меня зовут ${name}, я ${d.title ? d.title.toLowerCase() : "студент"} и хочу присоединиться к команде ${v.employer.name} на позицию «${role}».`, have.length ? `У меня есть опыт в том, что важно для вас: ${have.slice(0, 3).join(", ")}.` : "Я быстро учусь и уже начал прокачивать навыки под эту роль.", proof ? `Например: ${lower1(proof)}.` : "", "Буду рад(а) обсудить, чем могу быть полезен(на). Спасибо за внимание!"].filter(Boolean).join("\n\n");
}

export const pickResume = (resumes, v) => [...resumes].sort((a, b) => matchVacancy(b.data, v).pct - matchVacancy(a.data, v).pct)[0];

export function interviewQuestions(v, lang = "ru") {
  const t = T(lang);
  const ks = v.key_skills?.length ? v.key_skills : [t("коммуникация", "communication")];
  return [
    { kind: "intro", q: t("Расскажите о себе за одну минуту.", "Tell me about yourself in one minute."), tip: t("Формула «настоящее → прошлое → будущее»: кто ты сейчас, что уже сделал(а), почему хочешь эту роль. 60-90 секунд.", "Present → past → future: who you are now, what you've done, why this role. 60-90 seconds.") },
    { kind: "motivation", q: t(`Почему именно эта компания: ${v.employer.name}?`, `Why this company: ${v.employer.name}?`), tip: t("Назови 1 факт о компании + 1 причину, связанную с твоим опытом. Без «у вас хорошая зарплата».", "One fact about the company + one reason tied to your experience. Never “the salary”.") },
    { kind: "star", q: t(`Расскажите о проекте, где вы использовали ${ks[0]}. Какой был результат?`, `Tell me about a project where you used ${ks[0]}. What was the result?`), tip: t("STAR: ситуация, задача, что сделал(а) лично ты, результат с цифрой.", "STAR: situation, task, what YOU did, result with a number.") },
    { kind: "failure", q: t("Опишите ситуацию, когда что-то пошло не так. Что вы сделали?", "Describe a time something went wrong. What did you do?"), tip: t("Выбери реальную, но не катастрофическую ошибку. 70% ответа: что ты сделал(а) и чему научился(ась).", "Pick a real but not catastrophic mistake. 70% of the answer: what you did and learned.") },
    { kind: "growth", q: t(`Как вы будете прокачивать ${ks[ks.length - 1]} в первые 3 месяца?`, `How will you grow your ${ks[ks.length - 1]} in the first 3 months?`), tip: t("План по месяцам: 1-й учусь и наблюдаю, 2-й делаю сам(а), 3-й показываю результат. Назови ресурс.", "Month by month: 1 learn and observe, 2 do it yourself, 3 show a result. Name a resource.") },
  ];
}

export function evaluateAnswer(q, answer = "", lang = "ru") {
  const t = T(lang), a = answer.trim();
  const words = a.split(/\s+/).filter(Boolean).length;
  const good = [], fix = [];
  let score = 2;
  if (words >= 40) (score += 3), good.push(t("Хороший объём ответа", "Good answer length"));
  else if (words >= 15) (score += 1), fix.push(t("Раскрой подробнее: 40-120 слов идеально", "Go deeper: 40-120 words is ideal"));
  else fix.push(t("Слишком коротко, рекрутер не поймёт, что ты сделал", "Too short: the recruiter can't see what you did"));
  if (/\d/.test(a)) (score += 2), good.push(t("Есть цифры, это убеждает", "Numbers make it convincing"));
  else fix.push(t("Добавь цифру: сроки, количество, процент", "Add a number: time, count, percent"));
  if (/(результат|в итоге|получил|вырос|удалось|result|ended up|grew|achieved|so that)/i.test(a)) (score += 2), good.push(t("Назван результат", "You named a result"));
  else fix.push(t("Закончи результатом: «в итоге…»", "End with a result: “in the end…”"));
  if (/(я сделал|я предложил|я написал|я организовал|я запустил|сделала|предложила|организовала|запустила|i built|i led|i made|i proposed|i wrote|i organi[sz]ed|i launched)/i.test(a)) (score += 1), good.push(t("Видна твоя личная роль", "Your personal role is clear"));
  else fix.push(t("Говори «я сделал», а не «мы делали»", "Say “I did”, not “we did”"));
  return { score: Math.min(10, score), good, fix, model: t("Структура STAR: ситуация → задача → что сделал я → результат с цифрой.", "STAR: situation → task → what I did → result with a number.") };
}

/** Прогресс по сетлисту (5 треков). */
export function routeProgress(state, resumeData, lang = "ru") {
  const score = scoreResume(resumeData, lang).score;
  const projects = ALL_PROJECTS.filter((p) => state.portfolio.progress[p.id]?.done).length;
  const apps = state.applications.length;
  const invite = state.applications.some((a) => a.status === "invite");
  const trained = state.achievements.includes("interview");
  const done = { resume: score >= 70, proj: projects > 0, apps: apps >= 10, train: trained, invite };
  const detail = { resume: `${score}/100`, proj: `${projects}`, apps: `${Math.min(apps, 10)}/10`, train: trained ? "✓" : "—", invite: invite ? "✓" : "—" };
  const part = { resume: score / 70, proj: projects ? 1 : 0, apps: Math.min(apps, 10) / 10, train: trained ? 1 : 0, invite: invite ? 1 : 0 };
  const steps = CHECKPOINTS.map((c) => ({ ...c, done: done[c.id], detail: detail[c.id], part: Math.min(1, part[c.id]) }));
  const doneN = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);
  const pct = Math.round((steps.reduce((a, s) => a + (s.done ? 1 : s.part * 0.9), 0) / steps.length) * 100);
  return { steps, score, next, doneN, pct };
}
