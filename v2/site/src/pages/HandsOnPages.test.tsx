import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HandsOnHubPage from './HandsOnHubPage'
import ResilienceRecoveryPage from './ResilienceRecoveryPage'
import PerformanceScalePage from './PerformanceScalePage'
import SecurityHardeningPage from './SecurityHardeningPage'
import MonitoringPage from './MonitoringPage'

describe('Hands-on pages', () => {
  it('renders hub headline and comparison table', () => {
    render(<HandsOnHubPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /when it has to work/i }),
    ).toBeInTheDocument()
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

  it('renders security hardening hero', () => {
    render(<SecurityHardeningPage />)
    expect(screen.getByRole('heading', { level: 1, name: /close the doors/i })).toBeInTheDocument()
  })

  it('renders monitoring Keystone section', () => {
    render(<MonitoringPage />)
    expect(screen.getByRole('heading', { level: 2, name: /keystone monitoring/i })).toBeInTheDocument()
  })
})