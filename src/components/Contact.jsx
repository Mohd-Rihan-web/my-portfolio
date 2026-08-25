import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { contactInfo } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '')

const initialForm = { name: '', email: '', message: '', company: '' } // "company" = honeypot

function validate(values) {
  const errors = {}
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Enter your name.'
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  }
  return errors
}

export default function Contact() {
  const rootRef = useRef(null)
  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-big, .contact-links, .field, .submit-btn', {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate({ ...values }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(values)
    setErrors(validation)
    setTouched({ name: true, email: true, message: true })

    if (Object.keys(validation).length > 0) return

    // honeypot: bots fill hidden fields, humans don't
    if (values.company) {
      setStatus({ state: 'ok', message: 'Thanks — your message has been sent.' })
      setValues(initialForm)
      return
    }

    setStatus({ state: 'sending', message: '' })
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus({ state: 'ok', message: "Thanks — your message is on its way. I'll reply soon." })
      setValues(initialForm)
      setTouched({})
    } catch (err) {
      setStatus({
        state: 'err',
        message: err.message || 'Could not send your message. Please try again later.',
      })
    }
  }

  return (
    <section id="contact" className="section" ref={rootRef}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">05 — Contact</div>
        </div>
        <div className="contact-grid">
          <div>
            <h2 className="contact-big">
              Let's build
              <br />
              something.
            </h2>
            <div className="contact-links">
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>{contactInfo.phone}</a>
              <span>{contactInfo.location}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot field — hidden from real users, catches simple bots */}
            <div className="field-hp" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.company}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.name && errors.name)}
              />
              {touched.name && errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.message && errors.message)}
              />
              {touched.message && errors.message && (
                <div className="field-error">{errors.message}</div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            {status.message && (
              <div className={`form-status ${status.state === 'ok' ? 'ok' : 'err'}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
