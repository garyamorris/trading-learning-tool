import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Activity = {
  id: string
  name: string
  traditional: string
  emerging: string
  aspirational: string
  tradeoff: string
}

const ACTIVITIES: Activity[] = [
  {
    id: 'trade_verify',
    name: 'trade verification',
    traditional: 'manual reconciliation of trade vs confirm. analysts work a queue of mismatches every morning.',
    emerging: 'auto-match against electronic confirmations (CME ConfirmHub, broker APIs). humans only see breaks.',
    aspirational: 'real-time STP — trades match the moment they\'re booked, with ML classifying the few break cases by likely root cause.',
    tradeoff: 'speed vs. control: faster matching means less time to catch deliberately weird patterns.',
  },
  {
    id: 'ipv',
    name: 'independent P&L (IPV)',
    traditional: 'daily batch comparing trader marks vs vendor consensus the next morning. breaks investigated by hand.',
    emerging: 'intraday IPV polling consensus every 15 minutes; large breaks alert immediately.',
    aspirational: 'real-time IPV with ML-flagged "behavioural" anomalies (mark drift patterns, suspicious timing). compliance gets a 24/7 model.',
    tradeoff: 'false positives explode at higher frequency. tuning the alert threshold is now its own job.',
  },
  {
    id: 'reserves',
    name: 'reserves & adjustments',
    traditional: 'monthly committee approves methodology. quarterly review of reserve adequacy.',
    emerging: 'methodologies coded into the system; reserves auto-compute from market data daily.',
    aspirational: 'probabilistic reserves with continuous calibration to realised P&L outcomes — they get smaller when justified, bigger when not.',
    tradeoff: 'auto-computed reserves are easier to challenge ("just turn the knob down") — methodology has to be documented as code.',
  },
  {
    id: 'exception',
    name: 'exception monitoring',
    traditional: 'EOD batch fires; analysts triage tickets in the morning queue.',
    emerging: 'intraday exception streams with ML-based severity prediction. low-severity items auto-close.',
    aspirational: 'predictive controls — exceptions surface before the underlying event, based on early signal patterns.',
    tradeoff: 'auto-close trusts the model; if the model is wrong about what\'s "low severity", real issues get suppressed.',
  },
  {
    id: 'recon',
    name: 'position reconciliation',
    traditional: 'morning batch matches 4 sources; breaks worked manually.',
    emerging: 'continuous recon with API-level integration to back office + counterparties.',
    aspirational: 'distributed-ledger-style "one source of truth" shared with counterparties — no recon because no separate sources.',
    tradeoff: 'shared ledgers require industry coordination that historically takes decades.',
  },
  {
    id: 'reg_report',
    name: 'regulatory reporting',
    traditional: 'overnight batches per regime; rejections worked by hand the next day.',
    emerging: 'event-driven reporting with auto-correction loops. regtech vendors consolidate the regime-specific schemas.',
    aspirational: 'regulators consume firm data directly via approved real-time feeds. submission/rejection cycle disappears.',
    tradeoff: 'pushing data live to regulators raises confidentiality concerns and changes the firm\'s control model.',
  },
]

type View = 'traditional' | 'emerging' | 'aspirational'

const VIEW_META: Record<View, { color: string; label: string; emoji: string; sub: string }> = {
  traditional: {
    color: 'mustard',
    label: 'traditional',
    emoji: '📜',
    sub: 'how it works today in most shops',
  },
  emerging: {
    color: 'teal',
    label: 'emerging',
    emoji: '🚀',
    sub: 'rolling out at the more advanced firms',
  },
  aspirational: {
    color: 'lavender',
    label: 'aspirational',
    emoji: '🌌',
    sub: 'where it could be in 5-10 years',
  },
}

const VIEW_BG: Record<string, string> = {
  mustard: 'border-mustard bg-mustard/10',
  teal: 'border-teal bg-teal/10',
  lavender: 'border-lavender bg-lavender/10',
}

export function WhereItsGoingDemo() {
  const [view, setView] = useState<View>('traditional')
  const meta = VIEW_META[view]

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        six middle-office activities, three points in time. slide between them and watch each function evolve:
      </div>

      <div className="flex gap-2 mb-4 items-center justify-center">
        {(['traditional', 'emerging', 'aspirational'] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`pill-sketch text-sm transition-all ${
              view === v ? 'bg-mustard/40 shadow-sketchSm scale-105' : 'hover:bg-paper'
            }`}
          >
            {VIEW_META[v].emoji} {VIEW_META[v].label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: view === 'traditional' ? -8 : view === 'aspirational' ? 8 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className={`p-3 mb-3 rounded-lg border-[2px] border-dashed ${VIEW_BG[meta.color]} text-center`}>
            <div className="font-display text-xl">{meta.emoji} {meta.label}</div>
            <div className="font-hand text-xs text-ink/65">{meta.sub}</div>
          </div>

          <div className="space-y-1.5">
            {ACTIVITIES.map((a) => {
              const description = a[view]
              return (
                <div
                  key={a.id}
                  className={`rounded border-[2px] p-2 ${VIEW_BG[meta.color]}`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-sm">{a.name}</span>
                  </div>
                  <div className="font-body text-xs text-ink/85 leading-snug mt-0.5">
                    {description}
                  </div>
                  {view === 'aspirational' && (
                    <div className="font-hand text-[10px] text-coral mt-1">
                      ⚠ trade-off: {a.tradeoff}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 p-3 rounded-lg bg-rose/10 border-[2px] border-dashed border-rose">
        <div className="font-display text-base text-rose mb-1">
          ✦ the meta-trend
        </div>
        <div className="font-body text-sm text-ink/85 leading-snug">
          Every move along this axis trades <strong>speed and automation</strong> for{' '}
          <strong>auditability and human judgment</strong>. The best MOs are pragmatic — they take the cheap wins (auto-match, auto-close low severity) but stay skeptical of automation in places where the trade-off is wrong (deliberate-mismark detection, escalation decisions).
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the middle office isn&apos;t disappearing — but the work is{' '}
        <span className="text-coral">moving up the stack</span>. less mechanical reconciling; more model oversight, judgment, behavioural patterns, and edge cases.
      </div>
    </div>
  )
}
