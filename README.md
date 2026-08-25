# Mohd Rihan — Portfolio

An awwwards-style, scroll-driven portfolio built with **React + Vite + GSAP** (ScrollTrigger),
plus a small **Express + Nodemailer** backend so the contact form sends real email over SMTP.

## What's inside

- Preload animation (percentage counter → curtain wipe reveal)
- Big center hero headline with a text reveal-in
- Infinite marquee slider cycling your roles (Web / Frontend / UI-UX / WordPress Developer) — slows on hover
- Scroll-triggered reveals for About, Skills, Experience and Projects
- A contact form with real client-side validation (name, email format, message length, honeypot
  anti-spam field) that POSTs to a Node/Express API which sends mail via SMTP with Nodemailer
- Fully responsive layout (desktop → mobile), with a mobile nav overlay
- Respects `prefers-reduced-motion`

## Project structure

```
portfolio/
├─ src/               React frontend (Vite)
│  ├─ components/      Preloader, Nav, Hero, RoleSlider, About, Skills,
│  │                    Experience, Projects, Contact, Footer
│  └─ data/content.js  All resume text lives here — edit this file to update content
├─ server/             Express + Nodemailer SMTP API for the contact form
└─ index.html
```

## 1. Run the frontend

```bash
npm install
cp .env.example .env      # VITE_API_URL should point at your backend
npm run dev                # http://localhost:5173
```

## 2. Run the contact-form backend (SMTP)

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_TO_EMAIL=saifirihan952@gmail.com
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
```

**If you use Gmail:** you can't use your normal password — turn on 2-Step Verification, then
create an [App Password](https://myaccount.google.com/apppasswords) and use that as `SMTP_PASS`.
Any other SMTP provider (SendGrid, Mailgun, Zoho, Amazon SES SMTP, your host's own mail server)
works the same way — just swap in their host/port/user/pass.

```bash
npm start                  # http://localhost:4000
```

With both running, submitting the contact form sends a real email to `CONTACT_TO_EMAIL`, with
`replyTo` set to the visitor's address so you can hit "reply" directly.

## 3. Editing content

Everything from your resume — roles, skills, experience, projects, education, contact info —
lives in `src/data/content.js`. Update that one file and the whole site updates.

## 4. Deploying

- **Frontend:** `npm run build` → deploy the `dist/` folder to Vercel, Netlify, or Cloudflare
  Pages. Set `VITE_API_URL` (as an env var on the host) to your deployed backend's URL.
- **Backend:** deploy `server/` to Render, Railway, Fly.io, or any Node host. Set the SMTP env
  vars there, and set `CLIENT_ORIGIN` to your deployed frontend's URL (for CORS).

## Notes

- The contact API rate-limits to 5 submissions per 15 minutes per IP, and includes a hidden
  honeypot field to filter simple bots.
- Colors, type and spacing are all driven by CSS variables at the top of `src/index.css` — change
  `--bg`, `--accent`, `--accent-2`, etc. there to re-theme the whole site.
