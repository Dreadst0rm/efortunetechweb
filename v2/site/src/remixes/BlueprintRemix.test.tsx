import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BlueprintRemix from './BlueprintRemix'

describe('BlueprintRemix', () => {
  it('renders the hero headline', () => {
    render(<BlueprintRemix />)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /senior technology leadership, without the full-time hire/i,
      }),
    ).toBeInTheDocument()
  })

  it('shows the quarterly initiative badge above hero actions', () => {
    render(<BlueprintRemix />)
    const badge = screen.getByRole('link', {
      name: /Quarterly Initiative: any one lineup project/i,
    })
    expect(badge).toHaveAttribute('href', '/quarterly-initiative')
  })
})
