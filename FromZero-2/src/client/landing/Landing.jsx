// FromZero · лендинг-лонгрид в духе «Огненной зоны»: прелоадер с процентами, гигантский красный логотип,
// ч/б коллажные сцены с репликами, досье «Состава», сетлист маршрута и финал в огне.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useI18n } from "../i18n.js";
import { setState } from "../store.js";
import { DIRECTIONS, PROJECTS, skillLabel } from "../data.js";
import { FAMOUS } from "../famous.js";
import { SCENES, projectPhoto } from "../photos.js";
import { Logo, Mark, RecordMark } from "../Logo.jsx";
import { Bubble, Embers, Flames, LangSwitch, Modal, reduced, reveal, useIsMobile } from "../ui.jsx";
import ResumePreview from "../screens/ResumePreview.jsx";
import { searchHh } from "../hh.js";

const ease = [0.22, 1, 0.36, 1];

/** Строка, выезжающая из-под маски. Наблюдаем за самой маской: текст внутри спрятан за overflow и сам «в кадр» не попадёт. */
function MaskLine({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const on = useInView(ref, { once: true, margin: "-40px" });
  return (
    <span className="line-mask" ref={ref}>
      <motion.span className={className} initial={{ y: "105%" }} animate={{ y: on ? "0%" : "105%" }} transition={{ duration: 0.8, delay, ease }}>{children}</motion.span>
    </span>
  );
}

/* ——— Прелоадер: проценты считаются по реальной загрузке картинок ——— */
function Preloader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    const srcs = Object.values(SCENES);
    let loaded = 0, shown = 0, raf;
    const t0 = performance.now();
    srcs.forEach((s) => { const i = new Image(); i.onload = i.onerror = () => loaded++; i.src = s; });
    const tick = () => {
      const real = (loaded / srcs.length) * 100;
      const time = Math.min(100, ((performance.now() - t0) / 1500) * 100);
      shown = Math.min(real, time, shown + 2.2);
      if (performance.now() - t0 > 5000) shown = Math.min(100, shown + 3);
      setPct(Math.floor(shown));
      if (shown >= 100) { setOut(true); setTimeout(onDone, 750); return; }
      raf = requestAnimationFrame(tick);
    };
    if (reduced()) { setOut(true); setTimeout(onDone, 50); } else raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <motion.div className="preloader" initial={false} animate={out ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} aria-hidden="true">
      <div className="pre-mark flicker"><Mark size={64} /></div>
      <div className="pre-num">{pct}<span> %</span></div>
      <div className="pre-script script">разогреваем сцену...</div>
      <Flames height={90} seed={11} className="pre-flames" />
    </motion.div>
  );
}

/* ——— Навигация ——— */
function Nav({ onStart, onSignIn }) {
  const { t } = useI18n();
  const { scrollY, scrollYProgress } = useScroll();
  const [rot, setRot] = useState(0);
  const [pct, setPct] = useState(0);
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => { setRot(v * 0.3); setSolid(v > 40); });
  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav className={"l-nav" + (solid ? " solid" : "")}>
      <div className="row">
        <RecordMark rotate={rot} size={48} onClick={() => go("top")} />
        <span className="l-pct mono">{pct} %</span>
      </div>
      <div className="l-links">
        {[["scenes", t("Сцены", "Scenes")], ["lineup", t("Состав", "Line-up")], ["albums", t("Направления", "Fields")], ["setlist", t("Сетлист", "Setlist")]].map(([id, l]) => (
          <button key={id} onClick={() => go(id)}>{l}</button>
        ))}
      </div>
      <div className="row l-right">
        <LangSwitch />
        <button className="link l-signin" onClick={onSignIn}>{t("Войти", "Sign in")}</button>
        <button className="btn sm" onClick={onStart}>{t("Начать", "Start")}</button>
      </div>
    </nav>
  );
}

/* ——— Хиро ——— */
const HOT = [12.3, 25.2, 37.6, 50.3, 63.3, 76.2, 89.2];

function Hero({ onStart, onSignIn, onOpen }) {
  const { t, L } = useI18n();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const sTitle = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const letters = "FROMZERO".split("");
  const [hover, setHover] = useState(null);
  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero-title-wrap" style={{ y: yTitle, scale: sTitle }}>
        <h1 className="hero-title" aria-label="FromZero">
          {letters.map((ch, i) => (
            <motion.span key={i} initial={{ y: "-60%", opacity: 0, filter: "blur(12px)" }} animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.15 + i * 0.07, duration: 0.8, ease }}>{ch}</motion.span>
          ))}
        </h1>
        <div className="hero-tags">
          <motion.span className="muted" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.7 }}>{t("С нуля до оффера", "From zero to offer")}</motion.span>
          <motion.span initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.7 }}>{t("Резюме, которые нанимают", "Resumes that get hired")}</motion.span>
        </div>
      </motion.div>
      <div className="hero-stage">
        <motion.div className="hero-img" style={{ y: yImg }} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease }}>
          <img src={SCENES.hero} alt={t("Дракула, Эйнштейн, Ньютон, Токаев, Трамп, Маск и Цукерберг держат свои первые резюме", "Dracula, Einstein, Newton, Tokayev, Trump, Musk and Zuckerberg holding their first resumes")} />
          {FAMOUS.map((f, i) => (
            <button key={f.id} className="hot" style={{ left: HOT[i] + "%" }} onMouseEnter={() => setHover(f.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(f.id)} onBlur={() => setHover(null)} onClick={() => onOpen(f.id)} aria-label={L(f.name)}>
              <span className="hot-ring" />
              <AnimatePresence>{hover === f.id && <motion.span className="hot-name" initial={{ opacity: 0, y: 8, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: -2 }} exit={{ opacity: 0 }}>{L(f.name)}<small>{L(f.first)}</small></motion.span>}</AnimatePresence>
            </button>
          ))}
        </motion.div>
        <Flames height={120} seed={5} className="hero-flames" />
        <Embers density={70} />
        <motion.div className="hero-tap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <span className="script bone">{t("тыкни на нас", "tap on us")}</span>
          <svg width="70" height="46" viewBox="0 0 70 46" aria-hidden="true"><path d="M4 6 C 26 2, 48 12, 58 38 M58 38 l -12 -4 M58 38 l 3 -12" fill="none" stroke="var(--bone)" strokeWidth="2" strokeLinecap="round" /></svg>
        </motion.div>
      </div>
      <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }}>
        <p className="lead">{t("Студентам Казахстана и СНГ: резюме, портфолио из мини-проектов, живые вакансии hh и тренажёр собеседования. Опыт не нужен.", "For students in Kazakhstan and the CIS: a resume, a portfolio of mini-projects, live hh jobs and an interview trainer. No experience needed.")}</p>
        <div className="row wrap">
          <button className="btn lg" onClick={onStart}>{t("Начать с нуля", "Start from zero")} <ArrowRight size={22} /></button>
          <button className="btn ghost lg" onClick={onSignIn}>{t("У меня есть аккаунт", "I have an account")}</button>
        </div>
      </motion.div>
    </section>
  );
}

function Ticker() {
  const { t } = useI18n();
  const words = [t("Опыт не нужен", "No experience needed"), t("Нужен старт", "Just a start"), t("6 секунд на резюме", "6 seconds per resume"), t("10 точных откликов", "10 precise applications"), t("Мини-проект за 3 дня", "A 3-day mini-project"), t("Живые вакансии hh", "Live hh jobs")];
  const row = [...words, ...words, ...words];
  return (
    <div className="tickers" aria-hidden="true">
      <div className="ticker red"><div className="ticker-in">{row.map((w, i) => <span key={i}>{w}<i>✕</i></span>)}</div></div>
      <div className="ticker bone"><div className="ticker-in rev">{row.map((w, i) => <span key={i}>{w}<i>✕</i></span>)}</div></div>
    </div>
  );
}

/* ——— Сцена-коллаж ——— */
function Scene({ id, img, alt, script, title, text, bubbles = [], cta, onCta, extra, flip, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <section className={"scene" + (flip ? " flip" : "")} id={id} ref={ref}>
      <div className="scene-copy">
        <div>
          <motion.div className="script" initial={{ clipPath: "inset(0 100% 0 0)" }} whileInView={{ clipPath: "inset(0 0% 0 0)" }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.1, ease }}>{script}</motion.div>
          <h2 className="display scene-h">
            {title.map((line, i) => (
              <MaskLine key={i} className={line.red ? "red" : ""} delay={0.1 + i * 0.09}>{line.text}</MaskLine>
            ))}
          </h2>
        </div>
        <motion.div className="scene-text" {...reveal(0.3)}>
          <p>{text}</p>
          {extra}
          {cta && <button className="btn" onClick={onCta}>{cta} <ArrowRight size={18} /></button>}
        </motion.div>
      </div>
      <div className="scene-stage">
        <motion.div className="scene-img" style={{ y }} initial={{ opacity: 0, scale: 1.06 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-120px" }} transition={{ duration: 1.4, ease }}>
          <img src={img} alt={alt} loading="lazy" />
        </motion.div>
        {bubbles.map((b, i) => <Bubble key={i} who={b.who} fire={b.fire} right={b.right} top={b.top} className={b.cls} style={b.style} delay={0.35 + i * 0.45}>{b.text}</Bubble>)}
        {children}
      </div>
    </section>
  );
}

function useHhCount() {
  const [n, setN] = useState(null);
  useEffect(() => {
    let on = true;
    searchHh({ noExp: true, area: "40" }).then((r) => on && setN(r.found)).catch(() => {});
    return () => { on = false; };
  }, []);
  return n;
}

/* ——— Яблоко Ньютона: тыкни, и закон сработает ——— */
function Apple() {
  const { t } = useI18n();
  const [hit, setHit] = useState(false);
  return (
    <>
      <button className="hot apple-hot" onClick={() => setHit(true)} aria-label={t("Яблоко", "Apple")}><span className="hot-ring" /></button>
      <AnimatePresence>
        {hit && (
          <motion.div className="bubble script-b fire" style={{ left: "62%", top: "64%", position: "absolute" }} initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: -3 }} exit={{ scale: 0 }} onClick={() => setHit(false)}>
            {t("закон всемирного найма", "the law of universal hiring")}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ——— Досье «Состава»: семь одинаковых карточек в один ряд.
   Десктоп: секция закрепляется, вертикальный скролл двигает ряд по горизонтали. Телефон: свайп с привязкой. ——— */
function Dossiers({ onOpen }) {
  const { t, L, lang } = useI18n();
  const isMobile = useIsMobile();
  const wrap = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    if (isMobile) return;
    const m = () => setDist(Math.max(0, (track.current?.scrollWidth || 0) - window.innerWidth + 64));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, [isMobile]);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 26, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const pinned = !isMobile && dist > 0;
  const cards = FAMOUS.map((f, i) => {
    const r = f.resume[lang] || f.resume.ru;
    return (
      <motion.button key={f.id} className="dossier paper-card" onClick={() => onOpen(f.id)}
        initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ duration: 0.7, delay: (i % 7) * 0.06, ease }}
        whileHover={{ y: -10, rotate: i % 2 ? 1 : -1 }}>
        <span className="tape" />
        <div className="dz-top mono"><span>Hiring Record</span><span>#{String(i + 1).padStart(2, "0")}/{FAMOUS.length}</span></div>
        <div className="dz-photo"><img src={f.img} alt={L(f.name)} loading="lazy" /><span className="dz-stamp">{t("нанят", "hired")}</span></div>
        <div className="dz-name">{L(f.name)}</div>
        <div className="dz-aka script">{L(f.first)}</div>
        <dl className="dz-fields">
          <div><dt>{t("старт", "start")}</dt><dd>{L(f.start)}</dd></div>
          <div><dt>{t("навыки", "skills")}</dt><dd>{(r.skills || []).slice(0, 2).map((s) => skillLabel(s, lang)).join(", ")}</dd></div>
        </dl>
        <span className="dz-more">{t("Первое резюме", "First resume")} <ArrowUpRight size={16} /></span>
      </motion.button>
    );
  });
  return (
    <section className={"lineup" + (pinned ? " pinned" : "")} id="lineup" ref={wrap} style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className="lineup-stick">
        <div className="sec-head lineup-head">
          <motion.div className="script" {...reveal(0, 20)}>{t("у всех было первое резюме", "everyone had a first resume")}</motion.div>
          <div className="lineup-title">
            <h2 className="display"><MaskLine>{t("Состав", "Line-up")}</MaskLine></h2>
            <p className="muted sec-sub">{t("Дракула тоже начинал ночным администратором. Тыкни на досье: там их первое резюме по открытым биографиям.", "Dracula also started as a night-shift manager. Tap a file to read their first resume, built from public biographies.")}</p>
          </div>
        </div>
        <div className="dossier-rail">
          <motion.div className="dossiers" ref={track} style={pinned ? { x } : undefined}>{cards}</motion.div>
        </div>
        {pinned && <div className="lineup-progress" aria-hidden="true"><motion.span style={{ width: bar }} /><b className="mono">{t("листай вниз", "keep scrolling")}</b></div>}
      </div>
    </section>
  );
}

function FamousModal({ id, onClose, onStart }) {
  const { t, L, lang } = useI18n();
  const isMobile = useIsMobile();
  const f = FAMOUS.find((x) => x.id === id);
  return (
    <Modal open={!!f} onClose={onClose} wide title={f ? L(f.name) : ""}>
      {f && (
        <div className="famous-modal">
          <div className="fm-side">
            <img src={f.img} alt="" className="fm-photo" />
            <p className="script">{L(f.first)}</p>
            <p className="muted small">{t("Пародия по открытой биографии. Портрет сгенерирован ИИ.", "A parody based on a public biography. AI-generated portrait.")}</p>
            <button className="btn" onClick={() => { onClose(); onStart(); }}>{t("Собрать своё", "Build mine")} <ArrowRight size={18} /></button>
          </div>
          <div className="fm-paper" style={{ transform: isMobile ? "none" : "rotate(1deg)" }}>
            <ResumePreview r={f.resume[lang] || f.resume.ru} template={f.template} lang={lang} stamp={L(f.start)} />
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ——— Направления как пластинки ——— */
function Albums({ onStart }) {
  const { t, L, lang, pl } = useI18n();
  return (
    <section className="l-sec" id="albums">
      <div className="sec-head">
        <motion.div className="script" {...reveal(0, 20)}>{t("выбери свой звук", "pick your sound")}</motion.div>
        <h2 className="display"><MaskLine>{t("6 направлений", "6 fields")}</MaskLine></h2>
        <p className="muted sec-sub">{t("В каждом три мини-проекта на 3, 7 и 14 дней. Сдал: строчка уже в резюме.", "Three mini-projects in each: 3, 7 and 14 days. Done: it's a resume line.")}</p>
      </div>
      <div className="albums">
        {DIRECTIONS.map((d, i) => {
          const ps = PROJECTS[d.id];
          return (
            <motion.button key={d.id} className="album" onClick={onStart} {...reveal((i % 3) * 0.08)}>
              <span className="vinyl"><span className="vinyl-label"><Mark size={22} bg="var(--fire)" stroke="var(--soot)" accent="var(--soot)" /></span></span>
              <span className="sleeve">
                <img src={projectPhoto(ps[0].id)} alt="" loading="lazy" />
                <span className="sleeve-shade" />
                <span className="sleeve-txt">
                  <span className="kicker">{ps.length} {pl(ps.length, ["проект", "проекта", "проектов"], ["project", "projects"])} · {ps.map((p) => p.days).join(" / ")} {t("дн.", "days")}</span>
                  <b>{L(d.name)}</b>
                  <span className="sleeve-skills">{d.skills.slice(0, 3).map((s) => skillLabel(s, lang)).join(" · ")}</span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ——— Сетлист маршрута ——— */
const SETLIST = [
  { ru: ["Базовый лагерь", "Онбординг за 2 минуты: направление, курс, что уже умеешь."], en: ["Base camp", "Two-minute onboarding: field, year, what you can already do."] },
  { ru: ["Резюме", "Простые вопросы, ИИ формулирует пункты: действие + результат + цифра."], en: ["Resume", "Plain questions; the AI writes bullets: action + result + number."] },
  { ru: ["Портфолио", "Нет опыта? Мини-проект на 3, 7 или 14 дней."], en: ["Portfolio", "No experience? A 3, 7 or 14-day mini-project."] },
  { ru: ["Отклики", "Живые вакансии hh с процентом совпадения и письмом."], en: ["Applications", "Live hh jobs with a match score and a letter."] },
  { ru: ["Тренажёр", "ИИ-рекрутер задаёт 5 вопросов и разбирает ответы по STAR."], en: ["Rehearsal", "An AI recruiter asks 5 questions and reviews them with STAR."] },
  { ru: ["Собеседование", "Финал тура. Дальше уже твоя работа."], en: ["Interview", "The tour finale. After that, it's your job."] },
];

function Setlist({ onStart }) {
  const { t, lang } = useI18n();
  const [on, setOn] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let k = 0;
      const id = setInterval(() => { k++; setOn(k); if (k >= 5) clearInterval(id); }, 420);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="l-sec setlist-sec" id="setlist">
      <motion.div className="setlist paper-card" ref={ref} initial={{ rotate: -4, y: 60, opacity: 0 }} whileInView={{ rotate: -1.5, y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>
        <span className="tape" style={{ left: "18%" }} /><span className="tape bone" style={{ left: "82%", transform: "translateX(-50%) rotate(4deg)" }} />
        <div className="sl-head"><b>{t("Сетлист", "Setlist")}</b><span className="script">{t("тур «С нуля»", "the “From zero” tour")}</span></div>
        <ol>
          {SETLIST.map((s, i) => (
            <li key={i}>
              <span className="sl-n">{i + 1}</span>
              <span className="sl-t"><b className={"strike" + (i < on ? " on" : "")}>{s[lang][0]}</b><small>{s[lang][1]}</small></span>
            </li>
          ))}
        </ol>
        <span className="sl-encore script">{t("на бис: оффер", "encore: the offer")}</span>
      </motion.div>
      <motion.div className="setlist-side" {...reveal(0.2)}>
        <div className="script">{t("зачёркиваешь по одному", "cross them off one by one")}</div>
        <h2 className="display md">{t("Шесть треков", "Six tracks")}<br /><span className="red">{t("до первого собеседования", "to the first interview")}</span></h2>
        <button className="btn lg" onClick={onStart}>{t("Выйти на сцену", "Take the stage")} <ArrowRight size={22} /></button>
      </motion.div>
    </section>
  );
}

function Ten() {
  const { t } = useI18n();
  return (
    <section className="l-sec ten">
      <motion.div className="ten-num" initial={{ scale: 0.6, opacity: 0, rotate: -6 }} whileInView={{ scale: 1, opacity: 1, rotate: -3 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 120, damping: 14 }}>10</motion.div>
      <motion.div {...reveal(0.15)}>
        <h2 className="display md">{t("Точных откликов", "Precise applications")}<br /><span className="red">{t("лучше ста случайных", "beat a hundred random ones")}</span></h2>
        <p className="lead muted">{t("Процент совпадения с вакансией, письмо под каждую компанию и трекер статусов. До 20 откликов в день, чтобы не выгореть.", "A match score per job, a letter for every company and a status tracker. Up to 20 a day so you don't burn out.")}</p>
        <span className="script">{t("проверено на Ньютоне", "tested on Newton")}</span>
      </motion.div>
    </section>
  );
}

function Finale({ onStart }) {
  const { t } = useI18n();
  return (
    <section className="finale">
      <Embers density={60} />
      <motion.div className="script" {...reveal(0, 20)}>{t("начни с нуля", "start from zero")}</motion.div>
      <h2 className="finale-h">
        <MaskLine>{t("Идти туда,", "Go where")}</MaskLine>
        <MaskLine className="red" delay={0.1}>{t("где страшно.", "it's scary.")}</MaskLine>
      </h2>
      <motion.div {...reveal(0.3)}><button className="btn lg paper" onClick={onStart}>{t("Начать бесплатно", "Start free")} <ArrowRight size={22} /></button></motion.div>
      <Flames height={200} seed={21} className="finale-flames" />
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="l-foot">
      <Logo size={22} />
      <p className="muted small">{t("Портреты и сцены сгенерированы ИИ. Резюме в «Составе» — пародия по открытым биографиям, не связаны с этими людьми и не выражают их позицию. Вакансии: открытый API hh.ru.", "Portraits and scenes are AI-generated. Line-up resumes are parodies based on public biographies, not affiliated with or endorsed by these people. Jobs: the open hh.ru API.")}</p>
      <span className="mono small muted">© 2026 FromZero</span>
    </footer>
  );
}

export default function Landing({ onStart, onSignIn }) {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(() => typeof sessionStorage !== "undefined" && sessionStorage.getItem("fz-pre") === "1");
  const [open, setOpen] = useState(null);
  const hh = useHhCount();
  const { fmt } = useI18n();
  const done = useMemo(() => () => { setLoaded(true); try { sessionStorage.setItem("fz-pre", "1"); } catch {} }, []);
  return (
    <div className="landing">
      {!loaded && <Preloader onDone={done} />}
      <Nav onStart={onStart} onSignIn={onSignIn} />
      {loaded && <Hero onStart={onStart} onSignIn={onSignIn} onOpen={setOpen} />}
      <Ticker />
      <div id="scenes" />
      <Scene id="s-resume" img={SCENES.resume} alt={t("Мэрилин у костра спрашивает Эйнштейна про резюме", "Marilyn by the campfire asks Einstein about a resume")}
        script={t("с чего начать?", "where do I start?")}
        title={[{ text: t("Резюме", "A resume") }, { text: t("с нуля", "from zero"), red: true }, { text: t("за 15 минут", "in 15 minutes") }]}
        text={t("Отвечаешь на простые вопросы: что сделал, какой результат, какая цифра. ИИ превращает это в пункты, а оценка 0–100 подсказывает, что поправить.", "Answer plain questions: what you did, the result, the number. The AI turns them into bullets, and a 0–100 score shows what to fix.")}
        cta={t("Собрать резюме", "Build my resume")} onCta={onStart}
        bubbles={[
          { who: t("Мэрилин", "Marilyn"), text: t("Альберт, как написать резюме, если опыта ноль?", "Albert, how do I write a resume with zero experience?"), style: { left: "5%", top: "16%" } },
          { who: t("Эйнштейн", "Einstein"), text: t("Всё относительно. Действие + результат + цифра.", "It's all relative. Action + result + number."), style: { left: "60%", top: "4%" }, fire: true },
        ]} />
      <Scene id="s-jobs" flip img={SCENES.jobs} alt={t("Мэрилин и Эйнштейн у доски вакансий", "Marilyn and Einstein at a job board")}
        script={t("а дальше?", "and then?")}
        title={[{ text: t("Живые вакансии", "Live jobs") }, { text: "hh.ru", red: true }, { text: t("а не таблички", "not mock tables") }]}
        text={t("Вакансии приходят напрямую из открытого API hh.ru: Алматы, Астана, Шымкент, удалёнка. Красным обведены те, где ты совпадаешь на 70%+.", "Jobs come straight from the open hh.ru API: Almaty, Astana, Shymkent, remote. Red circles mark the ones where you match 70%+.")}
        extra={hh ? <p className="hh-live"><span className="live-dot" /> {t(`Сейчас на hh: ${fmt(hh)} вакансий без опыта в Казахстане`, `On hh right now: ${fmt(hh)} no-experience jobs in Kazakhstan`)}</p> : null}
        cta={t("Смотреть вакансии", "See jobs")} onCta={onStart}
        bubbles={[
          { who: t("Мэрилин", "Marilyn"), text: t("Резюме есть. А работу где искать?", "Got the resume. Where do I find a job?"), style: { left: "3%", top: "16%" } },
          { who: t("Эйнштейн", "Einstein"), text: t("Тут. Обвёл красным, где ты совпадаешь.", "Right here. I circled your matches."), style: { left: "62%", top: "2%" }, fire: true },
        ]} />
      <Scene id="s-portfolio" img={SCENES.portfolio} alt={t("Ньютон под яблоней делает мини-проект", "Newton under an apple tree doing a mini-project")}
        script={t("нет опыта?", "no experience?")}
        title={[{ text: t("Мини-проект", "A mini-project") }, { text: t("за 3, 7, 14 дней", "in 3, 7, 14 days"), red: true }]}
        text={t("18 проектов в 6 направлениях: аудит соцсетей кофейни, трекер на React, дашборд в Excel. План по дням, критерий «готово» и строчка для резюме.", "18 projects in 6 fields: a café social audit, a React tracker, an Excel dashboard. A day-by-day plan, a done-criterion and a resume line.")}
        cta={t("Выбрать проект", "Pick a project")} onCta={onStart}
        bubbles={[
          { who: t("Ньютон", "Newton"), text: t("Опыт не падает с неба. Его делают за 7 дней.", "Experience doesn't fall from the sky. You make it in 7 days."), style: { left: "26%", top: "34%" }, right: true },
          { text: t("бум.", "bonk."), cls: "script-b", style: { left: "55%", top: "18%" }, fire: true },
        ]} />
      <Dossiers onOpen={setOpen} />
      <Scene id="s-spacex" flip img={SCENES.spacex} alt={t("Ньютон на собеседовании у Илона Маска в SpaceX", "Newton at a SpaceX interview with Elon Musk")}
        script={t("собеседование в SpaceX", "an interview at SpaceX")}
        title={[{ text: t("— Кем видите себя", "— Where do you see") }, { text: t("через 5 лет?", "yourself in 5 years?") }, { text: t("— На орбите.", "— In orbit."), red: true }]}
        text={t("Тренажёр задаёт 5 вопросов под конкретную вакансию: о себе, мотивация, проект по STAR, ошибка, рост. Каждый ответ разбирается: что хорошо, что поправить.", "The trainer asks 5 questions for a specific job: intro, motivation, a STAR project, a failure, growth. Every answer gets reviewed: what works, what to fix.")}
        cta={t("Отрепетировать", "Rehearse")} onCta={onStart}
        bubbles={[
          { who: t("Илон", "Elon"), text: t("Почему мы должны взять именно вас?", "Why should we hire you?"), style: { left: "50%", top: "22%" } },
          { who: t("Ньютон", "Newton"), text: t("Я открыл гравитацию. И прошёл тренажёр FromZero.", "I discovered gravity. And passed the FromZero trainer."), style: { left: "4%", top: "30%" }, fire: true },
        ]}><Apple /></Scene>
      <Albums onStart={onStart} />
      <Scene id="s-rehearsal" img={SCENES.rehearsal} alt={t("Дракула репетирует собеседование перед зеркалом без отражения", "Dracula rehearsing an interview in a mirror with no reflection")}
        script={t("репетиция в полночь", "a midnight rehearsal")}
        title={[{ text: t("Тренируйся,", "Rehearse") }, { text: t("даже если", "even if you"), red: true }, { text: t("не отражаешься", "have no reflection") }]}
        text={t("Пиши ответ, как сказал бы вслух. Подсказка STAR, счётчик слов, оценка до 10 и разбор. Дракула прошёл с 9/10.", "Write the answer as you'd say it. A STAR cue, a word count, a score out of 10 and a review. Dracula scored 9/10.")}
        bubbles={[
          { who: t("Дракула", "Dracula"), text: t("Рассказать о себе за 60 секунд? У меня 560 лет опыта.", "Tell you about myself in 60 seconds? I have 560 years of experience."), style: { left: "14%", top: "12%" }, right: true },
          { text: t("в зеркале: никого", "in the mirror: no one"), cls: "script-b", style: { left: "77%", top: "40%" } },
        ]} />
      <Setlist onStart={onStart} />
      <Ten />
      <Finale onStart={onStart} />
      <Footer />
      <FamousModal id={open} onClose={() => setOpen(null)} onStart={onStart} />
    </div>
  );
}
