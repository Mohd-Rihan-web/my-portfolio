import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { education } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-text p', {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      })
      gsap.from('.about-meta > *', {
        autoAlpha: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section" ref={rootRef}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">01 — About</div>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I'm a frontend and WordPress developer based in Meerut, India, with over a year
              building responsive, user-friendly websites and web applications. I'm comfortable
              on both sides of the stack that matters for the web: custom React.js interfaces and
              custom WordPress theming with ACF-driven content.
            </p>
          </div>
          <div className="about-meta">
            <dl>
              <dt>Focus</dt>
              <dd>React.js, WordPress, Headless CMS</dd>
              <dt>Based in</dt>
              <dd>Meerut, India</dd>
              <dt>Status</dt>
              <dd>Open to freelance &amp; full-time work</dd>
            </dl>
            <div className="about-edu">
              <dt style={{ display: 'block', marginBottom: 6 }}>{education.degree}</dt>
              <dd style={{ margin: 0 }}>
                {education.school} · {education.period}
              </dd>
            </div>
          </div>
        </div>
         <a
          href="https://ik.imagekit.io/rihan/Mohd_Rihan_Resume.pdf"
          download="Mohd_Rihan_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="download-cv"
        >
          Download CV
        </a>
      </div>
    </section>
  )
}
