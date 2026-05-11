import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Standard normal CDF via Abramowitz & Stegun 26.2.17
function normCDF(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x) / Math.sqrt(2)
  const t = 1.0 / (1.0 + p * ax)
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax)
  return 0.5 * (1 + sign * y)
}
function normPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

type Greeks = {
  price: number
  delta: number
  gamma: number
  vega: number
  theta: number
}

function blackScholesCall(S: number, K: number, T: number, vol: number, r = 0.04): Greeks {
  const sqrtT = Math.sqrt(T)
  const d1 = (Math.log(S / K) + (r + 0.5 * vol * vol) * T) / (vol * sqrtT)
  const d2 = d1 - vol * sqrtT
  const price = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2)
  const delta = normCDF(d1)
  const gamma = normPDF(d1) / (S * vol * sqrtT)
  const vega = (S * normPDF(d1) * sqrtT) / 100 // per 1 vol point
  const theta = (-(S * normPDF(d1) * vol) / (2 * sqrtT) - r * K * Math.exp(-r * T) * normCDF(d2)) / 365
  return { price, delta, gamma, vega, theta }
}

type Instrument = 'vanilla_forward' | 'european_call' | 'swing'

function VolSurface({ vol }: { vol: number }) {
  // A tiny illustrative vol surface: skew + term structure
  const w = 220
  const h = 80
  const tenors = [1, 3, 6, 12, 24] // months
  const strikes = [0.85, 0.95, 1.0, 1.05, 1.15] // % of ATM
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      {tenors.map((tenor, i) =>
        strikes.map((strike, j) => {
          const x = 10 + (i / (tenors.length - 1)) * (w - 30)
          const y = 10 + (j / (strikes.length - 1)) * (h - 20)
          const localVol = vol * (1 + 0.18 * (1 - strike) + 0.05 * Math.log(tenor))
          const intensity = Math.min(1, localVol / 0.6)
          return (
            <rect
              key={`${i}-${j}`}
              x={x - 12}
              y={y - 8}
              width={24}
              height={16}
              fill="#3d8b8b"
              opacity={0.25 + intensity * 0.6}
              stroke="#2b2a26"
              strokeWidth="0.3"
            />
          )
        }),
      )}
      <text x={10} y={h - 2} fontSize="7" fontFamily="Patrick Hand" opacity="0.65">M+1 → Cal+2</text>
      <text x={w - 10} y={h - 2} fontSize="7" fontFamily="Patrick Hand" opacity="0.65" textAnchor="end">OTM ↕ ITM</text>
    </svg>
  )
}

export function OptionsGreeksDemo() {
  const [instrument, setInstrument] = useState<Instrument>('european_call')
  const [strike, setStrike] = useState(85)
  const [T, setT] = useState(0.25) // years
  const [vol, setVol] = useState(0.34)

  const S = 84.5 // spot, fixed for the demo

  const greeks = useMemo(() => blackScholesCall(S, strike, Math.max(0.01, T), vol), [strike, T, vol])

  // For swing: a strip of dailies over the period
  const swingDays = Math.max(5, Math.round(T * 365))
  const swingPriceTotal = greeks.price * 0.85 // crude
  const swingPerDay = swingPriceTotal / swingDays

  const isOption = instrument !== 'vanilla_forward'

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-hand text-ink/70 text-base mr-1">instrument:</span>
        <button
          onClick={() => setInstrument('vanilla_forward')}
          className={`pill-sketch text-sm ${
            instrument === 'vanilla_forward' ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          📏 vanilla forward
        </button>
        <button
          onClick={() => setInstrument('european_call')}
          className={`pill-sketch text-sm ${
            instrument === 'european_call' ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          🎲 european call
        </button>
        <button
          onClick={() => setInstrument('swing')}
          className={`pill-sketch text-sm ${
            instrument === 'swing' ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          🌀 swing contract
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
            <span>strike (€/MWh)</span>
            <span className="font-bold">{strike}</span>
          </div>
          <input
            type="range"
            min={60}
            max={120}
            step={1}
            value={strike}
            onChange={(e) => setStrike(parseInt(e.target.value))}
            className="w-full accent-coral"
            disabled={!isOption}
          />
        </div>
        <div>
          <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
            <span>time to expiry</span>
            <span className="font-bold">{(T * 12).toFixed(1)}m</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={2.0}
            step={0.05}
            value={T}
            onChange={(e) => setT(parseFloat(e.target.value))}
            className="w-full accent-mustard"
            disabled={!isOption}
          />
        </div>
        <div>
          <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
            <span>vol (ATM)</span>
            <span className="font-bold">{(vol * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.10}
            max={0.80}
            step={0.02}
            value={vol}
            onChange={(e) => setVol(parseFloat(e.target.value))}
            className="w-full accent-teal"
            disabled={!isOption}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        {[
          { id: 'price', label: 'theo price', valFn: () => isOption ? `€${greeks.price.toFixed(2)}` : `€${(S - strike).toFixed(2)}` },
          { id: 'delta', label: 'delta', valFn: () => isOption ? greeks.delta.toFixed(3) : '1.000', subtle: isOption ? '' : '(forward always 1)' },
          { id: 'gamma', label: 'gamma', valFn: () => isOption ? greeks.gamma.toFixed(4) : '0.000', subtle: isOption ? '' : '(forward = 0)' },
          { id: 'vega', label: 'vega', valFn: () => isOption ? greeks.vega.toFixed(3) : '0.000', subtle: isOption ? '' : '(forward = 0)' },
          { id: 'theta', label: 'theta/day', valFn: () => isOption ? `€${greeks.theta.toFixed(3)}` : '0.000', subtle: isOption ? '' : '(forward = 0)' },
        ].map((g) => (
          <motion.div
            key={g.id}
            layout
            className="bg-cream rounded border-[1.5px] border-ink/30 p-2 text-center"
          >
            <div className="font-hand text-xs text-ink/55">{g.label}</div>
            <div className="font-display text-xl">{g.valFn()}</div>
            {g.subtle && (
              <div className="font-hand text-[10px] text-ink/45 leading-tight">{g.subtle}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Comparison panel */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        {instrument === 'vanilla_forward' && (
          <div className="font-body text-sm text-ink/85 leading-snug">
            <div className="font-display text-base text-teal mb-1">📏 vanilla forward</div>
            A locked-in buy at strike. Linear payoff. <strong>One number values it</strong>: spot − strike (discounted).
            No optionality. Delta is always exactly 1. The rest of the greeks are zero. <span className="text-ink/60">→ try switching to a call.</span>
          </div>
        )}
        {instrument === 'european_call' && (
          <>
            <div className="font-display text-base text-coral mb-1">🎲 european call</div>
            <div className="font-body text-sm text-ink/85 leading-snug mb-2">
              You get the right (not obligation) to buy at the strike at expiry. The payoff is{' '}
              <strong>kinked</strong>, which is what makes it valuable — and what forces the system to track all four greeks.
              Notice: vol changes value but doesn't change a forward's value at all.
            </div>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <div className="font-hand text-xs text-ink/65 mb-1">vol surface (illustrative)</div>
                <VolSurface vol={vol} />
                <div className="font-hand text-[10px] text-ink/55 leading-tight">
                  the system must keep a 2-D <strong>vol surface</strong> (strike × tenor) alongside the forward curve.
                </div>
              </div>
              <div>
                <div className="font-hand text-xs text-ink/65 mb-1">payoff at expiry</div>
                <svg viewBox="0 0 200 70" className="w-full h-16">
                  <line x1={10} y1={50} x2={190} y2={50} stroke="#2b2a26" strokeWidth="0.5" opacity="0.3" />
                  <line x1={10} y1={10} x2={10} y2={60} stroke="#2b2a26" strokeWidth="0.5" opacity="0.3" />
                  <line x1={10} y1={50} x2={100} y2={50} stroke="#e8694e" strokeWidth="2" />
                  <line x1={100} y1={50} x2={180} y2={10} stroke="#e8694e" strokeWidth="2" />
                  <line x1={100} y1={50} x2={100} y2={62} stroke="#2b2a26" strokeWidth="0.5" strokeDasharray="2 1" opacity="0.5" />
                  <text x={100} y={68} fontSize="7" textAnchor="middle" fontFamily="Patrick Hand" opacity="0.65">strike</text>
                  <text x={185} y={15} fontSize="7" textAnchor="end" fontFamily="Patrick Hand" fill="#e8694e">in the money</text>
                </svg>
              </div>
            </div>
          </>
        )}
        {instrument === 'swing' && (
          <>
            <div className="font-display text-base text-lavender mb-1">🌀 swing contract</div>
            <div className="font-body text-sm text-ink/85 leading-snug mb-2">
              You can buy <strong>any amount</strong> between a daily-min and daily-max, with constraints on the period total.
              These dominate gas and retail-supply books. They decompose into a <strong>strip of daily options</strong> —
              {' '}{swingDays} of them here — each priced and risk-managed separately.
            </div>
            <div className="font-hand text-xs text-ink/65 mb-1">
              daily option strip (one bar per delivery day, ~€{swingPerDay.toFixed(3)}/day):
            </div>
            <div className="flex gap-[1px] h-10 bg-cream rounded border-[1.5px] border-ink/30 p-0.5 overflow-hidden">
              {Array.from({ length: Math.min(swingDays, 60) }).map((_, i) => {
                const heightPct = 40 + 50 * Math.sin((i / Math.max(1, swingDays)) * Math.PI * 2) ** 2
                return (
                  <div
                    key={i}
                    style={{ height: `${heightPct}%`, flex: 1 }}
                    className="bg-lavender/60 self-end"
                  />
                )
              })}
            </div>
            <div className="font-hand text-[10px] text-ink/55 mt-1">
              one swing = N daily options. the system stores it as one trade but values it as N.
            </div>
          </>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ a forward needs one number to price. an option needs a{' '}
        <span className="text-coral">vol surface plus four greeks</span>. that's why every ETRM has{' '}
        <em>two</em> pricing engines hiding inside it.
      </div>
    </div>
  )
}
