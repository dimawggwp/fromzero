// FromZero · лист резюме. Три шаблона: classic, accent («Сигнал»), mono («Минимал»).
import React from "react";
import { skillLabel } from "../data.js";

const CLS = { classic: "rp-classic", accent: "rp-accent", mono: "rp-mono" };
const H = ({ children }) => <h4 className="rp-h">{children}</h4>;

export default function ResumePreview({ r, template = "accent", id, lang = "ru", stamp }) {
  const t = (ru, en) => (lang === "en" ? en : ru);
  const items = (a = []) => a.filter((x) => x.role || x.title || (x.bullets || []).length);
  const exp = items(r.experience), proj = items(r.projects), edu = (r.education || []).filter((e) => e.school);
  return (
    <div className={"paper " + (CLS[template] || CLS.accent)} id={id}>
      {template === "accent" && <div className="rp-band" />}
      {stamp && <div className="rp-stamp">{stamp}</div>}
      <div className="rp-in">
        <div className="rp-name">{r.name || t("Имя Фамилия", "Your Name")}</div>
        <div className="rp-title">{r.title || t("Желаемая должность", "Target role")}</div>
        <div className="rp-meta">{[r.city, r.email, r.phone, r.links].filter(Boolean).join("  ·  ") || t("город · почта · телефон", "city · email · phone")}</div>
        {r.summary && (<><H>{t("О себе", "Summary")}</H><p>{r.summary}</p></>)}
        {exp.length > 0 && (<><H>{t("Опыт", "Experience")}</H>{exp.map((e, i) => (
          <div className="rp-item" key={i}>
            <div className="rp-row"><b>{e.role}{e.org && `, ${e.org}`}</b><span className="rp-dim">{e.period}</span></div>
            <ul>{(e.bullets || []).map((b, j) => <li key={j}>{b}</li>)}</ul>
          </div>))}</>)}
        {proj.length > 0 && (<><H>{t("Проекты", "Projects")}</H>{proj.map((p, i) => (
          <div className="rp-item" key={i}><b>{p.title}</b><ul>{(p.bullets || []).map((b, j) => <li key={j}>{b}</li>)}</ul></div>))}</>)}
        {edu.length > 0 && (<><H>{t("Образование", "Education")}</H>{edu.map((e, i) => (
          <div className="rp-row" key={i}><span><b>{e.school}</b>{e.degree && `, ${e.degree}`}</span><span className="rp-dim">{e.years}</span></div>))}</>)}
        {(r.skills || []).length > 0 && (<><H>{t("Навыки", "Skills")}</H><div className="rp-skills">{r.skills.map((s) => <span key={s}>{skillLabel(s, lang)}</span>)}</div></>)}
        {!r.summary && !exp.length && !proj.length && <div className="rp-empty">{t("Заполни анкету,", "Fill in the form,")}<br />{t("лист соберётся сам", "the page builds itself")}</div>}
      </div>
    </div>
  );
}
