// FromZero · трекер откликов: статусы, пачка из сохранённых, напоминание через неделю, копия письма для hh.
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Copy, Layers, MessageSquare, Send } from "lucide-react";
import platform from "../platform.js";
import { celebrate, setState, toast, useStore } from "../store.js";
import { useI18n } from "../i18n.js";
import { APP_STATUSES } from "../data.js";
import { Empty, ScreenHead } from "../ui.jsx";
import { ApplyModal, copyAndOpen } from "./Jobs.jsx";

const stale = (a) => (a.status === "sent" || a.status === "viewed") && Date.now() - new Date(a.date).getTime() > 7 * 864e5;

export default function Applications({ isMobile, go }) {
  const s = useStore();
  const { t, L, lang, pl } = useI18n();
  const [pick, setPick] = useState([]);
  const [open, setOpen] = useState(false);
  const vac = (id) => s.vacCache[id] || platform.vacancyById?.(id);
  const savedFree = s.saved.filter((id) => !s.applications.some((a) => a.vacId === id)).map(vac).filter(Boolean);
  const setStatus = (id, st) => setState((x) => ({ ...x, applications: x.applications.map((a) => (a.id === id ? { ...a, status: st } : a)) }));
  const count = Object.fromEntries(APP_STATUSES.map((x) => [x.id, s.applications.filter((a) => a.status === x.id).length]));
  const n = s.applications.length;
  return (
    <div className="screen">
      <ScreenHead script={t("трек 5 · ждём приглашение", "track 5 · waiting for an invite")} title={t("Отклики", "Applications")}
        sub={`${n} ${pl(n, ["отклик", "отклика", "откликов"], ["application", "applications"])} · ${t("цель", "goal")} 10`} />
      <div className="status-grid">
        {APP_STATUSES.map((x, i) => (
          <motion.div key={x.id} className={"card pad st-card st-" + x.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <span className="kicker">{L(x.name)}</span><b className="big-n">{count[x.id]}</b>
          </motion.div>
        ))}
      </div>
      {savedFree.length > 0 && (
        <section className="card pad stack">
          <div className="row between wrap">
            <h2 className="h2"><Layers size={22} /> {t("Пачка из сохранённых", "Batch from saved")}</h2>
            <button className="btn sm" disabled={!pick.length} onClick={() => setOpen(true)}><Send size={16} /> {t("Откликнуться", "Apply")} ({pick.length})</button>
          </div>
          <div className="stack sm">{savedFree.map((v) => (
            <label key={v.id} className="check check-row"><input type="checkbox" checked={pick.includes(v.id)} onChange={(e) => setPick(e.target.checked ? [...pick, v.id] : pick.filter((x) => x !== v.id))} />
              <span><b>{L(v.name)}</b> <span className="muted">· {v.employer?.name}</span></span></label>))}</div>
        </section>
      )}
      <div className="stack">
        {n === 0 ? <Empty mark="→" title={t("Откликов пока нет", "No applications yet")} text={t("Сохрани пару вакансий и отправь первую пачку.", "Save a few jobs and send your first batch.")} action={<button className="btn" onClick={() => go("jobs")}>{t("К вакансиям", "Go to jobs")}</button>} />
          : s.applications.map((a) => {
            const v = a.vac || vac(a.vacId);
            if (!v) return null;
            return (
              <motion.div layout key={a.id} className={"card pad app-card st-" + a.status}>
                <div className="row between wrap top">
                  <div>
                    <div className="h3">{L(v.name)}</div>
                    <div className="muted small">{v.employer?.name} · {new Date(a.date).toLocaleDateString(lang === "en" ? "en-GB" : "ru-RU")} · {a.via === "api" ? t("отправлено через hh", "sent via hh") : t("на hh вручную", "manual on hh")}</div>
                  </div>
                  <div className="seg" role="radiogroup" aria-label={t("Статус", "Status")}>
                    {APP_STATUSES.map((x) => <button key={x.id} role="radio" aria-checked={a.status === x.id} aria-pressed={a.status === x.id} onClick={() => { setStatus(a.id, x.id); if (x.id === "invite") celebrate(t("Приглашение", "Invite"), t("пора репетировать", "time to rehearse")); }}>{L(x.name)}</button>)}
                  </div>
                </div>
                {stale(a) && <p className="note"><Clock size={16} /> {t("Неделя без ответа. Напиши рекрутеру или откликнись повторно.", "A week with no answer. Message the recruiter or apply again.")}</p>}
                <div className="row wrap">
                  {a.via !== "api" && v.url && <button className="btn ghost sm" onClick={() => { copyAndOpen(a.letter, v.url); toast(t("Письмо скопировано", "Letter copied")); }}><Copy size={16} /> {t("Скопировать письмо и открыть hh", "Copy letter and open hh")}</button>}
                  {a.status === "invite" && <button className="btn sm" onClick={() => go("interview", a.vacId)}><MessageSquare size={16} /> {t("Репетировать собеседование", "Rehearse the interview")}</button>}
                </div>
              </motion.div>
            );
          })}
      </div>
      <ApplyModal open={open} onClose={() => { setOpen(false); setPick([]); }} vacs={pick.map(vac).filter(Boolean)} isMobile={isMobile} />
    </div>
  );
}
