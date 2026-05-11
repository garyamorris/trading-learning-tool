import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Approach = {
  id: string
  label: string
  emoji: string
  trader_response: string
  short_outcome: string
  long_outcome: string
  trader_relation: number // -3 to +3, change
  control_strength: number // -3 to +3, change
  bonus_pressure_delta: number
}

const APPROACHES: Approach[] = [
  {
    id: 'cave',
    label: 'cave · accept the trader\'s mark',
    emoji: '🫠',
    trader_response: '"Glad you saw sense. Let\'s move on. Same time tomorrow?"',
    short_outcome: 'Day saved. Trader happy. Mark goes in at their level. No documented break.',
    long_outcome: 'You\'ve just told this trader (and everyone watching) that pressure works. Their marks will be optimistic again next week. And the week after. And eventually you\'re explaining to an auditor why a pattern of mismarks exists in your records.',
    trader_relation: +2,
    control_strength: -3,
    bonus_pressure_delta: 0,
  },
  {
    id: 'hold',
    label: 'hold the line · document the break',
    emoji: '🛡️',
    trader_response: '"I disagree but I see it\'s documented. I\'ll appeal to the desk head."',
    short_outcome: 'Break recorded. Reserve held. Trader\'s bonus accrual reflects the MO mark. Awkward week ahead.',
    long_outcome: 'The right answer in 80% of cases. The trader respects you slightly less in the moment and significantly more six months later. Pattern of standing your ground builds the kind of MO that the CRO defends in board meetings.',
    trader_relation: -1,
    control_strength: +2,
    bonus_pressure_delta: 0,
  },
  {
    id: 'compromise',
    label: 'compromise · split the difference',
    emoji: '🤝',
    trader_response: '"I can live with that. Thanks for being reasonable."',
    short_outcome: 'Mark goes in halfway between trader and MO. Both sides slightly unhappy but it ships.',
    long_outcome: 'Sometimes legitimate (when the price is genuinely uncertain) — but it can become a habit. The MO that always splits the difference is gradually pulled toward the trader\'s direction over years. If you\'re going to compromise, make sure there\'s a documented reason — not just a desire for peace.',
    trader_relation: 0,
    control_strength: -1,
    bonus_pressure_delta: -1,
  },
  {
    id: 'escalate_desk',
    label: 'escalate to desk head',
    emoji: '🪜',
    trader_response: '"You\'re really going to make me argue this with my boss? Fine."',
    short_outcome: 'Desk head reviews. Often sides with MO (their own job is also at risk from a control failure). Decision documented above the trader\'s pay grade.',
    long_outcome: 'Used sparingly, this is a powerful tool. Used too often, you become "the MO who can\'t resolve things". Used too rarely, you give in to pressure you shouldn\'t.',
    trader_relation: -1,
    control_strength: +1,
    bonus_pressure_delta: -1,
  },
  {
    id: 'escalate_compliance',
    label: 'escalate straight to compliance',
    emoji: '🚨',
    trader_response: '"You\'re calling compliance? On THIS? Are you insane?"',
    short_outcome: 'Compliance opens a file. The trader is now in a formal process. Goodwill: zero. Mark held.',
    long_outcome: 'Reserved for pattern behaviour, suspected fraud, or any whiff of market abuse. Use this when you have to. If the pattern is real, you\'ll be glad you did. If you misjudge the situation, you\'ve burned a relationship for years.',
    trader_relation: -3,
    control_strength: +3,
    bonus_pressure_delta: -3,
  },
]

const VIGNETTE = {
  trader: 'Sam (senior power trader, top-3 P&L on the desk)',
  position: 'long 60 MW power Cal+2 illiquid',
  trader_mark: '€92.00',
  ipv_mark: '€86.50',
  trader_explanation:
    '"That\'s where I traded last week. The market\'s moved. Consensus is stale on this tenor. €92 is correct."',
  mo_view:
    'The position has been re-marked higher than consensus for 4 of the last 5 days. Combined unjustified P&L impact ~€330k. Today\'s gap alone is €220k.',
  bonus_context:
    'Cal+2 P&L sits in Sam\'s bonus pool for end-of-year compensation. They have a strong incentive for the mark to stay up.',
}

function bar(v: number, label: string, posColor: string, negColor: string) {
  const pct = Math.min(100, Math.abs(v) * 33)
  const isPos = v > 0
  const color = v === 0 ? 'bg-ink/20' : isPos ? posColor : negColor
  return (
    <div>
      <div className="flex justify-between font-hand text-[10px] text-ink/60">
        <span>{label}</span>
        <span className="font-bold">
          {isPos ? '+' : ''}
          {v}
        </span>
      </div>
      <div className="h-2 bg-paper rounded overflow-hidden flex">
        <div className="w-1/2 flex justify-end">
          {!isPos && (
            <motion.div className={color} style={{ height: '100%' }} animate={{ width: `${pct}%` }} />
          )}
        </div>
        <div className="w-1/2">
          {isPos && (
            <motion.div className={color} style={{ height: '100%' }} animate={{ width: `${pct}%` }} />
          )}
        </div>
      </div>
    </div>
  )
}

export function PoliticalRealityDemo() {
  const [picked, setPicked] = useState<string | null>(null)
  const approach = APPROACHES.find((a) => a.id === picked)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        every middle office function eventually meets <strong>this</strong>. it&apos;s not in the textbook:
      </div>

      {/* SCENARIO */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <div className="font-display text-base mb-1">🎭 the situation</div>
        <div className="font-body text-sm text-ink/85 space-y-1 leading-snug">
          <div>
            <strong>trader:</strong> {VIGNETTE.trader}
          </div>
          <div>
            <strong>position:</strong> {VIGNETTE.position}
          </div>
          <div>
            <strong>trader&apos;s mark:</strong> <span className="text-coral font-bold">{VIGNETTE.trader_mark}</span>
            {' · '}
            <strong>IPV mark:</strong> <span className="text-teal font-bold">{VIGNETTE.ipv_mark}</span>
            {' · '}
            <strong>gap:</strong> <span className="text-rose font-bold">€220k</span>
          </div>
          <div className="pt-1 border-t border-ink/15 mt-1">
            <span className="font-hand text-coral">trader says:</span>{' '}
            <em>{VIGNETTE.trader_explanation}</em>
          </div>
          <div>
            <span className="font-hand text-teal">MO view:</span> {VIGNETTE.mo_view}
          </div>
          <div className="font-hand text-xs text-ink/55 italic">
            ⓘ {VIGNETTE.bonus_context}
          </div>
        </div>
      </div>

      <div className="font-hand text-ink/70 text-sm mb-2">
        what do you do? pick an approach — each has short-term and long-term consequences:
      </div>

      <div className="space-y-1.5 mb-3">
        {APPROACHES.map((a) => (
          <button
            key={a.id}
            onClick={() => setPicked(a.id)}
            className={`w-full text-left rounded border-[2px] p-2 transition-colors shadow-sketchSm ${
              picked === a.id
                ? 'border-mustard bg-mustard/15 ring-2 ring-mustard/30'
                : 'border-ink/30 bg-cream hover:bg-paper'
            }`}
          >
            <div className="font-display text-sm">
              {a.emoji} {a.label}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {approach && (
          <motion.div
            key={approach.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-cream rounded-lg border-[2px] border-ink/30 p-3 mb-3">
              <div className="font-display text-base mb-1">
                {approach.emoji} you chose: <em>{approach.label.split(' · ')[0]}</em>
              </div>
              <div className="font-body text-sm text-ink/85 mb-2 italic leading-snug">
                <span className="font-hand text-coral">trader says:</span> {approach.trader_response}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <div className="p-2 rounded bg-sage/10 border-[1.5px] border-sage/50">
                  <div className="font-hand text-xs text-sage font-bold">today</div>
                  <div className="font-body text-xs leading-snug">{approach.short_outcome}</div>
                </div>
                <div className="p-2 rounded bg-coral/10 border-[1.5px] border-coral/50">
                  <div className="font-hand text-xs text-coral font-bold">six months later</div>
                  <div className="font-body text-xs leading-snug">{approach.long_outcome}</div>
                </div>
              </div>
              <div className="space-y-1">
                {bar(approach.trader_relation, 'trader relationship', 'bg-sage', 'bg-coral')}
                {bar(approach.control_strength, 'control strength', 'bg-sage', 'bg-coral')}
                {bar(approach.bonus_pressure_delta, 'trader bonus pressure on MO', 'bg-coral', 'bg-sage')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ a good middle office doesn&apos;t pick &quot;hold the line&quot; every time — it picks{' '}
        <span className="text-coral">the right tool for the right break</span>, and builds a reputation for both fairness and spine.
      </div>
    </div>
  )
}
