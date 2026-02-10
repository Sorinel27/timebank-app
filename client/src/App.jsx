import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useParams } from 'react-router-dom'
import demoData from './data/demoData.json'
import './App.css'

const { users: USERS, services: SERVICES, requests: REQUESTS, balances: BALANCES, statusSteps: STATUS_STEPS } = demoData

function App() {
  useEffect(() => {
    const root = document.documentElement
    let latestX = window.innerWidth / 2
    let latestY = window.innerHeight / 3
    let rafId = 0

    const applyPosition = () => {
      rafId = 0
      root.style.setProperty('--cursor-x', `${latestX}px`)
      root.style.setProperty('--cursor-y', `${latestY}px`)
    }

    const onMove = (event) => {
      latestX = event.clientX
      latestY = event.clientY
      if (!rafId) {
        rafId = window.requestAnimationFrame(applyPosition)
      }
    }

    const onTouchMove = (event) => {
      if (!event.touches.length) {
        return
      }
      latestX = event.touches[0].clientX
      latestY = event.touches[0].clientY
      if (!rafId) {
        rafId = window.requestAnimationFrame(applyPosition)
      }
    }

    applyPosition()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouchMove)
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <div className="app">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/request/:id" element={<RequestFlow />} />
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">TB</span>
        <div>
          <div className="brand-title">TimeBank</div>
          <div className="brand-subtitle">Trade skills for time credits</div>
        </div>
      </div>
      <nav className="nav">
        <NavLink to="/" end>
          Overview
        </NavLink>
        <NavLink to="/marketplace">Marketplace</NavLink>
        <NavLink to="/request/req-1">Request Flow</NavLink>
        <NavLink to="/profiles">Profiles</NavLink>
        <NavLink to="/profile/ioana">Profile</NavLink>
      </nav>
      <div className="header-actions">
        <NavLink to="/login" className="ghost">
          Log in
        </NavLink>
        <NavLink to="/register" className="button">
          Create account
        </NavLink>
      </div>
    </header>
  )
}

function Home() {
  return (
    <section className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Time Credit Core Loop</p>
          <h1>
            Earn time credits by sharing what you know, then spend them to learn
            from others.
          </h1>
          <p className="lead">
            Every new member receives a 3-credit bonus to get started. This demo
            shows the flow with hardcoded data to match the product vision.
          </p>
          <div className="hero-actions">
            <NavLink to="/marketplace" className="button">
              Explore offers
            </NavLink>
            <NavLink to="/request/req-1" className="ghost">
              See request flow
            </NavLink>
          </div>
        </div>
        <div className="hero-card">
          <div className="card-label">Starting balance</div>
          <div className="card-value">3 credits</div>
          <div className="card-meta">Issued instantly on registration.</div>
          <div className="card-grid">
            <div>
              <div className="card-caption">Andrei offers</div>
              <div className="card-strong">Guitar lessons</div>
            </div>
            <div>
              <div className="card-caption">Ioana requests</div>
              <div className="card-strong">1 hour session</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-grid">
        {STATUS_STEPS.map((step, index) => (
          <div
            key={step.id}
            className="info-card reveal"
            style={{ animationDelay: `${0.1 + index * 0.12}s` }}
          >
            <div className="info-number">0{index + 1}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="callout">
        <div>
          <h2>Hardcoded demo accounts</h2>
          <p>
            Use Ioana and Andrei to explore the flow while the backend is still
            scaffolding.
          </p>
        </div>
        <div className="pill-grid">
          <span className="pill">Ioana: {BALANCES.ioana} credits</span>
          <span className="pill">Andrei: {BALANCES.andrei} credits</span>
        </div>
      </div>
    </section>
  )
}

function AuthPage({ mode }) {
  const isRegister = mode === 'register'

  return (
    <section className="page auth">
      <div className="auth-panel">
        <h1>{isRegister ? 'Create your TimeBank account' : 'Welcome back'}</h1>
        <p>
          {isRegister
            ? 'You will receive a 3-credit bonus on registration.'
            : 'Sign in to request or offer services.'}
        </p>
        <form className="auth-form">
          <label>
            Name
            <input type="text" placeholder="Ioana Ionescu" disabled />
          </label>
          <label>
            Email
            <input type="email" placeholder="ioana@email.com" disabled />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" disabled />
          </label>
          <button type="button" className="button" disabled>
            {isRegister ? 'Create account' : 'Log in'}
          </button>
          <p className="form-note">
            Hardcoded demo: forms are disabled until the backend is wired.
          </p>
        </form>
      </div>
      <aside className="auth-aside">
        <h2>Why TimeBank?</h2>
        <ul>
          <li>Trade time instead of money.</li>
          <li>Build local trust and reciprocity.</li>
          <li>Earn credits by teaching or helping.</li>
        </ul>
      </aside>
    </section>
  )
}

function Marketplace() {
  const [query, setQuery] = useState('')
  const [rateFilter, setRateFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')

  const tags = useMemo(() => {
    const uniqueTags = new Set()
    SERVICES.forEach((service) => {
      service.tags.forEach((tag) => uniqueTags.add(tag))
    })
    return ['all', ...Array.from(uniqueTags)]
  }, [])

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return SERVICES.filter((service) => {
      const matchesQuery =
        !normalizedQuery ||
        service.title.toLowerCase().includes(normalizedQuery) ||
        service.summary.toLowerCase().includes(normalizedQuery) ||
        USERS[service.providerId].name
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesRate =
        rateFilter === 'all' || String(service.rate) === rateFilter

      const matchesTag =
        tagFilter === 'all' || service.tags.includes(tagFilter)

      return matchesQuery && matchesRate && matchesTag
    })
  }, [query, rateFilter, tagFilter])

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h1>Offers available right now</h1>
        </div>
        <div className="filter-row">
          <span className="pill">Cluj-Napoca</span>
          <span className="pill">Hardcoded data</span>
          <span className="pill">{filteredServices.length} offers</span>
        </div>
      </div>
      <div className="filter-panel">
        <label className="filter-field">
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Guitar, branding, Andrei..."
          />
        </label>
        <label className="filter-field">
          Credits
          <select
            value={rateFilter}
            onChange={(event) => setRateFilter(event.target.value)}
          >
            <option value="all">All rates</option>
            <option value="1">1 credit</option>
            <option value="2">2 credits</option>
          </select>
        </label>
        <label className="filter-field">
          Focus tag
          <select
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
          >
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All tags' : tag}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="filter-clear"
          onClick={() => {
            setQuery('')
            setRateFilter('all')
            setTagFilter('all')
          }}
        >
          Clear filters
        </button>
      </div>
      {filteredServices.length === 0 ? (
        <div className="empty-state">
          <h3>No offers match that filter</h3>
          <p>Try removing a tag or searching by provider name.</p>
          <button
            type="button"
            className="filter-clear"
            onClick={() => {
              setQuery('')
              setRateFilter('all')
              setTagFilter('all')
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="service-card reveal"
              style={{ animationDelay: `${0.1 + index * 0.12}s` }}
            >
              <div className="service-top">
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                </div>
                <div className="rate">
                  <div className="rate-value">{service.rate}</div>
                  <div className="rate-label">credit / {service.unit}</div>
                </div>
              </div>
              <div className="tags">
                {service.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="service-footer">
                <div className="meta">
                  <span>{USERS[service.providerId].name}</span>
                  <span className="dot" />
                  <span>{service.availability}</span>
                </div>
                <NavLink to={`/service/${service.id}`} className="service-cta">
                  View details
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function ServiceDetail() {
  const { id } = useParams()
  const service = SERVICES.find((item) => item.id === id)

  if (!service) {
    return <NotFound />
  }

  const provider = USERS[service.providerId]

  return (
    <section className="page">
      <div className="detail-grid">
        <div className="detail-card">
          <p className="eyebrow">Service detail</p>
          <h1>{service.title}</h1>
          <p className="lead">{service.summary}</p>
          <div className="detail-info">
            <div>
              <div className="label">Provider</div>
              <div className="value">{provider.name}</div>
              <div className="muted">{provider.skill}</div>
            </div>
            <div>
              <div className="label">Rate</div>
              <div className="value">
                {service.rate} credit / {service.unit}
              </div>
              <div className="muted">Availability: {service.availability}</div>
            </div>
          </div>
          <div className="tags">
            {service.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="detail-actions">
            <NavLink to={`/request/${REQUESTS[0].id}`} className="button">
              Request this service
            </NavLink>
            <NavLink to="/marketplace" className="ghost">
              Back to marketplace
            </NavLink>
          </div>
        </div>
        <div className="detail-card alt">
          <h3>Demo notes</h3>
          <p>
            Ioana has credits and requests Andrei's service. Andrei accepts, the
            session happens, and Ioana marks it completed so 1 credit moves to
            Andrei.
          </p>
          <div className="stack">
            <span className="pill">Ioana: {BALANCES.ioana} credits</span>
            <span className="pill">Andrei: {BALANCES.andrei} credits</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function RequestFlow() {
  const { id } = useParams()
  const request = REQUESTS.find((item) => item.id === id)

  if (!request) {
    return <NotFound />
  }

  const service = SERVICES.find((item) => item.id === request.serviceId)
  const requester = USERS[request.requesterId]
  const provider = USERS[request.providerId]
  const isCompleted = request.status === 'completed'

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Request flow</p>
          <h1>From request to credit transfer</h1>
        </div>
        <span className={`status ${isCompleted ? 'status--good' : ''}`}>
          {isCompleted ? 'Completed' : 'In progress'}
        </span>
      </div>

      <div className="request-grid">
        <div className="request-card">
          <h3>Request details</h3>
          <div className="summary-row">
            <span className="label">Service</span>
            <span className="value">{service.title}</span>
          </div>
          <div className="summary-row">
            <span className="label">Requester</span>
            <span className="value">{requester.name}</span>
          </div>
          <div className="summary-row">
            <span className="label">Provider</span>
            <span className="value">{provider.name}</span>
          </div>
          <div className="summary-row">
            <span className="label">Credits</span>
            <span className="value">
              {service.rate * request.hours} credit / {request.hours} hour
            </span>
          </div>
          <div className="summary-row">
            <span className="label">Created</span>
            <span className="value">{request.createdAt}</span>
          </div>
          <div className="summary-row">
            <span className="label">Notes</span>
            <span className="value">Bring an acoustic guitar.</span>
          </div>
        </div>
        <div className="request-card">
          <h3>Status timeline</h3>
          <div className="timeline">
            {STATUS_STEPS.map((step) => {
              const isActive = step.id === request.status
              const isPast =
                STATUS_STEPS.findIndex((item) => item.id === step.id) <=
                STATUS_STEPS.findIndex((item) => item.id === request.status)

              return (
                <div
                  key={step.id}
                  className={`timeline-item ${isPast ? 'past' : ''} ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <div className="dot" />
                  <div>
                    <div className="timeline-title">{step.title}</div>
                    <div className="timeline-desc">{step.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="callout">
        <div>
          <h2>Credit transfer summary</h2>
          <p>
            Once marked completed, 1 credit moves from Ioana to Andrei. This is
            a hardcoded preview of the final flow.
          </p>
        </div>
        <div className="pill-grid">
          <span className="pill">Ioana balance: {BALANCES.ioana}</span>
          <span className="pill">Andrei balance: {BALANCES.andrei}</span>
        </div>
      </div>
    </section>
  )
}

function ProfilePage() {
  const { id } = useParams()
  const user = USERS[id]

  if (!user) {
    return <NotFound />
  }

  const offers = SERVICES.filter((service) => service.providerId === id)
  const activity = REQUESTS.filter(
    (request) => request.requesterId === id || request.providerId === id,
  )

  return (
    <section className="page">
      <div className="profile-hero">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{user.name}</h1>
          <p className="lead">{user.bio}</p>
          <div className="profile-meta">
            <span className="pill">{user.handle}</span>
            <span className="pill">{user.city}</span>
            <span className="pill">Rating {user.rating}</span>
            <span className="pill">Joined {user.joined}</span>
          </div>
        </div>
        <div className="profile-card">
          <div className="profile-stat">
            <div className="label">Current balance</div>
            <div className="stat-value">{BALANCES[id]} credits</div>
          </div>
          <div className="profile-stat">
            <div className="label">Primary skill</div>
            <div className="stat-value">{user.skill}</div>
          </div>
          <div className="profile-stat">
            <div className="label">Active offers</div>
            <div className="stat-value">{offers.length}</div>
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="info-card">
          <h3>Offers by {user.name.split(' ')[0]}</h3>
          <p className="muted">Hardcoded preview of services listed.</p>
          <div className="mini-list">
            {offers.map((service) => (
              <NavLink
                key={service.id}
                to={`/service/${service.id}`}
                className="mini-item"
              >
                <div>
                  <div className="mini-title">{service.title}</div>
                  <div className="muted">{service.availability}</div>
                </div>
                <span className="pill">
                  {service.rate} credit / {service.unit}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="info-card">
          <h3>Recent activity</h3>
          <p className="muted">Latest requests involving this member.</p>
          <div className="mini-list">
            {activity.map((request) => {
              const service = SERVICES.find(
                (item) => item.id === request.serviceId,
              )
              const statusLabel = request.status
              return (
                <NavLink
                  key={request.id}
                  to={`/request/${request.id}`}
                  className="mini-item"
                >
                  <div>
                    <div className="mini-title">{service.title}</div>
                    <div className="muted">{request.createdAt}</div>
                  </div>
                  <span className={`pill status-pill ${statusLabel}`}>
                    {statusLabel}
                  </span>
                </NavLink>
              )}
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProfilesPage() {
  const people = Object.values(USERS)

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Members</p>
          <h1>Community profiles</h1>
        </div>
        <div className="filter-row">
          <span className="pill">Cluj-Napoca</span>
          <span className="pill">Top rated</span>
          <span className="pill">New this year</span>
        </div>
      </div>
      <div className="profile-grid">
        {people.map((person, index) => (
          <NavLink
            key={person.id}
            to={`/profile/${person.id}`}
            className="profile-tile reveal"
            style={{ animationDelay: `${0.08 + index * 0.1}s` }}
          >
            <div>
              <div className="profile-name">{person.name}</div>
              <div className="muted">{person.skill}</div>
            </div>
            <div className="profile-stats">
              <span className="pill">{person.city}</span>
              <span className="pill">Rating {person.rating}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <section className="page not-found">
      <h1>Page not found</h1>
      <p>Return to the marketplace to explore available services.</p>
      <NavLink to="/marketplace" className="button">
        Go to marketplace
      </NavLink>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="brand-title">TimeBank Demo</div>
        <p className="muted">
          Frontend-only flow using hardcoded data for the core loop.
        </p>
      </div>
      <div className="footer-links">
        <span>Cluj-Napoca</span>
        <span>Time Credits</span>
        <span>2026</span>
      </div>
    </footer>
  )
}

export default App
