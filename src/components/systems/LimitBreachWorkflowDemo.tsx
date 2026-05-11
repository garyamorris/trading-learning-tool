import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Limit = {
  id: string
  label: string
  unit: string
  limit: number
  // value as a function of "position scale" knob (0.5 - 1.6)
  valueFor: (scale: number) => number
  who: string // approver
  hint: string
}

const LIMITS: Limit[] = [
  {
    id: 'var',
    label: 'VaR 95% (10d)',
    unit: '€k',
    limit: 335,
    valueFor: (s) => 240 * s,
    who: 'risk_manager',
    hint: 'tail loss in normal conditions',
  },
  {
    id: 'pos',
    label: 'position · power',
    unit: 'MW',
    limit: 190,
    valueFor: (s) => 145 * s,
    who: 'risk_manager',
    hint: 'directional exposure cap',
  },
  {
    id: 'tenor',
    label: 'tenor concentration · near-month',
    unit: '%',
    limit: 40,
    valueFor: (s) => 30 * s,
    who: 'risk_manager',
    hint: 'don\'t pile everything into M+1',
  },
  {
    id: 'cp',
    label: 'counterparty · CP_004 PFE',
    unit: '€k',
    limit: 560,
    valueFor: (s) => 380 * s,
    who: 'credit_officer',
    hint: 'no single counterparty too big',
  },
  {
    id: 'stress',
    label: 'stress · gas supply shock',
    unit: '€k',
    limit: 225,
    valueFor: (s) => 165 * s * s,
    who: 'risk_committee',
    hint: 'survive a hand-built scenario',
  },
]

type Status = 'ok' | 'warn' | 'breach'

type BreachCard = {
  id: string
  limitId: string
  label: string
  utilisation: number
  approver: string
  state: 'open' | 'approved' | 'exception' | 'force_reduce'
  ts: string
}

function status(util: number): Status {
  if (util >= 1.0) return 'breach'
  if (util >= 0.65) return 'warn'
  return 'ok'
}

function statusColor(s: Status): string {
  return s === 'breach' ? 'coral' : s === 'warn' ? 'mustard' : 'sage'
}

export function LimitBreachWorkflowDemo() {
  const [scale, setScale] = useState(1.0)
  const [history, setHistory] = useState<BreachCard[]>([])
  const [counter, setCounter] = useState(0)

  const rows = useMemo(
    () =>
      LIMITS.map((l) => {
        const value = l.valueFor(scale)
        const util = value / l.limit
        return { ...l, value, util, status: status(util) }
      }),
    [scale],
  )

  // Auto-generate breach cards for any limit currently in 'breach' state
  // that doesn't already have an open card
  const openCards = history.filter((c) => c.state === 'open')
  const newBreaches = rows
    .filter((r) => r.status === 'breach' && !openCards.some((c) => c.limitId === r.id))
    .map((r) => ({
      limit: r,
    }))

  function raiseBreaches() {
    if (newBreaches.length === 0) return
    const ts = new Date()
    const tsStr = `${String(ts.getHours()).padStart(2, '0')}:${String(ts.getMinutes()).padStart(2, '0')}:${String(ts.getSeconds()).padStart(2, '0')}`
    const additions = newBreaches.map((nb, i) => ({
      id: `BR_${(counter + i + 1).toString().padStart(3, '0')}`,
      limitId: nb.limit.id,
      label: nb.limit.label,
      utilisation: nb.limit.util,
      approver: nb.limit.who,
      state: 'open' as const,
      ts: tsStr,
    }))
    setHistory([...history, ...additions])
    setCounter(counter + additions.length)
  }

  function resolve(id: string, state: BreachCard['state']) {
    setHistory(history.map((c) => (c.id === id ? { ...c, state } : c)))
  }

  function clearHistory() {
    setHistory([])
    setCounter(0)
  }

  const breachCount = rows.filter((r) => r.status === 'breach').length

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        five live limits. push the scale up and watch breaches accumulate. when one fires, it lands in the queue on the right:
      </div>

      <div className="mb-4">
        <div className="flex justify-between font-hand text-sm text-ink/70 mb-1">
          <span>portfolio scale</span>
          <span className="font-bold">
            ×{scale.toFixed(2)}
            {breachCount > 0 && (
              <span className="ml-2 text-coral">
                · {breachCount} breach{breachCount > 1 ? 'es' : ''}!
              </span>
            )}
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={1.7}
          step={0.02}
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full accent-coral"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* LIMIT TABLE */}
        <div className="md:col-span-3 bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3">
          <div className="font-display text-base mb-2">📊 limit table</div>
          <div className="space-y-1.5">
            {rows.map((r) => {
              const color = statusColor(r.status)
              return (
                <motion.div
                  key={r.id}
                  layout
                  className={`bg-cream border-[1.5px] rounded p-1.5 ${
                    color === 'coral'
                      ? 'border-coral'
                      : color === 'mustard'
                      ? 'border-mustard'
                      : 'border-ink/30'
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-body text-xs font-bold">{r.label}</span>
                    <span className="font-mono text-xs tabular-nums">
                      {r.value.toFixed(r.unit === 'MW' || r.unit === '%' ? 0 : 0)} / {r.limit} {r.unit}
                    </span>
                  </div>
                  <div className="relative h-2.5 bg-paper/60 rounded overflow-hidden mt-1">
                    <motion.div
                      className={`h-full ${
                        color === 'coral'
                          ? 'bg-coral'
                          : color === 'mustard'
                          ? 'bg-mustard'
                          : 'bg-sage'
                      }`}
                      animate={{ width: `${Math.min(100, r.util * 100)}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-[1.5px] bg-coral/80"
                      style={{ left: '100%' }}
                    />
                  </div>
                  <div className="flex justify-between font-hand text-[10px] text-ink/55 mt-0.5">
                    <span>{r.hint}</span>
                    <span>
                      {(r.util * 100).toFixed(0)}%{' '}
                      <span
                        className={
                          color === 'coral'
                            ? 'text-coral font-bold'
                            : color === 'mustard'
                            ? 'text-mustard font-bold'
                            : 'text-sage'
                        }
                      >
                        ({r.status === 'breach' ? 'BREACH' : r.status === 'warn' ? 'warn' : 'ok'})
                      </span>
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {newBreaches.length > 0 && (
            <button
              onClick={raiseBreaches}
              className="btn-sketch bg-coral/40 w-full mt-2 text-sm"
            >
              ⚠ raise {newBreaches.length} new breach{newBreaches.length > 1 ? 'es' : ''} →
            </button>
          )}
        </div>

        {/* BREACH QUEUE */}
        <div className="md:col-span-2 bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 min-h-[250px]">
          <div className="flex justify-between items-baseline mb-2">
            <div className="font-display text-base">📥 breach queue</div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="font-hand text-xs text-ink/50 hover:text-ink/80 underline"
              >
                clear
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            <AnimatePresence>
              {history
                .slice()
                .reverse()
                .map((c) => {
                  const stateColor =
                    c.state === 'open'
                      ? 'border-coral bg-coral/10'
                      : c.state === 'approved'
                      ? 'border-sage bg-sage/10'
                      : c.state === 'exception'
                      ? 'border-mustard bg-mustard/10'
                      : 'border-lavender bg-lavender/10'
                  const stateLabel =
                    c.state === 'open'
                      ? 'OPEN'
                      : c.state === 'approved'
                      ? 'approved ✓'
                      : c.state === 'exception'
                      ? 'exception granted'
                      : 'forced reduce'
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      layout
                      className={`rounded border-[2px] p-2 ${stateColor}`}
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono text-xs font-bold">{c.id}</span>
                        <span className="font-hand text-[10px] text-ink/55">{c.ts}</span>
                      </div>
                      <div className="font-body text-xs leading-tight my-0.5">
                        {c.label}
                      </div>
                      <div className="font-hand text-[10px] text-ink/65">
                        {(c.utilisation * 100).toFixed(0)}% of limit · → {c.approver}
                      </div>
                      <div className="font-hand text-[11px] mt-0.5">
                        status:{' '}
                        <span
                          className={
                            c.state === 'open'
                              ? 'text-coral font-bold'
                              : c.state === 'approved'
                              ? 'text-sage font-bold'
                              : c.state === 'exception'
                              ? 'text-mustard font-bold'
                              : 'text-lavender font-bold'
                          }
                        >
                          {stateLabel}
                        </span>
                      </div>
                      {c.state === 'open' && (
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => resolve(c.id, 'approved')}
                            className="btn-sketch !py-0.5 !px-1.5 !text-[10px] bg-sage/40"
                          >
                            approve
                          </button>
                          <button
                            onClick={() => resolve(c.id, 'exception')}
                            className="btn-sketch !py-0.5 !px-1.5 !text-[10px] bg-mustard/40"
                          >
                            exception
                          </button>
                          <button
                            onClick={() => resolve(c.id, 'force_reduce')}
                            className="btn-sketch !py-0.5 !px-1.5 !text-[10px] bg-lavender/40"
                          >
                            force reduce
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
            </AnimatePresence>
            {history.length === 0 && (
              <div className="font-hand text-ink/45 text-sm text-center mt-8">
                no open breaches.{' '}
                <br />
                push the scale slider →
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ a limit isn't a gauge. it's a{' '}
        <span className="text-coral">workflow with an audit trail</span> — and "approved" is a database row, not a hand-wave in chat.
      </div>
    </div>
  )
}
