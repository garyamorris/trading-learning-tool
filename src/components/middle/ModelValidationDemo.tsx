import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Instrument = {
  id: string
  desc: string
  type: 'forward' | 'european_call' | 'asian' | 'swing' | 'swaption'
  trader_price: number
  mv_price: number
  trader_assumption: string
  mv_assumption: string
  divergence_kind: 'noise' | 'calibration' | 'structural'
  ruling: string
}

const PORTFOLIO: Instrument[] = [
  {
    id: 'I_001',
    desc: 'power forward · M+1 · DE base',
    type: 'forward',
    trader_price: 84.50,
    mv_price: 84.48,
    trader_assumption: 'EEX broker mid quote',
    mv_assumption: 'consensus from Markit + EEX settle',
    divergence_kind: 'noise',
    ruling: '✓ Bid-ask noise on a vanilla forward. No model risk here. Log and pass.',
  },
  {
    id: 'I_004',
    desc: 'power European call · K=90 · M+6',
    type: 'european_call',
    trader_price: 4.85,
    mv_price: 4.62,
    trader_assumption: 'lognormal Black-76, flat ATM vol = 34%',
    mv_assumption: 'lognormal Black-76, vol surface w/ skew (vol@K=90 = 33.1%)',
    divergence_kind: 'calibration',
    ruling: '⚠ Calibration disagreement. Trader uses flat ATM vol; MO uses the full surface and the OTM strike sees lower vol. MO is right but the magnitude is small — reserve 5% of position value.',
  },
  {
    id: 'I_009',
    desc: 'gas Asian (avg) · 30 obs · Q+1',
    type: 'asian',
    trader_price: 2.41,
    mv_price: 2.18,
    trader_assumption: 'closed-form geometric-Asian approximation',
    mv_assumption: 'Monte Carlo arithmetic-Asian, 100k paths, control variate',
    divergence_kind: 'structural',
    ruling: '⚠ Structural divergence: trader uses geometric Asian (closed form, faster) as proxy for arithmetic. MO does the actual MC. €230k of position value sits in this gap on a €15m book. Reserve in full + escalate to Model Risk committee.',
  },
  {
    id: 'I_014',
    desc: 'power swing (daily, period Q+1)',
    type: 'swing',
    trader_price: 18.40,
    mv_price: 17.95,
    trader_assumption: 'strip-of-dailies, no exercise correlation',
    mv_assumption: 'least-squares MC w/ exercise dependence',
    divergence_kind: 'structural',
    ruling: '⚠ Structural. Trader\'s simpler model ignores exercise-day correlations and overprices flexibility. MO\'s LSM is more correct but much slower. Reserve 2.5% of position; revisit after Model Risk reviews the assumption.',
  },
  {
    id: 'I_017',
    desc: 'gas swaption · expiry M+3 · K=ATM',
    type: 'swaption',
    trader_price: 6.10,
    mv_price: 6.08,
    trader_assumption: 'Hull-White short-rate w/ calibrated mean reversion',
    mv_assumption: 'Hull-White short-rate w/ different calibration period',
    divergence_kind: 'noise',
    ruling: '✓ Same model, both calibrated within tolerance. Differences are second-order. No reserve needed.',
  },
]

const KIND_META = {
  noise: { color: 'sage', label: 'noise', icon: '·' },
  calibration: { color: 'mustard', label: 'calibration', icon: '⚙️' },
  structural: { color: 'rose', label: 'structural', icon: '⚠' },
} as const

const KIND_BG: Record<string, string> = {
  sage: 'border-sage bg-sage/10',
  mustard: 'border-mustard bg-mustard/10',
  rose: 'border-rose bg-rose/10',
}

export function ModelValidationDemo() {
  const [openId, setOpenId] = useState<string | null>('I_009')

  const summary = useMemo(() => {
    const out = { noise: 0, calibration: 0, structural: 0 }
    for (const i of PORTFOLIO) out[i.divergence_kind]++
    return out
  }, [])

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        the MO doesn't only re-mark prices — it re-implements the <em>pricing models</em> too. five instruments, two implementations, three kinds of divergence:
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {(['noise', 'calibration', 'structural'] as const).map((k) => {
          const m = KIND_META[k]
          return (
            <div key={k} className={`p-2 rounded border-[1.5px] text-center ${KIND_BG[m.color]}`}>
              <div className="font-hand text-xs text-ink/60">{m.icon} {m.label}</div>
              <div className="font-display text-2xl">{summary[k]}</div>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        {PORTFOLIO.map((i) => {
          const m = KIND_META[i.divergence_kind]
          const diff = i.trader_price - i.mv_price
          const diffPct = (diff / i.mv_price) * 100
          const isOpen = openId === i.id
          return (
            <motion.div
              layout
              key={i.id}
              className={`rounded-lg border-[2px] shadow-sketchSm ${KIND_BG[m.color]}`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : i.id)}
                className="w-full text-left p-2 hover:bg-paper/30 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold">{i.id}</span>
                    <span className="font-body text-xs truncate">{i.desc}</span>
                  </div>
                  <div className="flex items-baseline gap-2 shrink-0">
                    <span className="font-mono text-xs">
                      trader: <strong>€{i.trader_price.toFixed(2)}</strong>
                    </span>
                    <span className="text-ink/40">·</span>
                    <span className="font-mono text-xs">
                      MV: <strong>€{i.mv_price.toFixed(2)}</strong>
                    </span>
                    <span className={`font-hand text-xs px-1 rounded font-bold ${
                      Math.abs(diffPct) < 1 ? 'text-sage' : Math.abs(diffPct) < 5 ? 'text-mustard' : 'text-rose'
                    }`}>
                      Δ {diff > 0 ? '+' : ''}{diffPct.toFixed(1)}%
                    </span>
                    <span className="font-display text-base text-ink/40">{isOpen ? '−' : '+'}</span>
                  </div>
                </div>
              </button>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <div className="px-2 pb-2 pt-1 border-t border-ink/15 space-y-1.5">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-coral/10 border-[1.5px] border-coral/40 rounded p-1.5">
                        <div className="font-hand text-coral text-[10px] mb-0.5">trader's model</div>
                        <div className="font-body leading-snug">{i.trader_assumption}</div>
                      </div>
                      <div className="bg-teal/10 border-[1.5px] border-teal/40 rounded p-1.5">
                        <div className="font-hand text-teal text-[10px] mb-0.5">MO's independent model</div>
                        <div className="font-body leading-snug">{i.mv_assumption}</div>
                      </div>
                    </div>
                    <div className="font-body text-xs text-ink/85 italic leading-snug">{i.ruling}</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ <span className="text-coral">model risk reserves</span> (the MR bar in chapter 4) come from exactly this exercise. without a second implementation, you can't even measure it.
      </div>
    </div>
  )
}
