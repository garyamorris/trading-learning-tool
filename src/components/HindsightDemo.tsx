import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Case = {
  id: string
  story: string
  decisionWasGood: boolean
  outcomeWasGood: boolean
  decisionExplanation: string
  outcomeExplanation: string
  trap: string
}

const CASES: Case[] = [
  {
    id: 'good_bad',
    story: 'A trader hedged 50% of a long power position before a heatwave forecast. The heatwave never materialised — prices fell. The hedge cost €40k.',
    decisionWasGood: true,
    outcomeWasGood: false,
    decisionExplanation: 'Given the forecast, hedging matched both the risk picture and the actor\'s mandate. CVaR was high; the action reduced it. Regret was small.',
    outcomeExplanation: 'Weather went the other way. The unhedged position would have made more money. But the trader didn\'t know that at the time — and couldn\'t have.',
    trap: 'A hindsight reviewer says "you wasted €40k on hedging." But you can\'t evaluate a 95th-percentile-protection decision by the realisation of the 50th percentile.',
  },
  {
    id: 'bad_good',
    story: 'A trader held a near-month position into stress utilisation of 92%, ignoring an escalation prompt. Prices happened to drift down. The book made €30k.',
    decisionWasGood: false,
    outcomeWasGood: true,
    decisionExplanation: 'Hold was the lowest-utility feasible action — limit pressure was real, the breach probability was 35%. Regret vs. hedge_50 was material.',
    outcomeExplanation: 'They got lucky. The dice rolled their way. In 35% of futures the desk would have crossed the limit and burned the rest of the year cleaning up.',
    trap: 'The P&L looks great. But "made money" doesn\'t mean "decided well." Rewarding this becomes a slow disaster — every trader learns to ignore breach probabilities.',
  },
  {
    id: 'good_good',
    story: 'A risk manager pushed for hedge_75 the morning of an EU carbon-policy announcement. The announcement was hawkish; carbon spiked 14%. The hedge saved €120k.',
    decisionWasGood: true,
    outcomeWasGood: true,
    decisionExplanation: 'Stress utilisation was elevated and CVaR was meaningful. The hedge was the highest-utility feasible action.',
    outcomeExplanation: 'The shock arrived. The hedge worked exactly as designed.',
    trap: 'These cases are easy to celebrate — but they\'re also the easiest to confuse for "good decision-making" when the same decision in calm weather would still have been right.',
  },
  {
    id: 'bad_bad',
    story: 'A trader rejected escalation, requested a limit exception with no real justification, and held into a cold spell. Prices spiked the wrong way. The book lost €260k.',
    decisionWasGood: false,
    outcomeWasGood: false,
    decisionExplanation: 'request_limit_exception with no constraint to justify it carries a heavy governance penalty. Hold under those breach conditions was near the worst utility on the menu.',
    outcomeExplanation: 'The bad bet paid off badly. The two are correlated but not the same thing.',
    trap: 'Easy to call. But notice: this is the only quadrant where hindsight and decision quality agree. The other three need careful reasoning to avoid wrong lessons.',
  },
]

const QUADRANT_BG = {
  'true-true': 'bg-sage/15 border-sage',
  'true-false': 'bg-mustard/15 border-mustard',
  'false-true': 'bg-coral/10 border-coral',
  'false-false': 'bg-rose/15 border-rose',
}

export function HindsightDemo() {
  const [caseId, setCaseId] = useState(CASES[0].id)
  const [picked, setPicked] = useState<{ d: boolean; o: boolean } | null>(null)
  const [revealed, setRevealed] = useState(false)
  const c = CASES.find((x) => x.id === caseId)!

  function pick(d: boolean, o: boolean) {
    if (revealed) return
    setPicked({ d, o })
    setRevealed(true)
  }

  function next() {
    const idx = CASES.findIndex((x) => x.id === caseId)
    setCaseId(CASES[(idx + 1) % CASES.length].id)
    setPicked(null)
    setRevealed(false)
  }

  const correct =
    picked && picked.d === c.decisionWasGood && picked.o === c.outcomeWasGood

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-2">
        a real story. read it, then place it in the 2×2:
      </div>
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-4 mb-4 font-body text-base leading-relaxed">
        {c.story}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { d: true, o: true, label: 'good decision · good outcome', emoji: '🌟' },
          { d: true, o: false, label: 'good decision · bad outcome', emoji: '😬' },
          { d: false, o: true, label: 'bad decision · good outcome', emoji: '🍀' },
          { d: false, o: false, label: 'bad decision · bad outcome', emoji: '💥' },
        ].map((q) => {
          const isPicked = picked?.d === q.d && picked?.o === q.o
          const isCorrect = revealed && c.decisionWasGood === q.d && c.outcomeWasGood === q.o
          const key = `${q.d}-${q.o}` as keyof typeof QUADRANT_BG
          let cls = 'border-ink/30 bg-cream hover:bg-paper'
          if (revealed) {
            cls = isCorrect ? QUADRANT_BG[key] : 'border-ink/20 bg-paper/30 opacity-60'
          } else if (isPicked) {
            cls = 'border-mustard bg-mustard/30'
          }
          return (
            <button
              key={q.label}
              onClick={() => pick(q.d, q.o)}
              disabled={revealed}
              className={`p-3 rounded-lg border-[2.5px] text-left transition-all shadow-sketchSm ${cls}`}
            >
              <div className="font-display text-xl">
                {q.emoji} {q.label}
              </div>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border-[2px] border-dashed border-coral bg-coral/5"
          >
            <div className="font-display text-2xl mb-2">
              {correct ? '✦ correct quadrant.' : '✦ ah — different quadrant.'}
            </div>
            <div className="space-y-2 font-body text-sm leading-relaxed">
              <div>
                <span className="font-hand text-coral">decision quality:</span>{' '}
                <strong>{c.decisionWasGood ? 'good' : 'bad'}</strong>.{' '}
                {c.decisionExplanation}
              </div>
              <div>
                <span className="font-hand text-coral">outcome:</span>{' '}
                <strong>{c.outcomeWasGood ? 'good' : 'bad'}</strong>.{' '}
                {c.outcomeExplanation}
              </div>
              <div className="pt-2 mt-2 border-t border-ink/15">
                <span className="font-hand text-mustard text-base">⚠️ the hindsight trap:</span>{' '}
                {c.trap}
              </div>
            </div>
            <button onClick={next} className="btn-sketch bg-coral/40 mt-3">
              try another →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ "the desk made money" is not the same thing as "the desk decided well."
        the four quadrants are independent — and judging on outcomes alone
        teaches the wrong lessons.
      </div>
    </div>
  )
}
