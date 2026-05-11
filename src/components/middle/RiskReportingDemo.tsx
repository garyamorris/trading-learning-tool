import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Level = {
  id: string
  audience: string
  icon: string
  cadence: string
  detail: 'high' | 'medium' | 'low'
  description: string
  contents: { title: string; body: string }[]
}

const LEVELS: Level[] = [
  {
    id: 'trader',
    audience: 'trader',
    icon: '💼',
    cadence: 'real-time',
    detail: 'high',
    description: 'their own dashboard. every position, every greek, every limit. updated as they trade.',
    contents: [
      { title: 'live positions per book/commodity/tenor', body: '~120 line items, refreshed every minute' },
      { title: 'live greeks (delta/gamma/vega/theta)', body: 'per instrument · per leg' },
      { title: 'intra-day P&L', body: 'their own marks, no IPV overlay' },
      { title: 'all live limits + utilisation', body: 'updates as new trades book' },
      { title: 'broker quote feeds', body: 'raw, unfiltered' },
    ],
  },
  {
    id: 'desk_head',
    audience: 'desk head',
    icon: '👔',
    cadence: 'daily (EOD)',
    detail: 'medium',
    description: 'sums up the desk. one page per book. enough to challenge any trader on any number.',
    contents: [
      { title: 'desk P&L (daily, MTD, YTD)', body: 'with attribution waterfall' },
      { title: 'per-book VaR + utilisation', body: 'colour-coded by limit pressure' },
      { title: 'top 5 risk drivers', body: 'biggest contributors to firm VaR' },
      { title: 'breaches & exceptions today', body: 'one-line per ticket' },
      { title: 'IPV breaks summary', body: 'count + total impact, not per-position' },
    ],
  },
  {
    id: 'risk_committee',
    audience: 'risk committee',
    icon: '⚖️',
    cadence: 'weekly',
    detail: 'medium',
    description: 'one deck. firm risk picture. enough to ask sensible questions of the CRO.',
    contents: [
      { title: 'firm VaR / CVaR / stress losses', body: 'trend over 12 weeks' },
      { title: 'top 10 firm-level risk drivers', body: 'by desk / by commodity / by counterparty' },
      { title: 'stress scenario summaries', body: 'P&L impact across 5 hand-built scenarios' },
      { title: 'IPV summary', body: 'open breaks by severity, total reserve impact' },
      { title: 'control framework status', body: 'open exceptions ageing chart' },
    ],
  },
  {
    id: 'board',
    audience: 'board / audit committee',
    icon: '🏛️',
    cadence: 'monthly / quarterly',
    detail: 'low',
    description: 'three slides. high-signal. only the things that need a board vote or could embarrass anyone.',
    contents: [
      { title: 'firm-level risk vs appetite', body: 'is the firm operating within board-set limits?' },
      { title: 'material risk events', body: 'breaches over €1m, regulatory matters, model approvals' },
      { title: 'control environment summary', body: 'one paragraph from CRO + one from internal audit' },
    ],
  },
]

const DETAIL_COLORS: Record<string, string> = {
  high: 'border-coral bg-coral/10',
  medium: 'border-mustard bg-mustard/10',
  low: 'border-teal bg-teal/10',
}

export function RiskReportingDemo() {
  const [openId, setOpenId] = useState<string>('desk_head')

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        same underlying numbers. four audiences. each gets a <span className="text-coral font-bold">different summary</span> because each can act on different things:
      </div>

      <div className="space-y-2">
        {LEVELS.map((level, idx) => {
          const isOpen = openId === level.id
          // Pyramid effect: indent each level slightly more
          const indent = idx * 28
          return (
            <div key={level.id} style={{ marginLeft: indent, marginRight: indent }}>
              <motion.button
                layout
                onClick={() => setOpenId(isOpen ? '' : level.id)}
                className={`w-full text-left rounded-lg border-[2.5px] p-3 transition-colors shadow-sketchSm ${
                  DETAIL_COLORS[level.detail]
                } ${isOpen ? 'ring-2 ring-ink/30' : 'hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'}`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-2xl">{level.icon}</span>
                    <div className="min-w-0">
                      <div className="font-display text-xl">{level.audience}</div>
                      <div className="font-hand text-xs text-ink/65 leading-tight">
                        {level.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-hand text-[10px] text-ink/55">{level.cadence}</span>
                    <span className="font-hand text-[10px] font-bold uppercase tracking-wider">
                      {level.detail} detail
                    </span>
                    <span className="font-display text-base text-ink/40">{isOpen ? '−' : '+'}</span>
                  </div>
                </div>
              </motion.button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 p-2 rounded bg-paper/40 border-[1.5px] border-dashed border-ink/30 space-y-1">
                      <div className="font-hand text-xs text-ink/60 mb-1">what {level.audience} sees:</div>
                      {level.contents.map((c) => (
                        <div key={c.title} className="bg-cream rounded border-[1px] border-ink/25 px-2 py-1">
                          <div className="font-body text-xs font-bold">{c.title}</div>
                          <div className="font-hand text-[10px] text-ink/60 leading-tight">{c.body}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-mustard/10 border-[2px] border-dashed border-mustard">
        <div className="font-display text-base text-mustard mb-1">
          ✦ the funnel is what's hard
        </div>
        <div className="font-body text-sm text-ink/85 leading-snug">
          The same VaR number could be reported as a single integer to the board, or as a 50,000-line per-position breakdown to the trader. The MO's craft is{' '}
          <strong>deciding what each level needs to know to do their job</strong> — and what they don't need to know that would just distract.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ what gets summarised, what gets buried, what gets escalated:{' '}
        <span className="text-coral">that's the middle office's pen</span>. it shapes what leadership sees about the firm's risk every day.
      </div>
    </div>
  )
}
