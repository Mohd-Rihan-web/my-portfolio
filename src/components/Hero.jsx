import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import RoleSlider from './RoleSlider.jsx'

export default function Hero({ ready }) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const lines = rootRef.current.querySelectorAll('.hero-title .line span')
      gsap.set(lines, { yPercent: 120 })
      gsap
        .timeline({ delay: 0.15 })
        .to(lines, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.08,
        })
        .from(
          '.hero-eyebrow, .hero-sub, .hero-scroll',
          { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
          '-=0.7'
        )
        .from('.marquee', { autoAlpha: 0, duration: 0.6 }, '-=0.5')
    }, rootRef)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="hero-inner">
        <div className="hero-eyebrow">Meerut, India — Available for freelance &amp; full-time roles</div>
        <h1 className="hero-title">
          <span className="line">
            <span>MOHD RIHAN</span>
          </span>
        </h1>
        <p className="hero-sub">
          I design and build fast, responsive interfaces — bridging custom React.js frontends
          with WordPress and headless CMS backends.
        </p>
      </div>

      <RoleSlider />

      <div className="hero-scroll">
        <span className="hero-scroll-line" />
        Scroll
      </div>
    </section>
  )
}
