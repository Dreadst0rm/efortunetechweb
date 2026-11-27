import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import QuarterlyInitiativePage from './QuarterlyInitiativePage'

describe('QuarterlyInitiativePage', () => {
  it('renders hero copy and offer badge link', () => {
    render(<QuarterlyInitiativePage />)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /any one lineup project/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/industry evaluation/i).length).toBeGreaterThan(0)
    const badge = screen.getByRole('link', {
      name: /Quarterly Initiative: any one lineup project/i,
    })
    expect(badge).toHaveAttribute('href', '/quarterly-initiative')
    expect(screen.getByRole('link', { name: 'Start my project' })).toHaveAttribute(
      'href',
      '/contact.html?interest=quarterly-initiative',
    )
  })
})