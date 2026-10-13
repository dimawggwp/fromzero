// FromZero v4 · оболочка. Лендинг переоформлен под «Огненную зону»; экраны кабинета подключаются в следующей итерации.
import React, { useState } from "react";
import Landing from "./landing/Landing.jsx";
import { Announcer, Modal } from "./ui.jsx";
import { useI18n } from "./i18n.js";

export default function App() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Landing onStart={() => setOpen(true)} onSignIn={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} title={t("Кабинет на ремонте", "Cabinet in progress")}>
        <p>{t("Кабинет (резюме, портфолио, вакансии, тренажёр) переоформляется под новый дизайн. Твои данные сохранены.", "The cabinet is being redesigned. Your data is safe.")}</p>
        <button className="btn" onClick={() => setOpen(false)}>OK</button>
      </Modal>
      <Announcer />
    </>
  );
}
