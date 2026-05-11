import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Node = {
  id: string
  label: string
  level: 'firm' | 'desk' | 'book'
  parent?: string
  positionMW?: number
  vol?: number // simulated annualised vol
}

const TREE: Node[] = [
  { id: 'firm', label: 'Firm', level: 'firm' },
  { id: 'desk_ph', label: 'Power Hedge', level: 'desk', parent: 'firm' },
  { id: 'desk_gp', label: 'Gas Procurement', level: 'desk', parent: 'firm' },
  { id: 'desk_prop', label: 'Prop Trading', level: 'desk', parent: 'firm' },
  { id: 'book_007', label: 'BOOK_007', level: 'book', parent: 'desk_ph', positionMW: 145, vol: 0.34 },
  { id: 'book_008', label: 'BOOK_008', level: 'book', parent: 'desk_ph', positionMW: 90, vol: 0.32 },
  { id: 'book_012', label: 'BOOK_012', level: 'book', parent: 'desk_gp', positionMW: 155, vol: 0.42 },
  { id: 'book_013', label: 'BOOK_013', level: 'book', parent: 'desk_gp', positionMW: 70, vol: 0.38 },
  { id: 'book_022', label: 'BOOK_022', level: 'book', parent: 'desk_prop', positionMW: 95, vol: 0.45 },
]

type Phase = 'idle' | 'snapshot' | 'mc' | 'aggregate' | 'publish' | 'done'

const PHASE_LABELS: Record<Exclude<Phase, 'idle' | 'done'>, string> = {
  snapshot: 'snapshot positions & curves',
  mc: 'run Monte Carlo paths',
  aggregate: 'aggregate up the book tree',
  publish: 'publish to limit checker',
}

function bookVaR(n: Node, volMult: number, posMult: number): number {
  const pos = (n.positionMW ?? 0) * posMult
  const vol = (n.vol ?? 0) * volMult
  // Simplified: VaR_10d = 1.65 * 0.10 * pos * 78 * vol / sqrt(252) * sqrt(10)
  return 1.65 * 0.10 * Math.abs(pos) * 78 * vol * Math.sqrt(10 / 252)
}

export function RiskCycleDemo() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [volMult, setVolMult] = useState(1.0)
  const [posMult, setPosMult] = useState(1.0)
  const [tick, setTick] = useState(0)

  // Animate phases
  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return
    const next: Record<Exclude<Phase, 'idle' | 'done'>, Phase> = {
      snapshot: 'mc',
      mc: 'aggregate',
      aggregate: 'publish',
      publish: 'done',
    }
    const ms = phase === 'mc' ? 1200 : 700
    const t = setTimeout(() => setPhase(next[phase as keyof typeof next]), ms)
    return () => clearTimeout(t)
  }, [phase])

  // MC dot animation while in 'mc' phase
  useEffect(() => {
    if (phase !== 'mc') return
    const id = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(id)
  }, [phase])

  // Compute VaRs per node
  const books = TREE.filter((n) => n.level === 'book')
  const bookVaRs = new Map(books.map((b) => [b.id, bookVaR(b, volMult, posMult)]))
  const deskVaRs = new Map<string, number>()
  for (const desk of TREE.filter((n) => n.level === 'desk')) {
    const sum = books
      .filter((b) => b.parent === desk.id)
      .reduce((s, b) => s + (bookVaRs.get(b.id) ?? 0), 0)
    // crude diversification benefit
    deskVaRs.set(desk.id, sum * 0.92)
  }
  const firmVaR =
    [...deskVaRs.values()].reduce((s, v) => s + v, 0) * 0.88

  const run = () => {
    setTick(0)
    setPhase('snapshot')
  }
  const reset = () => {
    setPhase('idle')
    setTick(0)
  }

  const phaseIndex = phase === 'idle' || phase === 'done' ? -1 : (['snapshot', 'mc', 'aggregate', 'publish'] as const).indexOf(phase as 'snapshot')

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        every evening at ~6pm, the ETRM kicks off the <span className="text-coral font-bold">EOD risk cycle</span>. press the button and watch the four-stage pipeline run:
      </div>

      {/* CONTROL ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
              <span>vol regime</span>
              <span className="font-bold">×{volMult.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.8}
              step={0.05}
              value={volMult}
              onChange={(e) => setVolMult(parseFloat(e.target.value))}
              className="w-full accent-coral"
            />
          </div>
          <div>
            <div className="flex justify-between font-hand text-xs text-ink/70 mb-1">
              <span>portfolio scale</span>
              <span className="font-bold">×{posMult.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={posMult}
              onChange={(e) => setPosMult(parseFloat(e.target.value))}
              className="w-full accent-mustard"
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={run}
            disabled={phase !== 'idle' && phase !== 'done'}
            className="btn-sketch bg-teal/40 flex-1 disabled:opacity-50"
          >
            ▶ run EOD cycle
          </button>
          {phase === 'done' && (
            <button onClick={reset} className="btn-sketch">↻</button>
          )}
        </div>
      </div>

      {/* PIPELINE STAGES */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {(['snapshot', 'mc', 'aggregate', 'publish'] as const).map((p, i) => {
          const active = phase === p
          const done = phaseIndex > i || phase === 'done'
          return (
            <motion.div
              key={p}
              layout
              animate={{
                scale: active ? 1.04 : 1,
              }}
              className={`p-2 rounded-lg border-[2px] text-center transition-colors ${
                active
                  ? 'border-coral bg-coral/15 shadow-sketchSm'
                  : done
                  ? 'border-sage bg-sage/15'
                  : 'border-ink/25 bg-paper/30 opacity-60'
              }`}
            >
              <div className="font-hand text-xs text-ink/60">step {i + 1}</div>
              <div className="font-display text-base leading-tight">
                {done && !active ? '✓ ' : ''}
                {PHASE_LABELS[p]}
              </div>
              {active && p === 'mc' && (
                <div className="font-hand text-xs text-coral mt-1">
                  path {(tick * 60).toLocaleString()} / 5,000
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* BOOK TREE */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <div className="font-hand text-ink/70 text-sm mb-2">
          VaR rolling up the book hierarchy:
        </div>
        {/* Firm row */}
        <div className="flex items-center justify-between bg-mustard/15 border-[2px] border-ink rounded p-2 mb-1">
          <span className="font-display text-lg">🏢 Firm</span>
          <AnimatePresence mode="wait">
            {phase === 'done' ? (
              <motion.span
                key="firm-val"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-display text-2xl text-coral"
              >
                €{firmVaR.toFixed(0)}k
              </motion.span>
            ) : (
              <span className="font-hand text-ink/40">—</span>
            )}
          </AnimatePresence>
        </div>
        {/* Desks */}
        {TREE.filter((n) => n.level === 'desk').map((desk) => (
          <div key={desk.id} className="ml-4 mb-1">
            <div className="flex items-center justify-between bg-cream border-[1.5px] border-ink/40 rounded p-1.5">
              <span className="font-body text-sm">
                <span className="text-ink/40 mr-1">↳</span>📁 {desk.label}
              </span>
              <AnimatePresence mode="wait">
                {(phase === 'aggregate' || phase === 'publish' || phase === 'done') ? (
                  <motion.span
                    key="desk-val"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-display text-base text-teal"
                  >
                    €{(deskVaRs.get(desk.id) ?? 0).toFixed(0)}k
                  </motion.span>
                ) : (
                  <span className="font-hand text-ink/40 text-xs">—</span>
                )}
              </AnimatePresence>
            </div>
            {/* Books */}
            {books
              .filter((b) => b.parent === desk.id)
              .map((b) => (
                <div
                  key={b.id}
                  className="ml-6 flex items-center justify-between bg-cream/60 border-[1px] border-ink/30 rounded px-2 py-1 mt-1"
                >
                  <span className="font-body text-xs">
                    <span className="text-ink/40 mr-1">↳</span>📒 {b.label}{' '}
                    <span className="text-ink/55">
                      ({(b.positionMW ?? 0) * posMult > 0 ? '+' : ''}
                      {((b.positionMW ?? 0) * posMult).toFixed(0)} MW)
                    </span>
                  </span>
                  <AnimatePresence mode="wait">
                    {phase === 'mc' || phase === 'aggregate' || phase === 'publish' || phase === 'done' ? (
                      <motion.span
                        key="book-val"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-sm text-ink"
                      >
                        €{(bookVaRs.get(b.id) ?? 0).toFixed(0)}k
                      </motion.span>
                    ) : (
                      <span className="font-hand text-ink/40 text-xs">—</span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
          </div>
        ))}
      </div>

      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg border-[2px] border-dashed border-sage bg-sage/10"
        >
          <div className="font-hand text-sage text-base">
            ✓ EOD cycle complete · published at 06:42 next morning
          </div>
          <div className="font-body text-sm text-ink/85 leading-snug">
            The firm-level number{' '}
            <strong>€{firmVaR.toFixed(0)}k</strong> is the start of
            tomorrow's limit-check process — chapter 7's territory. Notice
            firm VaR &lt; sum of desks &lt; sum of books — that's{' '}
            <em>diversification benefit</em>, the reward for not betting on
            the same risk in two places.
          </div>
        </motion.div>
      )}

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this batch runs <em>every single night</em>. when it's late or
        broken,{' '}
        <span className="text-coral">no trader can trade</span> the next
        morning until the numbers are published.
      </div>
    </div>
  )
}
