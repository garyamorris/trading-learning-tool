import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Scenario = {
  id: string
  label: string
  emoji: string
  story: string
  shocks: { power: number; gas: number; carbon: number }
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cold_spell',
    label: 'cold spell',
    emoji: '❄️',
    story: 'A two-week cold front. Heating demand spikes; wind drops. Power and gas both jump.',
    shocks: { power: 0.16, gas: 0.18, carbon: 0.04 },
  },
  {
    id: 'gas_supply',
    label: 'gas supply shock',
    emoji: '🛢️',
    story: 'A major pipeline goes offline. Gas spikes ~25%, power follows because gas plants set the price.',
    shocks: { power: 0.18, gas: 0.24, carbon: 0.02 },
  },
  {
    id: 'low_wind',
    label: 'low wind drought',
    emoji: '🍃',
    story: 'A "wind drought" lingers for weeks. Power up; gas only mildly affected as backup ramps.',
    shocks: { power: 0.14, gas: 0.08, carbon: 0.02 },
  },
  {
    id: 'carbon_policy',
    label: 'carbon policy',
    emoji: '🏭',
    story: 'Surprise EU policy tightening. Carbon allowances jump 22%. Generation cost reshuffles.',
    shocks: { power: 0.06, gas: 0.02, carbon: 0.22 },
  },
  {
    id: 'liquidity',
    label: 'liquidity crisis',
    emoji: '💸',
    story: 'Markets seize up across all three commodities. Spreads blow out; everything is hard to trade.',
    shocks: { power: 0.10, gas: 0.10, carbon: 0.08 },
  },
]

const POSITION = { power: 145, gas: -25, carbon: 35 }
const SPOT = { power: 78, gas: 52, carbon: 74 }

function stressLoss(scenario: Scenario) {
  let pnl = 0
  ;(['power', 'gas', 'carbon'] as const).forEach((c) => {
    pnl += 0.10 * POSITION[c] * SPOT[c] * scenario.shocks[c]
  })
  return Math.max(0, -pnl)
}

export function StressTestDemo() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const losses = SCENARIOS.map((s) => ({ s, loss: stressLoss(s) }))
  const max = Math.max(...losses.map((x) => x.loss))
  const worst = losses.reduce((a, b) => (a.loss > b.loss ? a : b))
  const current = losses.find((x) => x.s.id === scenarioId)!

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        a power-heavy book is{' '}
        <span className="font-bold text-sage">long power +145</span>,{' '}
        <span className="font-bold text-coral">short gas −25</span>,{' '}
        <span className="font-bold text-sage">long carbon +35</span>. now
        imagine each scenario actually happens:
      </div>

      <div className="space-y-2 mb-5">
        {losses.map(({ s, loss }) => {
          const widthPct = (loss / Math.max(max, 1)) * 100
          const isPicked = s.id === scenarioId
          const isWorst = s.id === worst.s.id
          return (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`w-full text-left relative border-[2px] border-ink rounded-lg
                overflow-hidden transition-all shadow-sketchSm
                hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
                ${isPicked ? 'ring-4 ring-mustard/40' : ''} bg-cream`}
            >
              <motion.div
                className={`absolute inset-y-0 left-0 ${
                  isWorst ? 'bg-coral/40' : 'bg-rose/30'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.35 }}
              />
              <div className="relative flex items-center justify-between px-4 py-2">
                <span className="font-body text-base">
                  <span className="mr-2">{s.emoji}</span>
                  {s.label}
                  {isWorst && (
                    <span className="ml-2 font-hand text-coral text-sm">
                      worst case
                    </span>
                  )}
                </span>
                <span className="font-hand text-ink font-bold tabular-nums">
                  −€{loss.toFixed(0)}k
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.s.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="p-4 rounded-lg bg-paper/40 border-[2px] border-dashed border-ink/30 mb-3"
        >
          <div className="font-display text-2xl mb-1">
            {current.s.emoji} {current.s.label}
          </div>
          <div className="font-body text-base text-ink/85 mb-2 leading-snug">
            {current.s.story}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {(['power', 'gas', 'carbon'] as const).map((c) => (
              <div key={c} className="bg-cream rounded border-[1.5px] border-ink/30 p-2">
                <div className="font-hand text-ink/70 capitalize">{c} shock</div>
                <div className="font-display text-xl text-coral">
                  +{(current.s.shocks[c] * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ VaR is "what's a typical bad day." stress tests are "what if{' '}
        <em>this specific thing</em> happens." both numbers exist because
        neither is enough on its own.
      </div>
    </div>
  )
}
