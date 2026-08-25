const nodemailer = require('nodemailer')

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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) }
  }

  const { errors, clean } = validateBody(body)
  if (errors.length > 0) {
    return { statusCode: 400, body: JSON.stringify({ error: errors.join(' ') }) }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

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

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('SMTP send failed:', err.message)
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Could not send email right now. Please try again later.' }),
    }
  }
}