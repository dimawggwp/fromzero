// FromZero · вход и регистрация. Без паролей: Google, почта или телефон + одноразовый код.
// Демо: любой 6-значный код, данные не покидают браузер. Боевой режим: Supabase Auth (platform.live.js).
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import platform from "../platform.js";
import { cx } from "../store.js";
import { useI18n } from "../i18n.js";
import { Dialog, LangSwitch } from "../ui.jsx";
import { Mark } from "../Logo.jsx";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

function Otp({ value, onChange }) {
  const refs = useRef([]);
  const cells = value.padEnd(6, " ").slice(0, 6).split("");
  const set = (i, raw) => {
    const d = raw.replace(/\D/g, "");
    if (d.length > 1) { onChange(d.slice(0, 6)); refs.current[Math.min(5, d.length)]?.focus(); return; }
    const a = value.padEnd(6, " ").split("");
    a[i] = d || " ";
    onChange(a.join("").replace(/\s+$/, ""));
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <div className="otp" role="group" aria-label="Code">
      {cells.map((c, i) => (
        <motion.input key={i} ref={(el) => (refs.current[i] = el)} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={6} aria-label={`${i + 1}`}
          className={cx(c.trim() && "filled")} value={c.trim()} onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => e.key === "Backspace" && !c.trim() && i > 0 && refs.current[i - 1]?.focus()} autoFocus={i === 0}
          animate={c.trim() ? { y: [0, -6, 0] } : { y: 0 }} transition={{ duration: 0.25 }} />
      ))}
    </div>
  );
}

const fmtPhone = (p) => { const d = p.replace(/\D/g, "").slice(0, 10); return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(" "); };

export default function AuthModal({ open, mode: initialMode = "signup", onClose, onAuthed, isMobile }) {
  const { t } = useI18n();
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState("choose");
  const [kind, setKind] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { if (open) { setMode(initialMode || "signup"); setStep("choose"); setCode(""); setErr(""); } }, [open, initialMode]);

  const go = (s) => { setErr(""); setStep(s); };
  const target = kind === "email" ? email.trim() : "+7" + phone.replace(/\D/g, "");
  const google = async () => {
    setBusy(true); setErr("");
    const r = await platform.auth.google().catch(() => ({ error: true }));
    setBusy(false);
    if (r?.user) onAuthed(r.user, mode); else if (r?.error) setErr(t("Не получилось войти через Google", "Google sign-in failed"));
  };
  const send = async () => {
    setBusy(true); setErr("");
    const r = kind === "email" ? await platform.auth.sendEmail(email.trim()) : await platform.auth.sendPhone(target);
    setBusy(false);
    if (r.ok) { setCode(""); go("code"); } else setErr(kind === "email" ? t("Проверь адрес почты", "Check the email address") : t("Нужно 10 цифр после +7", "Enter 10 digits after +7"));
  };
  const verify = async () => {
    setBusy(true); setErr("");
    const r = await platform.auth.verify(kind, target, code);
    setBusy(false);
    if (r.user) onAuthed({ ...r.user, label: r.user.label || target }, mode); else setErr(t("Код не подошёл. Попробуй ещё раз", "That code didn't work. Try again"));
  };
  const spin = <Loader2 size={18} className="spin" />;
  const Back = ({ to }) => <button type="button" className="btn ghost square" onClick={() => go(to)} aria-label={t("Назад", "Back")}><ArrowLeft size={18} /></button>;
  const signup = mode === "signup";

  return (
    <Dialog isMobile={isMobile} open={open} onClose={onClose} title={signup ? t("Регистрация", "Sign up") : t("Вход", "Sign in")}>
      <div className="auth">
        <div className="auth-ticket" aria-hidden="true">
          <Mark size={30} />
          <span className="mono">{signup ? "ADMIT ONE · NEW" : "ADMIT ONE · RETURN"}</span>
          <span className="script">{signup ? t("первый выход на сцену", "your first time on stage") : t("с возвращением", "welcome back")}</span>
        </div>
        {step === "choose" && (
          <div className="seg auth-seg" role="tablist">
            {[["signup", t("Регистрация", "Sign up")], ["signin", t("Вход", "Sign in")]].map(([m, l]) => (
              <button key={m} role="tab" aria-selected={mode === m} aria-pressed={mode === m} onClick={() => setMode(m)}>{l}</button>
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -26 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
            {step === "choose" && (
              <div className="stack">
                <p className="muted">{signup ? t("Один аккаунт: резюме, проекты и отклики сохраняются и открываются на любом устройстве.", "One account: resumes, projects and applications are saved on every device.") : t("Войди тем же способом, что и при регистрации.", "Use the same method you signed up with.")}</p>
                {[
                  { k: "google", ic: <GoogleIcon />, l: t("Продолжить с Google", "Continue with Google"), on: google },
                  { k: "email", ic: <Mail size={20} />, l: t("По почте", "With email"), on: () => { setKind("email"); go("email"); } },
                  { k: "phone", ic: <Phone size={20} />, l: t("По номеру телефона", "With phone number"), on: () => { setKind("phone"); go("phone"); } },
                ].map((o, i) => (
                  <motion.button key={o.k} className="auth-opt" onClick={o.on} disabled={busy} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.07 }}>
                    <span className="ao-ic">{o.ic}</span><span className="ao-l">{o.l}</span>{busy && o.k === "google" ? spin : <ArrowRight size={20} className="ao-arr" />}
                  </motion.button>
                ))}
                {err && <p className="err">{err}</p>}
                <p className="note"><ShieldCheck size={18} />{t("Без паролей: присылаем одноразовый код. Аккаунт удаляется в один клик.", "No passwords: we send a one-time code. Delete your account in one click.")}</p>
              </div>
            )}
            {step === "email" && (
              <form className="stack" onSubmit={(e) => { e.preventDefault(); send(); }}>
                <div className="field"><label htmlFor="au-email">{t("Почта", "Email")}</label>
                  <input id="au-email" type="email" autoComplete="email" placeholder="aidana@mail.kz" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus /></div>
                <p className="muted small">{t("Пришлём 6-значный код и ссылку для входа.", "We'll send a 6-digit code and a sign-in link.")}</p>
                {err && <p className="err">{err}</p>}
                <div className="row"><Back to="choose" /><button className="btn grow" disabled={busy || !email}>{busy ? spin : t("Получить код", "Send code")}</button></div>
              </form>
            )}
            {step === "phone" && (
              <form className="stack" onSubmit={(e) => { e.preventDefault(); send(); }}>
                <div className="field"><label htmlFor="au-phone">{t("Телефон", "Phone")}</label>
                  <div className="input-pre"><span>+7</span><input id="au-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="701 234 56 78" value={fmtPhone(phone)} onChange={(e) => setPhone(e.target.value)} autoFocus /></div></div>
                <p className="muted small">{t("Код придёт в SMS. Казахстан и Россия (+7).", "The code arrives by SMS. Kazakhstan and Russia (+7).")}</p>
                {err && <p className="err">{err}</p>}
                <div className="row"><Back to="choose" /><button className="btn grow" disabled={busy || phone.replace(/\D/g, "").length < 10}>{busy ? spin : t("Получить код", "Send code")}</button></div>
              </form>
            )}
            {step === "code" && (
              <form className="stack" onSubmit={(e) => { e.preventDefault(); verify(); }}>
                <p>{t("Код отправлен на", "Code sent to")} <b>{kind === "email" ? email : "+7 " + fmtPhone(phone)}</b></p>
                <Otp value={code} onChange={setCode} />
                {platform.mode === "demo" && <p className="muted small">{t("Демо: подойдёт любой 6-значный код. Данные не покидают браузер.", "Demo: any 6-digit code works. Nothing leaves your browser.")}</p>}
                {err && <p className="err">{err}</p>}
                <div className="row"><Back to={kind} /><button className="btn grow" disabled={busy || code.replace(/\s/g, "").length < 6}>{busy ? spin : signup ? t("Создать аккаунт", "Create account") : t("Войти", "Sign in")}</button></div>
                <button type="button" className="link" onClick={send} disabled={busy}>{t("Отправить код ещё раз", "Resend code")}</button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="row between auth-foot"><span className="muted small">{t("Язык интерфейса", "Interface language")}</span><LangSwitch /></div>
      </div>
    </Dialog>
  );
}
