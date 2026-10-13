// FromZero · «Бэкстейдж»: главная кабинета. Сетлист тура (5 треков зачёркиваются), пропуск, статы, значки.
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Flame, Send } from "lucide-react";
import { useStore, useActiveResume } from "../store.js";
import { useI18n } from "../i18n.js";
import { ACHIEVEMENTS, DIRECTIONS } from "../data.js";
import { routeProgress, scoreResume } from "../logic.js";
import { Embers, Fuse } from "../ui.jsx";
import { BackstagePass, Gauge, Pin, SetlistPaper } from "./kit.jsx";

const ease = [0.22, 1, 0.36, 1];
const NOTE = {
  resume: { ru: "Оценка 70 из 100 и выше", en: "Score 70 out of 100 or more" },
  proj: { ru: "Сдай один мини-проект", en: "Finish one mini-project" },
  apps: { ru: "Десять точных откликов", en: "Ten precise applications" },
  train: { ru: "Пройди тренажёр до конца", en: "Finish the trainer" },
  invite: { ru: "Отметь приглашение в трекере", en: "Mark an invite in the tracker" },
};

export default function Dashboard({ isMobile, go }) {
  const s = useStore();
  const res = useActiveResume();
  const { t, lang, L, pl } = useI18n();
  const { steps, score, next, doneN, pct } = routeProgress(s, res.data, lang);
  const tips = scoreResume(res.data, lang).tips;
  const first = (res.data.name || s.user?.name || "").split(" ")[0];
  const dir = DIRECTIONS.find((d) => d.id === s.profile.direction);
  const since = s.user?.since ? new Date(s.user.since).getFullYear() : new Date().getFullYear();
  const items = steps.map((x) => ({ id: x.id, go: x.go, name: x.name[lang], done: x.done, detail: x.done ? "✓" : x.detail, note: L(NOTE[x.id]), current: next?.id === x.id }));

  return (
    <div className="screen dash">
      <section className="dash-hero">
        <Embers density={26} className="dash-embers" />
        <div className="dash-hero-copy">
          <motion.div className="script" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 0.9, ease }}>
            {first ? t(`привет, ${first}`, `hey, ${first}`) : t("привет", "hey")}
          </motion.div>
          <h1 className="display dash-h">
            <span className="line-mask"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.7, ease }}>{t("Тур пройден", "Tour done")}</motion.span></span>
            <span className="line-mask"><motion.span className="red" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease }}>{t("на", "")} {pct}%</motion.span></span>
          </h1>
          <div className="dash-fuse"><Fuse value={pct} /><span className="mono muted">{doneN}/5 {t("треков", "tracks")}</span></div>
        </div>
        {next ? (
          <motion.button className="next-card" onClick={() => go(next.go)} initial={{ opacity: 0, y: 20, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 1 }} transition={{ delay: 0.3, ease }} whileHover={{ rotate: 0, y: -4 }}>
            <span className="kicker">{t("следующий трек", "next track")}</span>
            <b>{next.name[lang]}</b>
            <span className="next-note">{L(NOTE[next.id])}</span>
            <span className="next-go">{t("Играть", "Play")} <ArrowRight size={20} /></span>
          </motion.button>
        ) : (
          <div className="next-card done"><span className="kicker">{t("тур завершён", "tour complete")}</span><b>{t("На бис: оффер", "Encore: the offer")}</b></div>
        )}
      </section>

      <div className="dash-grid">
        <SetlistPaper title={t("Сетлист", "Setlist")} sub={t("тур «С нуля»", "the “From zero” tour")} items={items} encore={t("на бис: оффер", "encore: the offer")} onGo={(x) => go(x.go)} />
        {!isMobile && (
          <div className="dash-pass">
            <BackstagePass name={res.data.name || s.user?.name} role={dir ? L(dir.name) : undefined} since={since} />
            <p className="muted small center">{t("Твой пропуск. Кликни трек в сетлисте, чтобы продолжить.", "Your pass. Click a track in the setlist to continue.")}</p>
          </div>
        )}
      </div>

      <div className="dash-stats">
        <motion.button className="card pad stat" onClick={() => go("builder")} whileHover={{ y: -3 }}>
          <Gauge value={score} size={88} label={t("Оценка резюме", "Resume score")} />
          <div className="grow">
            <div className="stat-h">{t("Резюме", "Resume")}</div>
            <p className="muted small">{tips[0] ? tips[0].t : t("Готово к откликам", "Ready to apply")}</p>
          </div>
        </motion.button>
        <div className="card pad stat col">
          <div className="row"><Flame size={22} className="fire-t" /><span className="big-n">{s.streak.count}</span><span className="muted">{pl(s.streak.count, ["день", "дня", "дней"], ["day", "days"])} {t("подряд", "in a row")}</span></div>
          <div className="tally" aria-hidden="true">{Array.from({ length: 7 }).map((_, k) => <motion.span key={k} className={k < Math.min(7, s.streak.count) ? "on" : ""} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.3 + k * 0.06 }} />)}</div>
          <p className="muted small">{t("Один шаг в день держит темп.", "One step a day keeps the pace.")}</p>
        </div>
        <motion.button className="card pad stat col" onClick={() => go(s.applications.length ? "applications" : "jobs")} whileHover={{ y: -3 }}>
          <div className="row"><Bookmark size={22} /><span className="big-n">{s.saved.length}</span><span className="muted">{t("сохранено", "saved")}</span></div>
          <div className="row"><Send size={18} className="muted" /><span className="muted">{s.applications.length} {pl(s.applications.length, ["отклик", "отклика", "откликов"], ["application", "applications"])} {t("отправлено", "sent")}</span></div>
        </motion.button>
      </div>

      <section>
        <div className="row between sec-row">
          <h2 className="h2">{t("Значки", "Pins")}</h2>
          <span className="mono muted">{s.achievements.length}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="pins">{ACHIEVEMENTS.map((a, k) => <Pin key={a.id} i={k} glyph={a.glyph} title={L(a.title)} hint={L(a.hint)} on={s.achievements.includes(a.id)} />)}</div>
      </section>
    </div>
  );
}
