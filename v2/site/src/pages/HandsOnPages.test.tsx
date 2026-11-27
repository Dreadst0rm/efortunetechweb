import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HandsOnHubPage from './HandsOnHubPage'
import ResilienceRecoveryPage from './ResilienceRecoveryPage'
import PerformanceScalePage from './PerformanceScalePage'
import SecurityHardeningPage from './SecurityHardeningPage'
import MonitoringPage from './MonitoringPage'
import AiPracticePage from './AiPracticePage'
import CloudMigrationPage from './CloudMigrationPage'
import ZeroTrustPage from './ZeroTrustPage'

describe('Hands-on pages', () => {
  it('renders hub headline and comparison table', () => {
    render(<HandsOnHubPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /expertise that's hard to hire/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /four outcomes/i })).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /book a free resilience snapshot/i }).length).toBeGreaterThan(
      0,
    )
  })

  it('renders resilience recovery hero', () => {
    render(<ResilienceRecoveryPage />)
    expect(screen.getByRole('heading', { level: 1, name: /ride the storm/i })).toBeInTheDocument()
  })

  it('renders performance and scale pricing hint', () => {
    render(<PerformanceScalePage />)
    expect(screen.getByText(/\$12,000–\$25,000/)).toBeInTheDocument()
  })

  it('renders security roadmap hero and insurance section', () => {
    render(<SecurityHardeningPage />)
    expect(screen.getByRole('heading', { level: 1, name: /3–5 year security roadmap/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /cyber insurance readiness/i })).toBeInTheDocument()
  })

  it('renders AI practice page', () => {
    render(<AiPracticePage />)
    expect(screen.getByRole('heading', { level: 1, name: /ai as a practice/i })).toBeInTheDocument()
  })

  it('renders cloud migration page', () => {
    render(<CloudMigrationPage />)
    expect(screen.getByRole('heading', { level: 1, name: /cloud moves/i })).toBeInTheDocument()
  })

  it('renders zero trust page', () => {
    render(<ZeroTrustPage />)
    expect(screen.getByRole('heading', { level: 1, name: /identity-based access/i })).toBeInTheDocument()
  })

  it('renders monitoring Keystone section', () => {
    render(<MonitoringPage />)
    expect(screen.getByRole('heading', { level: 2, name: /keystone monitoring/i })).toBeInTheDocument()
  })
})