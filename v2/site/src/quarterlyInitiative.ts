/** Shared Quarterly Initiative ($9,500) copy — one project from the hands-on lineup. */

export const QUARTERLY_INITIATIVE_PRICE = '$9,500'

export const INDUSTRY_EVALUATION_VALUE = '$3,800'

export const quarterlyInitiativePitch =
  'Pick any one project from the hands-on lineup. We agree on a defined success outcome and delivery up front, execute through the quarter, and finish with a full industry peer evaluation. Includes everything listed below.'

export const quarterlyProjectIncludesHeading = `What your ${QUARTERLY_INITIATIVE_PRICE} project includes`

export const quarterlyProjectIncludes = [
  {
    title: 'Current-state assessment',
    body: 'We review the systems, risks and gaps that matter for the chosen outcome.',
  },
  {
    title: 'Roadmap',
    body: 'A prioritized plan (near-term fixes through 3–5 year direction) with owners and sequencing.',
  },
  {
    title: 'Defined-outcome delivery',
    body: 'One project with an agreed success outcome, delivered and verified.',
  },
  {
    title: 'Executive readout',
    body: 'A leadership/board-ready briefing of findings, decisions and next steps.',
  },
  {
    title: 'Runbooks and knowledge transfer',
    body: 'Documentation and a handoff session so your team or MSP can run what was built.',
  },
  {
    title: '30 days of post-delivery support',
    body: 'Questions and adjustments after handoff.',
  },
  {
    title: 'Industry peer evaluation (closing report)',
    body: `How you compare with peer companies and competitors and how ready you are for the future, valued at ${INDUSTRY_EVALUATION_VALUE} on its own.`,
  },
] as const

/** Short labels for pricing glance and hub. */
export const quarterlyProjectIncludesShort = quarterlyProjectIncludes.map((item) => item.title)

export const startWithQuarterlyLine = `Start with any one project for ${QUARTERLY_INITIATIVE_PRICE}.`

export const quarterlyNoContract = 'No long-term contract.'

export const quarterlyLargerProjectsNote =
  'Larger multi-part projects are scoped separately on the project tier ($10,000–$50,000 total).'

export const quarterlyPricingBlurb =
  'Any one project from the hands-on lineup. Assessment, roadmap, verified delivery, executive readout, runbooks and handoff, 30-day post-delivery support, and industry peer evaluation included.'