import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STAGES = [
  {
    id: 'market',
    title: 'market state',
    icon: '🌍',
    body: (
      <ul className="space-y-1 font-body text-sm">
        <li>• regime: <strong>cold spell</strong></li>
        <li>• power spot: <strong>€132 / MWh</strong> (vs €78 in normal)</li>
        <li>• gas spot: <strong>€71 / MWh</strong></li>
        <li>• vol multiplier: <strong>×1.4</strong></li>
        <li>• liquidity: <strong>normal</strong></li>
      </ul>
    ),
    note: 'Where the market is right now. Same input every actor and model sees.',
  },
  {
    id: 'portfolio',
    title: 'portfolio snapshot',
    icon: '📦',
    body: (
      <ul className="space-y-1 font-body text-sm">
        <li>• desk: <strong>Power Hedge</strong>, book BOOK_007</li>
        <li>• power Δ: <strong>+145 MW</strong> (long)</li>
        <li>• gas Δ: <strong>−25 MW</strong></li>
        <li>• carbon Δ: <strong>+35 t</strong></li>
        <li>• MTM: <strong>+€1,210k</strong></li>
        <li>• recent P&amp;L: <strong>+€42k</strong> trailing</li>
      </ul>
    ),
    note: 'Position deltas. Long power into a cold spell looks like a friendly setup — until you see the risk numbers.',
  },
  {
    id: 'risk',
    title: 'risk snapshot',
    icon: '📈',
    body: (
      <ul className="space-y-1 font-body text-sm">
        <li>• VaR 95% (10d): <strong>€304k</strong></li>
        <li>• CVaR 95% (10d): <strong>€388k</strong></li>
        <li>• stress (cold spell): <strong>€198k</strong></li>
        <li>• breach probability (10d): <strong>34%</strong></li>
      </ul>
    ),
    note: 'CVaR alone tells you almost nothing. CVaR vs limit is what matters — and that\'s the next box.',
  },
  {
    id: 'governance',
    title: 'governance state',
    icon: '⚖️',
    body: (
      <ul className="space-y-1 font-body text-sm">
        <li>• VaR utilisation: <strong className="text-mustard">91%</strong></li>
        <li>• CVaR utilisation: <strong className="text-mustard">91%</strong></li>
        <li>• stress utilisation: <strong className="text-coral">88% (warning)</strong></li>
        <li>• approval status: <strong>approval_required</strong></li>
        <li>• approval path: <strong>risk_manager</strong></li>
      </ul>
    ),
    note: 'The trader can still trade, but every move needs a risk manager sign-off. "hold" carries a governance penalty here.',
  },
  {
    id: 'actor',
    title: 'actor & action',
    icon: '👔',
    body: (
      <ul className="space-y-1 font-body text-sm">
        <li>• actor: <strong>POWER_HEDGE_DESK_RISK_MANAGER</strong></li>
        <li>• role: <strong>Risk manager</strong> (cvar+breach weights ≈ 60%)</li>
        <li>• feasible actions: hold, hedge_25, hedge_50, hedge_75, reduce_25, reduce_50, escalate</li>
        <li>• <span className="text-coral font-bold">chosen action: hedge_50</span></li>
        <li>• logged reason: <em>"VaR utilisation near limit; hedge selected to reduce directional exposure."</em></li>
      </ul>
    ),
    note: 'The risk manager picks hedge_50. A trader in the same seat would more likely have picked hedge_25 or hold.',
  },
  {
    id: 'oracle',
    title: 'counterfactual oracle (hidden)',
    icon: '🔮',
    body: (
      <div>
        <div className="font-body text-sm mb-2">
          The oracle simulates every feasible action down 500 paths:
        </div>
        <table className="w-full text-xs font-body">
          <thead className="font-hand text-ink/60">
            <tr>
              <th className="text-left">action</th>
              <th className="text-right">utility</th>
              <th className="text-right">regret</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            <tr><td>hold</td><td className="text-right">−4.2</td><td className="text-right">7.6</td></tr>
            <tr><td>hedge_25</td><td className="text-right">+1.1</td><td className="text-right">2.3</td></tr>
            <tr className="bg-mustard/30"><td className="font-bold">hedge_50</td><td className="text-right font-bold">+3.1</td><td className="text-right">0.3</td></tr>
            <tr className="bg-sage/20"><td className="font-bold">hedge_75 ★</td><td className="text-right font-bold">+3.4</td><td className="text-right">0.0</td></tr>
            <tr><td>reduce_50</td><td className="text-right">+2.5</td><td className="text-right">0.9</td></tr>
            <tr><td>escalate</td><td className="text-right">+0.4</td><td className="text-right">3.0</td></tr>
          </tbody>
        </table>
      </div>
    ),
    note: 'Best feasible was hedge_75 by a hair. Chosen action (hedge_50) had regret 0.3 → quality label "effective".',
  },
  {
    id: 'outcome',
    title: 'realised outcome (T+10)',
    icon: '📊',
    body: (
      <ul className="space-y-1 font-body text-sm">
        <li>• observed P&amp;L: <strong>−€18k</strong></li>
        <li>• observed CVaR change: <strong>−€140k</strong></li>
        <li>• observed limit breach: <strong>no</strong></li>
        <li>• decision quality: <strong className="text-sage">effective</strong></li>
        <li>• outcome: <strong className="text-mustard">slightly negative</strong></li>
        <li>• hindsight label: <strong>good_decision_bad_outcome</strong></li>
      </ul>
    ),
    note: 'A small loss. The naive review says "the hedge cost us money." The honest review says "the hedge bought protection that didn\'t end up being needed — and the decision was right." This is exactly the trap from Chapter 12.',
  },
]

export function DecisionCardDemo() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        one full decision in the synthetic world. click each box to expand:
      </div>

      <div className="space-y-2">
        {STAGES.map((s, i) => {
          const open = openIdx === i
          return (
            <div
              key={s.id}
              className="border-[2px] border-ink rounded-lg overflow-hidden bg-cream shadow-sketchSm"
            >
              <button
                onClick={() => setOpenIdx(open ? -1 : i)}
                className="w-full text-left p-3 flex items-center justify-between hover:bg-paper transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="font-hand text-ink/60 text-xs uppercase tracking-widest">
                      step {i + 1}
                    </div>
                    <div className="font-display text-xl">{s.title}</div>
                  </div>
                </div>
                <span className="font-display text-2xl text-ink/40">
                  {open ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-ink/15">
                      <div className="bg-paper/40 rounded-lg p-3 mb-2">
                        {s.body}
                      </div>
                      <div className="font-hand text-ink/70 text-base italic">
                        ✦ {s.note}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is one row in the dataset. multiply it by 50,000 decisions across
        40 books over 5 years and you have a research-scale ETRM benchmark.
      </div>
    </div>
  )
}
