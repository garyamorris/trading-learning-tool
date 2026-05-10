import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Actor = {
  id: string
  role: string
  emoji: string
  blurb: string
  // Weights from company.py
  weights: {
    pnl: number
    cvar: number
    breach: number
    liquidity: number
    governance: number
  }
  inertia: number
  noise: number
}

const ACTORS: Actor[] = [
  {
    id: 'trader',
    role: 'Trader',
    emoji: '💼',
    blurb: 'Owns P&L. Wants to hold winning positions and avoid forced de-risking.',
    weights: { pnl: 0.50, cvar: 0.20, breach: 0.10, liquidity: 0.15, governance: 0.05 },
    inertia: 0.28,
    noise: 0.85,
  },
  {
    id: 'risk',
    role: 'Risk manager',
    emoji: '🛡️',
    blurb: 'Owns the risk envelope. Wants tail-loss bounded and limits respected.',
    weights: { pnl: 0.15, cvar: 0.35, breach: 0.25, liquidity: 0.10, governance: 0.15 },
    inertia: 0.08,
    noise: 0.55,
  },
  {
    id: 'desk_head',
    role: 'Desk head',
    emoji: '👔',
    blurb: 'Sits between trading and risk. Wants P&L but won\'t blow through governance.',
    weights: { pnl: 0.35, cvar: 0.25, breach: 0.15, liquidity: 0.15, governance: 0.10 },
    inertia: 0.18,
    noise: 0.70,
  },
  {
    id: 'credit',
    role: 'Credit officer',
    emoji: '🏦',
    blurb: 'Watches counterparty exposure. Pushes hard on credit-side actions.',
    weights: { pnl: 0.10, cvar: 0.20, breach: 0.30, liquidity: 0.10, governance: 0.30 },
    inertia: 0.05,
    noise: 0.45,
  },
]

// Simplified scoring: hand-authored utilities for a few illustrative actions
// in a "stress utilisation 80%, near-VaR-limit, normal liquidity" scenario.
const STATE = {
  risk_pressure: 0.85,
  liquidity_cost: 0.35,
  governance_pressure: 0.55,
}

function score(action: string, actor: Actor): number {
  const a = actor.weights
  let s = 0
  // Approximate: reduce-risk actions help risk, cost some PnL & liquidity.
  if (action === 'hold') {
    s += 0.05 * a.pnl - STATE.risk_pressure * 0.6 + actor.inertia
  } else if (action === 'hedge_25') {
    s += 0.20 * STATE.risk_pressure * (a.cvar + a.breach) - 0.20 * STATE.liquidity_cost * a.liquidity - 0.10 * a.pnl
  } else if (action === 'hedge_50') {
    s += 0.50 * STATE.risk_pressure * (a.cvar + a.breach) - 0.50 * STATE.liquidity_cost * a.liquidity - 0.20 * a.pnl
  } else if (action === 'hedge_75') {
    s += 0.75 * STATE.risk_pressure * (a.cvar + a.breach) - 0.85 * STATE.liquidity_cost * a.liquidity - 0.30 * a.pnl
  } else if (action === 'reduce_50') {
    s += 0.65 * STATE.risk_pressure * (a.cvar + a.breach) - 0.70 * STATE.liquidity_cost * a.liquidity - 0.40 * a.pnl
  } else if (action === 'escalate') {
    s += STATE.governance_pressure * (1.25 + 2.0 * a.governance) - (actor.id === 'trader' ? 0.35 : 0)
  }
  return s
}

const ACTIONS = ['hold', 'hedge_25', 'hedge_50', 'hedge_75', 'reduce_50', 'escalate'] as const

function softmax(xs: number[], temp: number): number[] {
  const t = Math.max(0.15, temp)
  const max = Math.max(...xs)
  const exps = xs.map((x) => Math.exp((x - max) / t))
  const total = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / total)
}

const ACTION_COLORS: Record<string, string> = {
  hold: 'bg-paper',
  hedge_25: 'bg-sage/30',
  hedge_50: 'bg-sage/50',
  hedge_75: 'bg-teal/50',
  reduce_50: 'bg-mustard/40',
  escalate: 'bg-coral/40',
}

export function ActorChoiceDemo() {
  const [actorId, setActorId] = useState(ACTORS[0].id)
  const actor = ACTORS.find((x) => x.id === actorId)!

  const probs = useMemo(() => {
    const scores = ACTIONS.map((a) => score(a, actor))
    return softmax(scores, actor.noise)
  }, [actor])

  const top = ACTIONS[probs.indexOf(Math.max(...probs))]

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        same situation —{' '}
        <span className="font-bold">stress at 85% of limit, normal liquidity</span>
        . each role brings their own preferences:
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {ACTORS.map((a) => (
          <button
            key={a.id}
            onClick={() => setActorId(a.id)}
            className={`p-2 rounded-lg border-[2px] transition-all text-left ${
              a.id === actorId
                ? 'border-ink bg-mustard/30 shadow-sketchSm'
                : 'border-ink/30 bg-cream hover:bg-paper'
            }`}
          >
            <div className="font-display text-xl">
              {a.emoji} {a.role}
            </div>
            <div className="font-hand text-xs text-ink/60">
              pnl·{(a.weights.pnl * 100).toFixed(0)} risk·{((a.weights.cvar + a.weights.breach) * 100).toFixed(0)} gov·{(a.weights.governance * 100).toFixed(0)}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={actor.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          <div className="font-body text-sm text-ink/80 italic mb-3">
            {actor.blurb}
          </div>

          <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
            <div className="font-hand text-ink/70 text-base mb-2">
              probability over actions:
            </div>
            <div className="space-y-2">
              {ACTIONS.map((a, i) => {
                const widthPct = probs[i] * 100
                return (
                  <div key={a} className="relative">
                    <div className="h-7 bg-cream rounded border-[1.5px] border-ink/30 overflow-hidden relative">
                      <motion.div
                        className={`h-full ${ACTION_COLORS[a]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-3 font-body text-sm">
                        <span className={a === top ? 'font-bold' : ''}>{a}</span>
                        <span className="font-hand tabular-nums">
                          {(probs[i] * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg border-[2px] border-dashed border-mustard bg-mustard/10">
            <div className="font-display text-2xl mb-1">
              {actor.emoji} most likely move:{' '}
              <span className="text-coral">{top}</span>
            </div>
            <div className="font-body text-sm text-ink/85 leading-snug">
              {actor.id === 'trader' &&
                'Traders weigh P&L heavily and have inertia bias — they\'d rather hold than de-risk if it\'s avoidable.'}
              {actor.id === 'risk' &&
                'Risk managers care most about CVaR and breach probability. They\'ll push for a meaningful hedge.'}
              {actor.id === 'desk_head' &&
                'Desk heads split the difference — they\'ll often go for a moderate hedge that protects governance without crushing P&L.'}
              {actor.id === 'credit' &&
                'Credit officers lean heavily on governance; they\'re quick to escalate when the situation looks dangerous.'}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ "what should we do?" doesn't have one answer. it depends on whose
        utility function is at the desk that day.
      </div>
    </div>
  )
}
