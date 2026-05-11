import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Reserve = {
  id: string
  label: string
  short: string
  emoji: string
  color: string
  detail: string
  defaultActive: boolean
  // value computed from a "portfolio scale" knob (k)
  amount: (k: number) => number
}

const FAIR_VALUE = 1210 // €k

const RESERVES: Reserve[] = [
  {
    id: 'bid_ask',
    label: 'bid-ask reserve',
    short: 'BA',
    emoji: '↔️',
    color: 'mustard',
    detail:
      'Fair value uses the mid-market price. You can\'t actually trade at mid — you cross the bid-ask. The reserve is roughly (bid-ask spread × position) / 2, so the published P&L reflects what you could actually exit at.',
    defaultActive: true,
    amount: (k) => Math.round(48 * k),
  },
  {
    id: 'model',
    label: 'model risk reserve',
    short: 'MR',
    emoji: '🧮',
    color: 'lavender',
    detail:
      'The option pricer is approximate. Different choices of vol-surface interpolation give different prices in the wings. The reserve covers the band of plausible model outputs — usually 1-3% of option positions.',
    defaultActive: true,
    amount: (k) => Math.round(26 * k),
  },
  {
    id: 'liquidity',
    label: 'liquidity / concentration',
    short: 'LQ',
    emoji: '🧊',
    color: 'teal',
    detail:
      "Large positions can't be unwound at the screen price — you move the market as you go. The reserve scales with size and inversely with daily volume. Bigger book → bigger reserve, even without any price change.",
    defaultActive: true,
    amount: (k) => Math.round(38 * k * k),
  },
  {
    id: 'cva',
    label: 'CVA · counterparty default',
    short: 'CVA',
    emoji: '🏦',
    color: 'rose',
    detail:
      'Credit Valuation Adjustment. Even if your hedge is "in the money", your counterparty might default before paying. CVA = expected exposure × probability of default × loss-given-default, summed across counterparties.',
    defaultActive: true,
    amount: (k) => Math.round(34 * k),
  },
  {
    id: 'fva',
    label: 'FVA · funding cost',
    short: 'FVA',
    emoji: '💧',
    color: 'sage',
    detail:
      "Funding Valuation Adjustment. Carrying collateralised hedges has a real funding cost (your funding rate vs the collateral rate). FVA is contentious — accountants and traders argue about it forever — but most shops apply some version.",
    defaultActive: true,
    amount: (k) => Math.round(21 * k),
  },
]

const COLOR_HEX: Record<string, string> = {
  mustard: '#e3a93a',
  lavender: '#9a8cc7',
  teal: '#3d8b8b',
  rose: '#c14b6b',
  sage: '#8caf6f',
}

const COLOR_BG: Record<string, string> = {
  mustard: 'border-mustard bg-mustard/10',
  lavender: 'border-lavender bg-lavender/10',
  teal: 'border-teal bg-teal/10',
  rose: 'border-rose bg-rose/10',
  sage: 'border-sage bg-sage/10',
}

const COLOR_TEXT: Record<string, string> = {
  mustard: 'text-mustard',
  lavender: 'text-lavender',
  teal: 'text-teal',
  rose: 'text-rose',
  sage: 'text-sage',
}

export function ReservesWaterfallDemo() {
  const [active, setActive] = useState<Set<string>>(new Set(RESERVES.filter((r) => r.defaultActive).map((r) => r.id)))
  const [scale, setScale] = useState(1.0)
  const [openId, setOpenId] = useState<string | null>(null)

  const amounts = useMemo(
    () => RESERVES.map((r) => ({ ...r, value: r.amount(scale), on: active.has(r.id) })),
    [scale, active],
  )

  const totalReserves = amounts.filter((r) => r.on).reduce((s, r) => s + r.value, 0)
  const officialMTM = FAIR_VALUE - totalReserves
  const haircutPct = (totalReserves / FAIR_VALUE) * 100

  function toggle(id: string) {
    const next = new Set(active)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setActive(next)
  }

  // Waterfall geometry
  const w = 540
  const h = 220
  const padL = 32
  const padR = 12
  const padT = 14
  const padB = 28
  const slots = 2 + RESERVES.length
  const slotW = (w - padL - padR) / slots
  const maxV = FAIR_VALUE * 1.05
  const minV = Math.min(officialMTM, FAIR_VALUE - 250) - 40
  const yFor = (v: number) => h - padB - ((v - minV) / (maxV - minV)) * (h - padT - padB)

  let running = FAIR_VALUE
  const bars = amounts.map((r) => {
    const start = running
    const delta = r.on ? -r.value : 0
    const end = running + delta
    running = end
    return { ...r, start, end, delta }
  })
  const finalRunning = running

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        "fair value" is what the model says. <span className="text-coral font-bold">official P&amp;L</span>{' '}
        is what gets published. between them sit five reserves the middle office owns:
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex-1 min-w-[180px]">
          <div className="flex justify-between font-hand text-xs text-ink/70">
            <span>portfolio scale</span>
            <span className="font-bold">×{scale.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.4}
            max={2.0}
            step={0.05}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-coral"
          />
        </div>
        <button
          onClick={() => setActive(new Set(RESERVES.map((r) => r.id)))}
          className="btn-sketch !text-xs !py-0.5"
        >
          all on
        </button>
        <button
          onClick={() => setActive(new Set())}
          className="btn-sketch !text-xs !py-0.5"
        >
          all off
        </button>
      </div>

      {/* WATERFALL CHART */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '260px' }}>
          {/* Fair value starting bar */}
          <g>
            <rect
              x={padL + slotW * 0.15}
              width={slotW * 0.7}
              y={yFor(FAIR_VALUE)}
              height={h - padB - yFor(FAIR_VALUE)}
              fill="#3d8b8b"
              opacity="0.55"
              stroke="#2b2a26"
              strokeWidth="1"
            />
            <text x={padL + slotW * 0.5} y={yFor(FAIR_VALUE) - 4} fontSize="11" fontFamily="Caveat Brush" textAnchor="middle" fill="#3d8b8b">
              €{FAIR_VALUE}k
            </text>
            <text x={padL + slotW * 0.5} y={h - padB + 13} fontSize="10" fontFamily="Patrick Hand" textAnchor="middle" opacity="0.7">
              fair value
            </text>
          </g>

          {/* Reserve bars */}
          {bars.map((b, i) => {
            const slotX = padL + (i + 1) * slotW
            const yTop = b.on ? yFor(b.start) : yFor(b.start) // when off, no bar
            const barH = b.on ? Math.abs(yFor(b.end) - yFor(b.start)) : 0
            return (
              <g
                key={b.id}
                onClick={() => setOpenId(openId === b.id ? null : b.id)}
                style={{ cursor: 'pointer' }}
              >
                {i > 0 && (
                  <line
                    x1={slotX - slotW * 0.4}
                    x2={slotX + slotW * 0.15}
                    y1={yFor(b.start)}
                    y2={yFor(b.start)}
                    stroke="#2b2a26"
                    strokeDasharray="2 2"
                    strokeWidth="0.6"
                    opacity="0.4"
                  />
                )}
                {b.on && (
                  <motion.rect
                    initial={false}
                    animate={{
                      x: slotX + slotW * 0.15,
                      y: yTop,
                      height: barH,
                    }}
                    width={slotW * 0.7}
                    fill={COLOR_HEX[b.color]}
                    opacity={openId === b.id ? 0.9 : 0.65}
                    stroke="#2b2a26"
                    strokeWidth={openId === b.id ? 1.5 : 0.75}
                  />
                )}
                <text
                  x={slotX + slotW * 0.5}
                  y={yTop - 3}
                  fontSize="9"
                  fontFamily="Caveat Brush"
                  textAnchor="middle"
                  fill={b.on ? COLOR_HEX[b.color] : '#2b2a26'}
                  opacity={b.on ? 1 : 0.3}
                >
                  {b.on ? `−${b.value}` : 'off'}
                </text>
                <text
                  x={slotX + slotW * 0.5}
                  y={h - padB + 13}
                  fontSize="9"
                  fontFamily="Patrick Hand"
                  textAnchor="middle"
                  opacity={openId === b.id ? 1 : 0.7}
                >
                  {b.short}
                </text>
              </g>
            )
          })}

          {/* Official MTM final bar */}
          <g>
            <line
              x1={padL + (bars.length + 0.6) * slotW}
              x2={padL + (bars.length + 1) * slotW + slotW * 0.15}
              y1={yFor(finalRunning)}
              y2={yFor(finalRunning)}
              stroke="#2b2a26"
              strokeDasharray="2 2"
              strokeWidth="0.6"
              opacity="0.4"
            />
            <motion.rect
              initial={false}
              animate={{
                x: padL + (bars.length + 1) * slotW + slotW * 0.15,
                y: yFor(finalRunning),
                height: h - padB - yFor(finalRunning),
              }}
              width={slotW * 0.7}
              fill="#e8694e"
              opacity="0.6"
              stroke="#2b2a26"
              strokeWidth="1.5"
            />
            <text
              x={padL + (bars.length + 1) * slotW + slotW * 0.5}
              y={yFor(finalRunning) - 4}
              fontSize="11"
              fontFamily="Caveat Brush"
              textAnchor="middle"
              fill="#e8694e"
            >
              €{officialMTM}k
            </text>
            <text
              x={padL + (bars.length + 1) * slotW + slotW * 0.5}
              y={h - padB + 13}
              fontSize="10"
              fontFamily="Patrick Hand"
              textAnchor="middle"
              opacity="0.7"
            >
              official P&amp;L
            </text>
          </g>
        </svg>
      </div>

      {/* RESERVE TOGGLES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 mb-3">
        {amounts.map((r) => (
          <button
            key={r.id}
            onClick={() => toggle(r.id)}
            className={`p-1.5 rounded border-[2px] text-left transition-all ${
              r.on
                ? COLOR_BG[r.color]
                : 'border-ink/20 bg-paper/30 opacity-60'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-hand text-xs font-bold">
                {r.emoji} {r.short}
              </span>
              <span className={`font-hand text-[10px] ${r.on ? COLOR_TEXT[r.color] : 'text-ink/40'}`}>
                {r.on ? '✓ on' : 'off'}
              </span>
            </div>
            <div className={`font-display text-base ${r.on ? '' : 'opacity-50 line-through'}`}>
              €{r.value}k
            </div>
          </button>
        ))}
      </div>

      {openId && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border-[2px] ${COLOR_BG[bars.find((b) => b.id === openId)!.color]} mb-3`}
        >
          {(() => {
            const b = bars.find((x) => x.id === openId)!
            return (
              <>
                <div className="font-display text-lg">
                  {b.emoji} {b.label}
                </div>
                <div className="font-body text-sm text-ink/85 leading-snug">{b.detail}</div>
              </>
            )
          })()}
        </motion.div>
      )}

      <div
        className={`p-3 rounded-lg border-[2px] border-dashed ${
          haircutPct > 15 ? 'border-rose bg-rose/10' : haircutPct > 5 ? 'border-mustard bg-mustard/10' : 'border-sage bg-sage/10'
        }`}
      >
        <div className="font-display text-base">
          haircut: <span className="text-coral">{haircutPct.toFixed(1)}%</span> of fair value
        </div>
        <div className="font-body text-sm text-ink/85 leading-snug">
          The reserves cut €{totalReserves}k off the trader's headline. Turn them all off and the "P&amp;L" balloons back to €{FAIR_VALUE}k — which is{' '}
          {haircutPct > 12 ? <strong className="text-coral">exactly the kind of cliff regulators dislike</strong> : <strong>a number nobody actually believes you could realise</strong>}. The middle office's job is to make the official number defensible at exit.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ reserves are why the trader's "headline P&amp;L" and the firm's "official P&amp;L" are <em>never</em> the same number. and every reserve has{' '}
        <span className="text-coral">a methodology, an owner, and a defence</span>.
      </div>
    </div>
  )
}
