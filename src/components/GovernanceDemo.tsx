import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Limits (from company.py governance rules)
const LIMITS = {
  var_limit: 335,
  cvar_limit: 425,
  stress_limit: 225,
  position_limit: 190,
  warning_utilisation: 0.65,
  hard_utilisation: 0.95,
}

function Gauge({
  label,
  value,
  limit,
  unit,
}: {
  label: string
  value: number
  limit: number
  unit: string
}) {
  const util = value / limit
  const cappedPct = Math.min(120, util * 100)
  const status =
    util >= LIMITS.hard_utilisation
      ? 'hard'
      : util >= LIMITS.warning_utilisation
      ? 'warn'
      : 'ok'
  const barColor =
    status === 'hard' ? 'bg-coral' : status === 'warn' ? 'bg-mustard' : 'bg-sage'
  return (
    <div className="bg-paper/40 rounded-lg border-[1.5px] border-ink/30 p-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-hand text-ink/70 text-sm">{label}</span>
        <span className="font-hand text-ink text-sm tabular-nums">
          {value.toFixed(0)} / {limit.toFixed(0)} {unit}
        </span>
      </div>
      <div className="h-3 bg-cream rounded-full border-[1.5px] border-ink/30 overflow-hidden relative">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, cappedPct)}%` }}
          transition={{ duration: 0.3 }}
        />
        {/* warning + hard markers */}
        <div
          className="absolute top-0 bottom-0 w-[1.5px] bg-mustard"
          style={{ left: `${LIMITS.warning_utilisation * 100}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-[1.5px] bg-coral"
          style={{ left: `${LIMITS.hard_utilisation * 100}%` }}
        />
      </div>
      <div className="flex justify-between font-hand text-xs text-ink/50 mt-0.5">
        <span>{(util * 100).toFixed(0)}% of limit</span>
        <span
          className={
            status === 'hard'
              ? 'text-coral font-bold'
              : status === 'warn'
              ? 'text-mustard font-bold'
              : 'text-sage'
          }
        >
          {status === 'hard' ? 'HARD BREACH' : status === 'warn' ? 'approval needed' : 'within limits'}
        </span>
      </div>
    </div>
  )
}

export function GovernanceDemo() {
  const [position, setPosition] = useState(120)
  const [vol, setVol] = useState(0.34)

  const var10d = useMemo(() => {
    return 1.65 * 0.10 * Math.abs(position) * 78 * vol / Math.sqrt(252) * Math.sqrt(10)
  }, [position, vol])
  const cvar10d = useMemo(() => var10d * (2.06 / 1.65), [var10d])
  const stress = useMemo(() => Math.abs(position) * 78 * 0.10 * 0.18, [position])

  const utilisations = {
    var: var10d / LIMITS.var_limit,
    cvar: cvar10d / LIMITS.cvar_limit,
    stress: stress / LIMITS.stress_limit,
    position: Math.abs(position) / LIMITS.position_limit,
  }
  const governing = Math.max(...Object.values(utilisations))
  const hardBreach = governing >= LIMITS.hard_utilisation
  const approvalRequired = governing >= LIMITS.warning_utilisation
  const path = hardBreach
    ? 'risk_committee'
    : approvalRequired
    ? 'risk_manager'
    : 'none'

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>position size</span>
            <span className="font-bold">{position} MW</span>
          </div>
          <input
            type="range"
            min={20}
            max={250}
            step={5}
            value={position}
            onChange={(e) => setPosition(parseInt(e.target.value))}
            className="w-full accent-coral"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>market vol</span>
            <span className="font-bold">{(vol * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.10}
            max={0.80}
            step={0.02}
            value={vol}
            onChange={(e) => setVol(parseFloat(e.target.value))}
            className="w-full accent-mustard"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <Gauge label="VaR (10d)" value={var10d} limit={LIMITS.var_limit} unit="k" />
        <Gauge label="CVaR (10d)" value={cvar10d} limit={LIMITS.cvar_limit} unit="k" />
        <Gauge label="stress loss" value={stress} limit={LIMITS.stress_limit} unit="k" />
        <Gauge label="position" value={Math.abs(position)} limit={LIMITS.position_limit} unit="MW" />
      </div>

      <motion.div
        layout
        className={`p-4 rounded-lg border-[2.5px] ${
          hardBreach
            ? 'border-coral bg-coral/15'
            : approvalRequired
            ? 'border-mustard bg-mustard/15'
            : 'border-sage bg-sage/15'
        }`}
      >
        <div className="font-display text-2xl mb-1">
          {hardBreach ? '🚨 hard breach' : approvalRequired ? '⚠️ approval required' : '✅ all clear'}
        </div>
        <div className="font-body text-base text-ink/85 leading-snug">
          {hardBreach && (
            <>
              The governing utilisation hit{' '}
              <strong>{(governing * 100).toFixed(0)}%</strong>. The trader can{' '}
              no longer act unilaterally — the next action goes to the{' '}
              <strong>risk committee</strong>. "hold" stops being legal.
            </>
          )}
          {!hardBreach && approvalRequired && (
            <>
              At <strong>{(governing * 100).toFixed(0)}%</strong> of limit, the
              trader needs <strong>risk manager</strong> sign-off to put on
              more. They can still trade smaller, but governance is watching.
            </>
          )}
          {!approvalRequired && (
            <>
              At <strong>{(governing * 100).toFixed(0)}%</strong> the trader
              has full discretion. No approvals, no escalations.
            </>
          )}
        </div>
        <div className="mt-2 font-hand text-sm text-ink/70">
          approval path: <strong>{path}</strong>
        </div>
      </motion.div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ a VaR number with no limit attached is just a number. limits +
        utilisations are what turn risk into <span className="text-coral">decisions</span>.
      </div>
    </div>
  )
}
