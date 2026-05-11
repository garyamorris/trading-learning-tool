import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ARTIFACTS = [
  { id: 'ticket', icon: '🎫', label: 'trade ticket', from: 'sales chat' },
  { id: 'confo', icon: '📧', label: 'broker confirmation', from: 'email' },
  { id: 'sheet', icon: '📊', label: "trader's sheet", from: 'Excel macro' },
  { id: 'risk', icon: '📈', label: 'risk roll-up', from: 'another Excel' },
  { id: 'curve', icon: '〽️', label: 'forward curve', from: 'Reuters CSV' },
  { id: 'lim', icon: '⚖️', label: 'limit check', from: 'risk manager' },
  { id: 'pnl', icon: '💷', label: 'overnight P&L', from: 'finance pivot' },
  { id: 'sched', icon: '🚚', label: 'delivery schedule', from: 'ops email' },
]

export function BeforeAfterETRMDemo() {
  const [mode, setMode] = useState<'before' | 'after'>('before')

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-hand text-ink/70 text-base">view:</span>
        <button
          onClick={() => setMode('before')}
          className={`pill-sketch text-base transition ${
            mode === 'before' ? 'bg-coral/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          📂 before ETRM
        </button>
        <button
          onClick={() => setMode('after')}
          className={`pill-sketch text-base transition ${
            mode === 'after' ? 'bg-sage/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          🖥️ with ETRM
        </button>
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-4 min-h-[340px] relative">
        <AnimatePresence mode="wait">
          {mode === 'before' && (
            <motion.div
              key="before"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="font-display text-2xl mb-2 text-coral">
                📂 the trading floor in 1998
              </div>
              <div className="font-body text-sm text-ink/80 mb-4 leading-snug">
                Eight different artifacts. None of them know about each other.
                Reconciling them is a person's full-time job.
              </div>
              <div className="relative h-56">
                {ARTIFACTS.map((a, i) => {
                  const angle = (i / ARTIFACTS.length) * Math.PI * 2 + 0.4
                  const r = 100
                  const x = 50 + (Math.cos(angle) * r) / 4
                  const y = 50 + (Math.sin(angle) * r) / 4
                  const tilt = (i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 2)
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: tilt }}
                      transition={{ delay: i * 0.05, type: 'spring' }}
                      className="absolute bg-cream border-[2px] border-ink rounded-md shadow-sketchSm px-2 py-1 w-36"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="font-display text-base">
                        {a.icon} {a.label}
                      </div>
                      <div className="font-hand text-xs text-ink/60">
                        from: {a.from}
                      </div>
                    </motion.div>
                  )
                })}
                {/* tangled arrows */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {[
                    [20, 30, 70, 60],
                    [40, 20, 30, 70],
                    [70, 30, 20, 60],
                    [60, 70, 30, 40],
                    [25, 60, 75, 30],
                  ].map(([x1, y1, x2, y2], i) => (
                    <path
                      key={i}
                      d={`M ${x1} ${y1} Q ${(x1 + x2) / 2 + 5} ${(y1 + y2) / 2 - 8} ${x2} ${y2}`}
                      stroke="#e8694e"
                      strokeWidth="0.4"
                      fill="none"
                      strokeDasharray="1.5 1"
                      opacity="0.45"
                    />
                  ))}
                </svg>
              </div>
              <div className="mt-3 font-hand text-coral text-base">
                ⚠ when the numbers disagree, someone has to figure out which
                one's wrong. and they all disagree.
              </div>
            </motion.div>
          )}
          {mode === 'after' && (
            <motion.div
              key="after"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="font-display text-2xl mb-2 text-sage">
                🖥️ the same floor, with an ETRM
              </div>
              <div className="font-body text-sm text-ink/80 mb-4 leading-snug">
                One database. One trade record. Everything else is a{' '}
                <em>view</em> over it.
              </div>

              <div className="bg-cream border-[2.5px] border-ink rounded-lg p-3 mb-3 shadow-sketchSm">
                <div className="font-display text-xl text-center mb-2">
                  📚 single trade-record store
                </div>
                <div className="font-hand text-xs text-ink/60 text-center mb-3">
                  one row per deal · one source of truth
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {ARTIFACTS.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-sage/15 border-[1.5px] border-sage/50 rounded-md p-1.5 text-center"
                    >
                      <div className="font-display text-sm">
                        {a.icon} {a.label}
                      </div>
                      <div className="font-hand text-[10px] text-ink/55">
                        view, not a copy
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="font-hand text-sage text-base">
                ✓ when a trade changes, every view recomputes. nothing to
                reconcile.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the core promise of an ETRM is dull and revolutionary:{' '}
        <span className="text-coral">one record per trade</span>, and every
        downstream number derived from it.
      </div>
    </div>
  )
}
