# Jewelry Store

Коротко: монорепо з `backend` (NestJS) та `frontend` (Vite + React).

## Структура

- `backend/` — NestJS API
- `frontend/` — React + Vite frontend

## Prerequisites

- Node.js 18+ (рекомендується)
- npm
- Git

## Локальний запуск

1) Клонувати репозитарій

```bash
git clone <repo-url>
cd Jewelry
```

2) Запуск бекенду

```bash
cd backend
npm ci
# створіть .env або налаштуйте змінні оточення
npm run start:dev
```

3) Запуск фронтенду

```bash
cd frontend
npm ci
npm run dev
```

Відкрити фронтенд: http://localhost:5173
API слухає порт `process.env.PORT || 3000` і має префікс `/api`.

## Збірка для продакшен

- Frontend:

```bash
cd frontend
npm ci
npm run build
# згенерується dist/ у frontend/dist
```

- Backend:

```bash
cd backend
npm ci
npm run build
# потім запустити: npm run start:prod
```

## Environment Variables (важливо)

Налаштуйте ці змінні в Render / локально (не комітьте секрети в git):

- Backend (в `backend/.env`):
  - `DATABASE_URL` або `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`
  - `CLIENT_URL` — URL фронтенду (наприклад `https://your-site.onrender.com`)
  - `JWT_SECRET`
- Frontend (для збірки Vite):
  - `VITE_BACKEND_URL` — базовий URL для API (наприклад `https://api.example.com`)

> У репозиторії є приклад `.env` в `backend/.env` — не пуште його в публічний репо.

## Деплой на Render (Static Site + Web Service)

1) Frontend: Static Site
- Root Directory: `frontend` (або залишити корінь і вказати publish `frontend/dist`)
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist` (якщо Root = `frontend`) або `frontend/dist` (якщо Root = repo root)

2) Backend: Web Service
- Root Directory: `backend`
- Build Command: `npm ci && npm run build`
- Start Command: `npm run start:prod` (або `node dist/main`)
- Render автоматично передає `PORT` — Nest слухає `process.env.PORT`.
- Додайте Environment secrets в Render: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, інші.

3) CORS / CLIENT_URL
- У `backend/src/main.ts` встановлено CORS з `origin: process.env.CLIENT_URL`. Тому встановіть `CLIENT_URL` на URL вашого фронтенду.

## Швидкі поради

- Помилка на Render `Publish directory .dist does not exist` означає, що в налаштуваннях вказано `.dist` з крапкою — має бути `dist` або `frontend/dist`.
- Якщо хочете IaC, можна додати `render.yaml` (можу згенерувати за потреби).

