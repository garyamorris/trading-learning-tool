import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Deterministic seeded "noise" so the user's slider feels stable
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff - 0.5
  }
}

const TRUE_FIELDS = {
  power_spot: 84.5,
  gas_spot: 53.2,
  load_forecast: 51200,
  counterparty_pfe: 412,
  var_95_10d: 295,
  cvar_95_10d: 368,
  actor_confidence: 0.72,
  logged_reason_text: 'CVaR utilisation neared limit; hedged to reduce directional exposure.',
}

export function ImperfectionsDemo() {
  const [noise, setNoise] = useState(0.04)
  const [missingness, setMissingness] = useState(0.15)
  const [stale, setStale] = useState(false)

  const displayed = useMemo(() => {
    const rng = makeRng(7)
    const out: Record<string, string | null> = {}
    for (const [k, v] of Object.entries(TRUE_FIELDS)) {
      // Apply missingness
      if (rng() + 0.5 < missingness) {
        out[k] = null
        continue
      }
      if (typeof v === 'number') {
        const noiseScale = noise
        const noisy = v * (1 + rng() * 2 * noiseScale)
        out[k] = Number.isInteger(v) ? noisy.toFixed(0) : noisy.toFixed(2)
      } else {
        out[k] = v
      }
    }
    if (stale && out['power_spot']) {
      out['power_spot'] = (parseFloat(String(out['power_spot'])) * 0.94).toFixed(2)
    }
    return out
  }, [noise, missingness, stale])

  const fields = [
    { k: 'power_spot', label: 'power spot (€/MWh)', unit: '' },
    { k: 'gas_spot', label: 'gas spot (€/MWh)', unit: '' },
    { k: 'load_forecast', label: 'load forecast (MW)', unit: '' },
    { k: 'counterparty_pfe', label: 'counterparty PFE (€k)', unit: '' },
    { k: 'var_95_10d', label: 'VaR 95% (10d)', unit: '€k' },
    { k: 'cvar_95_10d', label: 'CVaR 95% (10d)', unit: '€k' },
    { k: 'actor_confidence', label: 'actor confidence', unit: '' },
    { k: 'logged_reason_text', label: 'logged reason', unit: '' },
  ]

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>measurement noise</span>
            <span className="font-bold">{(noise * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.20}
            step={0.01}
            value={noise}
            onChange={(e) => setNoise(parseFloat(e.target.value))}
            className="w-full accent-coral"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>missingness</span>
            <span className="font-bold">{(missingness * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.05}
            value={missingness}
            onChange={(e) => setMissingness(parseFloat(e.target.value))}
            className="w-full accent-mustard"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setStale(!stale)}
            className={`btn-sketch text-sm ${stale ? 'bg-coral/40' : ''}`}
          >
            {stale ? '✓ stale prices' : 'stale prices'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="p-3 bg-sage/10 rounded-lg border-[2px] border-sage/50">
          <div className="font-display text-xl text-sage mb-2">
            🌟 ground truth (oracle view)
          </div>
          <div className="space-y-1 font-body text-sm">
            {fields.map((f) => (
              <div key={f.k} className="flex justify-between gap-2">
                <span className="font-hand text-ink/70 text-xs">{f.label}:</span>
                <span className="text-right text-ink font-mono text-xs leading-tight">
                  {String(TRUE_FIELDS[f.k as keyof typeof TRUE_FIELDS])}
                  {f.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 bg-coral/10 rounded-lg border-[2px] border-coral/50">
          <div className="font-display text-xl text-coral mb-2">
            👁️ what the model actually sees
          </div>
          <div className="space-y-1 font-body text-sm">
            {fields.map((f) => {
              const v = displayed[f.k]
              return (
                <motion.div
                  key={f.k}
                  layout
                  className="flex justify-between gap-2"
                >
                  <span className="font-hand text-ink/70 text-xs">{f.label}:</span>
                  <span className="text-right text-ink font-mono text-xs leading-tight">
                    {v === null ? (
                      <span className="text-coral italic">— missing —</span>
                    ) : (
                      <>
                        {v}
                        {f.unit}
                      </>
                    )}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-mustard/15 border-[2px] border-dashed border-mustard">
        <div className="font-hand text-coral text-base mb-1">
          ✦ this is the leakage line
        </div>
        <div className="font-body text-sm leading-snug">
          The "model view" on the right is everything a model — or LLM — gets to
          see at decision time. The "oracle view" on the left is what was{' '}
          <em>actually</em> happening in the synthetic world. Anything from the
          oracle that leaks into the model view is a{' '}
          <span className="text-coral font-bold">data leak</span>: the model
          looks magical in eval, but only because it cheated.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ stale screens, missing fields, and noisy estimates are not edge cases.
        they are the everyday reality of any real trading floor.
      </div>
    </div>
  )
}
