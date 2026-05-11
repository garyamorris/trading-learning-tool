import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Severity = 'low' | 'med' | 'high'
type Status = 'open' | 'investigating' | 'closed'

type Exception = {
  id: string
  category: 'stale_price' | 'unconfirmed_trade' | 'pnl_break' | 'self_mark' | 'limit_spike'
  severity: Severity
  ageHours: number
  owner: string
  desc: string
  details: string
}

const SEED: Exception[] = [
  {
    id: 'EX_1041',
    category: 'pnl_break',
    severity: 'high',
    ageHours: 4,
    owner: 'IPV team',
    desc: 'P&L break €240k on power Cal+2',
    details:
      "Trader marked 5.50 above IPV consensus on a 40 MW long. Position is illiquid and the gap appeared overnight. Compliance has been pinged.",
  },
  {
    id: 'EX_1042',
    category: 'unconfirmed_trade',
    severity: 'high',
    ageHours: 28,
    owner: 'Trade control',
    desc: 'T_0001203 unconfirmed for 28h',
    details:
      "Booked yesterday morning. No confirmation back from CP_017. Either they lost it or it never went out. SLA was T+1 by 11am — 17 hours past.",
  },
  {
    id: 'EX_1043',
    category: 'stale_price',
    severity: 'med',
    ageHours: 3,
    owner: 'Market data',
    desc: 'gas M+1 NCG settle missing',
    details:
      "Vendor feed failed on yesterday's settle for NCG gas M+1. Backup source pulled but flagged as 'displayed' rather than 'verified' — affects 12 positions.",
  },
  {
    id: 'EX_1044',
    category: 'self_mark',
    severity: 'med',
    ageHours: 5,
    owner: 'IPV team',
    desc: 'power Q+1 mark drifted +€1.20 vs prior day',
    details:
      "Trader's Q+1 mark moved €1.20 while the consensus moved €0.40. Within tolerance individually but drift over the week is now €3.10 — pattern looks deliberate.",
  },
  {
    id: 'EX_1045',
    category: 'limit_spike',
    severity: 'med',
    ageHours: 1,
    owner: 'Risk control',
    desc: 'VaR utilisation jumped 18% in one cycle',
    details:
      "BOOK_012 VaR went from 64% → 82% overnight with no new trades. Curve move? Vol-surface recalibration? Check before market opens.",
  },
  {
    id: 'EX_1046',
    category: 'unconfirmed_trade',
    severity: 'low',
    ageHours: 8,
    owner: 'Trade control',
    desc: 'T_0001197 awaiting broker confirm',
    details: 'Routine. 8 hours old, within the 16-hour SLA. Nudge the broker if it hits 12.',
  },
  {
    id: 'EX_1047',
    category: 'pnl_break',
    severity: 'low',
    ageHours: 6,
    owner: 'IPV team',
    desc: 'P&L break €38k on carbon Cal+1',
    details: 'Small relative gap on a liquid position. Probably bid-ask noise. Log and close.',
  },
  {
    id: 'EX_1048',
    category: 'stale_price',
    severity: 'low',
    ageHours: 2,
    owner: 'Market data',
    desc: 'forward curve M+24 point missing',
    details: 'Long-end illiquid tenor. Interpolation fills it in. Low risk; document.',
  },
  {
    id: 'EX_1049',
    category: 'self_mark',
    severity: 'high',
    ageHours: 0.5,
    owner: 'Compliance',
    desc: 'two-day re-mark by trader after IPV flag',
    details:
      "Trader changed their power Cal+2 mark back to the previous level the morning after the MO flagged it. This is a behavioural red flag. Compliance has been pulled in.",
  },
  {
    id: 'EX_1050',
    category: 'limit_spike',
    severity: 'low',
    ageHours: 12,
    owner: 'Risk control',
    desc: 'counterparty PFE up 9% on CP_011',
    details: 'New gas swap added to the book. PFE moved as expected. No action.',
  },
  {
    id: 'EX_1051',
    category: 'unconfirmed_trade',
    severity: 'med',
    ageHours: 14,
    owner: 'Trade control',
    desc: 'T_0001172 confirm has wrong price',
    details: "Counterparty confirmed at €82.10; we have €79.50. €2.60 gap on 30 MW = €7.8k impact. Need a corrected confirm.",
  },
  {
    id: 'EX_1052',
    category: 'pnl_break',
    severity: 'low',
    ageHours: 7,
    owner: 'IPV team',
    desc: 'power M+1 IPV vs trader Δ €12k',
    details: 'Tiny gap on a liquid position. Log and close.',
  },
]

const CATEGORY_META: Record<Exception['category'], { label: string; icon: string }> = {
  stale_price: { label: 'stale price', icon: '🕰️' },
  unconfirmed_trade: { label: 'unconfirmed trade', icon: '📭' },
  pnl_break: { label: 'P&L break', icon: '📉' },
  self_mark: { label: 'self-mark anomaly', icon: '🎯' },
  limit_spike: { label: 'limit spike', icon: '🚨' },
}

const SEV_META: Record<Severity, { label: string; color: string }> = {
  low: { label: 'low', color: 'sage' },
  med: { label: 'medium', color: 'mustard' },
  high: { label: 'high', color: 'rose' },
}

const SEV_BG: Record<string, string> = {
  sage: 'border-sage bg-sage/10 text-sage',
  mustard: 'border-mustard bg-mustard/10 text-mustard',
  rose: 'border-rose bg-rose/10 text-rose',
}

export function ExceptionDashboardDemo() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(SEED.map((e) => [e.id, 'open' as Status])),
  )
  const [filter, setFilter] = useState<'all' | Exception['category']>('all')
  const [sevFilter, setSevFilter] = useState<'all' | Severity>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      SEED.filter(
        (e) =>
          (filter === 'all' || e.category === filter) &&
          (sevFilter === 'all' || e.severity === sevFilter),
      ),
    [filter, sevFilter],
  )

  function setStatus(id: string, s: Status) {
    setStatuses((prev) => ({ ...prev, [id]: s }))
  }
  function resetAll() {
    setStatuses(Object.fromEntries(SEED.map((e) => [e.id, 'open' as Status])))
    setOpenId(null)
  }

  // Stats
  const stats = useMemo(() => {
    const byCat: Record<string, number> = {}
    const bySev = { low: 0, med: 0, high: 0 } as Record<Severity, number>
    let open = 0
    for (const e of SEED) {
      if (statuses[e.id] === 'open') {
        open++
        bySev[e.severity]++
        byCat[e.category] = (byCat[e.category] ?? 0) + 1
      }
    }
    return { byCat, bySev, open }
  }, [statuses])

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        end-of-day, every middle-office team's screen looks like this. {SEED.length} exceptions in the queue,{' '}
        <span className="text-coral font-bold">{stats.open}</span> still open. work them down before tomorrow's open:
      </div>

      {/* SUMMARY STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-rose/15 border-[1.5px] border-rose rounded p-2 text-center">
          <div className="font-hand text-xs text-ink/60">high severity</div>
          <div className="font-display text-2xl text-rose">{stats.bySev.high}</div>
        </div>
        <div className="bg-mustard/15 border-[1.5px] border-mustard rounded p-2 text-center">
          <div className="font-hand text-xs text-ink/60">medium</div>
          <div className="font-display text-2xl text-mustard">{stats.bySev.med}</div>
        </div>
        <div className="bg-sage/15 border-[1.5px] border-sage rounded p-2 text-center">
          <div className="font-hand text-xs text-ink/60">low</div>
          <div className="font-display text-2xl text-sage">{stats.bySev.low}</div>
        </div>
        <div className="bg-cream border-[1.5px] border-ink/30 rounded p-2 text-center">
          <div className="font-hand text-xs text-ink/60">total open</div>
          <div className="font-display text-2xl">{stats.open}</div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2 text-xs">
        <span className="font-hand text-ink/55 mr-1">category:</span>
        <button
          onClick={() => setFilter('all')}
          className={`pill-sketch !text-[11px] !py-0 !px-2 ${
            filter === 'all' ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          all
        </button>
        {(Object.keys(CATEGORY_META) as Exception['category'][]).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`pill-sketch !text-[11px] !py-0 !px-2 ${
              filter === c ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {CATEGORY_META[c].icon} {CATEGORY_META[c].label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
        <span className="font-hand text-ink/55 mr-1">severity:</span>
        {(['all', 'low', 'med', 'high'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSevFilter(s)}
            className={`pill-sketch !text-[11px] !py-0 !px-2 ${
              sevFilter === s ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={resetAll} className="btn-sketch !text-[11px] !py-0.5">
          ↻ reset
        </button>
      </div>

      {/* QUEUE */}
      <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
        {filtered.map((e) => {
          const status = statuses[e.id]
          const sev = SEV_META[e.severity]
          const cat = CATEGORY_META[e.category]
          const isOpen = openId === e.id
          const statusBorder =
            status === 'closed'
              ? 'border-sage/60 bg-sage/5 opacity-70'
              : status === 'investigating'
              ? 'border-mustard bg-mustard/8'
              : `border-${sev.color === 'sage' ? 'ink/30' : sev.color}/60 bg-cream`
          return (
            <motion.div
              key={e.id}
              layout
              className={`rounded border-[2px] shadow-sketchSm ${statusBorder}`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : e.id)}
                className="w-full text-left p-2 hover:bg-paper/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span
                      className={`font-hand text-[10px] uppercase tracking-wider px-1.5 rounded border ${SEV_BG[sev.color]} font-bold shrink-0`}
                    >
                      {sev.label}
                    </span>
                    <span className="font-mono text-xs text-ink/55 shrink-0">{e.id}</span>
                    <span className="font-body text-sm font-bold truncate">
                      {cat.icon} {e.desc}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-hand text-[11px] text-ink/55">
                      {e.ageHours < 1 ? `${(e.ageHours * 60).toFixed(0)}m` : `${e.ageHours.toFixed(0)}h`}
                    </span>
                    <span className="font-hand text-xs">
                      {status === 'open' ? (
                        <span className="text-coral font-bold">open</span>
                      ) : status === 'investigating' ? (
                        <span className="text-mustard font-bold">investigating</span>
                      ) : (
                        <span className="text-sage font-bold">closed ✓</span>
                      )}
                    </span>
                    <span className="font-display text-base text-ink/40">{isOpen ? '−' : '+'}</span>
                  </div>
                </div>
                <div className="font-hand text-[10px] text-ink/55 mt-0.5">
                  owner: {e.owner} · category: {cat.label}
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
                      <div className="font-body text-sm text-ink/85 leading-snug mb-2">
                        {e.details}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => setStatus(e.id, 'investigating')}
                          disabled={status !== 'open'}
                          className="btn-sketch !text-[11px] !py-0.5 disabled:opacity-50"
                        >
                          start investigating
                        </button>
                        <button
                          onClick={() => setStatus(e.id, 'closed')}
                          className="btn-sketch !text-[11px] !py-0.5 bg-sage/40"
                        >
                          close ✓
                        </button>
                        <button
                          onClick={() => setStatus(e.id, 'open')}
                          disabled={status === 'open'}
                          className="btn-sketch !text-[11px] !py-0.5 disabled:opacity-50"
                        >
                          reopen
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="font-hand text-ink/45 text-center py-6">
            no exceptions match the filter.
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this dashboard is the middle office's daily life. <span className="text-coral">every exception is a ticket</span>; every ticket is owned; every ticket ages until it closes. nothing falls off.
      </div>
    </div>
  )
}
