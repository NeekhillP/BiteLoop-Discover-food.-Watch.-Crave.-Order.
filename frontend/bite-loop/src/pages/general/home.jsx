import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import FoodReel from '../../components/FoodReel.jsx'
import '../../styles/feed.css'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

export default function Home() {
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [needsLogin, setNeedsLogin] = useState(false)
  const [retry, setRetry] = useState(0)
  const feedRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    axios.get(`${API_URL}/api/food/`, {
      withCredentials: true, signal: controller.signal, timeout: 15000,
    }).then(({ data }) => {
      if (controller.signal.aborted) return
      if (!Array.isArray(data.foodItems)) throw new Error('Invalid food response')
      setFoodItems(data.foodItems)
    }).catch(err => {
      if (controller.signal.aborted) return
      const unauthorized = err.response?.status === 401
      setNeedsLogin(unauthorized)
      setError(unauthorized ? 'Log in to discover food on BiteLoop.' : 'Couldn’t load the videos. Please try again.')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [retry])

  function retryFeed() {
    setError('')
    setNeedsLogin(false)
    setLoading(true)
    setRetry(value => value + 1)
  }

  function handleKeyDown(event) {
    if (event.target !== event.currentTarget) return
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) {
      event.preventDefault()
      const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 : -1
      event.currentTarget.scrollBy({ top: direction * event.currentTarget.clientHeight, behavior: 'auto' })
    }
  }

  if (loading || error || !foodItems.length) {
    return (
      <main className="feed-state" aria-busy={loading}>
        <p className="feed-state-brand">BiteLoop.</p>
        <h1>{loading ? 'Finding your next bite…' : error ? 'Your feed is waiting.' : 'No bites just yet.'}</h1>
        <p role={error ? 'alert' : 'status'}>{error || (loading ? 'Loading videos.' : 'Food videos will appear here when partners share them.')}</p>
        {!loading && (needsLogin
          ? <Link className="feed-state-action" to="/user/login">Log in</Link>
          : <button className="feed-state-action" type="button" onClick={retryFeed}>Try again</button>)}
      </main>
    )
  }

  return (
    <main className="food-feed" ref={feedRef} tabIndex={0} aria-label="Food video feed. Scroll or use arrow keys for the next video." onKeyDown={handleKeyDown}>
      {foodItems.map(food => <FoodReel key={food._id} food={food} feedRef={feedRef} />)}
    </main>
  )
}
