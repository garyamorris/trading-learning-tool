import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Node = {
  id: string
  label: string
  level: number
  kind: 'output' | 'derived' | 'curve' | 'trade' | 'mkt' | 'config'
  details: string
  todayValue: string
  weekAgoValue: string
  children?: Node[]
}

const ROOT: Node = {
  id: 'var_firm',
  label: 'firm VaR 95% (10d)',
  level: 0,
  kind: 'output',
  details: 'published 06:42 by the EOD risk cycle',
  todayValue: '€612k',
  weekAgoValue: '€487k',
  children: [
    {
      id: 'positions',
      label: 'firm positions',
      level: 1,
      kind: 'derived',
      details: '5,982 open trades rolled up by book/commodity/tenor',
      todayValue: '+145 / −155 / +35 MW',
      weekAgoValue: '+118 / −140 / +28 MW',
      children: [
        {
          id: 'trade_a',
          label: 'T_0001142',
          level: 2,
          kind: 'trade',
          details: 'buy 36,000 MWh power M+1 @ €84.50 · CP_004',
          todayValue: 'open',
          weekAgoValue: 'open',
        },
        {
          id: 'trade_b',
          label: 'T_0001168',
          level: 2,
          kind: 'trade',
          details: 'buy 8,000 MWh gas M+1 @ €78.20 · CP_011',
          todayValue: 'open',
          weekAgoValue: 'open',
        },
        {
          id: 'trade_c',
          label: '... 5,980 more',
          level: 2,
          kind: 'trade',
          details: 'every open trade in the firm contributes to this rollup',
          todayValue: '—',
          weekAgoValue: '—',
        },
      ],
    },
    {
      id: 'curves',
      label: 'forward curves',
      level: 1,
      kind: 'curve',
      details: 'power / gas / carbon, 24 tenors each',
      todayValue: 'snapshot 17:30 UTC',
      weekAgoValue: 'snapshot 17:30 UTC',
      children: [
        {
          id: 'broker_44',
          label: 'BQ_44 · EEX power M+1',
          level: 2,
          kind: 'mkt',
          details: 'broker quote from Marex, ICAP, Tullett (consensus mid)',
          todayValue: '€82.10',
          weekAgoValue: '€80.45',
        },
        {
          id: 'eex_settle',
          label: 'EEX_settle 2026-04-30',
          level: 2,
          kind: 'mkt',
          details: 'exchange settlement price, cleared',
          todayValue: '€81.75',
          weekAgoValue: '€80.20',
        },
      ],
    },
    {
      id: 'vol_surface',
      label: 'vol surface',
      level: 1,
      kind: 'curve',
      details: 'power vol per (strike, tenor) for option positions',
      todayValue: '34% ATM',
      weekAgoValue: '32% ATM',
    },
    {
      id: 'corr_matrix',
      label: 'correlation matrix',
      level: 1,
      kind: 'config',
      details: 'pairwise correlations across commodities, calibrated weekly',
      todayValue: 'v2026-04-28',
      weekAgoValue: 'v2026-04-21',
    },
    {
      id: 'model',
      label: 'risk model',
      level: 1,
      kind: 'config',
      details: 'historic-simulation VaR engine, 5,000 paths, 10-day horizon',
      todayValue: 'commit 8f140ac',
      weekAgoValue: 'commit 8f140ac',
    },
  ],
}

const KIND_COLORS: Record<Node['kind'], string> = {
  output: 'bg-coral/15 border-coral text-coral',
  derived: 'bg-mustard/15 border-mustard',
  curve: 'bg-teal/15 border-teal',
  trade: 'bg-sage/15 border-sage',
  mkt: 'bg-lavender/15 border-lavender',
  config: 'bg-paper border-ink/30',
}

const KIND_ICONS: Record<Node['kind'], string> = {
  output: '🎯',
  derived: '📊',
  curve: '〽️',
  trade: '🎫',
  mkt: '📡',
  config: '⚙️',
}

function NodeCard({
  n,
  expanded,
  toggle,
  rewind,
}: {
  n: Node
  expanded: Set<string>
  toggle: (id: string) => void
  rewind: boolean
}) {
  const isOpen = expanded.has(n.id)
  const hasChildren = (n.children?.length ?? 0) > 0
  return (
    <div className="space-y-1.5">
      <motion.button
        layout
        onClick={() => hasChildren && toggle(n.id)}
        disabled={!hasChildren}
        className={`w-full text-left rounded border-[2px] p-2 transition-all shadow-sketchSm ${
          KIND_COLORS[n.kind]
        } ${!hasChildren ? 'cursor-default opacity-95' : 'hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'}`}
        style={{ marginLeft: n.level * 18 }}
      >
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-base">{KIND_ICONS[n.kind]}</span>
            <span className="font-body text-sm font-bold truncate">{n.label}</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="font-mono text-sm">
              {rewind ? n.weekAgoValue : n.todayValue}
            </span>
            {hasChildren && (
              <span className="font-display text-lg text-ink/45 ml-1">
                {isOpen ? '−' : '+'}
              </span>
            )}
          </div>
        </div>
        <div className="font-hand text-[11px] text-ink/65 mt-0.5">{n.details}</div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (n.children ?? []).map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <NodeCard n={c} expanded={expanded} toggle={toggle} rewind={rewind} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function LineageDemo() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['var_firm']))
  const [rewind, setRewind] = useState(false)

  function toggle(id: string) {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  function expandAll() {
    const all = new Set<string>(['var_firm'])
    function walk(n: Node) {
      all.add(n.id)
      ;(n.children ?? []).forEach(walk)
    }
    walk(ROOT)
    setExpanded(all)
  }

  function collapseAll() {
    setExpanded(new Set(['var_firm']))
  }

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        the firm just published a VaR. when the regulator asks "where did this come from?", you have to be able to
        <span className="text-coral font-bold"> walk every node back to source</span>:
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button onClick={expandAll} className="btn-sketch !text-xs !py-0.5">
          expand all
        </button>
        <button onClick={collapseAll} className="btn-sketch !text-xs !py-0.5">
          collapse
        </button>
        <div className="flex-1" />
        <span className="font-hand text-ink/60 text-xs">
          {rewind ? 'showing: 1 week ago' : 'showing: today'}
        </span>
        <button
          onClick={() => setRewind(!rewind)}
          className={`btn-sketch !text-xs !py-0.5 ${
            rewind ? 'bg-lavender/40' : ''
          }`}
        >
          {rewind ? '↻ today' : '⏮ rewind 1 week'}
        </button>
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
        <NodeCard n={ROOT} expanded={expanded} toggle={toggle} rewind={rewind} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="p-3 rounded-lg bg-coral/10 border-[2px] border-dashed border-coral">
          <div className="font-display text-base text-coral mb-1">⚖️ the regulator's ask</div>
          <div className="font-body text-sm text-ink/85 leading-snug">
            "Reproduce yesterday's firm VaR from frozen inputs. Same trades, same curves, same model version. Same number, every time."
          </div>
        </div>
        <div className="p-3 rounded-lg bg-sage/10 border-[2px] border-dashed border-sage">
          <div className="font-display text-base text-sage mb-1">✓ the ETRM's answer</div>
          <div className="font-body text-sm text-ink/85 leading-snug">
            Toggle "rewind 1 week" above. Same graph, snapshotted inputs, deterministic model. Every leaf has an immutable history. Every roll-up is reproducible.
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ <span className="text-coral">every number</span> in an ETRM has to trace back to{' '}
        every input that produced it. retrofit this and you'll cry. build it in from day one.
      </div>
    </div>
  )
}
