// FromZero · детали кабинета «Огненной зоны»: шкала-кольцо, бейдж-пропуск, значки, сетлист.
import React from "react";
import { motion } from "framer-motion";
import { Mark } from "../Logo.jsx";
import { cx } from "../store.js";
import { useI18n } from "../i18n.js";

const ease = [0.22, 1, 0.36, 1];

/** Кольцо-шкала 0–100: красная дуга догорает до значения. */
export function Gauge({ value = 0, size = 96, label, stroke = 7 }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, value));
  return (
    <div className="gauge" style={{ width: size, height: size }} role="img" aria-label={`${label || ""} ${v}/100`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--coal-3)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={v >= 70 ? "var(--fire)" : "var(--fire-hot)"} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - v / 100) }} transition={{ duration: 1.3, ease }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <motion.b key={v} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }} style={{ fontSize: size * 0.36 }}>{v}</motion.b>
    </div>
  );
}

/** Ламинированный пропуск за кулисы: выдаётся после регистрации, висит на шнурке и покачивается. */
export function BackstagePass({ name, role, since, swing = true, className }) {
  const { t } = useI18n();
  const bars = React.useMemo(() => Array.from({ length: 34 }, (_, i) => 1 + ((i * 7919) % 5)), []);
  return (
    <motion.div className={cx("pass-wrap", swing && "swing", className)} initial={{ y: -260, rotate: -10 }} animate={{ y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 90, damping: 9, delay: 0.15 }}>
      <span className="lanyard" aria-hidden="true" />
      <div className="pass">
        <span className="pass-hole" aria-hidden="true" />
        <div className="pass-band"><span>ALL ACCESS</span><span>{t("тур «С нуля»", "“From zero” tour")}</span></div>
        <div className="pass-body">
          <Mark size={46} bg="var(--paper)" stroke="var(--ink)" />
          <div className="pass-name">{name || t("Новичок", "Rookie")}</div>
          <div className="pass-role script">{role || t("первый тур", "first tour")}</div>
          <div className="pass-row mono"><span>BACKSTAGE</span><span>{since}</span></div>
          <div className="pass-bars" aria-hidden="true">{bars.map((w, i) => <i key={i} style={{ width: w }} />)}</div>
        </div>
      </div>
    </motion.div>
  );
}

/** Значок-пин: открыт = красный, закрыт = контур. */
export function Pin({ glyph, title, hint, on, i = 0 }) {
  return (
    <motion.div className={cx("pin", on && "on")} title={hint} initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: on ? (i % 2 ? 6 : -6) : 0 }} transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 14 }}>
      <span className="pin-disc"><b>{glyph}</b></span>
      <span className="pin-t">{title}</span>
    </motion.div>
  );
}

/** Сетлист на бумаге: пункты зачёркиваются красным маркером, когда пройдены. */
export function SetlistPaper({ title, sub, items, encore, onGo }) {
  return (
    <motion.div className="setlist paper-card cab-setlist" initial={{ rotate: -3, y: 30, opacity: 0 }} animate={{ rotate: -1, y: 0, opacity: 1 }} transition={{ duration: 0.8, ease }}>
      <span className="tape" style={{ left: "16%" }} /><span className="tape bone" style={{ left: "84%", transform: "translateX(-50%) rotate(4deg)" }} />
      <div className="sl-head"><b>{title}</b><span className="script">{sub}</span></div>
      <ol>
        {items.map((s, i) => (
          <li key={s.id}>
            <button type="button" className={cx("sl-btn", s.current && "cur")} onClick={() => onGo?.(s)} disabled={!onGo}>
              <span className="sl-n">{i + 1}</span>
              <span className="sl-t"><b className={cx("strike", s.done && "on")} style={{ transitionDelay: `${0.4 + i * 0.25}s` }}>{s.name}</b>{s.note && <small>{s.note}</small>}</span>
              {s.detail != null && <span className={cx("sl-d mono", s.done && "ok")}>{s.detail}</span>}
            </button>
          </li>
        ))}
      </ol>
      {encore && <span className="sl-encore script">{encore}</span>}
    </motion.div>
  );
}

/** Штамп «Зачтено» поверх карточки. */
export const Stamp = ({ children, sm }) => (
  <motion.span className={cx("cab-stamp", sm && "sm")} initial={{ scale: 2.2, rotate: -24, opacity: 0 }} animate={{ scale: 1, rotate: -10, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 16 }}>{children}</motion.span>
);
