import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Regime = {
  id: string
  name: string
  authority: string
  deadline: string
  emoji: string
  color: string
  fields: { k: string; v: string; changed?: boolean }[]
}

type Event = 'new_trade' | 'amendment' | 'partial_termination' | 'exercise'

const EVENTS: { id: Event; label: string; blurb: string }[] = [
  { id: 'new_trade', label: 'new trade', blurb: 'Initial reporting on execution.' },
  { id: 'amendment', label: 'amendment', blurb: 'Volume revised down from 50 MW to 42 MW after broker check.' },
  { id: 'partial_termination', label: 'partial termination', blurb: 'Mutual close-out of 20 MW. Remaining 22 MW continues.' },
  { id: 'exercise', label: 'exercise (option only)', blurb: 'Counterparty exercised the embedded option.' },
]

function buildReports(event: Event): Regime[] {
  const baseEMIR: Regime = {
    id: 'emir',
    name: 'EMIR (EU derivatives)',
    authority: 'ESMA · trade repository',
    deadline: 'T+1 (next business day)',
    emoji: '🇪🇺',
    color: 'teal',
    fields: [
      { k: 'UTI', v: 'EU56-T0001142-2026-04-30' },
      { k: 'action_type', v: 'NEWT', changed: event === 'new_trade' },
      { k: 'asset_class', v: 'COMM' },
      { k: 'product', v: 'PWERLM' },
      { k: 'notional', v: '36,000 MWh' },
      { k: 'price', v: '€84.50' },
      { k: 'exec_ts', v: '2026-04-30T11:42:18Z' },
      { k: 'cp_LEI', v: '529900W18LQJJN6SJ336' },
      { k: 'clearing', v: 'N (bilateral)' },
    ],
  }
  const baseREMIT: Regime = {
    id: 'remit',
    name: 'REMIT (EU wholesale energy)',
    authority: 'ACER · electronic data',
    deadline: 'near real-time (~hours)',
    emoji: '⚡',
    color: 'coral',
    fields: [
      { k: 'contract_id', v: 'EFET-RP-T0001142' },
      { k: 'contract_type', v: 'BL_M+1' },
      { k: 'delivery_point', v: 'DE-LU' },
      { k: 'commodity', v: 'electricity' },
      { k: 'quantity_unit', v: 'MW' },
      { k: 'quantity', v: '50' },
      { k: 'price', v: '84.50 EUR/MWh' },
      { k: 'delivery_start', v: '2026-05-01' },
      { k: 'delivery_end', v: '2026-05-31' },
      { k: 'transaction_type', v: 'BUY', changed: event === 'new_trade' },
    ],
  }
  const baseDF: Regime = {
    id: 'df',
    name: 'Dodd-Frank (US commodity)',
    authority: 'CFTC · SDR',
    deadline: 'as soon as technologically practicable',
    emoji: '🇺🇸',
    color: 'lavender',
    fields: [
      { k: 'USI', v: 'US001-T0001142' },
      { k: 'product', v: 'PWR-DE-BASE' },
      { k: 'block_trade', v: 'N' },
      { k: 'notional_amt', v: '$3,042,000' },
      { k: 'price', v: '$91.26/MWh' },
      { k: 'effective_date', v: '2026-05-01' },
      { k: 'termination', v: '2026-05-31' },
      { k: 'counterparty', v: 'NRG Power Marketing SA' },
      { k: 'execution_venue', v: 'OFF (bilateral)' },
    ],
  }

  // Apply event-specific overrides
  if (event === 'new_trade') return [baseEMIR, baseREMIT, baseDF]
  if (event === 'amendment') {
    return [
      {
        ...baseEMIR,
        fields: baseEMIR.fields.map((f) =>
          f.k === 'action_type'
            ? { k: f.k, v: 'MODI', changed: true }
            : f.k === 'notional'
            ? { k: f.k, v: '30,240 MWh', changed: true }
            : f,
        ),
      },
      {
        ...baseREMIT,
        fields: baseREMIT.fields.map((f) =>
          f.k === 'quantity'
            ? { k: f.k, v: '42', changed: true }
            : f.k === 'transaction_type'
            ? { k: f.k, v: 'AMEND', changed: true }
            : f,
        ),
      },
      {
        ...baseDF,
        fields: baseDF.fields.map((f) =>
          f.k === 'notional_amt'
            ? { k: f.k, v: '$2,555,280', changed: true }
            : f,
        ),
      },
    ]
  }
  if (event === 'partial_termination') {
    return [
      {
        ...baseEMIR,
        fields: baseEMIR.fields.map((f) =>
          f.k === 'action_type'
            ? { k: f.k, v: 'EARL', changed: true }
            : f.k === 'notional'
            ? { k: f.k, v: '15,840 MWh', changed: true }
            : f,
        ),
      },
      {
        ...baseREMIT,
        fields: baseREMIT.fields.map((f) =>
          f.k === 'quantity'
            ? { k: f.k, v: '22', changed: true }
            : f.k === 'transaction_type'
            ? { k: f.k, v: 'EARLY_TERM', changed: true }
            : f,
        ),
      },
      {
        ...baseDF,
        fields: baseDF.fields.map((f) =>
          f.k === 'notional_amt'
            ? { k: f.k, v: '$1,338,480', changed: true }
            : f,
        ),
      },
    ]
  }
  // exercise (vanilla forward has no embedded option — REMIT/DF n/a; EMIR action 'EXER')
  return [
    {
      ...baseEMIR,
      fields: baseEMIR.fields.map((f) =>
        f.k === 'action_type' ? { k: f.k, v: 'EXER', changed: true } : f,
      ),
    },
    {
      ...baseREMIT,
      fields: baseREMIT.fields.map((f) =>
        f.k === 'transaction_type'
          ? { k: f.k, v: 'n/a — forward', changed: true }
          : f,
      ),
    },
    {
      ...baseDF,
      fields: baseDF.fields.map((f) =>
        f.k === 'product'
          ? { k: f.k, v: 'n/a — forward', changed: true }
          : f,
      ),
    },
  ]
}

const COLOR_BG: Record<string, string> = {
  teal: 'bg-teal/10 border-teal',
  coral: 'bg-coral/10 border-coral',
  lavender: 'bg-lavender/10 border-lavender',
}

const COLOR_TEXT: Record<string, string> = {
  teal: 'text-teal',
  coral: 'text-coral',
  lavender: 'text-lavender',
}

export function RegulatoryReportingDemo() {
  const [event, setEvent] = useState<Event>('new_trade')
  const [rejected, setRejected] = useState(false)
  const reports = buildReports(event)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        one trade. three regulators want to know about it — each in their own dialect, on their own deadline:
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-2 mb-3">
        <div className="font-hand text-xs text-ink/55 mb-1">source trade:</div>
        <div className="font-mono text-xs bg-cream border-[1.5px] border-ink/40 rounded p-2 flex flex-wrap gap-x-3 gap-y-0.5">
          <span><span className="text-ink/55">id:</span> T_0001142</span>
          <span><span className="text-ink/55">buy:</span> 50 MW power M+1 (DE base)</span>
          <span><span className="text-ink/55">px:</span> €84.50</span>
          <span><span className="text-ink/55">cp:</span> CP_004 / NRG Power Marketing SA</span>
          <span><span className="text-ink/55">exec:</span> 2026-04-30 11:42 UTC</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="font-hand text-ink/70 text-sm mr-1">lifecycle event:</span>
        {EVENTS.map((e) => (
          <button
            key={e.id}
            onClick={() => { setEvent(e.id); setRejected(false) }}
            className={`pill-sketch text-xs ${
              event === e.id ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="mb-3 font-body text-sm text-ink/80 italic px-1">
        {EVENTS.find((e) => e.id === event)?.blurb}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {reports.map((r) => (
          <motion.div
            key={r.id}
            layout
            className={`rounded-lg border-[2.5px] p-2 shadow-sketchSm ${COLOR_BG[r.color]} ${
              rejected && r.id === 'emir' ? 'ring-2 ring-rose' : ''
            }`}
          >
            <div className="flex items-baseline justify-between">
              <div className="font-display text-base">
                {r.emoji} {r.name.split(' (')[0]}
              </div>
            </div>
            <div className={`font-hand text-[10px] ${COLOR_TEXT[r.color]} font-bold`}>
              {r.authority}
            </div>
            <div className="font-hand text-[10px] text-ink/60 mb-1.5">
              deadline: {r.deadline}
            </div>
            <div className="bg-cream/70 rounded border-[1px] border-ink/30 p-1.5 space-y-0.5 max-h-72 overflow-y-auto">
              {r.fields.map((f) => (
                <div key={f.k} className="flex justify-between gap-2 font-mono text-[10px]">
                  <span className="text-ink/55 shrink-0">{f.k}:</span>
                  <span
                    className={`text-right truncate ${
                      f.changed ? 'text-coral font-bold bg-coral/10 px-1 rounded' : ''
                    }`}
                  >
                    {f.v}
                  </span>
                </div>
              ))}
            </div>
            <AnimatePresence>
              {rejected && r.id === 'emir' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 p-1.5 rounded bg-rose/15 border-[1.5px] border-rose"
                >
                  <div className="font-hand text-rose text-xs font-bold">
                    ⚠ ESMA rejection
                  </div>
                  <div className="font-body text-[10px] text-ink/85 leading-snug">
                    "UTI namespace doesn't match registered LEI prefix. Resubmit within T+1 or breach."
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        <button
          onClick={() => setRejected(!rejected)}
          className={`btn-sketch text-sm ${rejected ? 'bg-rose/30' : ''}`}
        >
          {rejected ? '✓ fix & resubmit' : '✗ simulate ESMA rejection'}
        </button>
        <div className="p-2 rounded bg-mustard/10 border-[1.5px] border-dashed border-mustard text-xs font-body leading-snug">
          ✦ <strong>real-life pain</strong>: the three regimes <em>don't</em> agree on identifiers, units, or
          who counts as the "reporting party". an ETRM's reporting module is half mapping logic, half
          rejection-handling.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ every trade is reported{' '}
        <span className="text-coral">three or four times</span> in its lifetime, in three or four different formats.
        miss a deadline; pay a fine. it's not optional.
      </div>
    </div>
  )
}
