import { useState } from 'react'
import { motion } from 'framer-motion'

export function PositionPnLDemo() {
  const [position, setPosition] = useState(100) // MW
  const [priceMove, setPriceMove] = useState(0) // €/MWh change

  // Simplified: PnL = position * price_move * 0.10 (matches risk_engine.py)
  const pnl = position * priceMove * 0.10

  const isLong = position >= 0
  const positionLabel = isLong ? 'long' : 'short'

  // Why text
  let why = ''
  if (Math.abs(priceMove) < 0.5) {
    why = 'Prices barely moved — your P&L barely moves.'
  } else if (isLong && priceMove > 0) {
    why = `You're long ${Math.abs(position).toFixed(0)} MW. Prices went UP — you make money.`
  } else if (isLong && priceMove < 0) {
    why = `You're long ${Math.abs(position).toFixed(0)} MW. Prices went DOWN — you lose money.`
  } else if (!isLong && priceMove > 0) {
    why = `You're short ${Math.abs(position).toFixed(0)} MW. Prices went UP — you lose money (you owe at higher prices).`
  } else {
    why = `You're short ${Math.abs(position).toFixed(0)} MW. Prices went DOWN — you make money (you owe at lower prices).`
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-hand text-ink/70">
            your position{' '}
            <span
              className={`font-bold ${isLong ? 'text-sage' : 'text-coral'}`}
            >
              ({position >= 0 ? '+' : ''}
              {position.toFixed(0)} MW · {positionLabel})
            </span>
          </span>
          <span className="font-hand text-ink/50 text-sm">drag me</span>
        </div>
        <input
          type="range"
          min={-200}
          max={200}
          step={5}
          value={position}
          onChange={(e) => setPosition(parseInt(e.target.value))}
          className="w-full accent-mustard"
        />
        <div className="flex justify-between font-hand text-ink/50 text-sm">
          <span>short 200 MW</span>
          <span>flat</span>
          <span>long 200 MW</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-hand text-ink/70">
            today's price move{' '}
            <span className="font-bold">
              ({priceMove >= 0 ? '+' : ''}
              {priceMove.toFixed(1)} €/MWh)
            </span>
          </span>
        </div>
        <input
          type="range"
          min={-20}
          max={20}
          step={0.5}
          value={priceMove}
          onChange={(e) => setPriceMove(parseFloat(e.target.value))}
          className="w-full accent-coral"
        />
        <div className="flex justify-between font-hand text-ink/50 text-sm">
          <span>−20</span>
          <span>flat day</span>
          <span>+20</span>
        </div>
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-5 mb-3">
        <div className="font-hand text-ink/70 text-base mb-1">today's P&amp;L</div>
        <motion.div
          key={`${pnl > 0 ? 'p' : 'n'}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`font-display text-5xl mb-2 ${
            pnl >= 0 ? 'text-sage' : 'text-coral'
          }`}
        >
          {pnl >= 0 ? '+' : ''}€{pnl.toFixed(0)}k
        </motion.div>
        <div className="font-body text-base text-ink/85 leading-snug">{why}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-lg border-[1.5px] border-sage/50 bg-sage/10">
          <div className="font-hand text-sage font-bold mb-1">long 📈</div>
          <div className="font-body">
            you bought it. you profit when prices rise. you bleed when prices fall.
          </div>
        </div>
        <div className="p-3 rounded-lg border-[1.5px] border-coral/50 bg-coral/10">
          <div className="font-hand text-coral font-bold mb-1">short 📉</div>
          <div className="font-body">
            you owe it. you profit when prices fall. you bleed when prices rise.
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ a portfolio is just a bunch of these positions added up. that sum is
        called <span className="text-coral">delta</span> — your sensitivity to
        price moves.
      </div>
    </div>
  )
}
