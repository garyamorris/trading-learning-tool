import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Stage = {
  id: 'front' | 'middle' | 'back'
  label: string
  emoji: string
  role: string
  color: string
  jobs: string[]
  detail: string
}

const STAGES: Stage[] = [
  {
    id: 'front',
    label: 'Front Office',
    emoji: '⚡',
    role: 'trades',
    color: 'coral',
    jobs: [
      'books the trade',
      'marks the position',
      'asks for risk',
    ],
    detail:
      "The desk. Traders, originators, market-makers. Their compensation is tied directly to P&L — which gives them an obvious incentive to be optimistic about their own marks.",
  },
  {
    id: 'middle',
    label: 'Middle Office',
    emoji: '🛡️',
    role: 'verifies',
    color: 'teal',
    jobs: [
      'verifies the trade against external evidence',
      'independently re-marks the position',
      'computes reserves & adjustments',
      'runs the daily exception controls',
    ],
    detail:
      "The independent function in the middle. Different reporting line, different data sources, separate compensation. Their entire job is to be skeptical of the front office's numbers without breaking the relationship.",
  },
  {
    id: 'back',
    label: 'Back Office',
    emoji: '🧾',
    role: 'processes',
    color: 'mustard',
    jobs: [
      'sends confirmations',
      'reconciles settlements',
      'generates invoices',
      'books cash & accounting',
    ],
    detail:
      "Post-trade processing. Settlement, payments, accounting entries, regulatory submissions. They take the verified trade and turn it into cash and books.",
  },
]

const STEP_LABELS: Record<Stage['id'], string> = {
  front: '1 · trader executes',
  middle: '2 · MO verifies & marks',
  back: '3 · BO settles',
}

const SCANDALS = [
  { year: 1995, name: 'Barings Bank', loss: '£827m', cause: 'Nick Leeson booked losing trades to error account 88888; middle office never reconciled.' },
  { year: 2008, name: 'Société Générale', loss: '€4.9bn', cause: 'Jérôme Kerviel forged fake offsetting trades; middle office didn\'t verify them against external confirms.' },
  { year: 2011, name: 'UBS', loss: '$2.3bn', cause: 'Kweku Adoboli booked fictitious hedges; trade verification controls were inadequate.' },
  { year: 2012, name: 'JPMorgan London Whale', loss: '$6.2bn', cause: 'Iksil mismarked illiquid derivatives; independent valuation was overridden.' },
]

export function OrgDiagramDemo() {
  const [step, setStep] = useState<Stage['id'] | null>(null)
  const [playing, setPlaying] = useState(false)

  // Auto-walk through the steps when "play"
  useEffect(() => {
    if (!playing) return
    const order: Stage['id'][] = ['front', 'middle', 'back']
    let i = step ? order.indexOf(step) + 1 : 0
    if (i >= order.length) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep(order[i]), 1100)
    return () => clearTimeout(t)
  }, [playing, step])

  const activeIndex = step ? STAGES.findIndex((s) => s.id === step) : -1

  function play() {
    setStep(null)
    setPlaying(true)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        a trade goes through three rooms. each room has a job. each job exists because the other rooms can't be trusted to do it alone.
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={play} className="btn-sketch bg-teal/40 text-sm">
          ▶ walk a trade through
        </button>
        <button
          onClick={() => { setStep(null); setPlaying(false) }}
          className="btn-sketch text-sm"
        >
          ↻ reset
        </button>
        <div className="flex-1" />
        <span className="font-hand text-xs text-ink/55">click any room ↓</span>
      </div>

      {/* DIAGRAM */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-4 mb-3 relative">
        <div className="grid grid-cols-3 gap-2 relative">
          {/* Animated trade dot */}
          <AnimatePresence>
            {step && (
              <motion.div
                key={step}
                initial={{ left: `${(activeIndex / 3) * 100}%`, opacity: 0 }}
                animate={{
                  left: `${(activeIndex / 3) * 100 + 16}%`,
                  opacity: 1,
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                className="absolute -top-1 text-2xl pointer-events-none"
              >
                🎫
              </motion.div>
            )}
          </AnimatePresence>

          {STAGES.map((s, i) => {
            const active = step === s.id
            const past = activeIndex > i
            const colorBg =
              s.color === 'coral'
                ? 'border-coral bg-coral/10'
                : s.color === 'teal'
                ? 'border-teal bg-teal/10'
                : 'border-mustard bg-mustard/10'
            return (
              <motion.button
                key={s.id}
                layout
                onClick={() => { setPlaying(false); setStep(s.id) }}
                animate={{
                  scale: active ? 1.05 : 1,
                  opacity: !step ? 1 : active ? 1 : past ? 0.75 : 0.55,
                }}
                className={`text-left rounded-lg border-[2.5px] p-3 shadow-sketchSm transition-colors ${colorBg} ${active ? 'ring-2 ring-ink/40' : 'hover:bg-paper'}`}
              >
                <div className="font-hand text-[10px] uppercase tracking-widest text-ink/55">
                  {STEP_LABELS[s.id]}
                </div>
                <div className="font-display text-xl">
                  {s.emoji} {s.label}
                </div>
                <div className="font-hand text-sm text-ink/65">{s.role}</div>
                <ul className="mt-1 space-y-0.5">
                  {s.jobs.map((j) => (
                    <li
                      key={j}
                      className="font-body text-[11px] leading-snug flex gap-1"
                    >
                      <span className="text-ink/40">·</span> {j}
                    </li>
                  ))}
                </ul>
              </motion.button>
            )
          })}
        </div>

        {/* Arrows under the boxes */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="text-center font-display text-xl text-ink/35">
              {i < 2 ? '→' : '✓'}
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL CARD */}
      <AnimatePresence mode="wait">
        {step && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-lg bg-cream border-[2px] border-ink/30 mb-3"
          >
            {(() => {
              const s = STAGES.find((x) => x.id === step)!
              return (
                <>
                  <div className="font-display text-xl mb-1">
                    {s.emoji} {s.label}
                  </div>
                  <div className="font-body text-sm text-ink/85 leading-snug">
                    {s.detail}
                  </div>
                </>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCANDALS PANEL */}
      <div className="p-3 rounded-lg bg-rose/10 border-[2px] border-dashed border-rose">
        <div className="font-display text-base text-rose mb-1">
          ⚠ why this function exists
        </div>
        <div className="font-body text-sm text-ink/85 mb-2 leading-snug">
          Every famous trading scandal is at root a story of insufficient middle-office control. Hover or tap:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {SCANDALS.map((s) => (
            <div
              key={s.name}
              className="bg-cream rounded border-[1.5px] border-rose/40 p-1.5"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-sm">
                  {s.name}{' '}
                  <span className="text-ink/55 text-xs">({s.year})</span>
                </span>
                <span className="font-mono text-xs text-rose font-bold">
                  −{s.loss}
                </span>
              </div>
              <div className="font-body text-[11px] text-ink/75 leading-tight">
                {s.cause}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ "trust but verify" isn't a slogan in trading — it's an org chart. the middle office <span className="text-coral">is</span> the verify.
      </div>
    </div>
  )
}
