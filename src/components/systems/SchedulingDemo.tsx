import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Required delivery profile per hour (MW) — peaks in the evening
const REQUIRED: number[] = [
  20, 18, 16, 15, 14, 14, 20, 32, 42, 44, 42, 40, 40, 42, 44, 46, 50, 58, 62, 60, 52, 42, 32, 24,
]

const HOURS = REQUIRED.length

function totalMW(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0)
}

export function SchedulingDemo() {
  const [nominated, setNominated] = useState<number[]>(REQUIRED.map(() => 0))
  const [hover, setHover] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [submitted, setSubmitted] = useState(false)

  // Tick down the gate-closure timer
  useEffect(() => {
    if (submitted) return
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft, submitted])

  function setHour(h: number, value: number) {
    if (submitted) return
    const next = nominated.slice()
    next[h] = Math.max(0, Math.min(80, value))
    setNominated(next)
  }

  function autoMatch() {
    if (submitted) return
    setNominated([...REQUIRED])
  }

  function clearAll() {
    if (submitted) return
    setNominated(REQUIRED.map(() => 0))
  }

  function submit() {
    setSubmitted(true)
  }

  function reset() {
    setSubmitted(false)
    setSecondsLeft(60)
    setNominated(REQUIRED.map(() => 0))
  }

  const imbalance = nominated.map((n, i) => n - REQUIRED[i])
  const absImbalance = imbalance.reduce((s, v) => s + Math.abs(v), 0)
  const totalRequired = totalMW(REQUIRED)
  const totalNominated = totalMW(nominated)
  // Imbalance penalty: €15/MWh per imbalance MW
  const penalty = absImbalance * 15

  // Chart geometry
  const w = 540
  const h = 200
  const padL = 24
  const padR = 12
  const padT = 14
  const padB = 32
  const maxMW = Math.max(80, Math.max(...REQUIRED), Math.max(...nominated)) * 1.05
  const barW = (w - padL - padR) / HOURS
  const yFor = (mw: number) => h - padB - (mw / maxMW) * (h - padT - padB)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-2">
        you've sold 50 MW of power for tomorrow. now actually deliver it:{' '}
        <span className="text-coral font-bold">nominate</span> the MW per hour to the TSO before gate closure.
      </div>

      {/* TIMER */}
      <div className="flex items-center justify-between gap-3 mb-3 bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3">
        <div>
          <div className="font-hand text-xs text-ink/55">gate closure in</div>
          <motion.div
            key={Math.floor(secondsLeft / 5)}
            initial={{ scale: 1 }}
            animate={{
              scale: secondsLeft <= 10 && !submitted ? [1, 1.06, 1] : 1,
              color: secondsLeft <= 10 && !submitted ? '#e8694e' : '#2b2a26',
            }}
            transition={{ duration: 0.4 }}
            className="font-display text-3xl tabular-nums"
          >
            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
          </motion.div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2 text-center">
          <div className="bg-cream rounded border-[1.5px] border-ink/30 p-1.5">
            <div className="font-hand text-xs text-ink/55">required total</div>
            <div className="font-display text-lg text-ink">{totalRequired} MWh</div>
          </div>
          <div
            className={`rounded border-[1.5px] p-1.5 ${
              absImbalance < 10
                ? 'bg-sage/15 border-sage'
                : absImbalance < 30
                ? 'bg-mustard/15 border-mustard'
                : 'bg-coral/15 border-coral'
            }`}
          >
            <div className="font-hand text-xs text-ink/55">nominated total</div>
            <div className="font-display text-lg">{totalNominated} MWh</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={autoMatch}
            disabled={submitted}
            className="btn-sketch !py-0.5 !px-2 !text-xs"
          >
            auto-match
          </button>
          <button
            onClick={clearAll}
            disabled={submitted}
            className="btn-sketch !py-0.5 !px-2 !text-xs"
          >
            clear
          </button>
        </div>
      </div>

      {/* SCHEDULE CHART */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-52">
          {/* gridlines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={padL}
              x2={w - padR}
              y1={padT + (h - padT - padB) * (1 - f)}
              y2={padT + (h - padT - padB) * (1 - f)}
              stroke="#2b2a26"
              strokeWidth="0.3"
              opacity="0.2"
            />
          ))}

          {/* Required profile (outline) */}
          {REQUIRED.map((mw, i) => (
            <rect
              key={`req-${i}`}
              x={padL + i * barW + 0.5}
              width={barW - 1}
              y={yFor(mw)}
              height={Math.max(1, h - padB - yFor(mw))}
              fill="#e3a93a"
              fillOpacity="0.18"
              stroke="#e3a93a"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          ))}

          {/* Nominated bars */}
          {nominated.map((mw, i) => {
            const imb = mw - REQUIRED[i]
            const color =
              Math.abs(imb) < 4 ? '#8caf6f' : Math.abs(imb) < 10 ? '#e3a93a' : '#e8694e'
            return (
              <g
                key={`nom-${i}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: submitted ? 'default' : 'pointer' }}
              >
                <motion.rect
                  x={padL + i * barW + barW * 0.2}
                  width={barW * 0.6}
                  y={yFor(mw)}
                  height={Math.max(0, h - padB - yFor(mw))}
                  fill={color}
                  fillOpacity={hover === i ? 0.85 : 0.55}
                  stroke="#2b2a26"
                  strokeWidth="0.5"
                  animate={{ y: yFor(mw), height: Math.max(0, h - padB - yFor(mw)) }}
                />
                {hover === i && (
                  <g>
                    <rect
                      x={padL + i * barW - 8}
                      y={yFor(mw) - 22}
                      width={50}
                      height={20}
                      rx="2"
                      fill="#fbf6ec"
                      stroke="#2b2a26"
                      strokeWidth="1"
                    />
                    <text
                      x={padL + i * barW + 17}
                      y={yFor(mw) - 8}
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="Patrick Hand"
                    >
                      h{i}: {mw} / {REQUIRED[i]}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* x-axis */}
          {[0, 6, 12, 18, 23].map((hr) => (
            <text
              key={hr}
              x={padL + hr * barW + barW / 2}
              y={h - 14}
              fontSize="9"
              fontFamily="Patrick Hand"
              opacity="0.65"
              textAnchor="middle"
            >
              {String(hr).padStart(2, '0')}:00
            </text>
          ))}
          <text x={4} y={padT + 6} fontSize="8" fontFamily="Patrick Hand" opacity="0.55">
            MW
          </text>
        </svg>

        {/* HOUR SLIDERS — compact grid */}
        <div className="grid grid-cols-12 gap-1 mt-2">
          {nominated.map((mw, i) => (
            <button
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setHour(i, REQUIRED[i])}
              disabled={submitted}
              className={`text-[9px] font-mono rounded px-1 py-0.5 border ${
                hover === i ? 'border-ink bg-mustard/20' : 'border-ink/20 bg-cream'
              } ${submitted ? 'opacity-60' : 'hover:bg-mustard/10'}`}
            >
              <div className="text-ink/55 leading-tight">h{i}</div>
              <div className="font-bold leading-tight">{mw}</div>
            </button>
          ))}
        </div>
        <div className="font-hand text-xs text-ink/55 mt-1 text-center">
          click an hour to snap it to the required MW · drag bars below ↓
        </div>

        {/* per-hour scrollable detail */}
        <div className="grid grid-cols-12 gap-1 mt-1">
          {nominated.map((mw, i) => (
            <input
              key={i}
              type="range"
              min={0}
              max={80}
              value={mw}
              onChange={(e) => setHour(i, parseInt(e.target.value))}
              disabled={submitted}
              className="w-full accent-coral"
              style={{ writingMode: 'vertical-lr' as const }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-cream rounded border-[1.5px] border-ink/30 p-2">
          <div className="font-hand text-xs text-ink/55">total imbalance</div>
          <div
            className={`font-display text-2xl ${
              absImbalance < 10 ? 'text-sage' : absImbalance < 30 ? 'text-mustard' : 'text-coral'
            }`}
          >
            {absImbalance.toFixed(0)} MWh
          </div>
        </div>
        <div className="bg-cream rounded border-[1.5px] border-ink/30 p-2">
          <div className="font-hand text-xs text-ink/55">imbalance penalty</div>
          <div className="font-display text-2xl text-coral">−€{penalty.toFixed(0)}</div>
        </div>
        <div className="bg-cream rounded border-[1.5px] border-ink/30 p-2 flex flex-col justify-center">
          <button
            onClick={submit}
            disabled={submitted || secondsLeft <= 0}
            className="btn-sketch bg-teal/40 disabled:opacity-50 !text-sm"
          >
            {submitted ? '✓ submitted' : '📡 submit to TSO'}
          </button>
        </div>
      </div>

      {(submitted || secondsLeft <= 0) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border-[2px] border-dashed mb-3 ${
            submitted && absImbalance < 10
              ? 'border-sage bg-sage/10'
              : 'border-coral bg-coral/10'
          }`}
        >
          {submitted ? (
            absImbalance < 10 ? (
              <>
                <div className="font-display text-xl text-sage">
                  ✓ schedule accepted · nomination on file
                </div>
                <div className="font-body text-sm text-ink/85">
                  TSO acknowledged. Imbalance under 10 MWh; penalty negligible. The system will reconcile against metered actuals at T+1.
                </div>
              </>
            ) : (
              <>
                <div className="font-display text-xl text-coral">
                  ⚠ schedule accepted with imbalance
                </div>
                <div className="font-body text-sm text-ink/85">
                  TSO took the nomination, but the imbalance settlement will charge you{' '}
                  <strong>€{penalty.toFixed(0)}</strong> at the imbalance price. Better profile next time.
                </div>
              </>
            )
          ) : (
            <>
              <div className="font-display text-xl text-coral">
                💥 gate closed · no schedule submitted
              </div>
              <div className="font-body text-sm text-ink/85">
                The TSO will assume zero nominated and assign you a full-volume imbalance for every delivered MWh tomorrow. Expensive.
              </div>
            </>
          )}
          <button onClick={reset} className="btn-sketch mt-2 !text-xs">
            ↻ try again
          </button>
        </motion.div>
      )}

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ every physical MWh you trade has to be{' '}
        <span className="text-coral">told to the wires on time</span>. forget the cutoff and the grid charges you for the privilege.
      </div>
    </div>
  )
}
