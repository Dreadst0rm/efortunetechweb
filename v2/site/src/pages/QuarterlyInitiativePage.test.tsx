import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import QuarterlyInitiativePage from './QuarterlyInitiativePage'

describe('QuarterlyInitiativePage', () => {
  it('renders hero copy and offer badge link', () => {
    render(<QuarterlyInitiativePage />)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /one quarter\. one big technology win/i,
      }),
    ).toBeInTheDocument()
    const badge = screen.getByRole('link', {
      name: 'See the $99.99 Quarterly Initiative offer',
    })
    expect(badge).toHaveAttribute('href', '/quarterly-initiative')
    expect(screen.getByRole('link', { name: 'Start my quarter' })).toHaveAttribute(
      'href',
      '/contact.html?interest=quarterly-initiative',
    )
  })
})