// FromZero · «Саундчек»: онбординг после регистрации. Слева сцена в огне и сетлист шагов, справа один вопрос.
// В конце выдаётся пропуск за кулисы, и человек сразу попадает в нужный раздел.
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Hammer, ShieldCheck } from "lucide-react";
import { useStore, setState, cx, celebrate } from "../store.js";
import { useI18n } from "../i18n.js";
import { COURSES, DIRECTIONS, EXTRA_SKILLS, INTERESTS, PROJECTS, skillLabel } from "../data.js";
import { projectPhoto } from "../photos.js";
import { Chips, Embers, Flames, Fuse, LangSwitch } from "../ui.jsx";
import { Logo } from "../Logo.jsx";
import { BackstagePass } from "./kit.jsx";

const ease = [0.22, 1, 0.36, 1];

export default function Onboarding({ isMobile, onDone }) {
  const s = useStore();
  const { t, L, lang } = useI18n();
  const [i, setI] = useState(0);
  const [p, setP] = useState(s.profile);
  const [name, setName] = useState(s.resumes[0]?.data.name || "");
  const [consent, setConsent] = useState(s.consent);
  const [done, setDone] = useState(false);
  const set = (k) => (v) => setP((x) => ({ ...x, [k]: v }));
  const dirSkills = DIRECTIONS.find((d) => d.id === p.direction)?.skills || [];
  const skillOpts = Array.from(new Set([...dirSkills, ...EXTRA_SKILLS])).slice(0, 16);

  const steps = [
    {
      k: t("Имя на афише", "Name on the poster"), title: t("Как тебя зовут?", "What's your name?"), sub: t("Так тебя увидит рекрутер в шапке резюме.", "That's how a recruiter sees you in the resume header."), ok: name.trim().length > 1 && consent,
      body: (
        <div className="stack">
          <div className="field"><label htmlFor="ob-name">{t("Имя и фамилия", "Full name")}</label>
            <input id="ob-name" className="ob-name" placeholder={t("Айдана Серикова", "Aidana Serikova")} value={name} onChange={(e) => setName(e.target.value)} autoFocus autoComplete="name" /></div>
          <label className="check consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span><b>{t("Согласен(на) на обработку данных.", "I agree to data processing.")}</b> <span className="muted">{t("Храним только то, что нужно для резюме. Удалить аккаунт можно в любой момент.", "We keep only what the resume needs. Delete your account any time.")}</span></span></label>
        </div>
      ),
    },
    {
      k: t("Направление", "Field"), title: t("Какой твой звук?", "What's your sound?"), sub: t("Направление можно поменять потом.", "You can switch later."), ok: !!p.direction,
      body: (
        <div className="ob-albums">
          {DIRECTIONS.map((d, k) => (
            <motion.button key={d.id} type="button" className={cx("ob-album", p.direction === d.id && "on")} aria-pressed={p.direction === d.id} onClick={() => set("direction")(d.id)}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.05, ease }}>
              <img src={projectPhoto(PROJECTS[d.id][0].id)} alt="" />
              <span className="ob-album-shade" />
              <span className="ob-album-t"><b>{L(d.name)}</b><small>{d.skills.slice(0, 2).map((x) => skillLabel(x, lang)).join(" · ")}</small></span>
            </motion.button>
          ))}
        </div>
      ),
    },
    { k: t("Курс", "Year"), title: t("Где ты сейчас?", "Where are you now?"), sub: t("Подстроим тон и вакансии.", "We'll tune tone and jobs."), ok: !!p.course, body: <Chips multi={false} size="lg" options={COURSES} value={p.course} onChange={set("course")} label={(o) => L(o.name)} /> },
    {
      k: t("Навыки", "Skills"), title: t("Что уже умеешь?", "What can you do?"), sub: t("Отметь хоть что-нибудь, даже «чуть-чуть».", "Tick anything, even “a little”."), ok: p.skills.length > 0,
      body: (
        <div className="stack">
          <p className="label">{t("Навыки", "Skills")}</p>
          <Chips options={skillOpts} value={p.skills} onChange={set("skills")} label={(o) => skillLabel(o, lang)} />
          <p className="label" style={{ marginTop: 8 }}>{t("Интересы", "Interests")}</p>
          <Chips options={INTERESTS} value={p.interests} onChange={set("interests")} label={(o) => L(o.name)} />
        </div>
      ),
    },
    {
      k: t("Опыт", "Experience"), title: t("Есть опыт или проекты?", "Any experience?"), sub: t("Подработка, волонтёрство, учебный проект: всё считается.", "Part-time jobs, volunteering, a class project: it all counts."), ok: p.hasExperience !== null,
      body: (
        <div className="ob-exp">
          {[{ v: true, ti: t("Да, кое-что есть", "Yes, a bit"), d: t("Сразу в конструктор резюме", "Straight to the resume builder"), I: FileText }, { v: false, ti: t("Пока ничего", "Nothing yet"), d: t("Соберём опыт через мини-проекты", "We'll build it with mini-projects"), I: Hammer }].map((o) => (
            <button key={String(o.v)} type="button" className={cx("ob-exp-opt paper-card", p.hasExperience === o.v && "on")} aria-pressed={p.hasExperience === o.v} onClick={() => set("hasExperience")(o.v)}>
              <o.I size={30} /><b>{o.ti}</b><span>{o.d}</span>
            </button>
          ))}
        </div>
      ),
    },
  ];
  const st = steps[i];
  const last = i === steps.length - 1;

  const finish = () => {
    const nm = name.trim();
    setState((x) => ({
      ...x, consent: true, profile: p, portfolio: { ...x.portfolio, direction: p.direction },
      resumes: x.resumes.map((r, k) => (k === 0 ? { ...r, data: { ...r.data, name: r.data.name || nm, skills: Array.from(new Set([...r.data.skills, ...p.skills])) } } : r)),
      user: x.user ? { ...x.user, name: nm, since: x.user.since || new Date().toISOString() } : x.user,
    }));
    setDone(true);
    setTimeout(() => celebrate(t("В составе", "On the bill"), nm.split(" ")[0]), 900);
  };
  const enter = (where) => { setState({ onboarded: true }); onDone(where); };
  const next = () => (last ? finish() : setI(i + 1));
  const dir = DIRECTIONS.find((d) => d.id === p.direction);

  if (done)
    return (
      <div className="onb-done">
        <Embers density={70} />
        <Flames height={160} seed={9} className="onb-done-flames" />
        <BackstagePass name={name.trim()} role={dir ? L(dir.name) : undefined} since={new Date().getFullYear()} />
        <motion.div className="onb-done-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7, ease }}>
          <div className="script">{t("пропуск выдан", "pass issued")}</div>
          <h1 className="display">{t("Добро пожаловать", "Welcome")}<br /><span className="red">{t("за кулисы", "backstage")}</span></h1>
          <p className="lead muted">{p.hasExperience ? t("Начнём с резюме: простые вопросы, формулировки сделает ИИ.", "Let's start with the resume: plain questions, the AI writes the wording.") : t("Начнём с мини-проекта: через 3 дня у тебя будет первая строчка опыта.", "Let's start with a mini-project: in 3 days you'll have your first line of experience.")}</p>
          <div className="row wrap">
            <button className="btn lg" onClick={() => enter(p.hasExperience ? "builder" : "portfolio")}>{p.hasExperience ? t("Собрать резюме", "Build my resume") : t("Выбрать проект", "Pick a project")} <ArrowRight size={22} /></button>
            <button className="btn ghost lg" onClick={() => enter("dashboard")}>{t("В бэкстейдж", "Backstage")}</button>
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="onb">
      {!isMobile && (
        <aside className="onb-side">
          <Embers density={46} />
          <Flames height={130} seed={7} className="onb-flames" />
          <div className="row between onb-top"><Logo size={22} /><LangSwitch /></div>
          <div className="onb-copy">
            <div className="script">{t("саундчек", "soundcheck")} · {i + 1}/{steps.length}</div>
            <div className="display onb-big">{t("Опыт", "Experience")}<br />{t("не нужен.", "not needed.")}<br /><span className="red">{t("Нужен старт.", "A start is.")}</span></div>
          </div>
          <ol className="onb-list">
            {steps.map((x, k) => (
              <li key={k} className={cx(k === i && "cur")}><span className="mono">{String(k + 1).padStart(2, "0")}</span><b className={cx("strike", k < i && "on")}>{x.k}</b></li>
            ))}
          </ol>
        </aside>
      )}
      <main className="onb-main">
        {isMobile && <div className="row between"><Logo size={20} /><LangSwitch /></div>}
        <div className="onb-progress"><span className="mono muted">{t("шаг", "step")} {i + 1}/{steps.length}</span><Fuse value={((i + (st.ok ? 1 : 0.4)) / steps.length) * 100} /></div>
        <div className="onb-stage">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.32, ease }}>
              <h1 className="display md">{st.title}</h1>
              <p className="sub muted">{st.sub}</p>
              <div className="onb-field">{st.body}</div>
              {i === 0 && <p className="note"><ShieldCheck size={18} />{t("Без Telegram и сторонних ботов: всё внутри сайта.", "No Telegram or third-party bots: everything stays on the site.")}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="row onb-nav">
          {i > 0 && <button className="btn ghost square" onClick={() => setI(i - 1)} aria-label={t("Назад", "Back")}><ArrowLeft size={20} /></button>}
          <button className="btn lg grow" disabled={!st.ok} onClick={next}>{last ? t("Получить пропуск", "Get my pass") : i === 0 ? t("Начать", "Start") : t("Дальше", "Next")} <ArrowRight size={22} /></button>
        </div>
      </main>
    </div>
  );
}
