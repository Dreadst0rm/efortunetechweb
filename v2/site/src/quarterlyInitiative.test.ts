import { describe, expect, it } from 'vitest'
import {
  QUARTERLY_INITIATIVE_PRICE,
  quarterlyLargerProjectsNote,
  quarterlyProjectIncludes,
  quarterlyProjectIncludesHeading,
  startWithQuarterlyLine,
} from './quarterlyInitiative'

describe('quarterlyInitiative copy', () => {
  it('lists seven included project deliverables', () => {
    const titles = quarterlyProjectIncludes.map((i) => i.title)
    expect(titles).toEqual([
      'Current-state assessment',
      'Roadmap',
      'Defined-outcome delivery',
      'Executive readout',
      'Runbooks and knowledge transfer',
      '30 days of post-delivery support',
      'Industry peer evaluation (closing report)',
    ])
    expect(quarterlyProjectIncludes[6].body).toMatch(/\$3,800/)
  })

  it('uses the includes heading with the list price', () => {
    expect(quarterlyProjectIncludesHeading).toBe(`What your ${QUARTERLY_INITIATIVE_PRICE} project includes`)
  })

  it('points larger work to the project tier', () => {
    expect(quarterlyLargerProjectsNote).toMatch(/\$10,000–\$50,000/)
  })

  it('uses the standard start line on service pages', () => {
    expect(startWithQuarterlyLine).toBe('Start with any one project for $9,500.')
  })
})