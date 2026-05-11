import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Source = 'front' | 'middle' | 'back' | 'counterparty'

type Row = {
  id: string
  desc: string
  positions: Record<Source, number | null>
  story: string
  resolution?: string
}

const ROWS: Row[] = [
  {
    id: 'P_001',
    desc: 'power M+1 (DE base)',
    positions: { front: 145, middle: 145, back: 145, counterparty: 145 },
    story: 'all four sources agree. boring. good.',
  },
  {
    id: 'P_002',
    desc: 'gas M+1 (NCG)',
    positions: { front: -155, middle: -155, back: -155, counterparty: -155 },
    story: 'all four agree.',
  },
  {
    id: 'P_003',
    desc: 'power Q+1',
    positions: { front: 80, middle: 80, back: 75, counterparty: 80 },
    story: 'back office is 5 MW low. probably a settlement-system mapping issue on a recent amendment.',
    resolution: 'BO team to re-process the amendment in their feed.',
  },
  {
    id: 'P_004',
    desc: 'gas Cal+2',
    positions: { front: 60, middle: 50, back: 60, counterparty: 60 },
    story: "MO shadow position is 10 MW short of everyone else. their hedge calc didn't pick up a swap booked after their last snapshot.",
    resolution: 'MO to re-snapshot and re-run their shadow calc.',
  },
  {
    id: 'P_005',
    desc: 'power Cal+2',
    positions: { front: 40, middle: 40, back: 40, counterparty: 25 },
    story: '⚠ counterparty thinks they only have 25 MW with us. we have 40. that\'s 15 MW of trades they haven\'t booked — or we never sent. critical.',
    resolution: 'Trade ops to pull the original confirms; escalate to credit team.',
  },
  {
    id: 'P_006',
    desc: 'carbon Cal+1',
    positions: { front: 35, middle: 35, back: 35, counterparty: 35 },
    story: 'all four agree.',
  },
  {
    id: 'P_007',
    desc: 'power H+24 (deliver tomorrow)',
    positions: { front: 22, middle: 22, back: null, counterparty: 22 },
    story: 'back office has no record yet. trade booked at 16:50 last night; BO batch ran at 16:30. it will land at the next batch.',
    resolution: 'Wait for next BO sync (in 14 minutes).',
  },
]

const SOURCE_META: Record<Source, { label: string; icon: string; color: string }> = {
  front: { label: 'front office', icon: '⚡', color: 'coral' },
  middle: { label: 'middle (shadow)', icon: '🛡️', color: 'teal' },
  back: { label: 'back office', icon: '🧾', color: 'mustard' },
  counterparty: { label: 'counterparty', icon: '🏢', color: 'lavender' },
}

function isBreak(row: Row): boolean {
  const vals = Object.values(row.positions).filter((v) => v !== null) as number[]
  return new Set(vals).size > 1 || Object.values(row.positions).some((v) => v === null)
}

function diverging(row: Row): Source[] {
  const counts: Record<string, number> = {}
  for (const v of Object.values(row.positions)) {
    if (v === null) continue
    counts[String(v)] = (counts[String(v)] ?? 0) + 1
  }
  const majority = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  return (Object.entries(row.positions) as [Source, number | null][])
    .filter(([, v]) => v === null || String(v) !== majority)
    .map(([k]) => k)
}

export function PositionReconDemo() {
  const [openId, setOpenId] = useState<string | null>(null)

  const breakCount = ROWS.filter(isBreak).length

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        the <em>same</em> position lives in <strong>four</strong> systems. recon job runs every morning and tells you where they disagree.{' '}
        <span className="text-coral font-bold">{breakCount} breaks today</span>:
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 overflow-hidden">
        <div className="grid grid-cols-12 bg-cream/60 border-b-[1.5px] border-ink/30 font-hand text-xs text-ink/60 px-2 py-1.5">
          <div className="col-span-3">position</div>
          {(['front', 'middle', 'back', 'counterparty'] as Source[]).map((s) => (
            <div key={s} className="col-span-2 text-right">
              <span className={`text-${SOURCE_META[s].color}`}>{SOURCE_META[s].icon}</span>{' '}
              <span className="hidden md:inline">{SOURCE_META[s].label}</span>
            </div>
          ))}
          <div className="col-span-1 text-right">status</div>
        </div>
        {ROWS.map((r) => {
          const isB = isBreak(r)
          const divs = diverging(r)
          const isOpen = openId === r.id
          return (
            <div
              key={r.id}
              className={`border-b border-ink/15 last:border-b-0 ${isB ? 'bg-coral/5' : ''}`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : r.id)}
                className="w-full grid grid-cols-12 px-2 py-1.5 text-sm hover:bg-paper/40 transition-colors"
              >
                <div className="col-span-3 text-left self-center">
                  <div className="font-mono text-xs font-bold">{r.id}</div>
                  <div className="font-body text-[11px] text-ink/70 truncate">{r.desc}</div>
                </div>
                {(['front', 'middle', 'back', 'counterparty'] as Source[]).map((s) => {
                  const v = r.positions[s]
                  const isDiverging = divs.includes(s)
                  return (
                    <div
                      key={s}
                      className={`col-span-2 text-right font-mono text-xs tabular-nums self-center ${
                        isDiverging ? 'text-coral font-bold' : ''
                      } ${v === null ? 'text-ink/40' : ''}`}
                    >
                      {v === null ? '— missing —' : (v > 0 ? '+' : '') + v}
                    </div>
                  )
                })}
                <div className="col-span-1 text-right self-center">
                  {isB ? (
                    <span className="font-hand text-xs text-coral font-bold">⚠ break</span>
                  ) : (
                    <span className="font-hand text-xs text-sage">✓</span>
                  )}
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-2 mb-2 p-2 rounded bg-mustard/10 border-[1.5px] border-dashed border-mustard text-xs font-body leading-snug">
                      <span className="font-hand text-coral">🔍 the break:</span> {r.story}
                      {r.resolution && (
                        <>
                          <br />
                          <span className="font-hand text-sage">→ action:</span> {r.resolution}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="mt-3 p-3 rounded-lg bg-teal/10 border-[2px] border-dashed border-teal">
        <div className="font-display text-base text-teal mb-1">
          🤝 why four sources?
        </div>
        <div className="font-body text-sm text-ink/85 leading-snug">
          Front, middle, and back each have their own systems — built or bought at different times, with different update cycles. The counterparty has theirs.{' '}
          <strong>None of them inform each other directly.</strong> The recon job is what stops the four from quietly drifting apart over time.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ <span className="text-coral">"all four sources agree"</span> is the dullest, most expensive sentence on a trading floor — and the only one that means you actually know what you own.
      </div>
    </div>
  )
}
