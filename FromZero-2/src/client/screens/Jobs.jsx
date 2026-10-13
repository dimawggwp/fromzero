// FromZero · вакансии: живые с hh.ru (фолбэк: примеры), % совпадения с резюме, что докачать, письмо, свайпы на телефоне.
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Bookmark, BookmarkCheck, Briefcase, Heart, Info, Loader2, MapPin, MessageSquare, RotateCcw, Search, Send, SlidersHorizontal, Sparkles, X } from "lucide-react";
import platform from "../platform.js";
import { celebrate, cx, setState, toast, touchStreak, uid, unlock, useActiveResume, useStore } from "../store.js";
import { money, useI18n } from "../i18n.js";
import { AREAS, DAILY_LIMIT, DIRECTIONS, SCHEDULES, skillLabel } from "../data.js";
import { pickResume } from "../logic.js";
import { Bar, Dialog, Empty, MatchBadge, Notice, ScreenHead, Skeleton } from "../ui.jsx";

const BASE = { q: "", area: "", remote: false, intern: false, noExp: true, schedule: "", salary: "", dir: "", sort: "match" };
const today = () => new Date().toISOString().slice(0, 10);
const todayCount = (s) => s.applications.filter((a) => a.date.slice(0, 10) === today()).length;
export const snap = (v) => ({ id: v.id, name: v.name, employer: { name: v.employer?.name }, url: v.url, key_skills: v.key_skills, area: v.area, salary: v.salary, test: v.test, description: v.description, schedule: v.schedule, employment: v.employment });
export async function copyAndOpen(letter, url) { try { await navigator.clipboard?.writeText(letter || ""); } catch {} if (url) window.open(url, "_blank", "noopener"); }
const schedName = (v, L) => (v.schedule?.name ? L(v.schedule.name) : L(SCHEDULES.find((x) => x.id === v.schedule?.id)?.name));
const seed = (id) => String(id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);

export function ApplyModal({ open, onClose, vacs, isMobile }) {
  const s = useStore();
  const { t, L, lang } = useI18n();
  const [rows, setRows] = useState([]);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!open) return;
    setOk(false);
    let on = true;
    const init = vacs.map((v) => ({ v, resumeId: pickResume(s.resumes, v).id, letter: "", loading: true }));
    setRows(init);
    init.forEach(async (r, i) => {
      const res = s.resumes.find((x) => x.id === r.resumeId);
      const letter = await platform.ai.letter(res.data, r.v, lang).catch(() => "");
      on && setRows((x) => x.map((y, j) => (j === i ? { ...y, letter, loading: false } : y)));
    });
    return () => { on = false; };
  }, [open]);
  const left = DAILY_LIMIT - todayCount(s);
  const over = rows.length > left;
  const confirm = async () => {
    setBusy(true);
    const date = new Date().toISOString();
    const out = await Promise.all(rows.map((r) => platform.apply({ vacancy: r.v, resumeId: r.resumeId, letter: r.letter }).catch(() => ({ mode: "manual" }))));
    setState((x) => ({ ...x, applications: [...rows.map((r, i) => ({ id: uid(), vacId: r.v.id, vac: snap(r.v), resumeId: r.resumeId, letter: r.letter, status: "sent", via: out[i]?.mode || "manual", date })), ...x.applications] }));
    if (out[0]?.mode === "manual") await copyAndOpen(rows[0]?.letter, rows[0]?.v.url);
    touchStreak(); unlock("first-apply");
    if (s.applications.length + rows.length >= 10) unlock("ten-apply");
    celebrate(rows.length > 1 ? `${rows.length}` : t("Отправлено", "Sent"), t("письмо скопировано", "letter copied"));
    if (rows.length > 1) toast(t("Остальные открывай из трекера: письма уже готовы.", "Open the rest from the tracker: each letter is ready."));
    setBusy(false); onClose();
  };
  return (
    <Dialog isMobile={isMobile} open={open} onClose={onClose} wide title={vacs.length > 1 ? t(`Пачка · ${vacs.length}`, `Batch · ${vacs.length}`) : t("Отклик", "Apply")}>
      <div className="stack">
        {rows.map((r, i) => (
          <div key={r.v.id} className="card raised pad stack apply-row">
            <div className="row between wrap">
              <div><div className="h3">{L(r.v.name)}</div><div className="muted small">{r.v.employer?.name}</div></div>
              <select className="select" aria-label={t("Версия резюме", "Resume version")} value={r.resumeId} onChange={async (e) => {
                const res = s.resumes.find((x) => x.id === e.target.value);
                setRows((x) => x.map((y, j) => (j === i ? { ...y, resumeId: res.id, loading: true } : y)));
                const letter = await platform.ai.letter(res.data, r.v, lang);
                setRows((x) => x.map((y, j) => (j === i ? { ...y, letter, loading: false } : y)));
              }}>{s.resumes.map((x) => <option key={x.id} value={x.id}>{x.title} · {platform.ai.match(x.data, r.v).pct}%</option>)}</select>
            </div>
            <label htmlFor={`l-${r.v.id}`} className="label">{r.loading ? <Loader2 size={15} className="spin" /> : <Sparkles size={15} className="fire-t" />} {t("Сопроводительное письмо (можно править)", "Cover letter (editable)")}</label>
            <textarea id={`l-${r.v.id}`} className="input" rows={6} value={r.letter} onChange={(e) => setRows((x) => x.map((y, j) => (j === i ? { ...y, letter: e.target.value } : y)))} />
          </div>
        ))}
        <Notice>{t("С 15 декабря 2025 hh.ru закрыл отклики для сторонних сервисов. Мы копируем письмо и открываем вакансию на hh, ты отправляешь там в один клик.", "Since 15 Dec 2025 hh.ru closed applying for third-party apps. We copy your letter and open the job on hh; you send it there in one click.")}</Notice>
        <label className="check"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /><span>{t("Я проверил(а) письмо и подтверждаю отклик от своего имени.", "I've checked the letter and confirm applying in my own name.")}</span></label>
        <div className="row between wrap">
          <span className={over ? "small err" : "small muted"}>{t(`Сегодня осталось ${left} из ${DAILY_LIMIT}`, `${left} of ${DAILY_LIMIT} left today`)}{over && t(": убери лишние", ": remove some")}</span>
          <button className="btn" disabled={!ok || over || !rows.length || busy || rows.some((r) => r.loading)} onClick={confirm}>{busy ? <Loader2 size={18} className="spin" /> : <Send size={18} />} {rows.length > 1 ? t(`Подтвердить все (${rows.length})`, `Confirm all (${rows.length})`) : t("Подтвердить отклик", "Confirm")}</button>
        </div>
      </div>
    </Dialog>
  );
}

function useVacancies(f, resume) {
  const [raw, setRaw] = useState([]);
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let on = true;
    setLoading(true); setError(false);
    const id = setTimeout(() => platform.searchVacancies(f).then((r) => {
      if (!on) return;
      const items = r.items || [];
      setRaw(items); setSrc(r.source); setLoading(false);
      setState((x) => ({ ...x, vacCache: { ...x.vacCache, ...Object.fromEntries(items.map((v) => [v.id, snap(v)])) } }), { silent: true });
    }).catch(() => { on && (setError(true), setLoading(false)); }), 280);
    return () => { on = false; clearTimeout(id); };
  }, [f.q, f.area, f.remote, f.intern, f.noExp, f.schedule, f.salary, f.dir]);
  const items = useMemo(() => {
    const a = raw.map((v) => ({ ...v, match: platform.ai.match(resume, v) }));
    if (f.sort === "match") a.sort((x, y) => y.match.pct - x.match.pct);
    if (f.sort === "salary") a.sort((x, y) => (y.salary?.from || y.salary?.to || 0) - (x.salary?.from || x.salary?.to || 0));
    if (f.sort === "date") a.sort((x, y) => String(y.published || "").localeCompare(String(x.published || "")));
    return a;
  }, [raw, resume, f.sort]);
  return { items, loading, error, src };
}

const toggleSave = (v) => setState((x) => ({ ...x, saved: x.saved.includes(v.id) ? x.saved.filter((i) => i !== v.id) : [...x.saved, v.id], vacCache: { ...x.vacCache, [v.id]: snap(v) } }));

function Filters({ f, setF }) {
  const { t, L } = useI18n();
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="stack">
      <div className="grid2">
        <div className="field"><label htmlFor="f-area">{t("Город", "City")}</label><select id="f-area" value={f.area} onChange={on("area")}><option value="">{t("Любой", "Any")}</option>{AREAS.map((a) => <option key={a.id} value={a.id}>{L(a.name)}</option>)}</select></div>
        <div className="field"><label htmlFor="f-dir">{t("Направление", "Field")}</label><select id="f-dir" value={f.dir} onChange={on("dir")}><option value="">{t("Все", "All")}</option>{DIRECTIONS.map((d) => <option key={d.id} value={d.id}>{L(d.name)}</option>)}</select></div>
        <div className="field"><label htmlFor="f-sch">{t("График", "Schedule")}</label><select id="f-sch" value={f.schedule} onChange={on("schedule")}><option value="">{t("Любой", "Any")}</option>{SCHEDULES.map((d) => <option key={d.id} value={d.id}>{L(d.name)}</option>)}</select></div>
        <div className="field"><label htmlFor="f-sal">{t("Зарплата от", "Salary from")}</label><input id="f-sal" inputMode="numeric" placeholder="150 000" value={f.salary} onChange={(e) => setF({ ...f, salary: e.target.value.replace(/\D/g, "") })} /></div>
      </div>
      <div className="chips">{[["remote", t("Удалённо", "Remote")], ["intern", t("Стажировка", "Internship")], ["noExp", t("Без опыта", "No experience")]].map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={f[k]} onClick={() => setF({ ...f, [k]: !f[k] })}>{l}</button>)}</div>
      <div className="field"><label htmlFor="f-sort">{t("Сортировка", "Sort")}</label><select id="f-sort" value={f.sort} onChange={on("sort")}><option value="match">{t("По совпадению с резюме", "By resume match")}</option><option value="salary">{t("По зарплате", "By salary")}</option><option value="date">{t("По дате", "By date")}</option></select></div>
    </div>
  );
}

function VacancyDetail({ v, go, isMobile }) {
  const s = useStore();
  const { t, L, lang } = useI18n();
  const [apply, setApply] = useState(false);
  const saved = s.saved.includes(v.id), applied = s.applications.some((a) => a.vacId === v.id);
  return (
    <div className="vac-detail">
      <div className="tags">
        {v.test && <span className="tag fire">{t("пример", "sample")}</span>}
        {v.area?.name && <span className="tag"><MapPin size={14} />{L(v.area.name)}</span>}
        {v.employment?.name && <span className="tag"><Briefcase size={14} />{L(v.employment.name)}</span>}
        {schedName(v, L) && <span className="tag">{schedName(v, L)}</span>}
      </div>
      <h2 className="display sm">{L(v.name)}</h2>
      <p className="muted">{v.employer?.name} · <b className="bone-t">{money(v.salary, lang)}</b></p>
      <div className="card raised pad match-box">
        <div className="row between"><span className="label">{t("Совпадение с резюме", "Match with your resume")}</span><MatchBadge pct={v.match.pct} seed={seed(v.id)} /></div>
        <Bar value={v.match.pct} />
        {v.match.have.length > 0 && <p className="small"><span className="muted">{t("Есть:", "You have:")}</span> {v.match.have.map((x) => skillLabel(x, lang)).join(", ")}</p>}
        {v.match.fixes.length > 0 && (
          <div><p className="label">{t("Чего не хватает", "What's missing")}</p>
            <ul className="fixes">{v.match.fixes.map(({ skill, project }) => (
              <li key={skill}><b>{skillLabel(skill, lang)}</b>{project ? <button className="link" onClick={() => go("portfolio", project.id)}>{L(project.title)} · {project.days} {t("дн.", "d")} <ArrowRight size={15} /></button> : <span className="muted small">{t("изучи сам(а)", "learn it yourself")}</span>}</li>
            ))}</ul></div>
        )}
      </div>
      {v.description && <><h3 className="h3">{t("О работе", "About the job")}</h3><p>{L(v.description)}</p></>}
      {v.requirements?.length > 0 && <><h3 className="h3">{t("Требования", "Requirements")}</h3><ul className="reqs">{v.requirements.map((r, i) => <li key={i}>{L(r)}</li>)}</ul></>}
      <div className="tags">{(v.key_skills || []).map((k) => <span key={k} className={cx("tag", v.match.have.includes(k) && "bone")}>{skillLabel(k, lang)}</span>)}</div>
      <div className={cx("row vac-actions", isMobile && "sticky")}>
        <button className="btn grow" disabled={applied} onClick={() => setApply(true)}><Send size={18} /> {applied ? t("Отклик отправлен", "Applied") : t("Откликнуться", "Apply")}</button>
        <button className={cx("icon-btn lg", saved && "on")} onClick={() => toggleSave(v)} aria-label={saved ? t("Убрать из сохранённых", "Unsave") : t("Сохранить", "Save")}>{saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}</button>
        <button className="icon-btn lg" onClick={() => go("interview", v.id)} aria-label={t("Тренажёр собеседования", "Interview trainer")} title={t("Тренажёр", "Rehearse")}><MessageSquare size={20} /></button>
      </div>
      <ApplyModal open={apply} onClose={() => setApply(false)} vacs={[v]} isMobile={isMobile} />
    </div>
  );
}

function SwipeCard({ v, onSwipe, top }) {
  const { t, L, lang } = useI18n();
  const x = useMotionValue(0);
  const rot = useTransform(x, [-220, 220], [-14, 14]);
  const yes = useTransform(x, [30, 120], [0, 1]);
  const no = useTransform(x, [-120, -30], [1, 0]);
  const fly = (d) => animate(x, d * 520, { duration: 0.28 }).then(() => onSwipe(d));
  useEffect(() => {
    if (!top) return;
    const f = (e) => e.detail && fly(e.detail);
    window.addEventListener("fz-swipe", f);
    return () => window.removeEventListener("fz-swipe", f);
  });
  return (
    <motion.div className="swipe paper-card" style={{ x, rotate: rot, zIndex: top ? 2 : 1, scale: top ? 1 : 0.95 }} drag={top ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.9}
      onDragEnd={(_, i) => (i.offset.x > 110 ? fly(1) : i.offset.x < -110 ? fly(-1) : null)}>
      <motion.div className="sw-lbl yes" style={{ opacity: yes }}>{t("Сохранить", "Save")}</motion.div>
      <motion.div className="sw-lbl no" style={{ opacity: no }}>{t("Мимо", "Skip")}</motion.div>
      <div className="row between">{v.test ? <span className="tag fire">{t("пример", "sample")}</span> : <span />}<MatchBadge pct={v.match.pct} seed={seed(v.id)} /></div>
      <h2 className="display sm">{L(v.name)}</h2>
      <p className="sw-emp">{v.employer?.name}</p>
      <p className="h3 fire-deep">{money(v.salary, lang)}</p>
      <div className="tags">{v.area?.name && <span className="tag ink"><MapPin size={14} />{L(v.area.name)}</span>}{schedName(v, L) && <span className="tag ink">{schedName(v, L)}</span>}</div>
      <p className="sw-desc">{L(v.description)}</p>
      <div className="tags">{(v.key_skills || []).slice(0, 6).map((k) => <span key={k} className={cx("tag ink", v.match.have.includes(k) && "hit")}>{skillLabel(k, lang)}</span>)}</div>
    </motion.div>
  );
}

export default function Jobs({ isMobile, go }) {
  const s = useStore();
  const res = useActiveResume();
  const { t, L, lang } = useI18n();
  const [f, setF] = useState(BASE);
  const [filters, setFilters] = useState(false);
  const [sel, setSel] = useState(null);
  const [onlySaved, setOnlySaved] = useState(false);
  const { items, loading, error, src } = useVacancies(f, res.data);
  const list = onlySaved ? items.filter((v) => s.saved.includes(v.id)) : items;
  const cur = list.find((v) => v.id === sel) || (!isMobile && list[0]);
  const demo = src === "demo";

  if (isMobile) {
    const deck = list.filter((v) => !s.skipped.includes(v.id) && !s.saved.includes(v.id));
    const swipe = (v) => (d) => setState((x) => (d > 0 ? { ...x, saved: [...x.saved, v.id], vacCache: { ...x.vacCache, [v.id]: snap(v) } } : { ...x, skipped: [...x.skipped, v.id] }));
    const open = list.find((v) => v.id === sel);
    return (
      <div className="screen">
        <div className="row">
          <div className="search grow"><Search size={18} /><input placeholder={t("Должность или навык", "Role or skill")} aria-label={t("Поиск вакансий", "Search jobs")} value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} /></div>
          <button className="btn ghost square" onClick={() => setFilters(true)} aria-label={t("Фильтры", "Filters")}><SlidersHorizontal size={20} /></button>
        </div>
        <div className="tabs">{[[false, t("Подборка", "For you")], [true, `${t("Сохранённые", "Saved")} · ${s.saved.length}`]].map(([k, l]) => <button key={String(k)} aria-selected={onlySaved === k} onClick={() => setOnlySaved(k)}>{l}</button>)}</div>
        {onlySaved ? (list.length ? <div className="stack">{list.map((v) => (
          <button key={v.id} className="card pad vac-li" onClick={() => setSel(v.id)}><div><div className="h3">{L(v.name)}</div><div className="muted small">{v.employer?.name} · {money(v.salary, lang)}</div></div><MatchBadge pct={v.match.pct} seed={seed(v.id)} /></button>))}</div>
          : <Empty mark="✕" title={t("Пока пусто", "Nothing yet")} text={t("Свайпни вправо, чтобы сохранить вакансию.", "Swipe right to save a job.")} />)
          : loading ? <Skeleton h={470} /> : (
            <>
              <div className="deck">{deck.length ? deck.slice(0, 2).reverse().map((v, i, a) => <SwipeCard key={v.id} v={v} top={i === a.length - 1} onSwipe={swipe(v)} />)
                : <Empty mark="△" title={t("Ты всё пролистал(а)", "You've seen them all")} text={t("Ослабь фильтры или верни пропущенные.", "Loosen the filters or bring back skipped.")} action={<button className="btn ghost" onClick={() => setState((x) => ({ ...x, skipped: [] }))}><RotateCcw size={18} /> {t("Показать пропущенные", "Show skipped")}</button>} />}</div>
              {deck.length > 0 && (
                <div className="deck-btns">
                  <button className="round" aria-label={t("Пропустить", "Skip")} onClick={() => window.dispatchEvent(new CustomEvent("fz-swipe", { detail: -1 }))}><X size={28} /></button>
                  <button className="round sm" aria-label={t("Подробнее", "Details")} onClick={() => setSel(deck[0].id)}><Info size={22} /></button>
                  <button className="round fire" aria-label={t("Сохранить", "Save")} onClick={() => window.dispatchEvent(new CustomEvent("fz-swipe", { detail: 1 }))}><Heart size={26} /></button>
                </div>
              )}
            </>
          )}
        {demo && <p className="muted small center">{t("hh.ru сейчас недоступен: показаны примеры вакансий.", "hh.ru is unreachable: showing sample jobs.")}</p>}
        <Dialog isMobile open={filters} onClose={() => setFilters(false)} title={t("Фильтры", "Filters")}><Filters f={f} setF={setF} /><button className="btn full" style={{ marginTop: 16 }} onClick={() => setFilters(false)}>{t("Показать", "Show")} {list.length}</button></Dialog>
        <Dialog isMobile open={!!open} onClose={() => setSel(null)} title={t("Вакансия", "Job")}>{open && <VacancyDetail v={open} go={go} isMobile />}</Dialog>
      </div>
    );
  }

  return (
    <div className="screen">
      <ScreenHead script={t("трек 3 · десять точных откликов", "track 3 · ten precise applications")} title={t("Вакансии", "Jobs")}
        right={<div className="row"><button className="chip" aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}><Bookmark size={16} /> {t("Сохранённые", "Saved")} · {s.saved.length}</button><button className="btn ghost sm" onClick={() => setFilters(true)}><SlidersHorizontal size={18} /> {t("Все фильтры", "All filters")}</button></div>} />
      <div className="row wrap jobs-bar">
        <div className="search grow"><Search size={18} /><input id="job-search" placeholder={t("Должность или навык   /", "Role or skill   /")} aria-label={t("Поиск вакансий", "Search jobs")} value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} /></div>
        <select className="select" aria-label={t("Город", "City")} value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })}><option value="">{t("Любой город", "Any city")}</option>{AREAS.map((a) => <option key={a.id} value={a.id}>{L(a.name)}</option>)}</select>
        {[["remote", t("Удалённо", "Remote")], ["intern", t("Стажировка", "Internship")], ["noExp", t("Без опыта", "No experience")]].map(([k, l]) => <button key={k} className="chip" aria-pressed={f[k]} onClick={() => setF({ ...f, [k]: !f[k] })}>{l}</button>)}
      </div>
      {src === "hh" && !loading && <p className="hh-live"><span className="live-dot" /> {t("живые вакансии hh.ru", "live hh.ru jobs")} · {list.length}</p>}
      {demo && <Notice>{t("hh.ru сейчас недоступен, поэтому ниже примеры вакансий для проверки интерфейса. Живые данные подтянутся сами.", "hh.ru is unreachable right now, so these are sample jobs. Live data will load on its own.")}</Notice>}
      {error && <Notice>{t("hh не ответил. Попробуй через минуту.", "hh didn't respond. Try again in a minute.")}</Notice>}
      <div className="jobs-split">
        <div role="listbox" aria-label={t("Список вакансий", "Job list")} className="vac-list">
          {loading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={104} />) : list.length ? list.map((v, i) => (
            <motion.button key={v.id} layout role="option" aria-selected={cur?.id === v.id} className="vac-item" onClick={() => setSel(v.id)} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}>
              <div className="row between top"><span className="vi-name">{L(v.name)}</span><MatchBadge pct={v.match.pct} seed={seed(v.id)} /></div>
              <div className="muted small">{v.employer?.name}{v.area?.name ? ` · ${L(v.area.name)}` : ""}</div>
              <div className="row between"><b className="small">{money(v.salary, lang)}</b>{s.saved.includes(v.id) && <BookmarkCheck size={16} className="fire-t" />}</div>
            </motion.button>
          )) : <Empty mark="⌕" title={t("Ничего не нашлось", "Nothing found")} text={t("Убери пару фильтров или попробуй другое слово.", "Drop a filter or try another word.")} action={<button className="btn ghost" onClick={() => setF(BASE)}>{t("Сбросить фильтры", "Reset filters")}</button>} />}
        </div>
        <div className="card pad vac-pane">
          <AnimatePresence mode="wait">
            {cur ? <motion.div key={cur.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }}><VacancyDetail v={cur} go={go} /></motion.div>
              : !loading && <Empty mark="←" title={t("Выбери вакансию", "Pick a job")} />}
          </AnimatePresence>
        </div>
      </div>
      <Dialog open={filters} onClose={() => setFilters(false)} title={t("Фильтры", "Filters")}><Filters f={f} setF={setF} /><button className="btn full" style={{ marginTop: 16 }} onClick={() => setFilters(false)}>{t("Показать", "Show")} {list.length}</button></Dialog>
    </div>
  );
}
