import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Side = {
  volume: number
  price: number
  commodity: string
  tenor: string
  counterparty: string
}

type Pending = {
  id: string
  source: 'broker' | 'counterparty' | 'exchange'
  ours: Side
  theirs: Side
  hint?: string // hint shown after investigate, justifying the mismatch
}

const PENDING: Pending[] = [
  {
    id: 'T_0001142',
    source: 'broker',
    ours:   { volume: 50,  price: 84.50, commodity: 'power', tenor: 'M+1', counterparty: 'CP_004' },
    theirs: { volume: 50,  price: 84.50, commodity: 'power', tenor: 'M+1', counterparty: 'CP_004' },
  },
  {
    id: 'T_0001150',
    source: 'counterparty',
    ours:   { volume: 50,  price: 86.00, commodity: 'power', tenor: 'M+1', counterparty: 'CP_004' },
    theirs: { volume: 45,  price: 86.00, commodity: 'power', tenor: 'M+1', counterparty: 'CP_004' },
    hint: '5 MW off. Probably a typo on the desk. Repaper at 45 MW (matches the recorded voice call).',
  },
  {
    id: 'T_0001168',
    source: 'broker',
    ours:   { volume: 20,  price: 78.20, commodity: 'gas',   tenor: 'M+1', counterparty: 'CP_011' },
    theirs: { volume: 20,  price: 78.20, commodity: 'gas',   tenor: 'M+1', counterparty: 'CP_011' },
  },
  {
    id: 'T_0001172',
    source: 'counterparty',
    ours:   { volume: 30,  price: 79.50, commodity: 'gas',   tenor: 'M+1', counterparty: 'CP_011' },
    theirs: { volume: 30,  price: 82.10, commodity: 'gas',   tenor: 'M+1', counterparty: 'CP_011' },
    hint: '€2.60 price difference. Counterparty used the wrong index settle. Push back and demand a corrected confirm.',
  },
  {
    id: 'T_0001181',
    source: 'exchange',
    ours:   { volume: 15,  price: 81.40, commodity: 'power', tenor: 'Q+1', counterparty: 'CP_004' },
    theirs: { volume: 15,  price: 81.40, commodity: 'power', tenor: 'M+3', counterparty: 'CP_004' },
    hint: 'Tenor mismatch — Q+1 vs M+3. Calendars are close but not the same. Investigate the original order ticket.',
  },
  {
    id: 'T_0001197',
    source: 'broker',
    ours:   { volume: 25,  price: 75.30, commodity: 'gas',   tenor: 'Cal+1', counterparty: 'CP_017' },
    theirs: { volume: 25,  price: 75.30, commodity: 'gas',   tenor: 'Cal+1', counterparty: 'CP_017' },
  },
  {
    id: 'T_0001203',
    source: 'counterparty',
    ours:   { volume: 40,  price: 88.00, commodity: 'power', tenor: 'M+1', counterparty: 'CP_017' },
    theirs: { volume: 0,   price: 0,     commodity: '—',     tenor: '—',   counterparty: 'CP_017' },
    hint: 'No record from them at all. Either we never sent it, or they lost it. 24 hours old; escalate now.',
  },
  {
    id: 'T_0001209',
    source: 'broker',
    ours:   { volume: 30,  price: 82.20, commodity: 'carbon', tenor: 'Cal+1', counterparty: 'CP_011' },
    theirs: { volume: 30,  price: 82.20, commodity: 'carbon', tenor: 'Cal+1', counterparty: 'CP_011' },
  },
]

type Decision = 'pending' | 'accept_ours' | 'accept_theirs' | 'investigate' | 'kick_back'

function fieldsMismatch(p: Pending): { volume: boolean; price: boolean; commodity: boolean; tenor: boolean; counterparty: boolean } {
  return {
    volume: p.ours.volume !== p.theirs.volume,
    price: Math.abs(p.ours.price - p.theirs.price) > 0.005,
    commodity: p.ours.commodity !== p.theirs.commodity,
    tenor: p.ours.tenor !== p.theirs.tenor,
    counterparty: p.ours.counterparty !== p.theirs.counterparty,
  }
}

function anyMismatch(p: Pending): boolean {
  const f = fieldsMismatch(p)
  return f.volume || f.price || f.commodity || f.tenor || f.counterparty
}

const SOURCE_LABEL: Record<Pending['source'], string> = {
  broker: 'broker',
  counterparty: 'counterparty',
  exchange: 'exchange clear',
}

const SOURCE_EMOJI: Record<Pending['source'], string> = {
  broker: '🎩',
  counterparty: '🏢',
  exchange: '🏛️',
}

export function TradeVerificationDemo() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>(
    Object.fromEntries(PENDING.map((p) => [p.id, 'pending' as Decision])),
  )
  const [openId, setOpenId] = useState<string | null>(null)

  function decide(id: string, d: Decision) {
    setDecisions((s) => ({ ...s, [id]: d }))
    if (d !== 'investigate') setOpenId(null)
  }

  function reset() {
    setDecisions(Object.fromEntries(PENDING.map((p) => [p.id, 'pending'])))
    setOpenId(null)
  }

  const cleanMatches = PENDING.filter((p) => !anyMismatch(p)).length
  const mismatches = PENDING.length - cleanMatches
  const pendingCount = Object.values(decisions).filter((d) => d === 'pending').length

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        the overnight confirmation queue. <span className="text-coral font-bold">{mismatches}</span>{' '}
        of the {PENDING.length} trades booked yesterday don't match external evidence:
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="font-hand text-sm">
          <span className="text-sage font-bold">{cleanMatches}</span> clean ·{' '}
          <span className="text-coral font-bold">{mismatches}</span> mismatch ·{' '}
          <span className="text-ink/60">{pendingCount}</span> still pending
        </div>
        <button onClick={reset} className="btn-sketch !text-xs !py-0.5">↻ reset</button>
      </div>

      <div className="space-y-2">
        {PENDING.map((p) => {
          const f = fieldsMismatch(p)
          const has = anyMismatch(p)
          const decision = decisions[p.id]
          const isOpen = openId === p.id

          let cardBorder = 'border-ink/30'
          let cardBg = 'bg-cream'
          if (decision !== 'pending') {
            if (decision === 'accept_ours' || decision === 'accept_theirs') {
              cardBorder = 'border-sage'
              cardBg = 'bg-sage/8'
            } else if (decision === 'kick_back') {
              cardBorder = 'border-coral'
              cardBg = 'bg-coral/8'
            } else {
              cardBorder = 'border-mustard'
              cardBg = 'bg-mustard/8'
            }
          } else if (has) {
            cardBorder = 'border-coral/60'
          }

          return (
            <motion.div
              layout
              key={p.id}
              className={`rounded-lg border-[2px] ${cardBorder} ${cardBg} shadow-sketchSm`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : p.id)}
                className="w-full text-left p-2 hover:bg-paper/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold">{p.id}</span>
                    <span className="font-hand text-xs text-ink/60">
                      vs {SOURCE_EMOJI[p.source]} {SOURCE_LABEL[p.source]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {has ? (
                      <span className="font-hand text-xs text-coral font-bold">
                        ⚠ {Object.entries(f).filter(([, v]) => v).map(([k]) => k).join(', ')}
                      </span>
                    ) : (
                      <span className="font-hand text-xs text-sage">✓ clean</span>
                    )}
                    <span className="font-hand text-xs">
                      {decision === 'pending'
                        ? <span className="text-ink/55">pending</span>
                        : decision === 'accept_ours'
                        ? <span className="text-sage font-bold">accepted (ours)</span>
                        : decision === 'accept_theirs'
                        ? <span className="text-sage font-bold">accepted (theirs)</span>
                        : decision === 'kick_back'
                        ? <span className="text-coral font-bold">kicked back ↩</span>
                        : <span className="text-mustard font-bold">investigating</span>}
                    </span>
                    <span className="font-display text-base text-ink/40">{isOpen ? '−' : '+'}</span>
                  </div>
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
                    <div className="px-2 pb-2 pt-1 border-t border-ink/15">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-teal/10 border-[1.5px] border-teal/40 rounded p-2 text-xs font-mono">
                          <div className="font-display text-sm text-teal mb-1">
                            🏦 ours (front office booking)
                          </div>
                          <div>vol: <span className={f.volume ? 'text-coral font-bold' : ''}>{p.ours.volume} MW</span></div>
                          <div>px: <span className={f.price ? 'text-coral font-bold' : ''}>€{p.ours.price.toFixed(2)}</span></div>
                          <div>{p.ours.commodity} · <span className={f.tenor ? 'text-coral font-bold' : ''}>{p.ours.tenor}</span></div>
                          <div>cp: {p.ours.counterparty}</div>
                        </div>
                        <div className="bg-coral/10 border-[1.5px] border-coral/40 rounded p-2 text-xs font-mono">
                          <div className="font-display text-sm text-coral mb-1">
                            {SOURCE_EMOJI[p.source]} {SOURCE_LABEL[p.source]} says
                          </div>
                          <div>vol: <span className={f.volume ? 'text-coral font-bold' : ''}>{p.theirs.volume || '—'} {p.theirs.volume ? 'MW' : ''}</span></div>
                          <div>px: <span className={f.price ? 'text-coral font-bold' : ''}>{p.theirs.price ? `€${p.theirs.price.toFixed(2)}` : '—'}</span></div>
                          <div>{p.theirs.commodity} · <span className={f.tenor ? 'text-coral font-bold' : ''}>{p.theirs.tenor}</span></div>
                          <div>cp: {p.theirs.counterparty}</div>
                        </div>
                      </div>
                      {decisions[p.id] === 'investigate' && p.hint && (
                        <div className="mb-2 p-2 rounded bg-mustard/15 border-[1.5px] border-dashed border-mustard text-xs font-body leading-snug">
                          <span className="font-hand text-coral">🔍 investigation note:</span> {p.hint}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => decide(p.id, 'accept_ours')}
                          disabled={decisions[p.id] !== 'pending' && decisions[p.id] !== 'investigate'}
                          className={`btn-sketch !text-xs !py-0.5 ${!has ? 'bg-sage/40' : ''} disabled:opacity-50`}
                        >
                          accept ours
                        </button>
                        <button
                          onClick={() => decide(p.id, 'accept_theirs')}
                          disabled={decisions[p.id] !== 'pending' && decisions[p.id] !== 'investigate'}
                          className="btn-sketch !text-xs !py-0.5 disabled:opacity-50"
                        >
                          accept theirs
                        </button>
                        <button
                          onClick={() => decide(p.id, 'investigate')}
                          disabled={decisions[p.id] !== 'pending'}
                          className={`btn-sketch !text-xs !py-0.5 ${has ? 'bg-mustard/30' : ''} disabled:opacity-50`}
                        >
                          investigate
                        </button>
                        <button
                          onClick={() => decide(p.id, 'kick_back')}
                          disabled={decisions[p.id] !== 'pending' && decisions[p.id] !== 'investigate'}
                          className="btn-sketch !text-xs !py-0.5 disabled:opacity-50"
                        >
                          kick back ↩
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ until a trade is reconciled against external evidence, it's just{' '}
        <span className="text-coral">the trader's claim</span>. the middle office is what makes it real.
      </div>
    </div>
  )
}
