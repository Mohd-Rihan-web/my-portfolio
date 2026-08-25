import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'

const app = express()

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: '20kb' }))

// Basic abuse protection: 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again later.' },
})

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateBody(body) {
  const errors = []
  const name = (body.name || '').toString().trim()
  const email = (body.email || '').toString().trim()
  const message = (body.message || '').toString().trim()

  if (name.length < 2 || name.length > 100) errors.push('Invalid name.')
  if (!emailRe.test(email)) errors.push('Invalid email address.')
  if (message.length < 10 || message.length > 5000) errors.push('Invalid message.')

  return { errors, clean: { name, email, message } }
}

// Nodemailer transporter configured for any standard SMTP provider
// (Gmail app password, SendGrid, Mailgun, Amazon SES SMTP, your own mail server, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587/25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { errors, clean } = validateBody(req.body)

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') })
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER,
      replyTo: clean.email,
      subject: `New portfolio message from ${clean.name}`,
      text: `Name: ${clean.name}\nEmail: ${clean.email}\n\n${clean.message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(clean.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(clean.email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(clean.message).replace(/\n/g, '<br/>')}</p>
      `,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('SMTP send failed:', err.message)
    res.status(502).json({ error: 'Could not send email right now. Please try again later.' })
  }
})

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Contact API listening on http://localhost:${PORT}`))
