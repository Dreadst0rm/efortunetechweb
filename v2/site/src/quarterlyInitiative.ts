/** Shared Quarterly Initiative ($9,999.99) copy — one project from the hands-on lineup. */

export const QUARTERLY_INITIATIVE_PRICE = '$9,999.99'

export const INDUSTRY_EVALUATION_VALUE = '$3,800'

export const quarterlyInitiativePitch =
  'Pick any one project from the hands-on lineup. We agree on a defined success outcome and delivery up front, execute through the quarter, and finish with a full industry evaluation report.'

export const quarterlyInitiativeOfferItems = [
  {
    title: 'Strategy session',
    body: 'We align on which lineup project fits now, what success looks like, and how we will measure it before work starts.',
  },
  {
    title: 'Defined success outcome',
    body: 'One clear, measurable result—written down so leadership and your IT partner know what “done” means.',
  },
  {
    title: 'Delivery through the quarter',
    body: 'I lead the work with your team or your IT provider: hands-on when needed, steering always, roadblocks cleared so the project actually finishes.',
  },
  {
    title: 'Industry evaluation report (included)',
    body: `How you compare to peer companies, how you stack up against competition, and how well you are set up for the future. Valued at ${INDUSTRY_EVALUATION_VALUE} on its own—included at no extra charge.`,
  },
] as const

export const startWithQuarterlyLine = `Start with any one project for ${QUARTERLY_INITIATIVE_PRICE}.`

export const quarterlyNoContract = 'No long-term contract.'

export const quarterlyLargerProjectsNote =
  'Larger multi-part projects are scoped separately on the project tier ($10,000–$50,000 total).'