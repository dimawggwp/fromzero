// FromZero · логотип. Знак: перечёркнутый ноль программиста, черта которого выходит за контур вверх-вправо:
// «из нуля наружу». Две линии, два цвета, читается от 16 px до билборда.
import React from "react";

export function Mark({ size = 32, bg = "var(--soot)", stroke = "var(--bone)", accent = "var(--fire)", title = "FromZero", className = "" }) {
  return (
    <svg className={"fz-mark " + className} width={size} height={size} viewBox="0 0 40 40" role="img" aria-label={title}>
      <ellipse cx="19" cy="22" rx="10" ry="13.5" fill="none" stroke={stroke} strokeWidth="3.4" />
      <line x1="10.5" y1="34" x2="33" y2="5" stroke={bg} strokeWidth="8" strokeLinecap="round" />
      <line className="slash" x1="10.5" y1="34" x2="33" y2="5" stroke={accent} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 24, onClick, className = "", bg }) {
  return (
    <span className={"fz-logo " + className} onClick={onClick} style={{ "--logo-h": size + "px" }} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
      <Mark size={size + 10} bg={bg} />
      <span className="fz-word">From<b>Zero</b></span>
    </span>
  );
}

/** Знак на «пластинке»: вращается вместе со скроллом (оммаж виниловой иконке референса). */
export function RecordMark({ rotate = 0, size = 52, onClick }) {
  return (
    <button className="record" style={{ width: size, height: size }} onClick={onClick} aria-label="FromZero">
      <span style={{ display: "grid", transform: `rotate(${rotate}deg)` }}>
        <Mark size={size * 0.56} bg="#0d0c0b" />
      </span>
    </button>
  );
}

/** SVG-строка для favicon и иконки приложения. */
export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#0d0c0b"/><ellipse cx="19" cy="22" rx="10" ry="13.5" fill="none" stroke="#efe8dc" stroke-width="3.4"/><line x1="10.5" y1="34" x2="33" y2="5" stroke="#0d0c0b" stroke-width="8" stroke-linecap="round"/><line x1="10.5" y1="34" x2="33" y2="5" stroke="#e8392f" stroke-width="3.4" stroke-linecap="round"/></svg>`;
