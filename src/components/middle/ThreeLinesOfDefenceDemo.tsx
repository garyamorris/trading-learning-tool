import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Line = {
  id: '1' | '2' | '3'
  title: string
  emoji: string
  who: string
  role: string
  examples: string[]
  reports_to: string
  color: string
}

const LINES: Line[] = [
  {
    id: '1',
    title: 'First Line · the people who take the risk',
    emoji: '⚡',
    who: 'front office traders & business managers',
    role: 'own the day-to-day controls embedded in their own activity. self-supervise. catch their own errors.',
    examples: [
      'trader checks their own trade ticket before booking',
      'desk head signs off on outsized positions',
      'self-marking with broker quotes',
      'desk-level risk dashboards refreshed in real-time',
    ],
    reports_to: 'business CEO',
    color: 'coral',
  },
  {
    id: '2',
    title: 'Second Line · independent challenge',
    emoji: '🛡️',
    who: 'middle office, risk, compliance, finance control',
    role: 'independently verify what the first line did. set frameworks, monitor adherence, challenge marks and assumptions.',
    examples: [
      'IPV — independent re-marking (Ch 3)',
      'trade verification against external confirms (Ch 2)',
      'reserves & adjustments (Ch 4)',
      'exception monitoring (Ch 5)',
      'limit-framework design + breach approval (Ch 7 systems)',
      'regulatory reporting accuracy (Ch 14 systems)',
    ],
    reports_to: 'CRO / CFO',
    color: 'teal',
  },
  {
    id: '3',
    title: 'Third Line · audit the auditors',
    emoji: '🔍',
    who: 'internal audit',
    role: 'audits both lines 1 and 2. independent of both. tests whether the controls actually work, periodically.',
    examples: [
      'annual audit of the IPV methodology',
      'sample testing of trade-verification controls',
      'review of model-validation independence',
      'spot-check of exception-aging and resolution',
      'review of escalation paths and their use',
    ],
    reports_to: 'audit committee of the board',
    color: 'lavender',
  },
]

const COLOR_BG: Record<string, string> = {
  coral: 'border-coral bg-coral/10',
  teal: 'border-teal bg-teal/10',
  lavender: 'border-lavender bg-lavender/10',
}

const COLOR_RING: Record<string, string> = {
  coral: 'ring-coral/50',
  teal: 'ring-teal/50',
  lavender: 'ring-lavender/50',
}

export function ThreeLinesOfDefenceDemo() {
  const [openId, setOpenId] = useState<string>('2')

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        every regulated firm uses some version of this model. three layers of controls, each <span className="text-coral font-bold">independent of the layer it oversees</span>:
      </div>

      {/* 3 NESTED RINGS DIAGRAM */}
      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-4 mb-3 relative">
        <div className="relative h-56 flex items-center justify-center">
          {/* Outer ring */}
          <button
            onClick={() => setOpenId('3')}
            className={`absolute inset-0 flex flex-col items-center justify-start pt-2 rounded-full border-[2.5px] transition-all ${
              openId === '3' ? `${COLOR_BG.lavender} ring-2 ${COLOR_RING.lavender}` : 'border-lavender/40 bg-lavender/5'
            }`}
          >
            <span className="font-display text-base">🔍 line 3 · internal audit</span>
          </button>
          {/* Middle ring */}
          <button
            onClick={() => setOpenId('2')}
            className={`absolute inset-8 flex flex-col items-center justify-start pt-2 rounded-full border-[2.5px] transition-all ${
              openId === '2' ? `${COLOR_BG.teal} ring-2 ${COLOR_RING.teal}` : 'border-teal/40 bg-teal/8'
            }`}
          >
            <span className="font-display text-base">🛡️ line 2 · MO / risk / compliance</span>
          </button>
          {/* Inner ring */}
          <button
            onClick={() => setOpenId('1')}
            className={`absolute inset-20 flex flex-col items-center justify-center rounded-full border-[2.5px] transition-all ${
              openId === '1' ? `${COLOR_BG.coral} ring-2 ${COLOR_RING.coral}` : 'border-coral/40 bg-coral/8'
            }`}
          >
            <span className="font-display text-base">⚡ line 1</span>
            <span className="font-hand text-xs text-ink/60 text-center px-2">
              traders
            </span>
          </button>
        </div>
        <div className="font-hand text-xs text-ink/55 text-center mt-1">
          click any ring ↑
        </div>
      </div>

      {/* DETAIL CARD */}
      <AnimatePresence mode="wait">
        {openId && (
          <motion.div
            key={openId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-lg border-[2px] p-3 mb-3 ${COLOR_BG[LINES.find((l) => l.id === openId)!.color]}`}
          >
            {(() => {
              const l = LINES.find((x) => x.id === openId)!
              return (
                <>
                  <div className="font-display text-lg mb-1">{l.emoji} {l.title}</div>
                  <div className="font-body text-sm text-ink/85 leading-snug mb-2">
                    <strong>who:</strong> {l.who}<br />
                    <strong>role:</strong> {l.role}
                  </div>
                  <div className="font-hand text-xs text-ink/65 mb-1">examples of what they do:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-2">
                    {l.examples.map((e) => (
                      <div key={e} className="bg-cream rounded border-[1.5px] border-ink/30 px-2 py-1 font-body text-xs">
                        · {e}
                      </div>
                    ))}
                  </div>
                  <div className="font-hand text-xs text-ink/60">
                    <strong>reports to:</strong> {l.reports_to}
                  </div>
                </>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 rounded-lg bg-mustard/10 border-[2px] border-dashed border-mustard">
        <div className="font-display text-base text-mustard">
          why independence matters at every layer
        </div>
        <div className="font-body text-sm text-ink/85 leading-snug">
          Line 1 can't be trusted to mark its own homework (Ch 1). Line 2 can't be trusted to audit itself either — they design the controls; they shouldn't also verify the controls work. So Line 3 reports up a completely separate chain (audit committee, not CEO) to keep <em>that</em> independence clean.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this isn't theoretical. <span className="text-coral">regulators check it</span>. the three lines are a structural requirement — and a question every CRO interview will eventually arrive at.
      </div>
    </div>
  )
}
