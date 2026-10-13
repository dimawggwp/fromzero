// FromZero · тренажёр собеседования: ИИ-рекрутер задаёт 5 вопросов под вакансию, каждый ответ разбирается по STAR.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lightbulb, Loader2, Play, RotateCcw, Send } from "lucide-react";
import platform from "../platform.js";
import { celebrate, cx, touchStreak, unlock, useStore } from "../store.js";
import { useI18n } from "../i18n.js";
import { DIRECTIONS, skillLabel } from "../data.js";
import { DEMO_VACANCIES } from "../demoVacancies.js";
import { ScreenHead } from "../ui.jsx";
import { Gauge } from "./kit.jsx";

function useRoles() {
  const s = useStore();
  const { t } = useI18n();
  return useMemo(() => {
    const all = Object.values(s.vacCache || {});
    const pool = all.length ? all : platform.mode === "demo" ? DEMO_VACANCIES : [];
    const d = DIRECTIONS.find((x) => x.id === s.profile.direction) || DIRECTIONS[0];
    const gen = { id: "generic", name: { ru: "Общее собеседование стажёра", en: "General intern interview" }, employer: { name: t("Компания мечты", "Your dream company") }, key_skills: d.skills };
    return [...pool.filter((v) => s.saved.includes(v.id)), ...pool.filter((v) => !s.saved.includes(v.id)).slice(0, 30), gen];
  }, [s.vacCache, s.saved, s.profile.direction, t]);
}

export default function Interview({ isMobile, vacId }) {
  const { t, L, lang } = useI18n();
  const roles = useRoles();
  const [id, setId] = useState(vacId || roles[0]?.id);
  const v = roles.find((x) => x.id === id) || roles[0];
  const [qs, setQs] = useState([]);
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState([]);
  const [ans, setAns] = useState("");
  const [busy, setBusy] = useState(false);
  const [tip, setTip] = useState(true);
  const end = useRef(null);
  useEffect(() => { let on = true; setLog([]); setStarted(false); platform.ai.questions(v, lang).then((q) => on && setQs(q)); return () => { on = false; }; }, [id, lang]);
  useEffect(() => { started && end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [log, busy, started]);
  const k = log.length, done = qs.length > 0 && k >= qs.length, cur = qs[k];
  const words = ans.trim().split(/\s+/).filter(Boolean).length;
  const total = log.length ? Math.round((log.reduce((a, x) => a + x.ev.score, 0) / log.length) * 10) : 0;
  const stage = started ? (done || busy ? 3 : ans.trim() ? 2 : 1) : 0;
  const send = async () => {
    if (!ans.trim() || !cur) return;
    const a = ans; setAns(""); setBusy(true);
    const ev = await platform.ai.evaluate(cur.q, a, lang).catch(() => null);
    setBusy(false);
    setLog((l) => {
      const nx = [...l, { q: cur.q, a, ev: ev || { score: 0, good: [], fix: [], model: "" } }];
      if (nx.length === qs.length) { unlock("interview"); touchStreak(); celebrate(t("Готов(а)", "Ready"), t("репетиция пройдена", "rehearsal complete")); }
      return nx;
    });
  };
  const STAR = t("Ситуация: \nЗадача: \nЧто сделал(а) я: \nРезультат (с цифрой): ", "Situation: \nTask: \nWhat I did: \nResult (with a number): ");
  const how = [
    [t("Выбери вакансию", "Pick a role"), t("Вопросы строятся под её навыки.", "Questions follow its key skills.")],
    [t("Прочитай вопрос и подсказку", "Read the question and the cue"), t("Подумай 20 секунд, набросай 2-3 мысли.", "Think 20 seconds, jot 2-3 points.")],
    [t("Ответь по STAR", "Answer with STAR"), t("40-120 слов, «я сделал(а)», в конце цифра.", "40-120 words, say “I did”, end with a number.")],
    [t("Разбери и повтори", "Review and repeat"), t("Оценка из 10 и что поправить.", "A score out of 10 and what to fix.")],
  ];
  const star = [["S", t("Ситуация", "Situation"), t("Где и когда", "Where and when")], ["T", t("Задача", "Task"), t("Что нужно было сделать", "What needed doing")], ["A", t("Действие", "Action"), t("Что сделал(а) именно ты", "What YOU did")], ["R", t("Результат", "Result"), t("Чем закончилось, с цифрой", "The outcome, with a number")]];
  const turns = [...log, ...(done || !cur ? [] : [{ q: cur.q, tip: cur.tip }])];

  return (
    <div className="screen">
      <ScreenHead script={t("трек 4 · репетиция", "track 4 · rehearsal")} title={t("Тренажёр", "Rehearsal")}
        sub={t(`ИИ-рекрутер задаст ${qs.length || 5} вопросов и разберёт каждый ответ.`, `An AI recruiter asks ${qs.length || 5} questions and reviews each answer.`)}
        right={<select className="select" aria-label={t("Вакансия", "Role")} value={v?.id} onChange={(e) => setId(e.target.value)}>{roles.map((r) => <option key={r.id} value={r.id}>{L(r.name)}</option>)}</select>} />
      <div className="iv-grid">
        <div>
          {!started ? (
            <motion.div className="iv-start paper-card" initial={{ opacity: 0, y: 20, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: -0.6 }}>
              <span className="tape" />
              <div className="mono iv-emp">{v?.employer?.name}</div>
              <div className="display sm">{L(v?.name)}</div>
              <p>{t("5 вопросов, около 10 минут. Пиши так, как сказал(а) бы вслух.", "5 questions, about 10 minutes. Write the way you'd say it.")}</p>
              <div className="tags">{(v?.key_skills || []).slice(0, 5).map((x) => <span key={x} className="tag ink">{skillLabel(x, lang)}</span>)}</div>
              <button className="btn lg" disabled={!qs.length} onClick={() => setStarted(true)}><Play size={20} /> {t("Начать репетицию", "Start rehearsal")}</button>
            </motion.div>
          ) : (
            <div className="chat">
              <div className="mini-dots">{qs.map((_, i) => <span key={i} className={i < k ? "on" : i === k ? "cur" : ""} />)}</div>
              {turns.map((x, i) => (
                <div key={i} className="turn">
                  <motion.div className="bubble static rec" initial={{ scale: 0.6, opacity: 0, rotate: -4 }} animate={{ scale: 1, opacity: 1, rotate: -1 }} transition={{ type: "spring", stiffness: 340, damping: 18 }}>
                    <span className="who">{t("рекрутер", "recruiter")} · {i + 1}/{qs.length}</span>{x.q}
                  </motion.div>
                  {!x.a && x.tip && (
                    <div className="tipbox"><button className="link" onClick={() => setTip(!tip)} aria-expanded={tip}><Lightbulb size={16} /> {t("Как отвечать", "How to answer")}</button>
                      <AnimatePresence>{tip && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="muted">{x.tip}</motion.p>}</AnimatePresence></div>
                  )}
                  {x.a && <motion.div className="bubble static fire right me" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: 1 }}><span className="who">{t("ты", "you")}</span>{x.a}</motion.div>}
                  {x.ev && (
                    <motion.div className="card pad review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="row between"><span className="label">{t("Разбор", "Review")}</span><span className="big-n sm">{x.ev.score}<small className="muted">/10</small></span></div>
                      {x.ev.good.map((g) => <p key={g} className="ok-t"><Check size={15} /> {g}</p>)}
                      {x.ev.fix.map((g) => <p key={g} className="fix-t">→ {g}</p>)}
                      {x.ev.model && <p className="muted small">{x.ev.model}</p>}
                    </motion.div>
                  )}
                </div>
              ))}
              {busy && <div className="typing">{[0, 1, 2].map((i) => <motion.span key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />)}</div>}
              {done && (
                <motion.div className="card pad iv-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Gauge value={total} size={100} label={t("Итог", "Result")} />
                  <div className="grow"><div className="h3">{total >= 70 ? t("Ты готов(а) к собеседованию", "You're ready for the interview") : t("Хорошая разминка", "Good warm-up")}</div><p className="muted">{t("Повтори завтра: с каждым разом увереннее.", "Repeat tomorrow: it gets steadier every time.")}</p></div>
                  <button className="btn ghost" onClick={() => setLog([])}><RotateCcw size={18} /> {t("Ещё раз", "Again")}</button>
                </motion.div>
              )}
              <div ref={end} />
              {!done && (
                <div className={cx("card pad answer", isMobile && "sticky-ans")}>
                  <label htmlFor="ans" className="label">{t("Твой ответ", "Your answer")}</label>
                  <textarea id="ans" className="input" rows={isMobile ? 3 : 4} placeholder={t("Отвечай как на настоящем собеседовании…", "Answer like it's the real thing…")} value={ans} onChange={(e) => setAns(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.metaKey || e.ctrlKey) && send()} />
                  <div className="row between wrap">
                    <div className="row"><button className="btn ghost sm" onClick={() => setAns((a) => (a ? a + "\n" : "") + STAR)}>{t("Шаблон STAR", "STAR template")}</button><span className={cx("mono small", words >= 40 && words <= 120 ? "fire-t" : "muted")}>{words} {t("слов · цель 40-120", "words · aim 40-120")}</span></div>
                    <button className="btn" onClick={send} disabled={!ans.trim() || busy}>{busy ? <Loader2 size={18} className="spin" /> : <Send size={18} />} {t("Ответить", "Answer")} {!isMobile && <span className="kbd">⌘↵</span>}</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <aside className="stack">
          <div className="card pad">
            <div className="h3">{t("Как проходит", "How it works")}</div>
            <ol className="how">{how.map(([a, b], i) => <li key={a} className={i < stage ? "done" : ""}><span className="n">{i < stage ? <Check size={15} /> : i + 1}</span><div><b>{a}</b><p className="muted small">{b}</p></div></li>)}</ol>
          </div>
          <div className="card pad star">
            <div className="star-h">STAR</div>
            {star.map(([l, a, b]) => <div key={l} className="star-row"><span className="star-l">{l}</span><div><b>{a}</b><p className="muted small">{b}</p></div></div>)}
          </div>
        </aside>
      </div>
    </div>
  );
}
