// FromZero · общие UI-примитивы «Огненной зоны».
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Info } from "lucide-react";
import { onAnnounce, setState, cx } from "./store.js";
import { useI18n } from "./i18n.js";

export function useIsMobile(q = "(max-width: 860px)") {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q), f = () => setM(mq.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}

export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useEsc(open, onClose) {
  useEffect(() => {
    if (!open) return;
    const f = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [open, onClose]);
}

export function Modal({ open, onClose, title, children, wide }) {
  useEsc(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
          <motion.div className={cx("modal", wide && "wide")} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}
            initial={{ y: 40, rotate: -1.5, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
            <div className="modal-head">
              <h2>{title}</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Sheet({ open, onClose, title, children }) {
  useEsc(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay sheet-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
          <motion.div className="sheet" role="dialog" aria-modal="true" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 32 }}>
            <div className="grab" />
            <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Dialog = ({ isMobile, ...p }) => (isMobile ? <Sheet {...p} /> : <Modal {...p} />);

export function Chips({ options, value, onChange, label, multi = true, size }) {
  const idOf = (o) => (typeof o === "string" ? o : o.id);
  const on = (o) => (multi ? (value || []).includes(idOf(o)) : value === idOf(o));
  const tog = (o) => {
    const id = idOf(o);
    if (!multi) return onChange(id);
    onChange(on(o) ? value.filter((x) => x !== id) : [...(value || []), id]);
  };
  return (
    <div className="chips">
      {options.map((o) => (
        <button type="button" key={idOf(o)} className={cx("chip", size)} aria-pressed={on(o)} onClick={() => tog(o)}>{label ? label(o) : idOf(o)}</button>
      ))}
    </div>
  );
}

export function Field({ id, label, hint, warn, rows, ...p }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {rows ? <textarea id={id} rows={rows} {...p} /> : <input id={id} {...p} />}
      {(warn || hint) && <p className={cx("hint", warn && "warn")}>{warn || hint}</p>}
    </div>
  );
}

/** Бикфордов шнур: прогресс-линия с тлеющим концом. */
export function Fuse({ value }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="fuse" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className="fuse-rope" />
      <motion.div className="fuse-burn" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
        <span className="fuse-spark" />
      </motion.div>
    </div>
  );
}

export function Bar({ value, h = 6 }) {
  return (
    <div className="bar" style={{ height: h }}>
      <motion.div className="bar-fill" style={{ background: "var(--fire)" }} initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  );
}

/** Рукописная красная обводка вокруг числа (как на доске объявлений в сцене). */
export function Circled({ children, seed = 1 }) {
  const d = useMemo(() => {
    const r = (n) => Math.sin(seed * 9301 + n * 49297) * 0.5 + 0.5;
    return `M ${8 + r(1) * 6} ${30 + r(2) * 6} C ${4} ${8}, ${50 + r(3) * 10} ${-2}, ${92} ${16 + r(4) * 6} S ${98} ${52}, ${52} ${56} S ${-2} ${48 + r(5) * 4}, ${14 + r(6) * 8} ${14}`;
  }, [seed]);
  return (
    <span className="circled">
      {children}
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d={d} /></svg>
    </span>
  );
}

export function MatchBadge({ pct, seed }) {
  const strong = pct >= 70;
  return (
    <span className={cx("match", strong && "strong")} aria-label={`${pct}%`}>
      {strong ? <Circled seed={seed}><b>{pct}%</b></Circled> : <b>{pct}%</b>}
    </span>
  );
}

/** Оценка резюме в облачке-реплике. */
export function ScoreBubble({ value, label }) {
  return (
    <div className="score-bubble" role="img" aria-label={`${label}: ${value}/100`}>
      <motion.b key={value} initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>{value}</motion.b>
      <span>/100</span>
    </div>
  );
}

export function Empty({ mark, title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-mark">{mark}</div>
      <h3>{title}</h3>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}

export function LangSwitch({ className }) {
  const { lang } = useI18n();
  return (
    <div className={cx("seg", className)} role="group" aria-label="Language">
      {["ru", "en"].map((l) => <button key={l} aria-pressed={lang === l} onClick={() => setState({ lang: l })}>{l.toUpperCase()}</button>)}
    </div>
  );
}

export function ScreenHead({ script, title, sub, right }) {
  return (
    <header className="screen-head">
      <div>
        {script && <motion.div className="script" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{script}</motion.div>}
        <motion.h1 className="display" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>{title}</motion.h1>
        {sub && <p className="muted sub">{sub}</p>}
      </div>
      {right && <div className="screen-head-right">{right}</div>}
    </header>
  );
}

export const Notice = ({ children }) => <div className="notice"><Info size={18} /><div>{children}</div></div>;
export const Skeleton = ({ h = 96 }) => <div className="skeleton" style={{ height: h }} />;

export function Announcer() {
  const [items, setItems] = useState([]);
  useEffect(() => onAnnounce((m) => {
    setItems((s) => [...s, m]);
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== m.id)), m.type === "stamp" ? 1900 : 2600);
  }), []);
  const stamp = items.filter((x) => x.type === "stamp").slice(-1)[0];
  const t = items.filter((x) => x.type === "toast").slice(-1)[0];
  return (
    <>
      <AnimatePresence>
        {stamp && (
          <motion.div key={stamp.id} className="stamp-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
            <motion.div className="stamp" initial={{ scale: 2.4, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}>
              <b>{stamp.text}</b>{stamp.sub && <span>{stamp.sub}</span>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {t && <motion.div key={t.id} className="toast" role="status" initial={{ y: 30, opacity: 0, x: "-50%" }} animate={{ y: 0, opacity: 1, x: "-50%" }} exit={{ y: 20, opacity: 0, x: "-50%" }}>{t.text}</motion.div>}
      </AnimatePresence>
    </>
  );
}

/** Летящие угли (canvas). Красные, а не оранжевые: огонь этой зоны красный. */
export function Embers({ density = 60, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const still = reduced();
    let w = 0, h = 0, raf, ps = [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const spawn = (any) => ({ x: Math.random() * w, y: any ? Math.random() * h : h + 10, r: Math.random() * 1.7 + 0.4, vy: Math.random() * 0.7 + 0.25, vx: (Math.random() - 0.5) * 0.3, ph: Math.random() * 6.28, life: Math.random() * 0.5 + 0.5 });
    size();
    ps = Array.from({ length: density }, () => spawn(true));
    const ro = new ResizeObserver(size);
    ro.observe(c);
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    const tick = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const p of ps) {
          p.y -= p.vy; p.ph += 0.03; p.x += p.vx + Math.sin(p.ph) * 0.25;
          const a = Math.max(0, Math.min(1, p.y / h)) * p.life;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
          ctx.fillStyle = `rgba(255,${70 + Math.floor(p.r * 30)},${40 + Math.floor(p.r * 10)},${a})`;
          ctx.shadowColor = "rgba(232,57,47,.9)"; ctx.shadowBlur = 8; ctx.fill();
          if (p.y < -10) Object.assign(p, spawn(false));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    if (!still) tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [density]);
  return <canvas ref={ref} className={cx("embers", className)} aria-hidden="true" />;
}

/** Полоса пламени: процедурные языки, каждый «лижет» в своём ритме. */
export function Flames({ height = 140, seed = 3, className, color = "var(--fire)" }) {
  const tongues = useMemo(() => {
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const out = [];
    let x = -20;
    while (x < 1220) {
      const w = 40 + rnd() * 90, hgt = 0.35 + rnd() * 0.65, lean = (rnd() - 0.5) * 40;
      const H = 200 * hgt;
      out.push({ d: `M${x} 200 C ${x + w * 0.1} ${200 - H * 0.5}, ${x + w * 0.35 + lean} ${200 - H * 0.7}, ${x + w * 0.5 + lean} ${200 - H} C ${x + w * 0.55 + lean * 0.6} ${200 - H * 0.6}, ${x + w * 0.9} ${200 - H * 0.45}, ${x + w} 200 Z`, dur: 1.6 + rnd() * 2.2, delay: -rnd() * 3 });
      x += w * (0.45 + rnd() * 0.35);
    }
    return out;
  }, [seed]);
  return (
    <svg className={cx("flames", className)} viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height }} aria-hidden="true">
      <rect x="0" y="186" width="1200" height="14" fill={color} />
      {tongues.map((t, i) => <path key={i} d={t.d} fill={color} style={{ "--d": `${t.dur}s`, animationDelay: `${t.delay}s` }} />)}
    </svg>
  );
}

/** Появление при скролле: базовый пресет. */
export const reveal = (delay = 0, y = 40) => ({ initial: { opacity: 0, y }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } });

/** Облачко, которое «выпрыгивает» из говорящего. */
export function Bubble({ children, who, className, style, delay = 0, fire, right, top }) {
  return (
    <motion.div className={cx("bubble", fire && "fire", right && "right", top && "top", className)} style={style}
      initial={{ scale: 0, opacity: 0, rotate: right ? 6 : -6 }} whileInView={{ scale: 1, opacity: 1, rotate: right ? 2 : -2 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 380, damping: 16, delay }}>
      {who && <span className="who">{who}</span>}
      {children}
    </motion.div>
  );
}

export function Tag({ children, kind }) { return <span className={cx("tag", kind)}>{children}</span>; }
