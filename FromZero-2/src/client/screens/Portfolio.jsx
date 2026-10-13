// FromZero · мини-проекты: 6 направлений × 3 проекта (3/7/14 дней). План по дням зачёркивается, сдал → строчка в резюме.
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Flag, Link2, Paperclip, Sparkles, Target, Wrench } from "lucide-react";
import { celebrate, cx, setState, touchStreak, uid, unlock, updateResume, useStore } from "../store.js";
import { useI18n } from "../i18n.js";
import { ALL_PROJECTS, DIRECTIONS, PROJECTS, skillLabel } from "../data.js";
import { projectPhoto } from "../photos.js";
import { Chips, Fuse, ScreenHead } from "../ui.jsx";
import { Stamp } from "./kit.jsx";

const ease = [0.22, 1, 0.36, 1];
export const prog = (s, p) => s.portfolio.progress[p.id] || { days: {}, link: "", file: "", done: false, added: false };
const pctOf = (s, p) => Math.round((Object.values(prog(s, p).days).filter(Boolean).length / p.plan.length) * 100);
const grade = (d) => (d <= 3 ? "I" : d <= 7 ? "II" : "III");

function ProjectView({ p, onBack }) {
  const s = useStore();
  const { t, L, lang, pl } = useI18n();
  const g = prog(s, p);
  const n = Object.values(g.days).filter(Boolean).length;
  const all = n === p.plan.length;
  const patch = (x) => setState((st) => ({ ...st, portfolio: { ...st.portfolio, progress: { ...st.portfolio.progress, [p.id]: { ...prog(st, p), ...x } } } }));
  const tick = (i) => {
    const on = !g.days[i];
    patch({ days: { ...g.days, [i]: on } });
    if (on) { touchStreak(); if (unlock("first-step")) celebrate(t("Первый шаг", "First step"), `${t("день", "day")} ${i + 1}`); }
  };
  const submit = () => { patch({ done: true }); unlock("project-done"); touchStreak(); celebrate(t("Зачтено", "Cleared"), L(p.title)); };
  const toResume = () => {
    updateResume(s.activeResumeId, (r) => ({ ...r, data: { ...r.data, projects: [...r.data.projects, { id: uid(), title: L(p.title), bullets: [L(p.resumeLine) + (g.link ? ` (${g.link})` : "")], raw: {} }], skills: Array.from(new Set([...r.data.skills, ...p.skills])) } }));
    patch({ added: true });
    celebrate(t("В резюме", "In resume"), "+1");
  };
  return (
    <div className="screen">
      <button className="link" onClick={onBack}><ArrowLeft size={18} /> {t("Все проекты", "All projects")}</button>
      <motion.div className="pv-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.img src={projectPhoto(p.id)} alt="" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }} />
        <div className="pv-shade" />
        <div className="pv-in">
          <span className="kicker fire-t">{t("уровень", "level")} {grade(p.days)} · {p.days} {pl(p.days, ["день", "дня", "дней"], ["day", "days"])}</span>
          <h1 className="display md">{L(p.title)}</h1>
          <div className="pv-facts">
            {[[Target, t("Цель", "Goal"), L(p.goal)], [Wrench, t("Чем делать", "Tools"), p.tools], [Flag, t("Готово, когда", "Done when"), L(p.criteria)]].map(([I, k, v]) => (
              <div key={k}><div className="label"><I size={15} /> {k}</div><p>{v}</p></div>
            ))}
          </div>
        </div>
        {g.done && <Stamp>{t("Зачтено", "Cleared")}</Stamp>}
      </motion.div>
      <div className="pv-grid">
        <section className="setlist paper-card pv-plan">
          <span className="tape" />
          <div className="sl-head"><b>{t("План", "Plan")}</b><span className="script">{n}/{p.plan.length} {t("готово", "done")}</span></div>
          <ol>
            {p.plan.map((x, i) => (
              <li key={i}>
                <button type="button" className="sl-btn" aria-pressed={!!g.days[i]} onClick={() => tick(i)}>
                  <motion.span className={cx("box", g.days[i] && "on")} animate={{ scale: g.days[i] ? [1, 1.3, 1] : 1 }}>{g.days[i] && <Check size={16} />}</motion.span>
                  <span className="sl-t"><small className="mono">{t("день", "day")} {i + 1}</small><b className={cx("strike", g.days[i] && "on")}>{L(x)}</b></span>
                </button>
              </li>
            ))}
          </ol>
        </section>
        <section className="card pad stack">
          <h2 className="h2">{t("Результат", "Result")}</h2>
          <p className="muted"><span className="script sm-script">{t("пример:", "example:")}</span> {L(p.example)}</p>
          <div className="input-pre"><span><Link2 size={18} /></span><input placeholder={t("Ссылка на результат", "Link to your result")} aria-label={t("Ссылка на результат", "Link to your result")} value={g.link} onChange={(e) => patch({ link: e.target.value })} /></div>
          <label className="file-btn"><Paperclip size={18} /> {g.file || t("Или прикрепи файл", "Or attach a file")}<input type="file" onChange={(e) => patch({ file: e.target.files?.[0]?.name || "" })} /></label>
          {g.done ? (
            <motion.div className="resume-line" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="label"><Sparkles size={16} className="fire-t" /> {t("Строчка для резюме", "Resume line")}</p>
              <p className="rl-text">{L(p.resumeLine)}</p>
              <button className="btn" disabled={g.added} onClick={toResume}>{g.added ? t("Уже в резюме ✓", "Already in resume ✓") : t("Добавить в резюме", "Add to resume")}</button>
            </motion.div>
          ) : (
            <>
              <button className="btn" disabled={!all || !(g.link || g.file)} onClick={submit}>{t("Сдать проект", "Submit project")}</button>
              {(!all || !(g.link || g.file)) && <p className="muted small">{t("Отметь все дни и приложи ссылку или файл, чтобы сдать.", "Tick every day and attach a link or file to submit.")}</p>}
            </>
          )}
          <div className="tags">{p.skills.map((x) => <span key={x} className="tag">{skillLabel(x, lang)}</span>)}</div>
        </section>
      </div>
    </div>
  );
}

export default function Portfolio({ isMobile, openProject }) {
  const s = useStore();
  const { t, L, lang, pl } = useI18n();
  const [open, setOpen] = useState(openProject || null);
  const dir = s.portfolio.direction || s.profile.direction || "marketing";
  const list = PROJECTS[dir] || [];
  const cur = ALL_PROJECTS.find((p) => p.id === open);
  if (cur) return <ProjectView p={cur} onBack={() => setOpen(null)} />;
  const cleared = list.filter((p) => prog(s, p).done).length;
  return (
    <div className="screen">
      <ScreenHead script={t("трек 2 · нет опыта? сделаем", "track 2 · no experience? make some")} title={t("Мини-проекты", "Mini-projects")}
        sub={t("Каждый проект превращается в строчку резюме.", "Every project becomes a resume line.")}
        right={<span className="pill"><Clock size={16} className="fire-t" /> {cleared}/{list.length} {t("зачтено", "cleared")}</span>} />
      <div className={isMobile ? "hscroll" : ""}><Chips multi={false} options={DIRECTIONS} value={dir} onChange={(v) => setState((x) => ({ ...x, portfolio: { ...x.portfolio, direction: v } }))} label={(o) => L(o.name)} /></div>
      <div className="proj-grid">
        {list.map((p, i) => {
          const pc = pctOf(s, p), done = prog(s, p).done;
          return (
            <motion.button key={p.id} className="proj" onClick={() => setOpen(p.id)} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ease }} whileHover={{ y: -6 }}>
              <span className="proj-photo">
                <img src={projectPhoto(p.id)} alt="" loading="lazy" />
                <span className="proj-shade" />
                <span className="proj-lvl"><b>{grade(p.days)}</b><small>{p.days} {pl(p.days, ["день", "дня", "дней"], ["day", "days"])}</small></span>
                {done && <Stamp sm>{t("Зачтено", "Cleared")}</Stamp>}
              </span>
              <span className="proj-body">
                <span className="h3">{L(p.title)}</span>
                <span className="muted small">{L(p.goal)}</span>
                <span className="tags">{p.skills.slice(0, 3).map((x) => <span key={x} className="tag">{skillLabel(x, lang)}</span>)}</span>
                <span className="proj-prog"><Fuse value={pc} /><span className="mono small">{pc}%</span></span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
