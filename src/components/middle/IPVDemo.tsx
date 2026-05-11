import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Position = {
  id: string
  desc: string
  volume: number
  traderMark: number
  ipvMark: number
  liquidity: 'liquid' | 'semi' | 'illiquid'
  story: 'noise' | 'stale' | 'model' | 'mismark'
}

const POSITIONS: Position[] = [
  { id: 'P_001', desc: 'power M+1 (DE base)', volume: 145, traderMark: 84.50, ipvMark: 84.40, liquidity: 'liquid', story: 'noise' },
  { id: 'P_002', desc: 'gas M+1 (NCG)', volume: -155, traderMark: 53.20, ipvMark: 53.30, liquidity: 'liquid', story: 'noise' },
  { id: 'P_003', desc: 'power Q+1', volume: 80, traderMark: 89.00, ipvMark: 87.50, liquidity: 'semi', story: 'stale' },
  { id: 'P_004', desc: 'gas Cal+2', volume: 60, traderMark: 75.50, ipvMark: 78.20, liquidity: 'illiquid', story: 'model' },
  { id: 'P_005', desc: 'carbon Cal+1', volume: 35, traderMark: 82.10, ipvMark: 82.20, liquidity: 'liquid', story: 'noise' },
  { id: 'P_006', desc: 'power Cal+2 (illiquid book)', volume: 40, traderMark: 92.00, ipvMark: 86.50, liquidity: 'illiquid', story: 'mismark' },
]

const THRESHOLD_ABS = 100 // €k absolute break
const THRESHOLD_REL = 0.05 // 5% relative

const STORY_EXPLAIN: Record<Position['story'], { title: string; body: string; severity: 'low' | 'med' | 'high' }> = {
  noise: {
    title: '✓ within tolerance · bid-ask noise',
    body: 'A small gap on a liquid position is fine — different price sources, different snap times. No action required, just log it.',
    severity: 'low',
  },
  stale: {
    title: '⚠ stale trader mark',
    body: "The trader's price is from the previous afternoon. The IPV pulled fresh consensus this morning and prices moved. Ask the desk to re-mark.",
    severity: 'med',
  },
  model: {
    title: '⚠ structural model disagreement',
    body: "Illiquid tenor — the trader's pricing model is extrapolating from M+1 broker quotes. The IPV uses a different model with a heavier seasonal calibration. Either is defensible. Escalate to model validation, document the choice.",
    severity: 'med',
  },
  mismark: {
    title: '🚨 possible deliberate mismark',
    body: "Illiquid Cal+2 marked €5.50 above the independent consensus on a 40 MW long. That's €220k of unjustified P&L. Compare to the position's history: was this gap there yesterday? If it just appeared, escalate to compliance immediately.",
    severity: 'high',
  },
}

function pnlImpact(p: Position): number {
  // (trader_mark - ipv_mark) * volume * 0.10 (€k convention used elsewhere in the app)
  return (p.traderMark - p.ipvMark) * p.volume * 0.10
}

export function IPVDemo() {
  const [openId, setOpenId] = useState<string | null>(null)

  const rows = POSITIONS.map((p) => {
    const impact = pnlImpact(p)
    const absImpact = Math.abs(impact)
    const relImpact = absImpact / (p.traderMark * Math.abs(p.volume) * 0.10 + 1)
    const isBreak = absImpact > THRESHOLD_ABS || relImpact > THRESHOLD_REL
    return { p, impact, isBreak }
  })

  const totalTrader = rows.reduce((s, r) => s + r.p.traderMark * r.p.volume * 0.10, 0)
  const totalIPV = rows.reduce((s, r) => s + r.p.ipvMark * r.p.volume * 0.10, 0)
  const totalImpact = totalTrader - totalIPV
  const breakCount = rows.filter((r) => r.isBreak).length

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        same six positions, two independent marks. the trader's marks come from broker mid quotes they hand-pick. the middle office's marks come from consensus services. they're <em>always</em> a little different. above a threshold, the difference is a <span className="text-coral font-bold">P&amp;L break</span>:
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 overflow-hidden mb-3">
        <div className="grid grid-cols-12 bg-cream/60 border-b-[1.5px] border-ink/30 font-hand text-xs text-ink/60 px-2 py-1.5">
          <div className="col-span-3">position</div>
          <div className="col-span-1 text-right">vol</div>
          <div className="col-span-2 text-right text-teal">trader's mark</div>
          <div className="col-span-2 text-right text-coral">IPV mark</div>
          <div className="col-span-2 text-right">P&amp;L impact</div>
          <div className="col-span-2 text-right">status</div>
        </div>
        {rows.map(({ p, impact, isBreak }) => {
          const isOpen = openId === p.id
          const story = STORY_EXPLAIN[p.story]
          const severityColor = story.severity === 'high' ? 'rose' : story.severity === 'med' ? 'mustard' : 'sage'
          return (
            <div
              key={p.id}
              className={`border-b border-ink/15 last:border-b-0 transition-colors ${
                isBreak ? 'bg-coral/5' : ''
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : p.id)}
                className="w-full grid grid-cols-12 px-2 py-1.5 text-sm hover:bg-paper/40 transition-colors"
              >
                <div className="col-span-3 text-left">
                  <div className="font-mono text-xs font-bold">{p.id}</div>
                  <div className="font-body text-xs text-ink/70 truncate">{p.desc}</div>
                </div>
                <div className="col-span-1 text-right font-mono text-xs tabular-nums self-center">
                  {p.volume > 0 ? '+' : ''}
                  {p.volume}
                </div>
                <div className="col-span-2 text-right font-mono text-xs tabular-nums self-center">
                  €{p.traderMark.toFixed(2)}
                </div>
                <div className="col-span-2 text-right font-mono text-xs tabular-nums self-center">
                  €{p.ipvMark.toFixed(2)}
                </div>
                <div
                  className={`col-span-2 text-right font-mono text-xs tabular-nums self-center ${
                    Math.abs(impact) < 1
                      ? 'text-ink/50'
                      : impact > 0
                      ? 'text-coral font-bold'
                      : 'text-teal font-bold'
                  }`}
                >
                  {impact >= 0 ? '+' : ''}€{impact.toFixed(0)}k
                </div>
                <div className="col-span-2 text-right self-center">
                  {isBreak ? (
                    <span className={`font-hand text-xs px-1.5 rounded border ${
                      story.severity === 'high'
                        ? 'border-rose bg-rose/15 text-rose font-bold'
                        : story.severity === 'med'
                        ? 'border-mustard bg-mustard/15 text-mustard font-bold'
                        : 'border-sage bg-sage/15 text-sage font-bold'
                    }`}>
                      ⚠ BREAK
                    </span>
                  ) : (
                    <span className="font-hand text-xs text-sage">✓ ok</span>
                  )}
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
                    <div
                      className={`mx-2 mb-2 p-2 rounded border-[1.5px] ${
                        severityColor === 'rose'
                          ? 'border-rose bg-rose/10'
                          : severityColor === 'mustard'
                          ? 'border-mustard bg-mustard/10'
                          : 'border-sage bg-sage/10'
                      }`}
                    >
                      <div className="font-display text-base">{story.title}</div>
                      <div className="font-body text-xs text-ink/85 leading-snug mt-0.5">
                        {story.body}
                      </div>
                      <div className="font-hand text-[10px] text-ink/55 mt-1">
                        liquidity: {p.liquidity} · |impact| €{Math.abs(impact).toFixed(0)}k · threshold €{THRESHOLD_ABS}k or {(THRESHOLD_REL * 100).toFixed(0)}% of P&amp;L
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        <div className="grid grid-cols-12 bg-mustard/10 border-t-[2px] border-ink/40 px-2 py-1.5 font-mono text-xs">
          <div className="col-span-3 font-hand text-ink/60">firm P&amp;L</div>
          <div className="col-span-1" />
          <div className="col-span-2 text-right font-bold">
            €{totalTrader.toFixed(0)}k
          </div>
          <div className="col-span-2 text-right font-bold">
            €{totalIPV.toFixed(0)}k
          </div>
          <div
            className={`col-span-2 text-right font-bold ${
              Math.abs(totalImpact) > THRESHOLD_ABS ? 'text-coral' : 'text-ink/70'
            }`}
          >
            {totalImpact >= 0 ? '+' : ''}€{totalImpact.toFixed(0)}k
          </div>
          <div className="col-span-2 text-right">
            <span className="font-hand text-coral font-bold">
              {breakCount > 0 ? `${breakCount} break${breakCount > 1 ? 's' : ''}` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-teal/10 border-[2px] border-dashed border-teal">
          <div className="font-display text-base text-teal mb-1">📊 the trader's truth</div>
          <div className="font-body text-sm text-ink/85 leading-snug">
            Marks chosen to be defensible but slightly optimistic. Stale on
            illiquid stuff. Bonus-relevant.
          </div>
        </div>
        <div className="p-3 rounded-lg bg-coral/10 border-[2px] border-dashed border-coral">
          <div className="font-display text-base text-coral mb-1">🛡️ the middle office's truth</div>
          <div className="font-body text-sm text-ink/85 leading-snug">
            Marks pulled from independent consensus. Refreshed every morning. Not bonus-relevant. The official number for risk and finance.
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this is the most political activity in any trading firm. the trader argues. the MO holds the line. the breaks above threshold get{' '}
        <span className="text-coral">documented either way</span> — that's the whole point.
      </div>
    </div>
  )
}
