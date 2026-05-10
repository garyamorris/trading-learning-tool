import { useState } from 'react'
import { motion } from 'framer-motion'

export function PhysicalObligationDemo() {
  const [obligation] = useState(140) // MW promised to retail customers
  const [hedgeRatio, setHedgeRatio] = useState(0.7)
  const [priceShock, setPriceShock] = useState(0)

  const unhedged = obligation * (1 - hedgeRatio)
  const baselinePrice = 78
  const shockedPrice = baselinePrice * (1 + priceShock)
  // Cost of the obligation at delivery: unhedged volume × (delivery price − contracted retail price)
  // Approximate retail-recovered price as baseline; loss is unhedged * (shockedPrice - baseline)
  const exposureCost = unhedged * (shockedPrice - baselinePrice) * 0.10

  const hedgeLabel =
    hedgeRatio >= 0.95
      ? 'fully hedged'
      : hedgeRatio >= 0.7
      ? 'mostly hedged'
      : hedgeRatio >= 0.4
      ? 'partially hedged'
      : 'naked'

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-4">
        you're a <span className="font-bold">retail supply desk</span>. you've
        promised customers <strong>{obligation} MW</strong> at a fixed retail
        price. delivery is in <strong>20 days</strong>. you can hedge any
        fraction of it now in the wholesale market:
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
          <span>hedge ratio</span>
          <span className="font-bold">
            {(hedgeRatio * 100).toFixed(0)}% — {hedgeLabel}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={hedgeRatio}
          onChange={(e) => setHedgeRatio(parseFloat(e.target.value))}
          className="w-full accent-sage"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-sage/10 rounded-lg border-[2px] border-sage/50">
          <div className="font-hand text-ink/70 text-sm">hedged</div>
          <div className="font-display text-3xl text-sage">
            {(obligation * hedgeRatio).toFixed(0)} MW
          </div>
          <div className="font-hand text-xs text-ink/60">
            already locked in at today's wholesale price.
          </div>
        </div>
        <div className="p-3 bg-coral/10 rounded-lg border-[2px] border-coral/50">
          <div className="font-hand text-ink/70 text-sm">unhedged exposure</div>
          <div className="font-display text-3xl text-coral">
            {unhedged.toFixed(0)} MW
          </div>
          <div className="font-hand text-xs text-ink/60">
            you'll have to buy this in the spot market on delivery day. at
            whatever the price is then.
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
          <span>spot price on delivery day</span>
          <span className="font-bold">
            {priceShock >= 0 ? '+' : ''}
            {(priceShock * 100).toFixed(0)}% vs today
          </span>
        </div>
        <input
          type="range"
          min={-0.3}
          max={0.6}
          step={0.05}
          value={priceShock}
          onChange={(e) => setPriceShock(parseFloat(e.target.value))}
          className="w-full accent-coral"
        />
        <div className="flex justify-between font-hand text-xs text-ink/50 mt-0.5">
          <span>−30% (mild winter)</span>
          <span>baseline</span>
          <span>+60% (cold spell)</span>
        </div>
      </div>

      <motion.div
        layout
        className={`p-4 rounded-lg border-[2px] ${
          exposureCost > 50
            ? 'border-coral bg-coral/15'
            : exposureCost < -50
            ? 'border-sage bg-sage/15'
            : 'border-ink/30 bg-paper/40'
        } mb-3`}
      >
        <div className="font-hand text-ink/70 text-sm">
          P&amp;L on the unhedged piece, at delivery:
        </div>
        <div
          className={`font-display text-4xl ${
            exposureCost > 0
              ? 'text-coral'
              : exposureCost < 0
              ? 'text-sage'
              : 'text-ink'
          }`}
        >
          {exposureCost >= 0 ? '−' : '+'}€{Math.abs(exposureCost).toFixed(0)}k
        </div>
        <div className="font-body text-sm text-ink/80 mt-1">
          {exposureCost > 50
            ? `Spot moved up ${(priceShock * 100).toFixed(0)}% but you have to deliver at the old retail price. Every unhedged MW bleeds.`
            : exposureCost < -50
            ? `Spot fell. The unhedged volume cost less than expected — pure luck. Hedging is about not relying on luck.`
            : 'Roughly break-even on the unhedged piece. But you bet on it.'}
        </div>
      </motion.div>

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ a financial trader can <em>choose</em> to be exposed to a price.{' '}
        a <span className="text-coral">physical desk has to deliver</span> —
        their exposure is whatever's left over after they hedge. unhedged
        physical exposure is the most dangerous number on the book.
      </div>
    </div>
  )
}
