
import { useEffect, useState } from 'react'
import { getHealth } from './services/healthApi'
import './App.css'

const plannedModules = [
  {
    title: 'Authentication',
    description: 'Secure login, JWT and authorization.',
  },
  {
    title: 'Accounts',
    description: 'Account management and ownership checks.',
  },
  {
    title: 'Transfers',
    description: 'Atomic transfers and double-entry ledger.',
  },
]

type BackendStatus = 'loading' | 'online' | 'offline'

function App() {
  const [showFlow, setShowFlow] = useState(false)

  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>('loading')

  const [backendService, setBackendService] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getHealth(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return
        }

        if (data.status === 'UP') {
          setBackendService(data.service)
          setBackendStatus('online')
        } else {
          setBackendStatus('offline')
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setBackendStatus('offline')
        }
      })

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">LX</span>
          <span>LedgerX</span>
        </div>

        <span className="environment-tag">
          Development preview
        </span>
      </header>

      <main className="page-content">
        <section className="hero">
          <p className="eyebrow">
            SIMULATED BANKING PLATFORM
          </p>

          <h1>
            Build banking software with confidence.
          </h1>

          <p className="hero-description">
            A full-stack digital banking platform built
            step by step with React, Spring Boot and MySQL.
          </p>

          <div className="status-row">
            <span className="status-item">
              <span className="status-dot ready" />
              Frontend running
            </span>

            <span
              className="status-item"
              role="status"
              aria-live="polite"
            >
              <span
                className={`status-dot ${
                  backendStatus === 'online'
                    ? 'ready'
                    : 'pending'
                }`}
              />

              {backendStatus === 'loading' &&
                'Checking backend...'}

              {backendStatus === 'online' &&
                `Backend connected (${backendService})`}

              {backendStatus === 'offline' &&
                'Backend unavailable'}
            </span>
          </div>

          <button
            type="button"
            className="flow-button"
            aria-expanded={showFlow}
            aria-controls="request-flow"
            onClick={() => setShowFlow((previous) => !previous)}
          >
            {showFlow
              ? 'Hide request flow'
              : 'View request flow'}
          </button>

          {showFlow && (
            <div className="flow-panel" id="request-flow">
              <h3>Current API request flow</h3>

              <p>
                React → healthApi.ts → HealthController
                → HealthService → JSON Response → React
              </p>

              <p>
                Database-backed features will also use
                Repository → MySQL. Our current health API
                does not use a repository.
              </p>
            </div>
          )}
        </section>

        <section
          className="modules-section"
          aria-labelledby="modules-heading"
        >
          <h2 id="modules-heading">
            What we'll build
          </h2>

          <p className="section-description">
            These modules are planned, not implemented yet.
          </p>

          <div className="module-grid">
            {plannedModules.map((module) => (
              <article
                className="module-card"
                key={module.title}
              >
                <span className="module-status">
                  Planned
                </span>

                <h3>{module.title}</h3>

                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        LedgerX • Local development • Simulated funds only
      </footer>
    </div>
  )
}

export default App
