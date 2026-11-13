import { describe, expect, it } from 'vitest'
import { digestUpdateSchema } from './schema'

const base = {
  date: '2026-09-06',
  title: 'Test',
  summary: 'Summary',
  sections: [{ heading: 'H', bullets: ['One bullet'] }],
  bottomLine: 'Bottom',
}

describe('digestUpdateSchema', () => {
  it('rejects non-http source URLs', () => {
    expect(() =>
      digestUpdateSchema.parse({
        ...base,
        sections: [
          {
            heading: 'H',
            bullets: ['x'],
            sources: [{ label: 'bad', url: 'javascript:alert(1)' }],
          },
        ],
      }),
    ).toThrow()
  })
})
