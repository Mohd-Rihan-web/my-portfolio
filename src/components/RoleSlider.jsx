import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { roles } from '../data/content.js'

export default function RoleSlider() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    // width of a single set (half the track, since content is duplicated)
    const setWidth = track.scrollWidth / 2

    const tween = gsap.to(track, {
      x: -setWidth,
      duration: 22,
      ease: 'none',
      repeat: -1,
    })

    const onEnter = () => gsap.to(tween, { timeScale: 0.25, duration: 0.4 })
    const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.4 })

    const marquee = track.closest('.marquee')
    marquee.addEventListener('mouseenter', onEnter)
    marquee.addEventListener('mouseleave', onLeave)

    return () => {
      tween.kill()
      marquee.removeEventListener('mouseenter', onEnter)
      marquee.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const doubled = [...roles, ...roles]

  return (
    <div className="marquee">
      <div className="marquee-track" ref={trackRef}>
        {doubled.map((role, i) => (
          <div className="marquee-item" key={i}>
            <strong>{role}</strong>
            <span className="marquee-dot">●</span>
          </div>
        ))}
      </div>
    </div>
  )
}
