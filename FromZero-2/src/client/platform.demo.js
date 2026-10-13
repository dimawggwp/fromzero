// FromZero · демо-платформа (index.html без сервера). Вакансии: живые с hh.ru, при недоступности hh: примеры.
import { getState } from "./store.js";
import { DEMO_VACANCIES } from "./demoVacancies.js";
import { coverLetter, evaluateAnswer, interviewQuestions, matchVacancy, toBullets } from "./logic.js";
import { searchHh, vacancyHh } from "./hh.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function filterDemo(f) {
  const q = (f.q || "").toLowerCase();
  return DEMO_VACANCIES.filter((v) =>
    (!q || (v.name.ru + v.name.en + v.employer.name + v.key_skills.join(" ")).toLowerCase().includes(q)) &&
    (!f.area || v.area.id === f.area || (f.area === "40" && ["160", "159", "205"].includes(v.area.id)) || (f.area === "113" && v.area.id === "1")) &&
    (!f.remote || v.schedule.id === "remote") && (!f.intern || v.employment.id === "probation") &&
    (!f.noExp || v.experience.id === "noExperience") && (!f.schedule || v.schedule.id === f.schedule) &&
    (!f.dir || v.dir === f.dir) && (!f.salary || (v.salary && (v.salary.to || v.salary.from) >= +f.salary)));
}

const demo = {
  mode: "demo",
  auth: {
    async google() { await wait(700); return { user: { id: "demo-google", provider: "google", label: "Google" } }; },
    async sendEmail(e) { await wait(600); return { ok: /.+@.+\..+/.test(e) }; },
    async sendPhone(p) { await wait(600); return { ok: p.replace(/\D/g, "").length >= 10 }; },
    async verify(kind, label, code) { await wait(500); return code.length === 6 ? { user: { id: "demo-" + kind, provider: kind, label } } : { error: "code" }; },
    async signOut() { await wait(200); return { ok: true }; },
    async current() { return null; },
  },
  /** → { items, source: "hh" | "demo", found } */
  async searchVacancies(f) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 9000);
      const r = await searchHh(f, { signal: ctrl.signal });
      clearTimeout(timer);
      return { ...r, source: "hh" };
    } catch {
      await wait(300);
      const items = filterDemo(f);
      return { items, found: items.length, source: "demo" };
    }
  },
  async vacancyDetails(id) {
    if (String(id).startsWith("test-")) return DEMO_VACANCIES.find((v) => v.id === id) || null;
    try { return await vacancyHh(id); } catch { return null; }
  },
  vacancyById: (id) => DEMO_VACANCIES.find((v) => v.id === id),
  ai: {
    async bullets(raw, lang) { return toBullets(raw, lang); },
    async letter(d, v, lang) { return coverLetter(d, v, lang); },
    async questions(v, lang) { return interviewQuestions(v, lang); },
    async evaluate(q, a, lang) { await wait(650); return evaluateAnswer(q, a, lang); },
    match: matchVacancy,
  },
  async apply() { return { mode: "manual" }; },
  hh: { async connect() { return { demo: true }; } },
  async deleteAccount() { await wait(300); return { ok: true }; },
  exportData() { return getState(); },
  startSync() { return () => {}; },
};

export default demo;
