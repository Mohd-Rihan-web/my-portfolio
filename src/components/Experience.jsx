import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { experience } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.exp-row')
      rows.forEach((row) => {
        gsap.to(row, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="section" ref={rootRef}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">03 — Experience</div>
          <h2 className="section-title">Where I've worked.</h2>
        </div>
        <div className="exp-list">
          {experience.map((job) => (
            <div className="exp-row" key={job.role + job.period}>
              <div className="exp-period">{job.period}</div>
              <div>
                <h3 className="exp-role">{job.role}</h3>
                <div className="exp-company">{job.company}</div>
                <ul className="exp-points">
                  {job.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
