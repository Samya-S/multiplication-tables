Multiplication Tables Test is a small Next.js app that quizzes students on 20 multiplication questions, keeps per-question timing, and sends a summary report (plus device info) by email.

## Features
- Pick which tables (2–20) to practice; defaults to 6–9 and 12–19 selected.
- 20 randomized questions per run with a per-question timer and pause/resume.
- On-submit feedback plus final score, average time, copy/share to clipboard or WhatsApp.
- Optional email delivery of results via Nodemailer, including client/device metadata and IP.

## Stack
- Next.js 15 + React 19 (App Router, client component UI).
- Tailwind CSS for styling.
- Nodemailer + API route for sending emails.
- Axios for client → API calls.

## Prerequisites
- Node.js 18+ (matches Next.js requirement).
- Gmail credentials for sending email (or adjust transporter config).

## Setup
1) Install dependencies
```bash
npm install
```

2) Configure environment variables in `.env.local`
```bash
AUTH_EMAIL=your_gmail_address@gmail.com      # Gmail username
AUTH_PASS=your_app_password_or_token         # Gmail app password (recommended)
SENDER_EMAIL=your_gmail_address@gmail.com    # From address
RECEIVER_EMAIL=destination@example.com       # Where results are sent
```
The API route lives at `app/api/sendMail/route.js` and uses these variables directly. If you use a non-Gmail provider, update the transporter config.

3) Run the development server
```bash
npm run dev
```
Open `http://localhost:3000`.

## Scripts
- `npm run dev` – start dev server.
- `npm run build` – build for production.
- `npm run start` – run the production build.
- `npm run lint` – Next.js ESLint checks.

## Notes on data collected
- When results are sent, the app gathers: platform, permissions status, language, timezone, user agent, network info, screen details, storage info, CPU cores, and the client IP (via `server/actions/get-ip.js`). Adjust or remove these fields if you do not want them emailed.

## Project structure
- `app/page.js` – quiz UI and client logic.
- `app/api/sendMail/route.js` – email API endpoint.
- `server/actions/get-ip.js` – helper to read forwarded IP header.
