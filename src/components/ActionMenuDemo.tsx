import { useState } from 'react'
import { motion } from 'framer-motion'

type Action = {
  id: string
  label: string
  emoji: string
  what: string
  intensity: number
}

const ACTIONS: Action[] = [
  { id: 'hold', label: 'hold', emoji: '🤚', what: 'Do nothing. Keep the position.', intensity: 0 },
  { id: 'hedge_25', label: 'hedge 25%', emoji: '🪶', what: 'Trim 25% of the directional exposure with an offsetting trade.', intensity: 0.25 },
  { id: 'hedge_50', label: 'hedge 50%', emoji: '🛡️', what: 'Halve the exposure. Standard de-risking move.', intensity: 0.50 },
  { id: 'hedge_75', label: 'hedge 75%', emoji: '🦺', what: 'Aggressive hedging — costs more in spread but cuts most of the risk.', intensity: 0.75 },
  { id: 'reduce_25', label: 'reduce 25%', emoji: '✂️', what: 'Sell 25% of the position outright (not just hedge it). Permanently smaller book.', intensity: 0.35 },
  { id: 'reduce_50', label: 'reduce 50%', emoji: '🔪', what: 'Cut the position in half. Strong de-risking when limits are pressed.', intensity: 0.70 },
  { id: 'roll_near_to_far', label: 'roll near→far', emoji: '⏩', what: 'Move near-month exposure into a later tenor. Buys time without changing total risk much.', intensity: 0.40 },
  { id: 'escalate', label: 'escalate', emoji: '📣', what: 'Send the decision up the chain. The trader can\'t (or won\'t) decide alone.', intensity: 0.05 },
  { id: 'request_limit_exception', label: 'request limit exception', emoji: '📝', what: 'Ask the credit officer for a temporary limit increase. Usually only when constrained by a physical or counterparty constraint.', intensity: 0.03 },
]

type Scenario = {
  id: string
  label: string
  blurb: string
  state: {
    hard_breach: boolean
    approval_required: boolean
    credit_limit_breached: boolean
    near_month_exposure: number
    has_physical_obligation: boolean
    liquidity_regime: 'normal' | 'thin' | 'crunched'
    stress_utilisation: number
  }
}

const SCENARIOS: Scenario[] = [
  {
    id: 'calm',
    label: 'calm day',
    blurb: 'Limits comfortable. Liquid markets. Routine.',
    state: {
      hard_breach: false,
      approval_required: false,
      credit_limit_breached: false,
      near_month_exposure: 12,
      has_physical_obligation: false,
      liquidity_regime: 'normal',
      stress_utilisation: 0.45,
    },
  },
  {
    id: 'tenor',
    label: 'near-month overload',
    blurb: 'Lots of risk concentrated in the front of the curve.',
    state: {
      hard_breach: false,
      approval_required: true,
      credit_limit_breached: false,
      near_month_exposure: 80,
      has_physical_obligation: false,
      liquidity_regime: 'normal',
      stress_utilisation: 0.78,
    },
  },
  {
    id: 'breach',
    label: 'hard breach',
    blurb: 'Position blew through the hard limit. Trader\'s discretion is gone.',
    state: {
      hard_breach: true,
      approval_required: true,
      credit_limit_breached: false,
      near_month_exposure: 90,
      has_physical_obligation: false,
      liquidity_regime: 'normal',
      stress_utilisation: 0.92,
    },
  },
  {
    id: 'credit',
    label: 'credit pressure',
    blurb: 'Counterparty exposure exceeded the credit limit. Credit officer is involved.',
    state: {
      hard_breach: false,
      approval_required: true,
      credit_limit_breached: true,
      near_month_exposure: 22,
      has_physical_obligation: true,
      liquidity_regime: 'thin',
      stress_utilisation: 0.7,
    },
  },
  {
    id: 'crunch',
    label: 'liquidity crunch',
    blurb: 'Spreads blew out. Aggressive hedges hurt. Some actions become infeasible.',
    state: {
      hard_breach: false,
      approval_required: false,
      credit_limit_breached: false,
      near_month_exposure: 30,
      has_physical_obligation: true,
      liquidity_regime: 'crunched',
      stress_utilisation: 0.6,
    },
  },
]

function feasibleActions(s: Scenario['state']): string[] {
  const feasible = new Set<string>(['hold', 'hedge_25', 'hedge_50', 'reduce_25'])
  if (s.liquidity_regime !== 'crunched') feasible.add('hedge_75')
  if (!s.has_physical_obligation || s.hard_breach) feasible.add('reduce_50')
  if (s.near_month_exposure > 15) feasible.add('roll_near_to_far')
  if (s.approval_required || s.hard_breach || s.stress_utilisation > 0.85) feasible.add('escalate')
  if (s.approval_required || s.hard_breach || s.credit_limit_breached) feasible.add('request_limit_exception')
  return [...feasible]
}

export function ActionMenuDemo() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const sc = SCENARIOS.find((x) => x.id === scenarioId)!
  const feasible = new Set(feasibleActions(sc.state))

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">scenario:</span>
        {SCENARIOS.map((x) => (
          <button
            key={x.id}
            onClick={() => setScenarioId(x.id)}
            className={`pill-sketch text-sm transition ${
              x.id === scenarioId ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <motion.div
        key={sc.id}
        layout
        className="font-body text-sm text-ink/80 mb-4 italic"
      >
        {sc.blurb}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {ACTIONS.map((a) => {
          const ok = feasible.has(a.id)
          return (
            <motion.div
              layout
              key={a.id}
              className={`p-3 rounded-lg border-[2px] transition-all ${
                ok
                  ? 'bg-cream border-ink shadow-sketchSm'
                  : 'bg-paper/30 border-ink/20 opacity-50'
              }`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-display text-xl">
                  {a.emoji} {a.label}
                </span>
                <span
                  className={`font-hand text-xs ${
                    ok ? 'text-sage' : 'text-coral'
                  }`}
                >
                  {ok ? 'feasible' : 'not allowed'}
                </span>
              </div>
              <div className="font-body text-sm text-ink/80 leading-snug">
                {a.what}
              </div>
              {!ok && (
                <div className="font-hand text-xs text-coral/80 mt-1">
                  {a.id === 'hedge_75' && 'liquidity is too thin to execute aggressively.'}
                  {a.id === 'reduce_50' && 'a physical desk can\'t cut the obligation in half — only a hard breach unlocks this.'}
                  {a.id === 'roll_near_to_far' && 'near-month exposure is too small to be worth rolling.'}
                  {a.id === 'escalate' && 'no breach or approval pressure — nothing to escalate.'}
                  {a.id === 'request_limit_exception' && 'no breach in play — credit officer wouldn\'t entertain it.'}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the action menu changes with the situation. half the work of risk
        software is figuring out{' '}
        <span className="text-coral">what's even legal to do right now</span>.
      </div>
    </div>
  )
}
