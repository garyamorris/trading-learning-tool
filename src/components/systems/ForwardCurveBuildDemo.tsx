import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type BrokerQuote = {
  months: number
  label: string
  price: number
  active: boolean
}

const INITIAL_QUOTES: BrokerQuote[] = [
  { months: 1, label: 'M+1', price: 82, active: true },
  { months: 3, label: 'M+3', price: 89, active: true },
  { months: 6, label: 'Q+2', price: 96, active: true },
  { months: 12, label: 'Cal+1', price: 102, active: true },
  { months: 24, label: 'Cal+2', price: 107, active: true },
]

const ALL_MONTHS = Array.from({ length: 24 }, (_, i) => i + 1)

function interpolate(quotes: BrokerQuote[], smoothing: number) {
  const active = quotes.filter((q) => q.active).sort((a, b) => a.months - b.months)
  if (active.length === 0) return ALL_MONTHS.map((m) => ({ months: m, price: 0 }))

  // Linear interpolation between active broker points + add a seasonal sine.
  const out = ALL_MONTHS.map((m) => {
    let price = 0
    if (m <= active[0].months) {
      price = active[0].price
    } else if (m >= active[active.length - 1].months) {
      price = active[active.length - 1].price
    } else {
      // Find bracket
      for (let i = 0; i < active.length - 1; i++) {
        if (m >= active[i].months && m <= active[i + 1].months) {
          const t = (m - active[i].months) / (active[i + 1].months - active[i].months)
          price = active[i].price * (1 - t) + active[i + 1].price * t
          break
        }
      }
    }
    // Add seasonal component (peaks in winter month 1 and 12)
    const seasonal = Math.sin(((m - 1) * Math.PI) / 6) * 6 * smoothing
    return { months: m, price: price + seasonal }
  })
  return out
}

export function ForwardCurveBuildDemo() {
  const [quotes, setQuotes] = useState<BrokerQuote[]>(INITIAL_QUOTES)
  const [smoothing, setSmoothing] = useState(0.5)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const curve = useMemo(() => interpolate(quotes, smoothing), [quotes, smoothing])

  // Chart geometry
  const w = 460
  const h = 200
  const padL = 36
  const padR = 12
  const padT = 14
  const padB = 32
  const maxP = Math.max(...curve.map((p) => p.price), 110) + 6
  const minP = Math.min(...curve.map((p) => p.price), 70) - 6
  const yFor = (p: number) =>
    h - padB - ((p - minP) / (maxP - minP)) * (h - padT - padB)
  const xFor = (m: number) => padL + ((m - 1) / 23) * (w - padL - padR)
  const pathD = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.months)} ${yFor(p.price)}`)
    .join(' ')

  function bumpQuote(months: number, delta: number) {
    setQuotes((qs) =>
      qs.map((q) => (q.months === months ? { ...q, price: Math.max(40, Math.min(160, q.price + delta)) } : q)),
    )
  }
  function toggleQuote(months: number) {
    setQuotes((qs) => qs.map((q) => (q.months === months ? { ...q, active: !q.active } : q)))
  }

  // MTM on a 50MW long position at €78 contracted price, M+1 to Cal+1
  const positionMonths = curve.slice(0, 12)
  const contracted = 78
  const positionMW = 50
  const mtm = positionMonths.reduce((s, p) => s + (p.price - contracted) * positionMW * 0.10, 0)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        the broker only quotes a handful of tenors. the curve engine builds the
        rest. toggle quotes on/off and watch the curve recompute:
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-52">
          {/* y-axis labels */}
          {[minP + (maxP - minP) * 0.2, (minP + maxP) / 2, minP + (maxP - minP) * 0.8].map(
            (p) => (
              <g key={p}>
                <line x1={padL} x2={w - padR} y1={yFor(p)} y2={yFor(p)} stroke="#2b2a26" strokeWidth="0.3" opacity="0.2" />
                <text x={padL - 4} y={yFor(p) + 3} fontSize="9" fill="#2b2a26" opacity="0.55" textAnchor="end" fontFamily="Patrick Hand">
                  €{p.toFixed(0)}
                </text>
              </g>
            ),
          )}
          {/* curve */}
          <motion.path
            d={pathD}
            stroke="#e8694e"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={false}
            animate={{ d: pathD }}
            transition={{ duration: 0.25 }}
          />
          {/* broker quote points */}
          {quotes.map((q) => (
            <g
              key={q.months}
              onMouseEnter={() => setHoverIdx(q.months)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={xFor(q.months)}
                cy={yFor(q.price)}
                r={q.active ? 5 : 3}
                fill={q.active ? '#e3a93a' : '#fbf6ec'}
                stroke="#2b2a26"
                strokeWidth="1.5"
                opacity={q.active ? 1 : 0.5}
              />
              {hoverIdx === q.months && (
                <text x={xFor(q.months)} y={yFor(q.price) - 9} fontSize="10" fontFamily="Patrick Hand" fill="#2b2a26" textAnchor="middle">
                  {q.label} €{q.price}
                </text>
              )}
            </g>
          ))}
          {/* x-axis labels */}
          {[1, 6, 12, 18, 24].map((m) => (
            <text key={m} x={xFor(m)} y={h - 8} fontSize="9" fill="#2b2a26" opacity="0.6" textAnchor="middle" fontFamily="Patrick Hand">
              {m === 1 ? 'M+1' : m === 12 ? 'Cal+1' : m === 24 ? 'Cal+2' : `m+${m}`}
            </text>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="p-3 bg-paper/40 rounded-lg border-[2px] border-ink/30">
          <div className="font-display text-base mb-1 text-mustard">
            🟡 broker quotes (toggle / bump)
          </div>
          <div className="space-y-1 text-sm">
            {quotes.map((q) => (
              <div key={q.months} className="flex items-center justify-between gap-1">
                <button
                  onClick={() => toggleQuote(q.months)}
                  className={`pill-sketch text-xs ${
                    q.active ? 'bg-mustard/30' : 'opacity-40 hover:bg-paper'
                  }`}
                >
                  {q.active ? '✓' : '✕'} {q.label}
                </button>
                <span className="font-mono text-xs tabular-nums">
                  €{q.price.toFixed(0)}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => bumpQuote(q.months, -2)} className="btn-sketch !py-0.5 !px-2 !text-xs">−</button>
                  <button onClick={() => bumpQuote(q.months, 2)} className="btn-sketch !py-0.5 !px-2 !text-xs">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 bg-paper/40 rounded-lg border-[2px] border-ink/30">
          <div className="font-display text-base mb-1 text-teal">
            ⚙️ seasonal calibration
          </div>
          <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
            <span>winter peak</span>
            <span className="font-bold">×{smoothing.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={smoothing}
            onChange={(e) => setSmoothing(parseFloat(e.target.value))}
            className="w-full accent-teal"
          />
          <div className="font-body text-xs text-ink/75 mt-1 leading-snug">
            The raw interpolation between broker points is a piecewise line.
            Power curves are seasonal — winter peaks higher than summer. A
            calibration step adds shape the brokers never quoted.
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg border-[2px] border-dashed border-coral bg-coral/10">
        <div className="font-display text-xl">
          → derived MTM on a 50 MW long power book:
        </div>
        <div className="font-display text-3xl text-coral">
          {mtm >= 0 ? '+' : ''}€{mtm.toFixed(0)}k
        </div>
        <div className="font-body text-sm text-ink/80">
          Move <em>one</em> broker quote and this number changes. So does VaR.
          So do all the gauges from page 1. The curve is the input upstream of
          everything.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ if you remember one thing from this chapter:{' '}
        <span className="text-coral">the forward curve is the input under every other number</span>.
        a curve-engine bug is a firm-wide P&amp;L bug.
      </div>
    </div>
  )
}
