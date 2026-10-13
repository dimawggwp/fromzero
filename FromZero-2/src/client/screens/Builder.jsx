// FromZero · конструктор резюме. Простые вопросы → ИИ формулирует пункты; живая оценка 0–100; версии; 3 шаблона; PDF.
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Copy, Download, Loader2, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import platform from "../platform.js";
import { celebrate, cx, setState, touchStreak, uid, unlock, updateResume, useActiveResume, useStore } from "../store.js";
import { useI18n } from "../i18n.js";
import { ALL_SKILLS, DIRECTIONS, TEMPLATES, skillLabel } from "../data.js";
import { liveHint, scoreResume } from "../logic.js";
import { Chips, Field, Modal, ScreenHead } from "../ui.jsx";
import ResumePreview from "./ResumePreview.jsx";
import { Gauge } from "./kit.jsx";

function useBullets(raw, lang) {
  const [list, setList] = useState([]);
  const [busy, setBusy] = useState(false);
  const key = `${raw.did || ""}|${raw.result || ""}|${raw.number || ""}|${lang}`;
  useEffect(() => {
    if (!raw.did?.trim()) { setList([]); return; }
    let on = true;
    setBusy(true);
    const id = setTimeout(async () => { const r = await platform.ai.bullets(raw, lang).catch(() => []); if (on) { setList(r || []); setBusy(false); } }, platform.mode === "demo" ? 200 : 900);
    return () => { on = false; clearTimeout(id); };
  }, [key]);
  return { list, busy };
}

function ExpItem({ e, onChange, onRemove, kind, n }) {
  const { t, lang } = useI18n();
  const raw = e.raw || {};
  const setRaw = (k, v) => onChange({ ...e, raw: { ...raw, [k]: v } });
  const { list, busy } = useBullets(raw, lang);
  return (
    <motion.div layout className="card pad exp-item" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <div className="row between exp-top"><span className="kicker">{kind === "exp" ? t("опыт", "experience") : t("проект", "project")} #{n}</span>
        <button type="button" className="link danger" onClick={onRemove}><Trash2 size={16} /> {t("Удалить", "Remove")}</button></div>
      <div className="grid2">
        {kind === "exp" ? (
          <>
            <Field id={`role-${e.id}`} label={t("Кем ты был(а)?", "What was your role?")} placeholder={t("Волонтёр, бариста, староста", "Volunteer, barista, class rep")} value={e.role || ""} onChange={(x) => onChange({ ...e, role: x.target.value })} />
            <Field id={`org-${e.id}`} label={t("Где и когда?", "Where and when?")} placeholder={t("Кафе «Зерно», 2024", "Café Zerno, 2024")} value={e.org || ""} onChange={(x) => onChange({ ...e, org: x.target.value })} />
          </>
        ) : (
          <div className="full"><Field id={`t-${e.id}`} label={t("Название проекта", "Project name")} placeholder={t("Сайт для студклуба", "Website for a student club")} value={e.title || ""} onChange={(x) => onChange({ ...e, title: x.target.value })} /></div>
        )}
      </div>
      <div className="qa">
        <Field id={`did-${e.id}`} label={t("Что ты делал(а)?", "What did you do?")} placeholder={t("вёл инстаграм кофейни", "ran the café's Instagram")} value={raw.did || ""} onChange={(x) => setRaw("did", x.target.value)} warn={liveHint("did", raw.did, lang)} />
        <Field id={`res-${e.id}`} label={t("Какой был результат?", "What was the result?")} placeholder={t("стало больше подписчиков и заказов", "more followers and orders")} value={raw.result || ""} onChange={(x) => setRaw("result", x.target.value)} warn={liveHint("result", raw.result, lang)} />
        <Field id={`num-${e.id}`} label={t("Есть цифра?", "Any number?")} placeholder={t("+40% подписчиков за 2 месяца", "+40% followers in 2 months")} value={raw.number || ""} onChange={(x) => setRaw("number", x.target.value)} warn={liveHint("number", raw.number, lang)} />
      </div>
      <AnimatePresence>
        {(list.length > 0 || busy) && (
          <motion.div className="sugg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <p className="label">{busy ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} className="fire-t" />} {t("ИИ предлагает · нажми, чтобы взять в резюме", "AI suggests · tap to add to the resume")}</p>
            {list.map((b, k) => {
              const on = (e.bullets || []).includes(b);
              return (
                <motion.button type="button" key={b} className={cx("sugg-b", on && "on")} onClick={() => onChange({ ...e, bullets: on ? e.bullets.filter((x) => x !== b) : [...(e.bullets || []), b] })}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.08 }}>
                  <span className="tick">{on && <Check size={14} />}</span><span>{b}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      {(e.bullets || []).filter((b) => !list.includes(b)).length > 0 && (
        <div className="kept">{e.bullets.filter((b) => !list.includes(b)).map((b) => (
          <button type="button" key={b} className="sugg-b on" onClick={() => onChange({ ...e, bullets: e.bullets.filter((x) => x !== b) })}><span className="tick"><Check size={14} /></span><span>{b}</span></button>))}</div>
      )}
    </motion.div>
  );
}

function useSections(res) {
  const { t, lang } = useI18n();
  const d = res.data;
  const upd = (p) => updateResume(res.id, (r) => ({ ...r, data: { ...r.data, ...p } }));
  const bind = (k) => ({ value: d[k] || "", onChange: (e) => upd({ [k]: e.target.value }) });
  const list = (k) => ({
    add: () => upd({ [k]: [...d[k], { id: uid(), raw: {}, bullets: [] }] }),
    set: (i, v) => upd({ [k]: d[k].map((x, j) => (j === i ? v : x)) }),
    rm: (i) => upd({ [k]: d[k].filter((_, j) => j !== i) }),
  });
  const ex = list("experience"), pr = list("projects");
  const pool = Array.from(new Set([...d.skills, ...DIRECTIONS.flatMap((x) => x.skills), ...ALL_SKILLS]));
  return [
    { id: "contacts", title: t("Кто ты?", "Who are you?"), body: (
      <div className="grid2">
        <Field id="name" label={t("Имя и фамилия", "Full name")} placeholder={t("Айдана Серикова", "Aidana Serikova")} autoComplete="name" {...bind("name")} />
        <Field id="title" label={t("Кем хочешь работать?", "Target role")} placeholder={t("Стажёр-маркетолог", "Marketing intern")} {...bind("title")} />
        <Field id="city" label={t("Город", "City")} placeholder={t("Алматы", "Almaty")} {...bind("city")} />
        <Field id="email" type="email" label={t("Почта", "Email")} placeholder="aidana@mail.kz" autoComplete="email" {...bind("email")} />
        <Field id="phone" label={t("Телефон", "Phone")} placeholder="+7 7XX XXX XX XX" autoComplete="tel" {...bind("phone")} />
        <Field id="links" label={t("Портфолио / GitHub", "Portfolio / GitHub")} placeholder="behance.net/aidana" {...bind("links")} />
      </div>) },
    { id: "summary", title: t("Пару слов о себе", "A few words about you"), body: (
      <Field id="summary" rows={4} label={t("Кто ты и чем полезен? 2-3 предложения", "Who are you and how do you help? 2-3 sentences")} placeholder={t("Студентка 3 курса КазНУ, журналистика. Веду соцсети студклуба…", "3rd-year journalism student at KazNU. I run the student club's socials…")} {...bind("summary")} warn={liveHint("summary", d.summary, lang)} hint={`${(d.summary || "").length} / 400`} />) },
    { id: "edu", title: t("Где учишься?", "Education"), body: (
      <div className="grid3f">{["school", "degree", "years"].map((k, i) => (
        <Field key={k} id={`edu-${k}`} label={[t("Вуз или колледж", "School"), t("Специальность", "Major"), t("Годы", "Years")][i]} placeholder={[t("КазНУ им. аль-Фараби", "Al-Farabi KazNU"), t("Маркетинг", "Marketing"), "2023-2027"][i]}
          value={d.education[0]?.[k] || ""} onChange={(e) => upd({ education: [{ ...d.education[0], [k]: e.target.value }] })} />))}</div>) },
    { id: "exp", title: t("Что ты уже делал(а)?", "What have you done?"), body: (
      <div className="stack">
        <p className="muted">{t("Подработка, волонтёрство, староста, олимпиады. Отвечай просто, формулировки сделает ИИ.", "Part-time jobs, volunteering, olympiads. Answer plainly; the AI writes the wording.")}</p>
        {d.experience.map((e, i) => <ExpItem key={e.id || i} n={i + 1} kind="exp" e={e} onChange={(v) => ex.set(i, v)} onRemove={() => ex.rm(i)} />)}
        <button type="button" className="btn ghost dashed" onClick={ex.add}><Plus size={18} /> {t("Добавить опыт", "Add experience")}</button>
      </div>) },
    { id: "proj", title: t("Проекты", "Projects"), body: (
      <div className="stack">
        <p className="muted">{t("Сданные мини-проекты попадают сюда в один клик.", "Finished mini-projects land here in one click.")}</p>
        {d.projects.map((e, i) => <ExpItem key={e.id || i} n={i + 1} kind="proj" e={e} onChange={(v) => pr.set(i, v)} onRemove={() => pr.rm(i)} />)}
        <button type="button" className="btn ghost dashed" onClick={pr.add}><Plus size={18} /> {t("Добавить проект", "Add project")}</button>
      </div>) },
    { id: "skills", title: t("Навыки", "Skills"), body: (
      <div className="stack"><p className="muted small">{t(`Выбрано: ${d.skills.length}. Нужно хотя бы 5.`, `Selected: ${d.skills.length}. Aim for at least 5.`)}</p>
        <Chips options={pool.slice(0, 40)} value={d.skills} onChange={(v) => upd({ skills: v })} label={(o) => skillLabel(o, lang)} /></div>) },
  ];
}

function Versions({ s, res }) {
  const { t } = useI18n();
  const [ren, setRen] = useState(false);
  return (
    <div className="versions">
      <select className="select" aria-label={t("Версия резюме", "Resume version")} value={res.id} onChange={(e) => setState((x) => ({ ...x, activeResumeId: e.target.value }))}>
        {s.resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
      </select>
      <button className="icon-btn" title={t("Копия под вакансию", "Copy for a role")} aria-label={t("Создать копию версии", "Duplicate version")} onClick={() => {
        const c = { ...structuredClone(res), id: uid(), title: `${res.title} (${t("копия", "copy")})` };
        setState((x) => ({ ...x, resumes: [...x.resumes, c], activeResumeId: c.id }));
      }}><Copy size={18} /></button>
      <button className="icon-btn" aria-label={t("Переименовать", "Rename")} onClick={() => setRen(true)}><Pencil size={18} /></button>
      {s.resumes.length > 1 && <button className="icon-btn" aria-label={t("Удалить версию", "Delete version")} onClick={() => setState((x) => { const rs = x.resumes.filter((r) => r.id !== res.id); return { ...x, resumes: rs, activeResumeId: rs[0].id }; })}><Trash2 size={18} /></button>}
      <Modal open={ren} onClose={() => setRen(false)} title={t("Название версии", "Version name")}>
        <input className="input" defaultValue={res.title} autoFocus onKeyDown={(e) => { if (e.key === "Enter") { updateResume(res.id, (r) => ({ ...r, title: e.target.value || r.title })); setRen(false); } }} />
        <p className="muted small" style={{ marginTop: 10 }}>{t("Например: «Под SMM» или «Под аналитику». Enter, чтобы сохранить.", "E.g. “For SMM” or “For analytics”. Press Enter to save.")}</p>
      </Modal>
    </div>
  );
}

function ScoreCard({ d, compact }) {
  const { t, lang } = useI18n();
  const { score, tips } = useMemo(() => scoreResume(d, lang), [d, lang]);
  return (
    <div className="card pad score-card">
      <div className="row">
        <Gauge value={score} size={compact ? 74 : 92} label={t("Оценка", "Score")} />
        <div className="grow">
          <div className="h3">{score >= 70 ? t("Сильное резюме", "Strong resume") : score >= 40 ? t("Уже неплохо", "Getting there") : t("Только начало", "Just starting")}</div>
          <div className="muted small">{tips.length ? <><b className="fire-t">+{tips[0].w}</b> {tips[0].t}</> : t("Можно откликаться!", "Ready to apply!")}</div>
        </div>
      </div>
      {!compact && tips.length > 1 && <ul className="tips">{tips.slice(1, 4).map((x) => <li key={x.t}><span className="mono fire-t">+{x.w}</span><span>{x.t}</span></li>)}</ul>}
    </div>
  );
}

function TemplatePick({ res }) {
  const { L } = useI18n();
  return <div className="seg">{TEMPLATES.map((x) => <button key={x.id} aria-pressed={res.template === x.id} onClick={() => updateResume(res.id, (r) => ({ ...r, template: x.id }))}>{L(x.name)}</button>)}</div>;
}

const exportPdf = () => { unlock("first-resume"); setTimeout(() => window.print(), 60); };

export default function Builder({ isMobile }) {
  const s = useStore();
  const res = useActiveResume();
  const { t, lang } = useI18n();
  const secs = useSections(res);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("form");
  const ready = () => {
    const { score } = scoreResume(res.data, lang);
    touchStreak();
    if (score >= 70 && unlock("score-70")) celebrate(t("Сильно", "Strong"), t("резюме 70+", "resume 70+"));
    else if (unlock("first-resume")) celebrate(t("Зачтено", "Cleared"), t("первое резюме", "first resume"));
    else celebrate(t("Сохранено", "Saved"), `${score}/100`);
  };

  if (isMobile) {
    const sec = secs[step];
    return (
      <div className="screen">
        <div className="tabs" role="tablist">{[["form", t("Анкета", "Form")], ["preview", t("Лист", "Preview")], ["score", t("Оценка", "Score")]].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div>
        {tab === "form" && (
          <>
            <div className="row between"><span className="mono muted">{t("шаг", "step")} {step + 1}/{secs.length}</span><div className="mini-dots">{secs.map((_, k) => <span key={k} className={k <= step ? "on" : ""} />)}</div></div>
            <AnimatePresence mode="wait"><motion.div key={step} className="stack" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}><h1 className="display sm">{sec.title}</h1>{sec.body}</motion.div></AnimatePresence>
            <div className="row sticky-nav">
              <button className="btn ghost square" disabled={step === 0} onClick={() => setStep(step - 1)} aria-label={t("Назад", "Back")}><ArrowLeft size={20} /></button>
              <button className="btn grow" onClick={() => (step === secs.length - 1 ? (ready(), setTab("preview")) : setStep(step + 1))}>{step === secs.length - 1 ? t("Готово", "Done") : t("Дальше", "Next")} <ArrowRight size={20} /></button>
            </div>
          </>
        )}
        {tab === "preview" && <div className="stack"><Versions s={s} res={res} /><TemplatePick res={res} /><div className="sheet-paper"><ResumePreview r={res.data} template={res.template} id="resume-print" lang={lang} /></div><button className="btn" onClick={exportPdf}><Download size={18} /> {t("Скачать PDF", "Download PDF")}</button></div>}
        {tab === "score" && <ScoreCard d={res.data} />}
      </div>
    );
  }

  return (
    <div className="screen builder">
      <div>
        <ScreenHead script={t("трек 1 · резюме 70+", "track 1 · resume 70+")} title={t("Конструктор", "Builder")} right={<Versions s={s} res={res} />} />
        <nav className="b-jump" aria-label={t("Разделы", "Sections")}>{secs.map((x, k) => <a key={x.id} href={`#sec-${x.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${x.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><span className="mono">{String(k + 1).padStart(2, "0")}</span>{x.title}</a>)}</nav>
        <div className="stack lg">
          {secs.map((x, k) => (
            <motion.section key={x.id} id={`sec-${x.id}`} className="b-sec" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}>
              <h2 className="h2"><span className="sec-n">{String(k + 1).padStart(2, "0")}</span>{x.title}</h2>
              {x.body}
            </motion.section>
          ))}
          <button className="btn lg" onClick={ready}><Check size={22} /> {t("Резюме готово", "Resume is ready")}</button>
        </div>
      </div>
      <aside className="builder-aside">
        <div className="row between"><TemplatePick res={res} /><button className="btn ghost sm" onClick={exportPdf}><Download size={18} /> PDF</button></div>
        <ScoreCard d={res.data} compact />
        <div className="aside-paper"><span className="tape" /><ResumePreview r={res.data} template={res.template} id="resume-print" lang={lang} /></div>
      </aside>
    </div>
  );
}
