import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const barRef = useRef(null)
  const curtainRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    const counter = { val: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        // hold briefly on 100, then wipe up with the accent curtain
        gsap.timeline({ onComplete: onDone })
          .to(curtainRef.current, { scaleY: 1, duration: 0.55, ease: 'power4.inOut' })
          .to(rootRef.current, { autoAlpha: 0, duration: 0.01 })
          .to(curtainRef.current, {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 0.65,
            ease: 'power4.inOut',
            delay: 0.05,
          })
      },
    })

    tl.to(counter, {
      val: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.floor(counter.val)),
    })
    tl.to(barRef.current, { width: '100%', duration: 1.8, ease: 'power2.inOut' }, '<')

    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div ref={rootRef} className="preloader">
        <div className="preloader-label">
          Mohd Rihan
          <br />
          Frontend / WordPress Dev
        </div>
        <div className="preloader-count">{String(count).padStart(2, '0')}</div>
        <div className="preloader-bar-track">
          <div ref={barRef} className="preloader-bar-fill" />
        </div>
      </div>
      <div ref={curtainRef} className="preloader-curtain" />
    </>
  )
}
