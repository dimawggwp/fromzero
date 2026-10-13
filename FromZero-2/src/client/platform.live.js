// FromZero · боевая платформа: Supabase Auth в браузере (только публичный anon-ключ), всё остальное через /api.
// Секреты (service_role, Groq, hh client_secret, ключ шифрования) живут только на сервере: src/lib/env.ts.
import { createBrowserClient } from "@supabase/ssr";
import { getState, onChange, setState } from "./store.js";
import { coverLetter, evaluateAnswer, interviewQuestions, matchVacancy, toBullets } from "./logic.js";
import { searchHh } from "./hh.js";

let sb = null;
const supa = () => (sb ||= createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

async function api(path, body, method = body ? "POST" : "GET") {
  const res = await fetch(`/api/${path}`, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.error || res.statusText), { status: res.status });
  return json;
}
const toUser = (u) => u && { id: u.id, provider: u.app_metadata?.provider || "email", label: u.email || u.phone || "FromZero" };

const live = {
  mode: "live",
  auth: {
    async google() {
      const { error } = await supa().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
      return error ? { error: error.message } : { redirect: true };
    },
    async sendEmail(email) { const { error } = await supa().auth.signInWithOtp({ email }); return { ok: !error }; },
    async sendPhone(phone) { const { error } = await supa().auth.signInWithOtp({ phone }); return { ok: !error }; },
    async verify(kind, target, token) {
      const { data, error } = await supa().auth.verifyOtp(kind === "email" ? { email: target, token, type: "email" } : { phone: target, token, type: "sms" });
      return error ? { error: "code" } : { user: toUser(data.user) };
    },
    async signOut() { await supa().auth.signOut(); return { ok: true }; },
    async current() { const { data } = await supa().auth.getUser(); return toUser(data.user); },
  },
  async searchVacancies(f) {
    try {
      return { ...(await api(`hh/vacancies?${new URLSearchParams(Object.entries(f).filter(([, v]) => v !== "" && v !== false).map(([k, v]) => [k, String(v)]))}`)), source: "hh" };
    } catch {
      // Сервер hh недоступен: пробуем открытый API напрямую из браузера
      return { ...(await searchHh(f)), source: "hh" };
    }
  },
  async vacancyDetails(id) { try { return (await api(`hh/vacancies/${encodeURIComponent(id)}`)).vacancy; } catch { return null; } },
  vacancyById: () => null,
  ai: {
    async bullets(raw, lang) { try { return (await api("ai/bullets", { raw, lang })).bullets; } catch { return toBullets(raw, lang); } },
    async letter(d, v, lang) { try { return (await api("ai/letter", { resume: d, vacancy: v, lang })).letter; } catch { return coverLetter(d, v, lang); } },
    async questions(v, lang) { try { return (await api("ai/questions", { vacancy: v, lang })).questions; } catch { return interviewQuestions(v, lang); } },
    async evaluate(q, a, lang) { try { return (await api("ai/evaluate", { question: q, answer: a, lang })).result; } catch { return evaluateAnswer(q, a, lang); } },
    match: matchVacancy,
  },
  // С 15.12.2025 hh закрыл отклики для сторонних приложений: копируем письмо и открываем вакансию на hh
  async apply(p) { try { return await api("hh/apply", { vacancyId: p.vacancy.id, letter: p.letter }); } catch { return { mode: "manual" }; } },
  hh: { async connect() { location.href = "/api/hh/oauth/start"; return { redirect: true }; } },
  async deleteAccount() { await api("account", undefined, "DELETE"); await supa().auth.signOut(); return { ok: true }; },
  exportData() { return getState(); },
  startSync() {
    let t;
    api("account/state").then((r) => r?.state && r.state.updatedAt > getState().updatedAt && setState(r.state, { silent: true })).catch(() => {});
    return onChange((s) => { clearTimeout(t); t = setTimeout(() => api("account/state", { state: s }, "PUT").catch(() => {}), 1500); });
  },
};

export default live;
