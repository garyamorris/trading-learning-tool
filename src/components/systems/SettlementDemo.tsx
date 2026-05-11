import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type LineItem = {
  id: string
  trade_id: string
  delivery: string
  volume_yours: number
  volume_theirs: number
  price_yours: number
  price_theirs: number
  index: string
}

const SEED: LineItem[] = [
  {
    id: 'L1',
    trade_id: 'T_0001142',
    delivery: '2026-04-01..2026-04-30',
    volume_yours: 36000,
    volume_theirs: 36000,
    price_yours: 84.5,
    price_theirs: 84.5,
    index: 'EEX_BASE_M+1',
  },
  {
    id: 'L2',
    trade_id: 'T_0001150',
    delivery: '2026-04-01..2026-04-30',
    volume_yours: 12400,
    volume_theirs: 12200,
    price_yours: 86.0,
    price_theirs: 86.0,
    index: 'EEX_BASE_M+1',
  },
  {
    id: 'L3',
    trade_id: 'T_0001168',
    delivery: '2026-04-01..2026-04-30',
    volume_yours: 8000,
    volume_theirs: 8000,
    price_yours: 78.2,
    price_theirs: 78.2,
    index: 'NCG_GAS_M+1',
  },
  {
    id: 'L4',
    trade_id: 'T_0001172',
    delivery: '2026-04-01..2026-04-30',
    volume_yours: 5000,
    volume_theirs: 5000,
    price_yours: 79.5,
    price_theirs: 82.1,
    index: 'NCG_GAS_M+1',
  },
]

type Resolution = 'pending' | 'accepted' | 'disputed' | 'investigating'

type LineState = {
  id: string
  resolution: Resolution
}

function diff(li: LineItem): { volume: boolean; price: boolean; total: boolean } {
  const volume = li.volume_yours !== li.volume_theirs
  const price = li.price_yours !== li.price_theirs
  return { volume, price, total: volume || price }
}

function lineAmount(volume: number, price: number): number {
  return Math.round(volume * price)
}

export function SettlementDemo() {
  const [items] = useState<LineItem[]>(SEED)
  const [states, setStates] = useState<LineState[]>(
    SEED.map((l) => ({ id: l.id, resolution: 'pending' as Resolution })),
  )

  function resolve(id: string, r: Resolution) {
    setStates((s) => s.map((x) => (x.id === id ? { ...x, resolution: r } : x)))
  }

  function reset() {
    setStates(SEED.map((l) => ({ id: l.id, resolution: 'pending' })))
  }

  const totalsYours = useMemo(
    () => items.reduce((s, l) => s + lineAmount(l.volume_yours, l.price_yours), 0),
    [items],
  )
  const totalsTheirs = useMemo(
    () => items.reduce((s, l) => s + lineAmount(l.volume_theirs, l.price_theirs), 0),
    [items],
  )
  const allResolved = states.every((s) => s.resolution !== 'pending')
  const disputedCount = states.filter((s) => s.resolution === 'disputed').length
  const acceptedCount = states.filter((s) => s.resolution === 'accepted').length

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        delivery month closed. you and your counterparty each generated an invoice. now match them line-by-line:
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 overflow-hidden">
        <div className="grid grid-cols-2 border-b-[2px] border-ink/30">
          <div className="p-2 text-center font-display text-base border-r border-ink/30 bg-teal/15">
            📤 your invoice (outbound)
          </div>
          <div className="p-2 text-center font-display text-base bg-coral/10">
            📥 counterparty's invoice (received)
          </div>
        </div>

        <div className="divide-y divide-ink/15">
          {items.map((li) => {
            const d = diff(li)
            const state = states.find((s) => s.id === li.id)!
            const yoursAmt = lineAmount(li.volume_yours, li.price_yours)
            const theirsAmt = lineAmount(li.volume_theirs, li.price_theirs)
            return (
              <div key={li.id} className="grid grid-cols-2">
                {/* YOUR LINE */}
                <div className="p-2 border-r border-ink/15 text-xs font-mono">
                  <div className="font-bold">{li.trade_id}</div>
                  <div className="text-ink/65">{li.delivery}</div>
                  <div className="flex justify-between mt-1">
                    <span>
                      vol{' '}
                      <span className={d.volume ? 'text-coral font-bold' : ''}>
                        {li.volume_yours.toLocaleString()}
                      </span>
                    </span>
                    <span>
                      @{' '}
                      <span className={d.price ? 'text-coral font-bold' : ''}>
                        €{li.price_yours.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <div className="text-ink/55">{li.index}</div>
                  <div className="font-bold text-right mt-0.5">€{yoursAmt.toLocaleString()}</div>
                </div>

                {/* THEIR LINE */}
                <div
                  className={`p-2 text-xs font-mono ${
                    d.total ? 'bg-coral/5' : ''
                  }`}
                >
                  <div className="font-bold">{li.trade_id}</div>
                  <div className="text-ink/65">{li.delivery}</div>
                  <div className="flex justify-between mt-1">
                    <span>
                      vol{' '}
                      <span className={d.volume ? 'text-coral font-bold' : ''}>
                        {li.volume_theirs.toLocaleString()}
                      </span>
                    </span>
                    <span>
                      @{' '}
                      <span className={d.price ? 'text-coral font-bold' : ''}>
                        €{li.price_theirs.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <div className="text-ink/55">{li.index}</div>
                  <div className="font-bold text-right mt-0.5">
                    €{theirsAmt.toLocaleString()}
                    {theirsAmt !== yoursAmt && (
                      <span className="ml-1 text-coral">
                        ({theirsAmt > yoursAmt ? '+' : ''}
                        {(theirsAmt - yoursAmt).toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>

                {/* ACTION ROW */}
                <div className="col-span-2 border-t border-ink/15 p-2 flex items-center justify-between bg-cream/50">
                  <div className="flex items-center gap-2 font-hand text-xs">
                    {d.total ? (
                      <span className="text-coral font-bold">
                        ⚠ mismatch:
                        {d.volume && ' volume'}
                        {d.volume && d.price && ' &'}
                        {d.price && ' price'}
                      </span>
                    ) : (
                      <span className="text-sage">✓ clean match</span>
                    )}
                    <span className="text-ink/55">·</span>
                    <span className="text-ink/70">status:</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={state.resolution}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={
                          state.resolution === 'accepted'
                            ? 'text-sage font-bold'
                            : state.resolution === 'disputed'
                            ? 'text-coral font-bold'
                            : state.resolution === 'investigating'
                            ? 'text-mustard font-bold'
                            : 'text-ink/55'
                        }
                      >
                        {state.resolution === 'pending'
                          ? 'pending'
                          : state.resolution === 'accepted'
                          ? 'accepted ✓'
                          : state.resolution === 'disputed'
                          ? 'disputed ⚠'
                          : 'investigating 🔍'}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => resolve(li.id, 'accepted')}
                      className={`btn-sketch !py-0.5 !px-2 !text-xs ${
                        !d.total ? 'bg-sage/40' : ''
                      }`}
                      disabled={state.resolution !== 'pending'}
                    >
                      accept
                    </button>
                    <button
                      onClick={() => resolve(li.id, 'investigating')}
                      className="btn-sketch !py-0.5 !px-2 !text-xs"
                      disabled={state.resolution !== 'pending'}
                    >
                      investigate
                    </button>
                    <button
                      onClick={() => resolve(li.id, 'disputed')}
                      className={`btn-sketch !py-0.5 !px-2 !text-xs ${
                        d.total ? 'bg-coral/30' : ''
                      }`}
                      disabled={state.resolution !== 'pending'}
                    >
                      dispute
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 border-t-[2px] border-ink/40 bg-mustard/10">
          <div className="p-2 text-right font-mono text-sm border-r border-ink/30">
            <span className="font-hand text-ink/60 mr-2">your total:</span>
            <strong>€{totalsYours.toLocaleString()}</strong>
          </div>
          <div className="p-2 text-right font-mono text-sm">
            <span className="font-hand text-ink/60 mr-2">their total:</span>
            <strong>€{totalsTheirs.toLocaleString()}</strong>
            {totalsYours !== totalsTheirs && (
              <span className="ml-2 text-coral">
                (Δ €{(totalsTheirs - totalsYours).toLocaleString()})
              </span>
            )}
          </div>
        </div>
      </div>

      {allResolved && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-lg border-[2px] border-dashed border-sage bg-sage/10"
        >
          <div className="font-display text-xl text-sage">
            ✓ reconciliation complete · {acceptedCount} accepted ·{' '}
            {disputedCount} disputed
          </div>
          <div className="font-body text-sm text-ink/85 leading-snug">
            Accepted lines settle on the agreed amounts. Disputed lines stay
            open — they go to a back-office workflow with timestamped emails,
            phone calls, and eventually a credit note or a write-off. A real
            shop runs this loop on hundreds of counterparties every month.
          </div>
          <button onClick={reset} className="btn-sketch mt-2 !text-xs">
            ↻ reset
          </button>
        </motion.div>
      )}

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ after every trade,{' '}
        <span className="text-coral">money has to actually move</span>. half the cost of running an ETRM is in this room — invoicing, matching, disputing, releasing cash.
      </div>
    </div>
  )
}
