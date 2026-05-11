import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Suspect = {
  id: string
  label: string
  icon: string
  hot: boolean
  delta: number
  evidence: string
  verdict: 'guilty' | 'innocent' | 'partial'
  partial_amount?: number
}

const SUSPECTS: Suspect[] = [
  {
    id: 'missing_trade',
    label: 'a trade missing from one feed',
    icon: '📭',
    hot: true,
    delta: 0,
    evidence:
      'Recon shows BO has 75 MW on power Q+1; FO and MO have 80 MW. The 5 MW gap doesn\'t explain €280k but it\'s the kind of thing that hides other gaps. Worth tracking but not the main cause.',
    verdict: 'innocent',
  },
  {
    id: 'stale_curve',
    label: 'a stale forward curve point',
    icon: '〽️',
    hot: true,
    delta: 0,
    evidence:
      "The gas M+1 NCG settle didn't refresh — the vendor feed failed (see chapter 5's exception EX_1043). MO ran with yesterday's value while the market moved €0.80. On a 155 MW short position, that's −€124k of attribution sitting in the wrong bucket.",
    verdict: 'partial',
    partial_amount: 124,
  },
  {
    id: 'model_commit',
    label: 'a pricing model change committed mid-week',
    icon: '🔧',
    hot: false,
    delta: 0,
    evidence:
      "The Asian pricer got a calibration tweak on Monday but the changelog says it only affects Q+2 onwards. Q+1 prices are unchanged. Not it.",
    verdict: 'innocent',
  },
  {
    id: 'double_book',
    label: 'a double-booked trade',
    icon: '👯',
    hot: true,
    delta: 0,
    evidence:
      'A power swap was rebooked yesterday after an amendment. The cancel-and-rebook usually nets to zero — but in this case the cancel didn\'t fire, so the position is counted twice for one day. That\'s €165k of imaginary P&L.',
    verdict: 'guilty',
    partial_amount: 165,
  },
  {
    id: 'cva_recalc',
    label: 'a CVA recalc (counterparty downgrade)',
    icon: '🏦',
    hot: false,
    delta: 0,
    evidence:
      'CP_017 got a Moody\'s notch yesterday. CVA on their book moved +€18k — small but real. Should be in its own bucket, not the residual.',
    verdict: 'partial',
    partial_amount: 18,
  },
  {
    id: 'fx_lag',
    label: 'an FX rate that lagged a day',
    icon: '💱',
    hot: false,
    delta: 0,
    evidence:
      "GBP positions are tiny on this book. Even a 1% FX move only contributes €2k. Not material.",
    verdict: 'innocent',
  },
]

const RESIDUAL_START = 280
const RESIDUAL_TARGET = 3 // €k tolerance

export function PnLExplainInAngerDemo() {
  const [explained, setExplained] = useState<Set<string>>(new Set())
  const [openId, setOpenId] = useState<string | null>(null)

  function toggle(id: string) {
    const next = new Set(explained)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExplained(next)
  }
  function reset() {
    setExplained(new Set())
    setOpenId(null)
  }

  const accountedFor = SUSPECTS.filter((s) => explained.has(s.id)).reduce((acc, s) => {
    if (s.verdict === 'innocent') return acc
    return acc + (s.partial_amount ?? 0)
  }, 0)
  const remaining = RESIDUAL_START - accountedFor
  const solved = Math.abs(remaining) <= RESIDUAL_TARGET

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        page 2 chapter 5 showed a clean P&amp;L attribution. this is the <span className="text-coral font-bold">broken</span> one. residual blew up to{' '}
        <strong>€{RESIDUAL_START}k</strong> — far past the €5k investigation threshold. find the leaks:
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-display text-base">📊 unexplained residual</span>
          <motion.span
            key={remaining}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`font-display text-3xl ${
              solved ? 'text-sage' : Math.abs(remaining) < 50 ? 'text-mustard' : 'text-coral'
            }`}
          >
            €{remaining.toFixed(0)}k
          </motion.span>
        </div>
        <div className="h-3 bg-cream rounded border-[1.5px] border-ink/30 overflow-hidden">
          <motion.div
            className={solved ? 'h-full bg-sage' : 'h-full bg-coral'}
            animate={{
              width: `${Math.max(0, Math.min(100, 100 - (Math.abs(remaining) / RESIDUAL_START) * 100))}%`,
            }}
          />
        </div>
        <div className="flex justify-between font-hand text-xs text-ink/55 mt-0.5">
          <span>start: €{RESIDUAL_START}k unexplained</span>
          <span>target: ≤ €{RESIDUAL_TARGET}k</span>
        </div>
      </div>

      <div className="font-hand text-ink/70 text-sm mb-2">
        the candidate causes — click to investigate each, tick the box if it's part of the answer:
      </div>

      <div className="space-y-1.5 mb-3">
        {SUSPECTS.map((s) => {
          const isOpen = openId === s.id
          const isExplained = explained.has(s.id)
          const isGuilty = s.verdict === 'guilty' || s.verdict === 'partial'
          return (
            <motion.div
              layout
              key={s.id}
              className={`rounded border-[2px] shadow-sketchSm ${
                isExplained
                  ? isGuilty
                    ? 'border-sage bg-sage/10'
                    : 'border-rose bg-rose/10'
                  : s.hot
                  ? 'border-mustard/60 bg-mustard/5'
                  : 'border-ink/30 bg-cream'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : s.id)}
                className="w-full text-left p-2 hover:bg-paper/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{s.icon}</span>
                    <span className="font-body text-sm">{s.label}</span>
                    {s.hot && !isExplained && (
                      <span className="font-hand text-[10px] text-mustard font-bold px-1 rounded border border-mustard">
                        likely
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isExplained && (
                      <span className={`font-hand text-xs ${isGuilty ? 'text-sage' : 'text-rose'}`}>
                        {s.verdict === 'guilty'
                          ? `guilty −€${s.partial_amount}k`
                          : s.verdict === 'partial'
                          ? `partial −€${s.partial_amount}k`
                          : 'innocent'}
                      </span>
                    )}
                    <span className="font-display text-base text-ink/40">{isOpen ? '−' : '+'}</span>
                  </div>
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 pb-2 pt-1 border-t border-ink/15">
                      <div className="font-body text-xs text-ink/85 leading-snug mb-1.5">
                        {s.evidence}
                      </div>
                      <button
                        onClick={() => toggle(s.id)}
                        className={`btn-sketch !text-xs !py-0.5 ${
                          isExplained ? 'bg-sage/40' : ''
                        }`}
                      >
                        {isExplained ? '✓ marked as explained' : '+ mark as cause'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg border-[2px] border-dashed border-sage bg-sage/10"
        >
          <div className="font-display text-base text-sage">
            ✓ explain complete · residual reduced to defensible noise
          </div>
          <div className="font-body text-sm text-ink/85 leading-snug">
            The €280k decomposes into: <strong>−€124k stale-curve attribution misplacement</strong>,{' '}
            <strong>−€165k phantom from a failed cancel-and-rebook</strong>, +€18k CVA recalc. Total tracked: €307k against a €280k starting residual — meaning the cancel-and-rebook hit was actually <em>masking</em> some genuine P&amp;L. Now everything's accounted for.
          </div>
          <button onClick={reset} className="btn-sketch !text-xs !py-0.5 mt-2">↻ start over</button>
        </motion.div>
      )}

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ when the residual blows up, the middle office is the{' '}
        <span className="text-coral">first responder</span>. tomorrow's published P&amp;L can't go out until this is solved.
      </div>
    </div>
  )
}
