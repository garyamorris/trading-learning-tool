import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Bar = {
  id: string
  label: string
  delta: number // €k
  color: string
  detail: string
}

const STARTING_MTM = 1210 // €k yesterday's end-of-day

const BARS: Bar[] = [
  {
    id: 'curve_power',
    label: 'power curve moved',
    delta: 84,
    color: 'sage',
    detail:
      'Power M+1 quote ticked from €82 → €84.5 overnight. Position is +145 MW long power.',
  },
  {
    id: 'curve_gas',
    label: 'gas curve moved',
    delta: -22,
    color: 'coral',
    detail:
      'Gas curve drifted up €1.2 across the board. Position is −25 MW (short gas), so this is a loss.',
  },
  {
    id: 'new_trades',
    label: 'new trades booked',
    delta: 18,
    color: 'sage',
    detail:
      'Two morning hedges (hedge_50 on power M+1, a small carbon roll). Booked at favourable prices.',
  },
  {
    id: 'time_decay',
    label: 'time / aging',
    delta: -6,
    color: 'mustard',
    detail:
      'One day closer to delivery means slightly less optionality. Mostly small.',
  },
  {
    id: 'fx',
    label: 'FX move',
    delta: -2,
    color: 'mustard',
    detail:
      'EUR/GBP wobble on the few GBP-denominated trades. Trivial.',
  },
  {
    id: 'expired',
    label: 'trades aged off',
    delta: 0,
    color: 'ink',
    detail: 'Nothing matured today.',
  },
  {
    id: 'unexplained',
    label: 'unexplained residual',
    delta: -3,
    color: 'rose',
    detail:
      "The number that should be zero. It rarely is. If it grew large, the curve engine, the position engine, or the trade store probably disagree.",
  },
]

const COLOR_HEX: Record<string, string> = {
  sage: '#8caf6f',
  coral: '#e8694e',
  mustard: '#e3a93a',
  rose: '#c14b6b',
  ink: '#2b2a26',
}

export function PnLAttributionDemo() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Compute cumulative position of each bar in the waterfall
  let running = STARTING_MTM
  const positions = BARS.map((b) => {
    const start = running
    const end = running + b.delta
    running = end
    return { start, end, ...b }
  })
  const endMTM = running
  const maxV = Math.max(STARTING_MTM, endMTM, ...positions.map((p) => Math.max(p.start, p.end)))
  const minV = Math.min(STARTING_MTM, endMTM, ...positions.map((p) => Math.min(p.start, p.end))) - 20

  // SVG geometry
  const w = 540
  const h = 200
  const padL = 12
  const padR = 12
  const padT = 16
  const padB = 26
  const slots = 2 + positions.length // 1 start bar + N change bars + 1 end bar
  const slotW = (w - padL - padR) / slots
  const yFor = (v: number) => h - padB - ((v - minV) / (maxV - minV)) * (h - padT - padB)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-2">
        the most-asked question in the morning meeting:{' '}
        <span className="text-coral">"why did the P&amp;L change overnight?"</span>
      </div>
      <div className="font-body text-sm text-ink/80 mb-4 leading-snug">
        The P&amp;L attribution decomposes the change into named drivers. Each
        bar is a driver. Click any bar for the why.
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '260px' }}>
          {/* Starting bar */}
          <g>
            <rect
              x={padL + slotW * 0.15}
              y={yFor(STARTING_MTM)}
              width={slotW * 0.7}
              height={h - padB - yFor(STARTING_MTM)}
              fill="#e3a93a"
              opacity="0.45"
              stroke="#2b2a26"
              strokeWidth="1"
            />
            <text x={padL + slotW * 0.5} y={yFor(STARTING_MTM) - 4} fontSize="11" fontFamily="Caveat Brush" textAnchor="middle">
              €{STARTING_MTM}k
            </text>
            <text x={padL + slotW * 0.5} y={h - padB + 14} fontSize="10" fontFamily="Patrick Hand" textAnchor="middle" opacity="0.7">
              yesterday EOD
            </text>
          </g>

          {/* Delta bars */}
          {positions.map((p, i) => {
            const slotX = padL + (i + 1) * slotW
            const isUp = p.delta >= 0
            const top = isUp ? yFor(p.end) : yFor(p.start)
            const height = Math.abs(yFor(p.end) - yFor(p.start))
            const isExpanded = expandedId === p.id
            return (
              <g
                key={p.id}
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* connecting line from previous bar */}
                {i > 0 && (
                  <line
                    x1={slotX - slotW * 0.4}
                    x2={slotX + slotW * 0.15}
                    y1={yFor(p.start)}
                    y2={yFor(p.start)}
                    stroke="#2b2a26"
                    strokeDasharray="2 2"
                    strokeWidth="0.75"
                    opacity="0.5"
                  />
                )}
                {p.delta !== 0 && (
                  <rect
                    x={slotX + slotW * 0.15}
                    y={top}
                    width={slotW * 0.7}
                    height={Math.max(height, 1)}
                    fill={COLOR_HEX[p.color]}
                    opacity={isExpanded ? 0.9 : 0.65}
                    stroke="#2b2a26"
                    strokeWidth={isExpanded ? 1.5 : 0.75}
                  />
                )}
                {p.delta !== 0 && (
                  <text x={slotX + slotW * 0.5} y={top - 3} fontSize="9" fontFamily="Caveat Brush" textAnchor="middle" fill={COLOR_HEX[p.color]}>
                    {p.delta > 0 ? '+' : ''}
                    {p.delta}
                  </text>
                )}
                {p.delta === 0 && (
                  <line
                    x1={slotX + slotW * 0.25}
                    x2={slotX + slotW * 0.75}
                    y1={yFor(p.start)}
                    y2={yFor(p.end)}
                    stroke={COLOR_HEX[p.color]}
                    strokeWidth="2"
                  />
                )}
                <text
                  x={slotX + slotW * 0.5}
                  y={h - padB + 14}
                  fontSize="9"
                  fontFamily="Patrick Hand"
                  textAnchor="middle"
                  opacity={isExpanded ? 1 : 0.7}
                  fill={isExpanded ? '#2b2a26' : '#2b2a26'}
                >
                  {p.label.length > 14 ? p.label.split(' ').slice(0, 2).join(' ') : p.label}
                </text>
              </g>
            )
          })}

          {/* Ending bar */}
          <g>
            <line
              x1={padL + (positions.length + 0.6) * slotW}
              x2={padL + (positions.length + 1) * slotW + slotW * 0.15}
              y1={yFor(endMTM)}
              y2={yFor(endMTM)}
              stroke="#2b2a26"
              strokeDasharray="2 2"
              strokeWidth="0.75"
              opacity="0.5"
            />
            <rect
              x={padL + (positions.length + 1) * slotW + slotW * 0.15}
              y={yFor(endMTM)}
              width={slotW * 0.7}
              height={h - padB - yFor(endMTM)}
              fill="#8caf6f"
              opacity="0.55"
              stroke="#2b2a26"
              strokeWidth="1.5"
            />
            <text
              x={padL + (positions.length + 1) * slotW + slotW * 0.5}
              y={yFor(endMTM) - 4}
              fontSize="11"
              fontFamily="Caveat Brush"
              textAnchor="middle"
            >
              €{endMTM}k
            </text>
            <text
              x={padL + (positions.length + 1) * slotW + slotW * 0.5}
              y={h - padB + 14}
              fontSize="10"
              fontFamily="Patrick Hand"
              textAnchor="middle"
              opacity="0.7"
            >
              today EOD
            </text>
          </g>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {expandedId ? (
          <motion.div
            key={expandedId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-lg border-[2px] border-dashed border-coral bg-coral/5 mb-3"
          >
            {(() => {
              const p = positions.find((x) => x.id === expandedId)!
              return (
                <>
                  <div className="font-display text-xl">
                    {p.label} · {' '}
                    <span style={{ color: COLOR_HEX[p.color] }}>
                      {p.delta > 0 ? '+' : ''}€{p.delta}k
                    </span>
                  </div>
                  <div className="font-body text-sm text-ink/85 leading-snug mt-1">
                    {p.detail}
                  </div>
                </>
              )
            })()}
          </motion.div>
        ) : (
          <div className="font-hand text-ink/50 text-center mb-3">
            click a bar above ↑
          </div>
        )}
      </AnimatePresence>

      <div className="p-3 rounded-lg border-[2px] border-dashed border-mustard bg-mustard/10">
        <div className="font-display text-base text-coral">
          ⚠ watch the residual.
        </div>
        <div className="font-body text-sm text-ink/85 leading-snug">
          A clean P&amp;L explain ends with a residual near zero. When it
          balloons — €40k, €120k, €600k — the curves, the positions, and the
          trade store have started to disagree. <em>That</em> is the alarm bell
          most ETRM systems are silently scored on.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ MTM tells you the value <em>now</em>. P&amp;L attribution tells you{' '}
        <span className="text-coral">why it changed</span> — and that's the
        version anyone in the morning meeting actually wants.
      </div>
    </div>
  )
}
