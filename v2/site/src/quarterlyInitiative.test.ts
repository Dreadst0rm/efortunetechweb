import { describe, expect, it } from 'vitest'
import {
  quarterlyInitiativeOfferItems,
  quarterlyLargerProjectsNote,
  startWithQuarterlyLine,
} from './quarterlyInitiative'

describe('quarterlyInitiative copy', () => {
  it('includes the four offer pillars', () => {
    const titles = quarterlyInitiativeOfferItems.map((i) => i.title)
    expect(titles).toEqual([
      'Strategy session',
      'Defined success outcome',
      'Delivery through the quarter',
      'Industry evaluation report (included)',
    ])
    expect(quarterlyInitiativeOfferItems[3].body).toMatch(/\$3,800/)
  })

  it('points larger work to the project tier', () => {
    expect(quarterlyLargerProjectsNote).toMatch(/\$10,000–\$50,000/)
  })

  it('uses the standard start line on service pages', () => {
    expect(startWithQuarterlyLine).toBe('Start with any one project for $9,999.99.')
  })
})