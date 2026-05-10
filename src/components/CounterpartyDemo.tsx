import { useState } from 'react'
import { motion } from 'framer-motion'

const COUNTERPARTY_LIMIT = 560 // €k, from governance rules

export function CounterpartyDemo() {
  const [pfe, setPfe] = useState(420)
  const [collateral, setCollateral] = useState(360)

  const shortfall = Math.max(0, pfe - collateral)
  const utilisation = pfe / COUNTERPARTY_LIMIT
  const watchlist = pfe > 590 || collateral / Math.max(pfe, 1) < 0.65
  const breached = utilisation >= 1.0

  let status = 'all clear'
  let statusBg = 'bg-sage/15 border-sage'
  let statusEmoji = '✅'
  if (breached) {
    status = 'CREDIT LIMIT BREACHED — escalate to credit officer'
    statusBg = 'bg-coral/15 border-coral'
    statusEmoji = '🚨'
  } else if (shortfall > 160) {
    status = 'collateral shortfall too large — credit review required'
    statusBg = 'bg-coral/15 border-coral'
    statusEmoji = '🚨'
  } else if (watchlist) {
    status = 'on the credit watchlist — collateral coverage thin'
    statusBg = 'bg-mustard/15 border-mustard'
    statusEmoji = '⚠️'
  }

  // Visual: stacked bars
  const maxBar = Math.max(pfe, collateral, COUNTERPARTY_LIMIT) * 1.05

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>counterparty PFE</span>
            <span className="font-bold">€{pfe}k</span>
          </div>
          <input
            type="range"
            min={100}
            max={750}
            step={10}
            value={pfe}
            onChange={(e) => setPfe(parseInt(e.target.value))}
            className="w-full accent-coral"
          />
          <div className="font-hand text-xs text-ink/55 mt-0.5">
            "if everything moves badly, here's how much they could owe you."
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>collateral posted</span>
            <span className="font-bold">€{collateral}k</span>
          </div>
          <input
            type="range"
            min={50}
            max={750}
            step={10}
            value={collateral}
            onChange={(e) => setCollateral(parseInt(e.target.value))}
            className="w-full accent-sage"
          />
          <div className="font-hand text-xs text-ink/55 mt-0.5">
            "what they've already pledged. yours if they default."
          </div>
        </div>
      </div>

      {/* visual: side-by-side bars */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-4 mb-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between font-hand text-sm text-ink/70 mb-1">
              <span>PFE (potential exposure)</span>
              <span>€{pfe}k</span>
            </div>
            <div className="h-7 bg-cream rounded border-[1.5px] border-ink/30 overflow-hidden relative">
              <motion.div
                className="h-full bg-coral/60"
                animate={{ width: `${(pfe / maxBar) * 100}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-rose"
                style={{ left: `${(COUNTERPARTY_LIMIT / maxBar) * 100}%` }}
              />
              <div
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-end pr-2 font-hand text-xs text-rose"
                style={{
                  paddingRight: `${(1 - COUNTERPARTY_LIMIT / maxBar) * 100 + 1}%`,
                }}
              >
                limit €{COUNTERPARTY_LIMIT}
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-hand text-sm text-ink/70 mb-1">
              <span>collateral posted</span>
              <span>€{collateral}k</span>
            </div>
            <div className="h-7 bg-cream rounded border-[1.5px] border-ink/30 overflow-hidden">
              <motion.div
                className="h-full bg-sage/60"
                animate={{ width: `${(collateral / maxBar) * 100}%` }}
              />
            </div>
          </div>
          {shortfall > 0 && (
            <div>
              <div className="flex justify-between font-hand text-sm text-coral mb-1">
                <span className="font-bold">shortfall (PFE − collateral)</span>
                <span className="font-bold">€{shortfall.toFixed(0)}k</span>
              </div>
              <div className="h-5 bg-cream rounded border-[1.5px] border-ink/30 overflow-hidden">
                <motion.div
                  className="h-full bg-coral/70"
                  animate={{ width: `${(shortfall / maxBar) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.div layout className={`p-3 rounded-lg border-[2.5px] ${statusBg} mb-3`}>
        <div className="font-display text-2xl mb-1">
          {statusEmoji} {status}
        </div>
        <div className="font-body text-sm text-ink/80">
          counterparty utilisation:{' '}
          <strong>{(utilisation * 100).toFixed(0)}%</strong> of limit.{' '}
          {watchlist && 'On watchlist. '}
          {breached &&
            'Beyond this point the credit officer joins the conversation — and "request_limit_exception" becomes a feasible action.'}
        </div>
      </motion.div>

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ market risk is "the price moves against me." credit risk is "the
        person on the other side of my hedge can't pay me." different problem,
        different limit, different desk watching.
      </div>
    </div>
  )
}
