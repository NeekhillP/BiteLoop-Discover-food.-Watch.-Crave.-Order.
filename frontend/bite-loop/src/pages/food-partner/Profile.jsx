import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import '../../styles/profile.css'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

export default function Profile() {
  const { partnerId } = useParams()
  return <PartnerProfile key={partnerId} partnerId={partnerId} />
}

function PartnerProfile({ partnerId }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const gridRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    axios.get(`${API_URL}/api/food/partner/${partnerId}`, {
      withCredentials: true, signal: controller.signal, timeout: 15000,
    }).then(({ data }) => {
      if (controller.signal.aborted) return
      if (!data.foodPartner || !Array.isArray(data.foodItems)) throw new Error('Invalid store response')
      setProfile(data)
    }).catch(err => {
      if (controller.signal.aborted) return
      setStatus(err.response?.status)
      setError(err.response?.status === 401 ? 'Log in to see this store and its food videos.'
        : err.response?.status === 404 ? 'This store could not be found.'
        : 'Could not load this store. Please try again.')
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [partnerId, attempt])

  function retry() {
    setLoading(true)
    setError('')
    setStatus(null)
    setAttempt(value => value + 1)
  }

  function handlePlay(event) {
    gridRef.current.querySelectorAll('video').forEach(video => {
      if (video !== event.currentTarget) video.pause()
    })
  }

  const partner = profile?.foodPartner
  const initials = partner?.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()

  return (
    <main className="partner-page">
      <nav className="partner-nav" aria-label="Store navigation">
        <Link className="partner-brand" to="/">BiteLoop.</Link>
        <Link className="partner-back" to="/">← Back to feed</Link>
      </nav>
      {loading || error ? (
        <section className="partner-state" aria-busy={loading}>
          <h1>{loading ? 'Opening the kitchen…' : 'Store unavailable'}</h1>
          <p role={error ? 'alert' : 'status'}>{error || 'Loading the store and its food videos.'}</p>
          {error && (status === 401
            ? <Link className="partner-action" to="/user/login">Log in</Link>
            : status !== 404 && <button className="partner-action" onClick={retry} type="button">Try again</button>)}
        </section>
      ) : (
        <>
          <header className="partner-header">
            <div className="partner-identity">
              <div className="partner-avatar" aria-hidden="true">{initials}</div>
              <div className="partner-info">
                <p className="partner-eyebrow">Food partner</p>
                <h1>{partner.name}</h1>
                <p className="partner-address">{partner.address}</p>
              </div>
            </div>
            <div className="partner-stat"><strong>{profile.totalMeals}</strong><span>{profile.totalMeals === 1 ? 'meal on the menu' : 'meals on the menu'}</span></div>
          </header>
          <section className="partner-menu" aria-labelledby="partner-menu-title">
            <div className="partner-menu-heading"><h2 id="partner-menu-title">From our kitchen</h2><span>Food videos</span></div>
            {!profile.foodItems.length ? <p className="partner-empty">This kitchen hasn’t shared any food videos yet. Check back soon.</p> : (
              <div className="partner-grid" ref={gridRef}>
                {profile.foodItems.map(food => <ProfileFoodCard key={food._id} food={food} onPlay={handlePlay} />)}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}

function ProfileFoodCard({ food, onPlay }) {
  const [failed, setFailed] = useState(false)
  return (
    <article className="partner-food-card">
      <div className="partner-video-frame">
        <video src={food.video} controls playsInline preload="metadata" onPlay={onPlay} onError={() => setFailed(true)} aria-label={`${food.name} video`} />
        {failed && <p className="partner-video-error" role="status">Video unavailable</p>}
      </div>
      <div className="partner-food-caption">
        <h3>{food.name}</h3>
        {typeof food.price === 'number' && <p className="partner-price">Price: {food.price.toLocaleString('en-US')}</p>}
        {food.description && <p className="partner-food-description">{food.description}</p>}
      </div>
    </article>
  )
}
