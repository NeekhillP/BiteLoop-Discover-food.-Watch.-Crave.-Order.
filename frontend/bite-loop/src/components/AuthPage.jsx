import { Link } from 'react-router-dom'
import '../styles/auth.css'

export default function AuthPage({ role, mode }) {
  const isPartner = role === 'food-partner'
  const isRegister = mode === 'register'
  const title = isRegister
    ? (isPartner ? 'Bring your food to BiteLoop.' : 'Find your next favorite bite.')
    : (isPartner ? 'Welcome back, partner.' : 'Welcome back.')

  return (
    <main className="auth-page">
      <Link className="auth-brand" to="/user/login" aria-label="BiteLoop home">
        <span className="auth-brand-mark" aria-hidden="true">b.</span>
        <span>BiteLoop<span className="auth-brand-dot">.</span></span>
      </Link>
      <section className="auth-card" aria-labelledby="auth-title" key={`${role}-${mode}`}>
        <nav className="auth-role-switch" aria-label="Account type">
          <Link to={`/user/${mode}`} aria-current={!isPartner ? 'page' : undefined}>Food lover</Link>
          <Link to={`/food-partner/${mode}`} aria-current={isPartner ? 'page' : undefined}>Food partner</Link>
        </nav>
        <header className="auth-heading">
          <p className="auth-eyebrow">{isRegister ? 'A fresh start' : 'Good to see you'}</p>
          <h1 id="auth-title">{title}</h1>
          <p>{isRegister
            ? (isPartner ? 'Create an account to share what you cook.' : 'Create an account to discover food you love.')
            : (isPartner ? 'Log in to your food partner account.' : 'Log in to pick up where you left off.')}</p>
        </header>
        <form className="auth-form" noValidate aria-label={`${isPartner ? 'Food partner' : 'User'} ${mode}`}>
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-name">{isPartner ? 'Business name' : 'Full name'}</label>
              <input id="auth-name" name={isPartner ? 'name' : 'fullName'} type="text" autoComplete={isPartner ? 'organization' : 'name'} placeholder={isPartner ? 'Your restaurant or food business' : 'Your full name'} required />
            </div>
          )}
          {isRegister && isPartner && (
            <>
              <div className="auth-field">
                <label htmlFor="auth-contact-name">Contact name</label>
                <input id="auth-contact-name" name="contactName" type="text" autoComplete="name" placeholder="Name of the person to contact" required />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-phone">Phone number</label>
                <input id="auth-phone" name="phone" type="tel" autoComplete="tel" placeholder="Your business phone number" required />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-address">Business address</label>
                <input id="auth-address" name="address" type="text" autoComplete="street-address" placeholder="Street, city, and postal code" required />
              </div>
            </>
          )}
          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input id="auth-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'Create a password' : 'Enter your password'} required />
          </div>
          <button className="auth-primary" type="button">{isRegister ? 'Create account' : 'Log in'}<span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-alternate">
          {isRegister ? 'Already have an account?' : 'New to BiteLoop?'}{' '}
          <Link to={`/${role}/${isRegister ? 'login' : 'register'}`}>{isRegister ? 'Log in' : 'Create an account'}</Link>
        </p>
      </section>
      <p className="auth-footer">Good food. A little closer.</p>
    </main>
  )
}
