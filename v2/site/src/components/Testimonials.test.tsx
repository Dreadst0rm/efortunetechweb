import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Testimonials from './Testimonials'

describe('Testimonials', () => {
  it('renders the section title and quotes', () => {
    render(<Testimonials variant="ns" kicker="03 · In Their Words" />)
    expect(
      screen.getByRole('heading', { level: 2, name: /what clients say/i })
    ).toBeInTheDocument()
    expect(screen.getByText('03 · In Their Words')).toBeInTheDocument()
    expect(screen.getAllByRole('figure')).toHaveLength(3)
  })
})
