import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Simplified Basel-style capital calc
const BASE_PORTFOLIO_VALUE = 8200 // €k market value
const BASE_PORTFOLIO_RWA = 4920 // €k risk-weighted (60% RW avg)
const CAPITAL_REQ_PCT = 0.08 // 8% Basel
const COST_OF_EQUITY = 0.12 // 12% required return
const ANNUAL_PROFIT_BASE = 980 // €k expected P&L

function rwaFor(positionScale: number, riskKind: 'low' | 'med' | 'high'): number {
  const rw = riskKind === 'low' ? 0.30 : riskKind === 'med' ? 0.60 : 1.10
  return BASE_PORTFOLIO_RWA + 250 * positionScale * rw * (riskKind === 'high' ? 2 : 1)
}

function profitFor(positionScale: number, riskKind: 'low' | 'med' | 'high'): number {
  const expRet = riskKind === 'low' ? 0.08 : riskKind === 'med' ? 0.14 : 0.22
  return ANNUAL_PROFIT_BASE + 250 * positionScale * expRet * (riskKind === 'high' ? 1.8 : 1)
}

export function RegulatoryCapitalDemo() {
  const [scale, setScale] = useState(0)
  const [risk, setRisk] = useState<'low' | 'med' | 'high'>('med')

  const baseline = useMemo(
    () => ({
      rwa: BASE_PORTFOLIO_RWA,
      capital: BASE_PORTFOLIO_RWA * CAPITAL_REQ_PCT,
      profit: ANNUAL_PROFIT_BASE,
    }),
    [],
  )
  const proposed = useMemo(() => {
    const rwa = rwaFor(scale, risk)
    const capital = rwa * CAPITAL_REQ_PCT
    const profit = profitFor(scale, risk)
    return { rwa, capital, profit }
  }, [scale, risk])

  const baselineROE = baseline.profit / baseline.capital
  const proposedROE = proposed.profit / proposed.capital
  const acceptable = proposedROE >= COST_OF_EQUITY

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        the trader wants to add a new trade. the regulator says: how much new <em>capital</em> does the firm need to hold against it? the MO does the math. then the firm asks: <span className="text-coral font-bold">is it worth the capital?</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
            <span>new trade size (vs baseline)</span>
            <span className="font-bold">+{scale.toFixed(1)}× scale</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-coral"
          />
        </div>
        <div>
          <div className="font-hand text-xs text-ink/70 mb-1">new trade risk profile:</div>
          <div className="flex gap-1">
            {(['low', 'med', 'high'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRisk(r)}
                className={`flex-1 pill-sketch text-xs ${
                  risk === r ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
                }`}
              >
                {r === 'low' ? 'low risk' : r === 'med' ? 'medium' : 'high risk'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
          <Step
            label="market value"
            unit="€k"
            value={BASE_PORTFOLIO_VALUE + 250 * scale}
            color="teal"
            note="what the book is worth"
          />
          <Arrow />
          <Step
            label="RWA"
            unit="€k"
            value={proposed.rwa}
            baseline={baseline.rwa}
            color="mustard"
            note="risk-weighted assets (Basel)"
          />
          <Arrow />
          <Step
            label="capital required"
            unit="€k"
            value={proposed.capital}
            baseline={baseline.capital}
            color="coral"
            note="× 8% of RWA"
            big
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <div className="bg-cream rounded border-[1.5px] border-ink/30 p-2 text-center">
          <div className="font-hand text-xs text-ink/60">expected annual P&amp;L</div>
          <div className="font-display text-xl">€{proposed.profit.toFixed(0)}k</div>
          <div className="font-hand text-[10px] text-ink/55">
            +€{(proposed.profit - baseline.profit).toFixed(0)}k from new trade
          </div>
        </div>
        <div className="bg-cream rounded border-[1.5px] border-ink/30 p-2 text-center">
          <div className="font-hand text-xs text-ink/60">required capital</div>
          <div className="font-display text-xl text-coral">€{proposed.capital.toFixed(0)}k</div>
          <div className="font-hand text-[10px] text-ink/55">
            +€{(proposed.capital - baseline.capital).toFixed(0)}k locked up
          </div>
        </div>
        <div
          className={`rounded border-[1.5px] p-2 text-center ${
            acceptable ? 'bg-sage/15 border-sage' : 'bg-coral/15 border-coral'
          }`}
        >
          <div className="font-hand text-xs text-ink/60">return on equity</div>
          <motion.div
            key={`${proposedROE.toFixed(2)}`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`font-display text-2xl ${
              acceptable ? 'text-sage' : 'text-coral'
            }`}
          >
            {(proposedROE * 100).toFixed(1)}%
          </motion.div>
          <div className="font-hand text-[10px] text-ink/55">
            hurdle: {(COST_OF_EQUITY * 100).toFixed(0)}% · baseline: {(baselineROE * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div
        className={`p-3 rounded-lg border-[2px] border-dashed ${
          acceptable ? 'border-sage bg-sage/10' : 'border-coral bg-coral/10'
        }`}
      >
        <div className="font-display text-base">
          {acceptable ? '✓ trade approved · clears the RoE hurdle' : '✗ trade rejected · RoE below cost of equity'}
        </div>
        <div className="font-body text-sm text-ink/85 leading-snug">
          {acceptable
            ? `The new position adds €${(proposed.profit - baseline.profit).toFixed(0)}k of expected P&L for €${(proposed.capital - baseline.capital).toFixed(0)}k of additional capital — a marginal RoE of ${(((proposed.profit - baseline.profit) / Math.max(proposed.capital - baseline.capital, 0.01)) * 100).toFixed(0)}%. Above hurdle. Approved.`
            : `The marginal RoE on the new trade is below the firm's cost of equity. Regulator-mandated capital eats the return. Either the trader gets more aggressive on price, or the deal dies.`}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the trader's bonus is{' '}
        <span className="text-coral">P&amp;L ÷ capital</span>. the MO doesn't get to set the numerator — but they compute the denominator. that's a lot of power.
      </div>
    </div>
  )
}

function Step({
  label,
  unit,
  value,
  baseline,
  color,
  note,
  big,
}: {
  label: string
  unit: string
  value: number
  baseline?: number
  color: 'teal' | 'mustard' | 'coral'
  note: string
  big?: boolean
}) {
  const bg = color === 'teal' ? 'bg-teal/15 border-teal' : color === 'mustard' ? 'bg-mustard/15 border-mustard' : 'bg-coral/15 border-coral'
  const text = color === 'teal' ? 'text-teal' : color === 'mustard' ? 'text-mustard' : 'text-coral'
  return (
    <div className={`rounded border-[2px] p-2 text-center ${bg}`}>
      <div className="font-hand text-xs text-ink/60">{label}</div>
      <motion.div
        key={value.toFixed(0)}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        className={`font-display ${big ? 'text-3xl' : 'text-2xl'} ${text}`}
      >
        €{value.toFixed(0)}{unit}
      </motion.div>
      {baseline !== undefined && Math.abs(value - baseline) > 1 && (
        <div className="font-hand text-[10px] text-ink/55">
          baseline €{baseline.toFixed(0)}{unit}
        </div>
      )}
      <div className="font-hand text-[10px] text-ink/55 mt-0.5 leading-tight">{note}</div>
    </div>
  )
}

function Arrow() {
  return (
    <div className="text-center font-display text-2xl text-ink/35 self-center hidden md:block">
      →
    </div>
  )
}
