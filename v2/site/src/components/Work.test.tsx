import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Work from './Work'

describe('Work', () => {
  it('renders the section title and case studies', () => {
    render(<Work variant="ns" kicker="02 · Proof of Delivery" />)
    expect(
      screen.getByRole('heading', { level: 2, name: /featured engagements/i })
    ).toBeInTheDocument()
    expect(screen.getByText('02 · Proof of Delivery')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
})
