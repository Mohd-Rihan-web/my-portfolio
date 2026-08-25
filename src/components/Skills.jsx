import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { skills } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-cat', {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" className="section" ref={rootRef}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">02 — Toolkit</div>
          <h2 className="section-title">What I build with.</h2>
        </div>
        <div className="skills-grid">
          {Object.entries(skills).map(([cat, items]) => (
            <div className="skills-cat" key={cat}>
              <h3>{cat}</h3>
              <div className="skills-tags">
                {items.map((s) => (
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
