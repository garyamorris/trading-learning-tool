import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type EscalationStep = {
  who: string
  sla: string
  action: string
  color: 'sage' | 'mustard' | 'coral' | 'rose' | 'lavender'
}

type Scenario = {
  id: string
  title: string
  trigger: string
  steps: EscalationStep[]
  failureMode: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'pnl_break',
    title: 'P&L break > €1m flagged by IPV',
    trigger: 'IPV identifies a €1.2m unexplained P&L break overnight on a trader\'s book',
    steps: [
      { who: 'MO analyst', sla: 'T+1 08:00', action: 'opens ticket, classifies break, contacts trader for explanation', color: 'sage' },
      { who: 'Trader + desk head', sla: 'T+1 11:00', action: 'must respond with documented explanation', color: 'sage' },
      { who: 'MO head', sla: 'T+1 14:00', action: 'accepts explanation or escalates if unsatisfactory', color: 'mustard' },
      { who: 'CRO', sla: 'T+2', action: 'reviews if unresolved; can mandate position reduction', color: 'coral' },
      { who: 'audit committee', sla: 'next meeting', action: 'notified for breaks > €5m or pattern of breaks; can mandate external review', color: 'rose' },
    ],
    failureMode: 'If the trader can\'t explain it and won\'t accept the MO mark, the trader\'s mark is overridden in the books anyway. Bonus accrual is adjusted.',
  },
  {
    id: 'unconfirmed',
    title: 'unconfirmed trade > 24h old',
    trigger: 'a trade booked yesterday morning has no broker or counterparty confirmation 24 hours later',
    steps: [
      { who: 'trade ops', sla: 'T+1 morning', action: 'chases broker and counterparty for the missing confirm', color: 'sage' },
      { who: 'trader', sla: 'T+1 PM', action: 'must produce voice recording or chat showing the trade was executed', color: 'sage' },
      { who: 'MO head + compliance', sla: 'T+2 09:00', action: 'opens formal investigation if no evidence found by T+1 close', color: 'mustard' },
      { who: 'CRO + compliance head', sla: 'T+2 PM', action: 'decides: cancel the booking, hold pending external evidence, or treat as suspicious', color: 'coral' },
      { who: 'regulator', sla: 'within 4 days', action: 'mandatory STOR (suspicious trade or order report) filed if compliance concludes possible market abuse', color: 'rose' },
    ],
    failureMode: 'This is the Kerviel / Adoboli playbook. Every famous rogue trader story has trades ageing in this state. Time pressure is the control.',
  },
  {
    id: 'suspected_mismark',
    title: 'pattern of self-marks favouring trader P&L',
    trigger: 'MO notices a trader\'s marks have moved 5+ days in a row in the direction of their P&L vs consensus',
    steps: [
      { who: 'MO analyst', sla: 'day of', action: 'opens behavioural exception (severity high), documents the pattern with charts', color: 'mustard' },
      { who: 'MO head', sla: 'day +1', action: 'reviews; if pattern holds, lifts to compliance directly (bypassing trader)', color: 'coral' },
      { who: 'compliance', sla: 'within 48h', action: 'opens internal investigation; pulls trader\'s communications, broker records, all marks', color: 'rose' },
      { who: 'CRO + General Counsel', sla: 'as findings emerge', action: 'decides on suspension pending review, mark overrides, bonus clawback', color: 'rose' },
      { who: 'regulator', sla: 'if confirmed', action: 'firm self-reports under market abuse rules; trader may face individual liability', color: 'lavender' },
    ],
    failureMode: 'The CRO can override compliance only in writing, with reasons. Every step is logged because if it ever blows up, the audit trail is the firm\'s defence.',
  },
  {
    id: 'system_failure',
    title: 'EOD risk cycle failed to publish by 06:30',
    trigger: 'the overnight risk batch (page 2 chapter 6) didn\'t finish — no firm VaR, no breach checks, no IPV inputs',
    steps: [
      { who: 'MO ops on-call', sla: 'within 30 min of fail', action: 'pages, diagnoses, attempts re-run', color: 'sage' },
      { who: 'MO head + IT head', sla: '07:30', action: 'decides on contingency: re-run, prior-day numbers, or partial publication', color: 'mustard' },
      { who: 'CRO + business heads', sla: '08:00 (pre-open)', action: 'notified; markets opening with no fresh risk — may halt trading on affected books', color: 'coral' },
      { who: 'board + audit committee', sla: 'if business halt > 1 day', action: 'disclosure obligation kicks in for listed firms', color: 'rose' },
    ],
    failureMode: 'This is one of the unglamorous risk scenarios that doesn\'t feature in textbooks but consumes serious MO bandwidth in real life.',
  },
]

const COLOR_BG: Record<string, string> = {
  sage: 'border-sage bg-sage/10',
  mustard: 'border-mustard bg-mustard/10',
  coral: 'border-coral bg-coral/10',
  rose: 'border-rose bg-rose/10',
  lavender: 'border-lavender bg-lavender/10',
}

export function EscalationPathsDemo() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const [reachedStep, setReachedStep] = useState(0)

  const sc = SCENARIOS.find((s) => s.id === scenarioId)!

  function pickScenario(id: string) {
    setScenarioId(id)
    setReachedStep(0)
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        when something fires, who hears about it — and in what order? each kind of exception has its own pre-agreed escalation tree:
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => pickScenario(s.id)}
            className={`pill-sketch text-xs ${
              scenarioId === s.id ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {s.title.length > 30 ? s.title.slice(0, 30) + '...' : s.title}
          </button>
        ))}
      </div>

      <motion.div
        key={sc.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3"
      >
        <div className="font-display text-base mb-1">📣 {sc.title}</div>
        <div className="font-body text-sm text-ink/85 italic mb-3 leading-snug">
          → {sc.trigger}
        </div>

        <div className="space-y-1.5">
          {sc.steps.map((s, i) => {
            const reached = i <= reachedStep
            return (
              <div key={i} className="flex items-stretch gap-2">
                {/* Step indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full border-[2px] flex items-center justify-center font-display text-sm ${
                      reached ? COLOR_BG[s.color] : 'border-ink/20 bg-paper/20 text-ink/40'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < sc.steps.length - 1 && (
                    <div className={`w-[2px] flex-1 my-1 ${reached ? 'bg-ink/40' : 'bg-ink/15'}`} />
                  )}
                </div>
                {/* Step body */}
                <button
                  onClick={() => setReachedStep(i)}
                  className={`flex-1 text-left rounded border-[2px] p-2 transition-all ${
                    reached ? COLOR_BG[s.color] : 'border-ink/15 bg-paper/20 opacity-60'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-sm">{s.who}</span>
                    <span className="font-hand text-[10px] text-ink/55">{s.sla}</span>
                  </div>
                  <div className="font-body text-xs text-ink/85 leading-snug">{s.action}</div>
                </button>
              </div>
            )
          })}
        </div>

        <div className="flex justify-between mt-3">
          <button
            onClick={() => setReachedStep(Math.max(0, reachedStep - 1))}
            disabled={reachedStep === 0}
            className="btn-sketch !text-xs !py-0.5 disabled:opacity-50"
          >
            ← step back
          </button>
          <span className="font-hand text-xs text-ink/55 self-center">
            step {reachedStep + 1} of {sc.steps.length}
          </span>
          <button
            onClick={() => setReachedStep(Math.min(sc.steps.length - 1, reachedStep + 1))}
            disabled={reachedStep === sc.steps.length - 1}
            className="btn-sketch !text-xs !py-0.5 disabled:opacity-50"
          >
            escalate further →
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sc.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-rose/10 border-[2px] border-dashed border-rose"
        >
          <div className="font-display text-base text-rose">⚠ the failure mode</div>
          <div className="font-body text-sm text-ink/85 leading-snug">{sc.failureMode}</div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the trees aren't improvised. they're <span className="text-coral">written down and tested</span> — and when they aren't followed, the audit committee finds out at the worst possible moment.
      </div>
    </div>
  )
}
