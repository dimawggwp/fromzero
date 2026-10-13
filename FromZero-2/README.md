# FromZero (v4, редизайн «Огненная зона» по референсу rammstein-firezone)
Сайт для студентов Казахстана и СНГ: от «у меня ничего нет» до первого собеседования. Название на обоих языках: **FromZero**.
Архитектура v2 сохранена: `src/client` (один код для сайта и демо `index.html`), `platform.js` (demo / live), `src/app/api` (ИИ, hh, аккаунт), `src/lib` (hh, шифрование, Groq, лимиты, Supabase). Ключ состояния `rsn-state-v2` не менялся: данные пользователей не теряются.

## Запуск
1. `npm install`
2. `cp .env.example .env.local` и заполни. **Ключи из старого .env.local перевыпусти** (Supabase → Settings → API → Reset service_role / Rotate; Groq → API Keys), если файл хоть раз попадал в чат, архив или git.
3. Supabase → SQL Editor → выполни `supabase/schema.sql` (идемпотентный, можно повторно).
4. `npm run dev` → http://localhost:3000. Без ключей: `npm run demo`.
5. Тесты: `npm test`, `npm run e2e`. Проверка утечек: `npm run check:secrets` (запускается и перед `build`).

## Безопасность ключей
- В браузер попадают только `NEXT_PUBLIC_SUPABASE_URL` и anon-ключ (публичные по задумке, данные закрыты RLS).
- `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `TOKEN_ENC_KEY`, `AUTH_SECRET`, `HH_CLIENT_SECRET` читаются только в `src/lib/env.ts` с `import "server-only"`: импорт в клиент ломает сборку.
- `scripts/check-secrets.mjs` валит сборку, если секрет найден в клиентском коде или в `NEXT_PUBLIC_*`.
- CSP + HSTS + X-Frame-Options в `next.config.mjs`, source maps в проде выключены.
- Токены hh: AES-256-GCM; OAuth state подписан HMAC, хранится в httpOnly cookie, живёт 10 минут.
- Лимиты: по IP (память) и дневные по пользователю (атомарная `bump_usage` в Postgres).

## hh.ru (по открытой документации github.com/hhru/api)
- Поиск `GET https://api.hh.ru/vacancies` и `GET /vacancies/{id}` **анонимные**: работают сразу, нужен только `HH_USER_AGENT` (формат `Название/версия (почта)`). Регионы: 40 Казахстан, 160 Алматы, 159 Астана, 205 Шымкент.
- OAuth соискателя: `https://hh.ru/oauth/authorize` → `POST https://api.hh.ru/token`. Нужны `HH_CLIENT_ID/SECRET` после одобрения заявки на dev.hh.ru.
- Отклики (`POST /negotiations`) с 15.12.2025 закрыты для сторонних приложений: `HH_APPLY_ENABLED=false`, письмо копируется и вакансия открывается на hh.

## Вход (Supabase Auth)
Google: Providers → Google, redirect `https://<project>.supabase.co/auth/v1/callback`; в URL Configuration добавь `http://localhost:3000/auth/callback` и боевой домен. Почта: SMTP Resend (`smtp.resend.com:465`, user `resend`), в шаблоне `{{ .Token }}`. Телефон: Providers → Phone + Twilio/Vonage.

## Контент
«Состав» на лендинге: пародийные первые резюме по открытым биографиям, портреты сгенерированы ИИ, дисклеймер на странице. Фото мини-проектов: `src/assets/j-<id>.webp` (замени на свои при желании, имена по id проекта).

## v4
- Новый минималистичный логотип: перечёркнутый ноль, черта выходит за контур (`src/client/Logo.jsx`).
- Лендинг-лонгрид: прелоадер с %, гигантский красный логотип, сцены-коллажи с репликами, досье «Состава», направления-пластинки, сетлист, финал в огне.
- Живые вакансии: `src/client/hh.js` (открытый API hh.ru, без ключей). Если hh недоступен, показываются примеры с пометкой.
- Демо-сборка: `npm run build:demo` → `dist/index.html`.
- Ключи: только в `.env.local` (в .gitignore). В клиентском коде и index.html секретов нет.

## v5 · вход, регистрация и кабинет в стиле «Огненной зоны»
- Вход/регистрация (`src/client/screens/Auth.jsx`): вкладки «Регистрация / Вход», Google, почта, телефон + 6-значный код. Демо: любой код; боевой режим: Supabase Auth через `platform.live.js`.
- После регистрации «Саундчек» (`Onboarding.jsx`): имя, направление-пластинки, курс, навыки, опыт → выдаётся пропуск за кулисы (ALL ACCESS).
- Кабинет: Бэкстейдж (сетлист тура, пропуск, значки), Резюме (ИИ-пункты, оценка 0–100, версии, 3 шаблона, PDF), Мини-проекты, Вакансии hh (свайпы на телефоне), Отклики, Тренажёр STAR, Кабинет (язык, тема «Огонь/Пепел», hh, JSON, выход, удаление).
- Все функции v3 перенесены; ключ `rsn-state-v2` прежний, данные пользователей сохраняются.
- «Состав» на лендинге: семь одинаковых досье в один ряд, на десктопе ряд едет по горизонтали при скролле; исправлено появление больших заголовков (раньше не проявлялись).
- `npm run build:demo` подменяет `platform.live.js` на заглушку, Supabase для демо не нужен.
- В архиве только клиентская часть и конфиги, которые были присланы: папки `src/app`, `src/lib`, `supabase`, `scripts/check-secrets.mjs` возьми из своего репозитория.
