import { useMemo, useState } from 'react'

const DAYS = 30
const THRESHOLD = 380 // €k unsecured threshold under the ISDA CSA
const LIMIT = 560 // hard counterparty limit

type Posting = 'on_time' | 'delayed' | 'disputed'

// Deterministic seeded PFE walk for the demo
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff - 0.5
  }
}

function generatePFE(volatility: number, trend: number): number[] {
  const rng = makeRng(13)
  let v = 280
  const out: number[] = []
  for (let i = 0; i < DAYS; i++) {
    v += rng() * 40 * volatility + trend
    v = Math.max(80, Math.min(720, v))
    out.push(v)
  }
  return out
}

function simulateCollateral(pfe: number[], posting: Posting): number[] {
  const coll: number[] = []
  let current = 0
  for (let i = 0; i < pfe.length; i++) {
    const required = Math.max(0, pfe[i] - THRESHOLD)
    if (posting === 'on_time') {
      current = required
    } else if (posting === 'delayed') {
      // posts 3 days late
      const target = i >= 3 ? Math.max(0, pfe[i - 3] - THRESHOLD) : 0
      current = target
    } else {
      // disputed: only posts half, eventually
      const target = i >= 5 ? Math.max(0, (pfe[i - 5] - THRESHOLD) * 0.5) : 0
      current = target
    }
    coll.push(current)
  }
  return coll
}

export function CreditCollateralDemo() {
  const [volatility, setVolatility] = useState(1.0)
  const [trend, setTrend] = useState(0.5)
  const [posting, setPosting] = useState<Posting>('on_time')

  const pfe = useMemo(() => generatePFE(volatility, trend), [volatility, trend])
  const collateral = useMemo(() => simulateCollateral(pfe, posting), [pfe, posting])
  const unsecured = pfe.map((p, i) => Math.max(0, p - THRESHOLD - collateral[i]))

  // Margin calls: triggered the day PFE crosses THRESHOLD upward
  const marginCalls: number[] = []
  for (let i = 1; i < DAYS; i++) {
    if (pfe[i] > THRESHOLD && pfe[i - 1] <= THRESHOLD) marginCalls.push(i)
    if (pfe[i] > LIMIT && pfe[i - 1] <= LIMIT) marginCalls.push(i) // limit breach also a "call"
  }

  // Chart geometry
  const w = 540
  const h = 220
  const padL = 28
  const padR = 12
  const padT = 14
  const padB = 26
  const maxY = Math.max(LIMIT * 1.1, ...pfe) + 30
  const xFor = (i: number) => padL + (i / (DAYS - 1)) * (w - padL - padR)
  const yFor = (v: number) => h - padB - (v / maxY) * (h - padT - padB)

  const pfePath = pfe.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`).join(' ')
  // unsecured area: between (pfe) and (threshold + collateral) when unsecured>0
  const securedLineY = pfe.map((_, i) => Math.min(pfe[i], THRESHOLD + collateral[i]))
  const unsecuredAreaPath =
    pfe
      .map((v, i) =>
        `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`,
      )
      .join(' ') +
    ' ' +
    pfe
      .map((_, i) => `L ${xFor(DAYS - 1 - i)} ${yFor(securedLineY[DAYS - 1 - i])}`)
      .join(' ') +
    ' Z'

  const totalUnsecuredAreaMW = unsecured.reduce((s, v) => s + v, 0) // proxy for unsecured-day exposure

  const finalUnsecured = unsecured[DAYS - 1]

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        one counterparty, 30 days. trades come and go; their net PFE moves. when it crosses the collateral threshold, a{' '}
        <span className="text-coral font-bold">margin call</span> fires.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
            <span>market volatility</span>
            <span className="font-bold">×{volatility.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.3}
            max={2.0}
            step={0.1}
            value={volatility}
            onChange={(e) => setVolatility(parseFloat(e.target.value))}
            className="w-full accent-coral"
          />
        </div>
        <div>
          <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
            <span>book is growing</span>
            <span className="font-bold">+{trend.toFixed(2)}/day</span>
          </div>
          <input
            type="range"
            min={-1.0}
            max={3.0}
            step={0.1}
            value={trend}
            onChange={(e) => setTrend(parseFloat(e.target.value))}
            className="w-full accent-mustard"
          />
        </div>
        <div>
          <div className="font-hand text-xs text-ink/70 mb-1">they post collateral:</div>
          <div className="flex flex-wrap gap-1">
            {(['on_time', 'delayed', 'disputed'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPosting(p)}
                className={`pill-sketch text-xs ${
                  posting === p ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
                }`}
              >
                {p === 'on_time' ? '✓ on time' : p === 'delayed' ? '⏰ delayed' : '⚠ disputed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
          {/* limit line */}
          <line
            x1={padL}
            x2={w - padR}
            y1={yFor(LIMIT)}
            y2={yFor(LIMIT)}
            stroke="#c14b6b"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <text x={w - padR - 2} y={yFor(LIMIT) - 3} fontSize="10" textAnchor="end" fontFamily="Caveat Brush" fill="#c14b6b">
            counterparty limit €{LIMIT}k
          </text>
          {/* threshold line */}
          <line
            x1={padL}
            x2={w - padR}
            y1={yFor(THRESHOLD)}
            y2={yFor(THRESHOLD)}
            stroke="#e3a93a"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text x={w - padR - 2} y={yFor(THRESHOLD) - 3} fontSize="9" textAnchor="end" fontFamily="Patrick Hand" fill="#e3a93a">
            CSA threshold €{THRESHOLD}k
          </text>

          {/* unsecured area */}
          <path d={unsecuredAreaPath} fill="#e8694e" fillOpacity="0.18" stroke="none" />

          {/* PFE line */}
          <path d={pfePath} stroke="#3d8b8b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* margin call markers */}
          {marginCalls.map((d) => (
            <g key={d}>
              <line
                x1={xFor(d)}
                x2={xFor(d)}
                y1={yFor(pfe[d])}
                y2={yFor(pfe[d]) - 18}
                stroke="#c14b6b"
                strokeWidth="1.2"
              />
              <text
                x={xFor(d)}
                y={yFor(pfe[d]) - 21}
                fontSize="11"
                textAnchor="middle"
              >
                📨
              </text>
            </g>
          ))}

          {/* x-axis */}
          {[0, 10, 20, 29].map((d) => (
            <text
              key={d}
              x={xFor(d)}
              y={h - 8}
              fontSize="9"
              fontFamily="Patrick Hand"
              opacity="0.6"
              textAnchor="middle"
            >
              day {d + 1}
            </text>
          ))}
          {/* y-axis label */}
          <text x={3} y={padT + 6} fontSize="8" fontFamily="Patrick Hand" opacity="0.55">
            €k
          </text>
        </svg>
        <div className="font-hand text-xs text-ink/55 mt-1 flex justify-center gap-3">
          <span><span className="inline-block w-3 h-[2px] bg-teal mr-1 align-middle" />PFE</span>
          <span><span className="inline-block w-3 h-[8px] bg-coral/30 mr-1 align-middle" />unsecured exposure</span>
          <span>📨 margin call</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-cream rounded border-[1.5px] border-ink/30 p-2 text-center">
          <div className="font-hand text-xs text-ink/55">peak PFE</div>
          <div className="font-display text-xl">€{Math.max(...pfe).toFixed(0)}k</div>
        </div>
        <div className="bg-cream rounded border-[1.5px] border-ink/30 p-2 text-center">
          <div className="font-hand text-xs text-ink/55">margin calls</div>
          <div className="font-display text-xl text-coral">{marginCalls.length}</div>
        </div>
        <div
          className={`rounded border-[1.5px] p-2 text-center ${
            finalUnsecured < 5
              ? 'bg-sage/15 border-sage'
              : finalUnsecured < 60
              ? 'bg-mustard/15 border-mustard'
              : 'bg-coral/15 border-coral'
          }`}
        >
          <div className="font-hand text-xs text-ink/55">unsecured (day 30)</div>
          <div className="font-display text-xl">€{finalUnsecured.toFixed(0)}k</div>
        </div>
      </div>

      <div
        className={`p-3 rounded-lg border-[2px] border-dashed ${
          posting === 'on_time' && finalUnsecured < 10
            ? 'border-sage bg-sage/10'
            : posting === 'on_time'
            ? 'border-mustard bg-mustard/10'
            : 'border-coral bg-coral/10'
        }`}
      >
        <div className="font-hand text-base">
          {posting === 'on_time' && (
            <>
              <span className="text-sage font-bold">✓ everything posted on time.</span> Unsecured area is zero or near-zero. CSA is doing its job.
            </>
          )}
          {posting === 'delayed' && (
            <>
              <span className="text-mustard font-bold">⏰ 3-day collateral lag.</span> You're carrying ~{(totalUnsecuredAreaMW / DAYS).toFixed(0)} €k of unsecured exposure on average — small, but real, and growing with every margin call they ignore.
            </>
          )}
          {posting === 'disputed' && (
            <>
              <span className="text-coral font-bold">⚠ they're disputing margin calls.</span> Average unsecured exposure ~€{(totalUnsecuredAreaMW / DAYS).toFixed(0)}k. By day 30 you're unsecured by €{finalUnsecured.toFixed(0)}k. The credit committee gets involved long before this number gets here in real life.
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ counterparty risk isn't measured once. it's a{' '}
        <span className="text-coral">daily process</span>: net exposure, margin call, collateral, repeat — for every counterparty, forever.
      </div>
    </div>
  )
}
