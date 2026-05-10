import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ActionEval = {
  id: string
  label: string
  expected_pnl: number
  cvar: number
  liquidity_cost: number
  breach_prob: number
  utility: number
}

// Hand-authored counterfactuals for one tense decision: stress at 88%, mid-vol day.
const ACTIONS: ActionEval[] = [
  { id: 'hold', label: 'hold', expected_pnl: 12, cvar: 410, liquidity_cost: 0, breach_prob: 0.42, utility: -5.4 },
  { id: 'hedge_25', label: 'hedge 25%', expected_pnl: 9, cvar: 320, liquidity_cost: 4, breach_prob: 0.22, utility: 1.2 },
  { id: 'hedge_50', label: 'hedge 50%', expected_pnl: 6, cvar: 220, liquidity_cost: 9, breach_prob: 0.08, utility: 4.6 },
  { id: 'hedge_75', label: 'hedge 75%', expected_pnl: 2, cvar: 130, liquidity_cost: 16, breach_prob: 0.03, utility: 3.1 },
  { id: 'reduce_50', label: 'reduce 50%', expected_pnl: 3, cvar: 175, liquidity_cost: 12, breach_prob: 0.05, utility: 3.8 },
  { id: 'roll_near_to_far', label: 'roll near→far', expected_pnl: 8, cvar: 360, liquidity_cost: 5, breach_prob: 0.30, utility: -1.4 },
]

const bestUtility = Math.max(...ACTIONS.map((a) => a.utility))
const bestAction = ACTIONS.find((a) => a.utility === bestUtility)!

function qualityLabel(regret: number): { label: string; color: string } {
  if (regret <= 0.5) return { label: 'effective', color: 'text-sage' }
  if (regret <= 1.5) return { label: 'defensible', color: 'text-teal' }
  if (regret <= 4.0) return { label: 'questionable', color: 'text-mustard' }
  return { label: 'poor', color: 'text-coral' }
}

export function RegretDemo() {
  const [pickedId, setPickedId] = useState<string | null>(null)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        you're in a tense spot — stress at 88%, vol elevated. before judging,
        the oracle simulates <em>every</em> feasible action down 500 future
        paths and computes a utility:
      </div>

      <div className="overflow-x-auto bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-4">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="font-hand text-ink/60 text-xs">
              <th className="text-left p-1">action</th>
              <th className="text-right p-1">E[P&amp;L]</th>
              <th className="text-right p-1">CVaR</th>
              <th className="text-right p-1">cost</th>
              <th className="text-right p-1">P(breach)</th>
              <th className="text-right p-1">utility</th>
              <th className="text-right p-1">regret</th>
            </tr>
          </thead>
          <tbody>
            {ACTIONS.map((a) => {
              const regret = bestUtility - a.utility
              const isBest = a.id === bestAction.id
              const isPicked = a.id === pickedId
              return (
                <tr
                  key={a.id}
                  onClick={() => setPickedId(a.id)}
                  className={`cursor-pointer transition-colors ${
                    isPicked
                      ? 'bg-mustard/30'
                      : isBest
                      ? 'bg-sage/15 hover:bg-sage/25'
                      : 'hover:bg-paper'
                  }`}
                >
                  <td className="p-1.5 font-bold">
                    {a.label}
                    {isBest && (
                      <span className="ml-1 font-hand text-sage text-xs">★ best</span>
                    )}
                  </td>
                  <td className="text-right p-1.5 tabular-nums">+€{a.expected_pnl}k</td>
                  <td className="text-right p-1.5 tabular-nums">€{a.cvar}k</td>
                  <td className="text-right p-1.5 tabular-nums">€{a.liquidity_cost}k</td>
                  <td className="text-right p-1.5 tabular-nums">{(a.breach_prob * 100).toFixed(0)}%</td>
                  <td className="text-right p-1.5 tabular-nums font-bold">{a.utility.toFixed(1)}</td>
                  <td className="text-right p-1.5 tabular-nums">
                    {regret === 0 ? '—' : regret.toFixed(1)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence mode="wait">
        {pickedId && (
          <motion.div
            key={pickedId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg border-[2px] border-dashed border-coral bg-coral/10"
          >
            {(() => {
              const a = ACTIONS.find((x) => x.id === pickedId)!
              const regret = bestUtility - a.utility
              const ql = qualityLabel(regret)
              const isBest = a.id === bestAction.id
              return (
                <>
                  <div className="font-display text-2xl mb-1">
                    you chose <span className="text-coral">{a.label}</span>{' '}
                    →{' '}
                    <span className={ql.color}>{ql.label}</span>
                  </div>
                  <div className="font-body text-base text-ink/85 leading-snug">
                    {isBest && 'You picked the highest-utility action. Regret = 0.'}
                    {!isBest && (
                      <>
                        Best feasible was <strong>{bestAction.label}</strong>{' '}
                        (utility {bestAction.utility.toFixed(1)}). Your action
                        scored {a.utility.toFixed(1)}. Regret = {regret.toFixed(1)}.
                        {regret <= 1.5 && ' Close enough to call defensible — different actor preferences would land here too.'}
                        {regret > 1.5 && regret <= 4.0 && ' This is a real gap — better risk/cost balance was available.'}
                        {regret > 4.0 && ' Materially worse than what was on the table. Hard to justify.'}
                      </>
                    )}
                  </div>
                </>
              )
            })()}
          </motion.div>
        )}
        {!pickedId && (
          <div className="font-hand text-ink/50 text-base text-center py-3">
            ↑ click an action above
          </div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ <span className="text-coral">regret</span> = "best utility I could have
        gotten" − "utility from what I actually did". it's the only way to grade
        a decision when you can't replay history.
      </div>
    </div>
  )
}
