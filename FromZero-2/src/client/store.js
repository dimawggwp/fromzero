// FromZero · единое состояние клиента (localStorage). Ключ не менять: данные пользователей сохранятся.
import { useEffect, useState } from "react";

export const STORAGE_KEY = "rsn-state-v2";
export const uid = () => Math.random().toString(36).slice(2, 10);
export const cx = (...a) => a.filter(Boolean).join(" ");

export const emptyResume = (title = "Основное резюме") => ({
  id: uid(),
  title,
  template: "accent",
  data: { name: "", title: "", city: "Алматы", email: "", phone: "", links: "", summary: "", education: [{ school: "", degree: "", years: "" }], experience: [], projects: [], skills: [] },
});

const detectLang = () => {
  try {
    const l = (navigator.language || "ru").toLowerCase();
    return l.startsWith("ru") || l.startsWith("kk") ? "ru" : "en";
  } catch {
    return "ru";
  }
};

export const initialState = () => {
  const r = emptyResume();
  return {
    v: 2, lang: detectLang(), theme: "dark", landingSeen: false, user: null, onboarded: false, consent: false,
    profile: { direction: null, course: null, skills: [], interests: [], hasExperience: null },
    resumes: [r], activeResumeId: r.id,
    portfolio: { direction: null, progress: {} },
    saved: [], skipped: [], applications: [], interviews: [], vacCache: {},
    streak: { count: 0, last: null }, achievements: [], updatedAt: 0,
  };
};

const load = () => {
  try {
    return { ...initialState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return initialState();
  }
};

let state = load();
const subs = new Set();
const changeSubs = new Set();
export const getState = () => state;

export function setState(patch, { silent = false } = {}) {
  const next = typeof patch === "function" ? patch(state) : { ...state, ...patch };
  state = { ...next, updatedAt: silent ? next.updatedAt : Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  subs.forEach((f) => f(state));
  if (!silent) changeSubs.forEach((f) => f(state));
}

/** Подписка на «настоящие» изменения (для синхронизации с сервером). */
export const onChange = (f) => (changeSubs.add(f), () => changeSubs.delete(f));

export function useStore() {
  const [s, set] = useState(state);
  useEffect(() => (subs.add(set), set(state), () => subs.delete(set)), []);
  return s;
}

export function resetAll(extra = {}) {
  localStorage.removeItem(STORAGE_KEY);
  setState({ ...initialState(), ...extra });
}

const today = () => new Date().toISOString().slice(0, 10);

export function touchStreak() {
  setState((s) => {
    const t = today();
    if (s.streak.last === t) return s;
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const count = s.streak.last === y ? s.streak.count + 1 : 1;
    const achievements = count >= 3 && !s.achievements.includes("streak-3") ? [...s.achievements, "streak-3"] : s.achievements;
    return { ...s, streak: { count, last: t }, achievements };
  });
}

/** Открыть достижение. true, если оно новое. */
export function unlock(id) {
  if (state.achievements.includes(id)) return false;
  setState((s) => ({ ...s, achievements: [...s.achievements, id] }));
  return true;
}

export const useActiveResume = () => {
  const s = useStore();
  return s.resumes.find((r) => r.id === s.activeResumeId) || s.resumes[0];
};

export const updateResume = (id, fn) => setState((s) => ({ ...s, resumes: s.resumes.map((r) => (r.id === id ? fn(r) : r)) }));

// Тосты и «штампы» (праздничные моменты)
const bus = new Set();
export const toast = (text) => bus.forEach((f) => f({ type: "toast", text, id: Math.random() }));
export const celebrate = (text, sub) => bus.forEach((f) => f({ type: "stamp", text, sub, id: Math.random() }));
export const onAnnounce = (f) => (bus.add(f), () => bus.delete(f));
