// FromZero · кабинет: резюме, язык, тема, hh.ru, выгрузка данных, выход, удаление аккаунта.
import React, { useState } from "react";
import { Download, FileText, Flame, Globe, Link2, LogOut, Moon, ShieldCheck, Trash2 } from "lucide-react";
import platform from "../platform.js";
import { resetAll, setState, toast, useStore } from "../store.js";
import { useI18n } from "../i18n.js";
import { scoreResume } from "../logic.js";
import { LangSwitch, Modal, ScreenHead } from "../ui.jsx";

function Row({ icon: I, title, desc, children, danger }) {
  return (
    <div className={"set-row" + (danger ? " danger" : "")}>
      <div className="row"><span className="set-ic"><I size={19} /></span><div><b>{title}</b>{desc && <div className="muted small">{desc}</div>}</div></div>
      {children}
    </div>
  );
}

export default function Profile({ isMobile, go, onSignedOut }) {
  const s = useStore();
  const { t, lang } = useI18n();
  const [del, setDel] = useState(false);
  const [hh, setHh] = useState(false);
  const exportJson = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(platform.exportData(), null, 2)], { type: "application/json" }));
    a.download = "fromzero-data.json"; a.click();
  };
  const signOut = async () => { await platform.auth.signOut(); setState({ user: null }); onSignedOut?.(); };
  return (
    <div className="screen narrow">
      <ScreenHead script={s.user ? `${t("вход", "signed in")}: ${s.user.label || s.user.provider}` : t("гость", "guest")} title={t("Кабинет", "Account")} />
      <section className="card pad stack">
        <h2 className="h2">{t("Мои резюме", "My resumes")}</h2>
        {s.resumes.map((r) => (
          <button key={r.id} className="res-row" onClick={() => { setState((x) => ({ ...x, activeResumeId: r.id })); go("builder"); }}>
            <span className="row"><FileText size={18} /><span>{r.title}</span>{r.id === s.activeResumeId && <span className="tag fire">{t("активное", "active")}</span>}</span>
            <span className="big-n sm fire-t">{scoreResume(r.data, lang).score}</span>
          </button>
        ))}
      </section>
      <section className="card pad settings">
        <Row icon={Globe} title={t("Язык", "Language")} desc={t("Русский или английский", "Russian or English")}><LangSwitch /></Row>
        <Row icon={s.theme === "light" ? Moon : Flame} title={t("Тема", "Theme")} desc={t("Огонь или пепел", "Fire or ash")}>
          <div className="seg">{[["dark", t("Огонь", "Fire")], ["light", t("Пепел", "Ash")]].map(([k, l]) => <button key={k} aria-pressed={s.theme === k} onClick={() => setState({ theme: k })}>{l}</button>)}</div>
        </Row>
        <Row icon={Link2} title={t("Аккаунт hh.ru", "hh.ru account")} desc={t("Для статусов откликов, если hh даст доступ", "For application statuses, if hh grants access")}><button className="btn ghost sm" onClick={async () => (await platform.hh.connect())?.demo && setHh(true)}>{t("Подключить", "Connect")}</button></Row>
        <Row icon={Download} title={t("Мои данные", "My data")} desc={t("Скачать всё, что мы храним", "Download everything we store")}><button className="btn ghost sm" onClick={exportJson}>JSON</button></Row>
        <Row icon={LogOut} title={t("Выйти", "Sign out")} desc={t("Данные останутся в аккаунте", "Your data stays in the account")}><button className="btn ghost sm" onClick={signOut}>{t("Выйти", "Sign out")}</button></Row>
        <Row icon={Trash2} danger title={t("Удалить аккаунт", "Delete account")} desc={t("Сотрём резюме, прогресс и токены навсегда", "Erase resumes, progress and tokens for good")}><button className="btn danger sm" onClick={() => setDel(true)}>{t("Удалить", "Delete")}</button></Row>
      </section>
      {!isMobile && <p className="muted small mono">{t("Горячие клавиши: 1-7 разделы · / поиск вакансий · T тема", "Shortcuts: 1-7 sections · / job search · T theme")}</p>}
      <Modal open={del} onClose={() => setDel(false)} title={t("Удалить всё?", "Delete everything?")}>
        <p>{t("Резюме, проекты, отклики и подключение hh будут удалены без возможности восстановления.", "Resumes, projects, applications and the hh connection will be deleted permanently.")}</p>
        <div className="row end" style={{ marginTop: 18 }}>
          <button className="btn ghost" onClick={() => setDel(false)}>{t("Отмена", "Cancel")}</button>
          <button className="btn danger" onClick={async () => { await platform.deleteAccount(); resetAll({ lang, landingSeen: true }); setDel(false); toast(t("Аккаунт удалён", "Account deleted")); onSignedOut?.(); }}>{t("Да, удалить", "Yes, delete")}</button>
        </div>
      </Modal>
      <Modal open={hh} onClose={() => setHh(false)} title={t("Вход через hh.ru", "Sign in with hh.ru")}>
        <p className="note"><ShieldCheck size={20} />{t("На боевом сайте здесь открывается официальная авторизация hh (OAuth). Токен хранится зашифрованным, отключить можно в один клик. В демо недоступно.", "On the live site this opens the official hh OAuth. The token is stored encrypted and you can disconnect in one click. Not available in the demo.")}</p>
        <div className="row end" style={{ marginTop: 18 }}><button className="btn" onClick={() => setHh(false)}>{t("Понятно", "Got it")}</button></div>
      </Modal>
    </div>
  );
}
