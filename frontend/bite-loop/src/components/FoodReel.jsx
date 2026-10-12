import { useEffect, useRef, useState } from 'react'

export default function FoodReel({ food, feedRef, onVisitStore }) {
  const cardRef = useRef(null)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const partnerId = typeof food.foodPartner === 'object' ? food.foodPartner?._id : food.foodPartner
  const storeName = typeof food.foodPartner === 'object' ? food.foodPartner?.name : null

  useEffect(() => {
    const video = videoRef.current
    let visible = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    function syncPlayback() {
      if (visible && !document.hidden && !reducedMotion.matches) {
        video.play().catch(() => { /* The play button remains available if autoplay is blocked. */ })
      } else video.pause()
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.75
      syncPlayback()
    }, { root: feedRef.current, threshold: [0, 0.75] })
    observer.observe(cardRef.current)
    document.addEventListener('visibilitychange', syncPlayback)
    reducedMotion.addEventListener('change', syncPlayback)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      reducedMotion.removeEventListener('change', syncPlayback)
      video.pause()
    }
  }, [feedRef])

  function togglePlayback() {
    const video = videoRef.current
    if (video.paused) video.play().catch(() => setPlaying(false))
    else video.pause()
  }

  return (
    <article className="food-reel" ref={cardRef} aria-label={food.name || 'Food video'}>
      <video className="food-reel-video" ref={videoRef} src={food.video} poster={food.poster} loop muted={muted} playsInline preload="metadata"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} aria-label={food.name || 'Food video'} />
      <div className="food-reel-shade" aria-hidden="true" />
      <header className="food-reel-header"><span className="food-reel-brand">BiteLoop.</span><span className="food-reel-label">For you</span></header>
      {failed && <p className="food-reel-error" role="status">This video is unavailable. Scroll to the next bite.</p>}
      <div className="food-reel-bottom">
        <div className="food-reel-controls">
          <button type="button" onClick={togglePlayback} disabled={failed} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" onClick={() => setMuted(value => !value)} disabled={failed} aria-pressed={!muted} aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted ? 'Sound off' : 'Sound on'}</button>
        </div>
        <h2 className="food-reel-name">{food.name}</h2>
        <p className="food-reel-details">
          {storeName && <span>{storeName}</span>}
          {typeof food.price === 'number' && <span>Price: {food.price.toLocaleString('en-US')}</span>}
        </p>
        <p className="food-reel-description">{food.description || 'Discover something delicious.'}</p>
        <button className="food-reel-store" type="button" onClick={() => onVisitStore?.(partnerId)} disabled={!onVisitStore || !partnerId} title={!onVisitStore ? 'Store page coming soon' : undefined}>
          Visit store<span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  )
}
