// FromZero v5 · оболочка. Гость видит лендинг «Огненной зоны» + вход/регистрацию.
// После регистрации: «Саундчек» (онбординг) → пропуск за кулисы → кабинет (бэкстейдж, резюме, проекты, вакансии, отклики, тренажёр).
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, FileText, Hammer, LayoutDashboard, MessageSquare, Send, UserRound, Flame, Moon } from "lucide-react";
import Landing from "./landing/Landing.jsx";
import { Announcer, Fuse, LangSwitch, useIsMobile } from "./ui.jsx";
import { useI18n } from "./i18n.js";
import { celebrate, setState, useActiveResume, useStore, cx } from "./store.js";
import platform from "./platform.js";
import { routeProgress } from "./logic.js";
import { FAVICON_SVG, Logo, RecordMark } from "./Logo.jsx";
import AuthModal from "./screens/Auth.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import Builder from "./screens/Builder.jsx";
import Portfolio from "./screens/Portfolio.jsx";
import Jobs from "./screens/Jobs.jsx";
import Applications from "./screens/Applications.jsx";
import Interview from "./screens/Interview.jsx";
import Profile from "./screens/Profile.jsx";

const NAV = [
  { id: "dashboard", icon: LayoutDashboard, ru: "Бэкстейдж", en: "Backstage" },
  { id: "builder", icon: FileText, ru: "Резюме", en: "Resume" },
  { id: "portfolio", icon: Hammer, ru: "Мини-проекты", en: "Mini-projects", short: { ru: "Проекты", en: "Projects" } },
  { id: "jobs", icon: Briefcase, ru: "Вакансии", en: "Jobs" },
  { id: "applications", icon: Send, ru: "Отклики", en: "Applied" },
  { id: "interview", icon: MessageSquare, ru: "Тренажёр", en: "Rehearsal" },
  { id: "profile", icon: UserRound, ru: "Кабинет", en: "Account" },
];
const MOBILE = ["dashboard", "builder", "portfolio", "jobs", "applications"];

function Screen({ route, isMobile, go, onSignedOut }) {
  const p = { isMobile, go };
  switch (route.id) {
    case "builder": return <Builder {...p} />;
    case "portfolio": return <Portfolio {...p} openProject={route.arg} key={route.arg || "p"} />;
    case "jobs": return <Jobs {...p} />;
    case "applications": return <Applications {...p} />;
    case "interview": return <Interview {...p} vacId={route.arg} key={route.arg || "i"} />;
    case "profile": return <Profile {...p} onSignedOut={onSignedOut} />;
    default: return <Dashboard {...p} />;
  }
}

function Rail({ route, go }) {
  const s = useStore();
  const res = useActiveResume();
  const { t, lang } = useI18n();
  const { pct, doneN } = routeProgress(s, res.data, lang);
  const [spin, setSpin] = useState(0);
  return (
    <nav className="rail" aria-label={t("Основная навигация", "Main navigation")}>
      <div className="rail-top">
        <RecordMark size={46} rotate={spin} onClick={() => { setSpin((x) => x + 360); go("dashboard"); }} />
        <Logo size={20} onClick={() => go("dashboard")} />
      </div>
      <div className="rail-nav">
        {NAV.map((n, i) => {
          const I = n.icon, on = route.id === n.id;
          return (
            <button key={n.id} data-nav={n.id} aria-current={on ? "page" : undefined} onClick={() => go(n.id)}>
              {on && <motion.span layoutId="rail-on" className="rail-on" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <I size={18} /><span className="rail-l">{n[lang]}</span><span className="kbd">{i + 1}</span>
            </button>
          );
        })}
      </div>
      <div className="rail-foot">
        <div className="row between"><span className="kicker">{t("тур", "tour")} · {doneN}/5</span><span className="rail-pct">{pct}%</span></div>
        <Fuse value={pct} />
        <div className="row between">
          <button className="icon-btn" onClick={() => setState({ theme: s.theme === "light" ? "dark" : "light" })} aria-label={t("Сменить тему", "Toggle theme")} title={t("Огонь / пепел", "Fire / ash")}>{s.theme === "light" ? <Moon size={18} /> : <Flame size={18} />}</button>
          <LangSwitch />
        </div>
      </div>
    </nav>
  );
}

function BottomNav({ route, go }) {
  const { lang, t } = useI18n();
  return (
    <nav className="bottom-nav" aria-label={t("Основная навигация", "Main navigation")}>
      {MOBILE.map((id) => {
        const n = NAV.find((x) => x.id === id), I = n.icon, on = route.id === id;
        return (
          <button key={id} data-nav={id} aria-current={on ? "page" : undefined} onClick={() => go(id)}>
            {on && <motion.span layoutId="bn-on" className="bn-on" />}
            <I size={21} /><span>{n.short?.[lang] || n[lang]}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const s = useStore();
  const isMobile = useIsMobile();
  const { t } = useI18n();
  const [route, setRoute] = useState({ id: "dashboard" });
  const [auth, setAuth] = useState(null);
  const main = useRef(null);
  const go = (id, arg) => { setRoute({ id, arg }); main.current?.scrollTo?.({ top: 0 }); window.scrollTo?.({ top: 0 }); };
  const inCabinet = !!s.user && s.onboarded;

  useEffect(() => {
    document.documentElement.dataset.theme = inCabinet && s.theme === "light" ? "light" : "dark";
    document.documentElement.lang = s.lang;
  }, [s.theme, s.lang, inCabinet]);
  useEffect(() => {
    let l = document.querySelector("link[rel=icon]");
    if (!l) { l = document.createElement("link"); l.rel = "icon"; document.head.appendChild(l); }
    l.href = "data:image/svg+xml," + encodeURIComponent(FAVICON_SVG);
    let stop = () => {};
    platform.auth.current().then((u) => { if (u) setState({ user: { ...(s.user || {}), ...u } }); stop = platform.startSync(); }).catch(() => {});
    return () => stop();
  }, []);
  useEffect(() => {
    if (isMobile || !inCabinet) return;
    const f = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = +e.key;
      if (n >= 1 && n <= NAV.length) go(NAV[n - 1].id);
      if (e.key === "/") { e.preventDefault(); go("jobs"); setTimeout(() => document.getElementById("job-search")?.focus(), 80); }
      if (e.key.toLowerCase() === "t" || e.key.toLowerCase() === "е") setState({ theme: s.theme === "light" ? "dark" : "light" });
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [isMobile, inCabinet, s.theme]);

  const authed = (user, mode) => {
    const returning = mode === "signin" && s.onboarded;
    setState({ user: { ...user, since: s.user?.since || new Date().toISOString() }, landingSeen: true });
    setAuth(null);
    platform.startSync();
    setRoute({ id: "dashboard" });
    setTimeout(() => celebrate(returning ? t("С возвращением", "Welcome back") : t("Ты в деле", "You're in"), returning ? "" : t("саундчек", "soundcheck")), 250);
  };

  if (!s.user)
    return (
      <>
        <div className="grain" aria-hidden="true" />
        <Landing onStart={() => setAuth("signup")} onSignIn={() => setAuth("signin")} />
        <AuthModal open={!!auth} mode={auth || "signup"} onClose={() => setAuth(null)} onAuthed={authed} isMobile={isMobile} />
        <Announcer />
      </>
    );

  if (!s.onboarded)
    return (<><div className="grain" aria-hidden="true" /><Onboarding isMobile={isMobile} onDone={(where) => go(where || "dashboard")} /><Announcer /></>);

  const body = (
    <AnimatePresence mode="wait">
      <motion.div key={route.id + (route.arg || "")} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
        <Screen route={route} isMobile={isMobile} go={go} onSignedOut={() => setRoute({ id: "dashboard" })} />
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      <div className="grain" aria-hidden="true" />
      {isMobile ? (
        <div className="m-shell">
          <header className="m-head">
            <Logo size={18} onClick={() => go("dashboard")} />
            <div className="row">
              <button className={cx("icon-btn", route.id === "interview" && "on")} aria-label={t("Тренажёр", "Rehearsal")} onClick={() => go("interview")}><MessageSquare size={19} /></button>
              <button className={cx("icon-btn", route.id === "profile" && "on")} aria-label={t("Кабинет", "Account")} onClick={() => go("profile")}><UserRound size={19} /></button>
            </div>
          </header>
          <main className="m-main" ref={main}>{body}</main>
          <BottomNav route={route} go={go} />
        </div>
      ) : (
        <div className="shell">
          <Rail route={route} go={go} />
          <main className="main" ref={main}>{body}</main>
        </div>
      )}
      <Announcer />
    </>
  );
}
