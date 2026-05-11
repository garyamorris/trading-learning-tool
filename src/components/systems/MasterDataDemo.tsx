import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Entity = {
  id: string
  legal_name: string
  country: string
  rating: string
  watchlist?: boolean
  isda?: boolean
  csa_threshold?: number
  affiliates?: Entity[]
}

const ENTITY_TREE: Entity = {
  id: 'NRG_HOLDINGS',
  legal_name: 'NRG Holdings Plc',
  country: '🇬🇧 UK',
  rating: 'BBB+',
  affiliates: [
    {
      id: 'NRG_EUR',
      legal_name: 'NRG Trading Europe SA',
      country: '🇧🇪 BE',
      rating: 'BBB+',
      isda: true,
      csa_threshold: 380,
      affiliates: [
        {
          id: 'CP_004',
          legal_name: 'NRG Power Marketing SA',
          country: '🇩🇪 DE',
          rating: 'BBB',
          isda: true,
          csa_threshold: 200,
        },
        {
          id: 'CP_011',
          legal_name: 'NRG Gas Supply BV',
          country: '🇳🇱 NL',
          rating: 'BBB',
          isda: true,
          csa_threshold: 180,
        },
      ],
    },
    {
      id: 'NRG_NA',
      legal_name: 'NRG Energy NA Inc.',
      country: '🇺🇸 US',
      rating: 'BBB',
      watchlist: true,
      isda: true,
      csa_threshold: 320,
      affiliates: [
        {
          id: 'CP_017',
          legal_name: 'NRG Carbon Solutions LLC',
          country: '🇺🇸 US',
          rating: 'BB+',
          watchlist: true,
          isda: true,
          csa_threshold: 120,
        },
      ],
    },
  ],
}

type Mode = 'trade' | 'tree'

// Some example open trades (which entity, how much exposure)
const OPEN_EXPOSURES: { entity_id: string; pfe: number }[] = [
  { entity_id: 'CP_004', pfe: 145 },
  { entity_id: 'CP_011', pfe: 88 },
  { entity_id: 'CP_017', pfe: 92 },
]

function rollupExposure(node: Entity): number {
  let s = 0
  for (const e of OPEN_EXPOSURES) {
    if (containsEntity(node, e.entity_id)) s += e.pfe
  }
  return s
}

function containsEntity(node: Entity, id: string): boolean {
  if (node.id === id) return true
  return (node.affiliates ?? []).some((a) => containsEntity(a, id))
}

function EntityCard({
  e,
  depth,
  selected,
  onSelect,
}: {
  e: Entity
  depth: number
  selected: string | null
  onSelect: (id: string) => void
}) {
  const total = rollupExposure(e)
  const ownPFE = OPEN_EXPOSURES.find((x) => x.entity_id === e.id)?.pfe ?? 0
  const isSelected = selected === e.id
  return (
    <div className="space-y-1">
      <motion.button
        layout
        onClick={() => onSelect(e.id)}
        className={`w-full text-left rounded border-[2px] p-2 transition-colors ${
          isSelected
            ? 'border-coral bg-coral/10 shadow-sketchSm'
            : 'border-ink/30 bg-cream hover:bg-paper'
        }`}
        style={{ marginLeft: depth * 16 }}
      >
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            {depth > 0 && <span className="text-ink/40">↳</span>}
            <span className="font-mono text-xs font-bold">{e.id}</span>
            <span className="font-body text-xs truncate text-ink/80">
              {e.legal_name}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-hand text-xs text-ink/65">{e.country}</span>
            <span
              className={`font-hand text-xs px-1.5 rounded border ${
                e.rating.startsWith('B') && !e.rating.startsWith('BB')
                  ? 'border-sage/60 bg-sage/10'
                  : 'border-mustard/60 bg-mustard/10'
              }`}
            >
              {e.rating}
            </span>
            {e.watchlist && (
              <span className="font-hand text-[10px] px-1 rounded bg-coral/20 border border-coral text-coral">
                watchlist
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-0.5 font-hand text-[11px] text-ink/65">
          <span>
            {e.isda ? '✓ ISDA' : 'no ISDA'}
            {e.csa_threshold ? ` · CSA €${e.csa_threshold}k` : ''}
          </span>
          <span>
            {ownPFE > 0 && (
              <span className="mr-2">
                own PFE: <strong className="text-ink">€{ownPFE}k</strong>
              </span>
            )}
            {(e.affiliates?.length ?? 0) > 0 && (
              <>
                roll-up PFE: <strong className="text-coral">€{total}k</strong>
              </>
            )}
          </span>
        </div>
      </motion.button>
      <AnimatePresence>
        {(e.affiliates ?? []).map((a) => (
          <EntityCard key={a.id} e={a} depth={depth + 1} selected={selected} onSelect={onSelect} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export function MasterDataDemo() {
  const [mode, setMode] = useState<Mode>('trade')
  const [selected, setSelected] = useState<string | null>('CP_004')

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-hand text-ink/70 text-base mr-1">view:</span>
        <button
          onClick={() => setMode('trade')}
          className={`pill-sketch text-sm ${
            mode === 'trade' ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          🎫 from a trade ticket
        </button>
        <button
          onClick={() => setMode('tree')}
          className={`pill-sketch text-sm ${
            mode === 'tree' ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
          }`}
        >
          🌳 the whole hierarchy
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'trade' && (
          <motion.div
            key="trade"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-3">
              <div className="font-hand text-xs text-ink/60 mb-1">
                an ordinary trade ticket (from chapter 2):
              </div>
              <div className="font-mono text-sm bg-cream border-[1.5px] border-ink/40 rounded p-2 flex flex-wrap gap-x-3 gap-y-1">
                <span>
                  <span className="text-ink/55">id:</span> T_0001142
                </span>
                <span>
                  <span className="text-ink/55">commodity:</span> power
                </span>
                <span>
                  <span className="text-ink/55">vol:</span> 36,000 MWh
                </span>
                <span>
                  <span className="text-ink/55">px:</span> €84.50
                </span>
                <span>
                  <span className="text-ink/55">cp:</span>{' '}
                  <button
                    onClick={() => setSelected('CP_004')}
                    className="underline decoration-coral decoration-2 underline-offset-2 text-coral font-bold"
                  >
                    CP_004
                  </button>
                </span>
              </div>
              <div className="font-hand text-xs text-ink/55 mt-1">
                ↑ click <span className="text-coral font-bold">CP_004</span> to see the master-data card
              </div>
            </div>

            <AnimatePresence>
              {selected === 'CP_004' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-coral/5 rounded-lg border-[2px] border-coral/40 p-3">
                    <div className="font-display text-xl mb-2">
                      🏷️ counterparty master record · <span className="font-mono text-base">CP_004</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-body">
                      <div>
                        <span className="font-hand text-ink/55">legal name:</span> NRG Power Marketing SA
                      </div>
                      <div>
                        <span className="font-hand text-ink/55">country:</span> 🇩🇪 Germany
                      </div>
                      <div>
                        <span className="font-hand text-ink/55">credit rating:</span>{' '}
                        <span className="font-bold">BBB</span>
                      </div>
                      <div>
                        <span className="font-hand text-ink/55">ISDA + CSA:</span>{' '}
                        <span className="text-sage font-bold">✓ in place</span>
                      </div>
                      <div>
                        <span className="font-hand text-ink/55">parent:</span>{' '}
                        <button
                          onClick={() => setMode('tree')}
                          className="underline decoration-teal decoration-2 text-teal font-bold"
                        >
                          NRG Trading Europe SA
                        </button>
                      </div>
                      <div>
                        <span className="font-hand text-ink/55">ultimate parent:</span>{' '}
                        <button
                          onClick={() => setMode('tree')}
                          className="underline decoration-teal decoration-2 text-teal font-bold"
                        >
                          NRG Holdings Plc
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-ink/15 font-body text-sm">
                      <span className="font-hand text-ink/60">PFE on this entity: </span>
                      <strong>€145k</strong>
                      <span className="text-ink/55"> · </span>
                      <span className="font-hand text-ink/60">PFE rolled up to ultimate parent: </span>
                      <strong className="text-coral">€325k</strong>
                      <span className="font-hand text-ink/60"> (across 3 affiliates)</span>
                    </div>
                  </div>
                  <div className="mt-2 font-hand text-xs text-ink/55 text-center">
                    notice: the limit-check from chapter 7 must consider the{' '}
                    <span className="text-coral font-bold">rolled-up</span> exposure, not just CP_004's own.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {mode === 'tree' && (
          <motion.div
            key="tree"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3"
          >
            <div className="font-hand text-xs text-ink/60 mb-2">
              the four entities you trade with all belong to one corporate family. credit limits live{' '}
              <span className="text-coral font-bold">at every level</span> of the tree:
            </div>
            <EntityCard e={ENTITY_TREE} depth={0} selected={selected} onSelect={setSelected} />
            <div className="mt-3 p-2 rounded bg-mustard/10 border-[1.5px] border-dashed border-mustard">
              <div className="font-hand text-sm">
                ✦ if any one affiliate defaults, all four typically default together. that's why{' '}
                <span className="text-coral font-bold">ultimate-parent exposure</span> is the number credit teams actually care about.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ master data has been hiding behind every "CP_xxx" in this guide.
        without it, <span className="text-coral">none of the previous chapters can agree on what they mean</span>.
      </div>
    </div>
  )
}
