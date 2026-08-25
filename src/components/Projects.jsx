import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { projects } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.project-card', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" className="section" ref={rootRef}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">04 — Selected Work</div>
          <h2 className="section-title">Recent projects.</h2>
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card" key={p.title}>
              <div className="project-index">{String(i + 1).padStart(2, '0')}</div>
              <div className="project-tag">{p.tag}</div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>
              <div className="project-stack">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
