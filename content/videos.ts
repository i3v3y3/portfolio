/**
 * Video embeds.
 *
 * ATTRIBUTION MATTERS HERE. Every one of these is posted by a company account,
 * not by Ivy — QuePay and Veno Autobotics. Showing them on a personal portfolio
 * without saying so would imply she published them. `postedBy` is rendered
 * visibly under each, not buried in a title attribute.
 *
 * They are still good evidence: they show the product she built and the lab she
 * built it in. That is a different claim from "I made this video", and the
 * page should make which one it is obvious.
 */
export interface VideoEmbed {
  id: string
  /** LinkedIn ugcPost URN — the numeric part. */
  urn: string
  title: string
  blurb: string
  postedBy: { name: string; href: string }
}

export const videos: VideoEmbed[] = [
  {
    id: 'mpesa-purchase',
    urn: '7374377705120804864',
    title: 'Paying for a dispense with M-Pesa',
    blurb:
      'The whole transaction on the controller I build the hardware and firmware for: select, pay, dispense.',
    postedBy: { name: 'QuePay', href: 'https://ke.linkedin.com/company/quepay' },
  },
  {
    id: 'assembly',
    urn: '7376944414331408385',
    title: 'Assembling a device in the lab',
    blurb: 'Hand assembly of a QuePay unit on the bench at Veno Autobotics.',
    postedBy: { name: 'Veno Autobotics', href: 'https://ke.linkedin.com/company/venoiot' },
  },
  {
    id: 'week-end',
    urn: '7400129004579598336',
    title: 'End of the week in the lab',
    blurb: 'A look around the workshop.',
    postedBy: { name: 'Veno Autobotics', href: 'https://ke.linkedin.com/company/venoiot' },
  },
]
