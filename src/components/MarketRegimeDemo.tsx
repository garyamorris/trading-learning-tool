import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Regime = {
  id: string
  label: string
  emoji: string
  blurb: string
  power_spot: number
  gas_spot: number
  carbon_spot: number
  vol_mult: number
  liq: 'normal' | 'thin' | 'crunched'
  power_curve_slope: number
  gas_curve_slope: number
}

const REGIMES: Regime[] = [
  {
    id: 'normal',
    label: 'normal',
    emoji: '🌤',
    blurb: 'Boring weather, full liquidity, mean-reverting prices. The world traders dream of and rarely get.',
    power_spot: 78,
    gas_spot: 52,
    carbon_spot: 74,
    vol_mult: 1.0,
    liq: 'normal',
    power_curve_slope: 0.035,
    gas_curve_slope: 0.025,
  },
  {
    id: 'cold_spell',
    label: 'cold spell',
    emoji: '❄️',
    blurb: 'Heating demand spikes. Power and gas both surge, often together. Wind can drop just when you need it.',
    power_spot: 132,
    gas_spot: 71,
    carbon_spot: 75,
    vol_mult: 1.4,
    liq: 'normal',
    power_curve_slope: 0.065,
    gas_curve_slope: 0.055,
  },
  {
    id: 'gas_supply_shock',
    label: 'gas supply shock',
    emoji: '🛢️',
    blurb: 'A pipeline goes down or geopolitics turns ugly. Gas spikes hard; power follows because gas plants set the marginal price.',
    power_spot: 148,
    gas_spot: 96,
    carbon_spot: 76,
    vol_mult: 1.6,
    liq: 'thin',
    power_curve_slope: 0.080,
    gas_curve_slope: 0.075,
  },
  {
    id: 'carbon_shock',
    label: 'carbon shock',
    emoji: '🏭',
    blurb: 'Policy news (tighter EU ETS cap, surprise auction). Carbon allowances spike. Fossil generators feel the squeeze.',
    power_spot: 92,
    gas_spot: 53,
    carbon_spot: 118,
    vol_mult: 1.3,
    liq: 'normal',
    power_curve_slope: 0.045,
    gas_curve_slope: 0.025,

  },
  {
    id: 'liquidity_crunch',
    label: 'liquidity crunch',
    emoji: '💸',
    blurb: 'Nobody wants to quote. Bid-ask spreads blow out. Prices barely move but executing anything is costly.',
    power_spot: 80,
    gas_spot: 54,
    carbon_spot: 75,
    vol_mult: 1.1,
    liq: 'crunched',
    power_curve_slope: 0.040,
    gas_curve_slope: 0.030,
  },
  {
    id: 'correlation_breakdown',
    label: 'correlation breakdown',
    emoji: '🔀',
    blurb: 'Power, gas, and carbon usually move together. In this regime they don\'t. Hedges built for "normal" stop hedging.',
    power_spot: 84,
    gas_spot: 50,
    carbon_spot: 78,
    vol_mult: 1.2,
    liq: 'normal',
    power_curve_slope: 0.030,
    gas_curve_slope: 0.020,
  },
]

const TENORS = [
  { id: 'M1', label: 'M+1', months: 1 },
  { id: 'M3', label: 'M+3', months: 3 },
  { id: 'Q1', label: 'Q+1', months: 4 },
  { id: 'Cal1', label: 'Cal+1', months: 12 },
]

function ForwardCurve({
  spot,
  slope,
  color,
  label,
}: {
  spot: number
  slope: number
  color: string
  label: string
}) {
  const points = TENORS.map((t) => ({
    label: t.label,
    months: t.months,
    price: spot * (1 + (slope * t.months) / 12),
  }))
  const maxP = Math.max(...points.map((p) => p.price), spot) * 1.05
  const minP = Math.min(...points.map((p) => p.price), spot) * 0.85
  const range = maxP - minP

  const w = 300
  const h = 80
  const xs = points.map((_, i) => 30 + (i * (w - 60)) / (points.length - 1))
  const ys = points.map((p) => h - ((p.price - minP) / range) * (h - 18) - 8)
  const pathD = points.map((_, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${ys[i]}`).join(' ')

  return (
    <div className="bg-paper/40 rounded-lg border-[1.5px] border-ink/25 p-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-hand text-ink/70 text-sm">{label} curve</span>
        <span className="font-hand text-ink/60 text-xs">
          €{spot.toFixed(0)} → €{points[points.length - 1].price.toFixed(0)}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
        <path d={pathD} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={xs[i]} cy={ys[i]} r="3.5" fill={color} stroke="#2b2a26" strokeWidth="1" />
            <text x={xs[i]} y={h - 1} textAnchor="middle" fontSize="9" fill="#2b2a26" opacity="0.6" fontFamily="Patrick Hand">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function MarketRegimeDemo() {
  const [regimeId, setRegimeId] = useState(REGIMES[0].id)
  const r = REGIMES.find((x) => x.id === regimeId)!

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">market mood:</span>
        {REGIMES.map((x) => (
          <button
            key={x.id}
            onClick={() => setRegimeId(x.id)}
            className={`pill-sketch text-sm transition ${
              x.id === regimeId ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {x.emoji} {x.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          <div className="font-body text-base text-ink/85 mb-4 leading-relaxed">
            {r.blurb}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'power spot', value: r.power_spot, unit: '€/MWh', color: 'text-coral' },
              { label: 'gas spot', value: r.gas_spot, unit: '€/MWh', color: 'text-mustard' },
              { label: 'carbon spot', value: r.carbon_spot, unit: '€/t', color: 'text-teal' },
            ].map((m) => (
              <motion.div
                key={m.label}
                layout
                className="p-3 bg-cream rounded-lg border-[2px] border-ink/30 text-center"
              >
                <div className="font-hand text-ink/70 text-xs">{m.label}</div>
                <div className={`font-display text-3xl ${m.color}`}>
                  {m.value.toFixed(0)}
                </div>
                <div className="font-hand text-ink/50 text-xs">{m.unit}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <ForwardCurve spot={r.power_spot} slope={r.power_curve_slope} color="#e8694e" label="power" />
            <ForwardCurve spot={r.gas_spot} slope={r.gas_curve_slope} color="#e3a93a" label="gas" />
          </div>

          <div className="flex flex-wrap gap-2 mb-1">
            <span className="pill-sketch text-sm bg-paper">
              vol multiplier: <strong className="ml-1">×{r.vol_mult.toFixed(1)}</strong>
            </span>
            <span
              className={`pill-sketch text-sm ${
                r.liq === 'crunched'
                  ? 'bg-coral/30'
                  : r.liq === 'thin'
                  ? 'bg-mustard/30'
                  : 'bg-sage/30'
              }`}
            >
              liquidity: <strong className="ml-1">{r.liq}</strong>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ "the market" isn't a single number. it's spot, a forward curve, a vol
        regime, and a liquidity regime — all moving together (or, scarier,
        not).
      </div>
    </div>
  )
}
