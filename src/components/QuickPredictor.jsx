import React from 'react'

export default function QuickPredictor() {
  const [form, setForm] = React.useState({
    heart_rate: 75,
    sleep_hours: 7,
    steps: 2000,
    day_of_week: new Date().getDay() === 0 ? 6 : new Date().getDay()-1, // 0=Mon..6=Sun
    hour: new Date().getHours(),
    mood_score: 0.6,
    pss10_score: undefined,
  })
  const [result, setResult] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async () => {
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/predict`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pss10_score: form.pss10_score ?? null })
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-slate-800/60 border border-blue-500/20 rounded-2xl">
      <h3 className="text-white font-semibold mb-4">Quick Stress Predictor</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm text-blue-100">
          Heart rate: {form.heart_rate} bpm
          <input type="range" min="45" max="120" value={form.heart_rate} onChange={e=>update('heart_rate', Number(e.target.value))} className="w-full" />
        </label>
        <label className="text-sm text-blue-100">
          Sleep hours: {form.sleep_hours}
          <input type="range" min="0" max="12" step="0.5" value={form.sleep_hours} onChange={e=>update('sleep_hours', Number(e.target.value))} className="w-full" />
        </label>
        <label className="text-sm text-blue-100">
          Steps: {form.steps}
          <input type="range" min="0" max="15000" step="100" value={form.steps} onChange={e=>update('steps', Number(e.target.value))} className="w-full" />
        </label>
        <label className="text-sm text-blue-100">
          Mood score: {form.mood_score.toFixed(2)}
          <input type="range" min="0" max="1" step="0.05" value={form.mood_score} onChange={e=>update('mood_score', Number(e.target.value))} className="w-full" />
        </label>
        <label className="text-sm text-blue-100">
          Hour: {form.hour}
          <input type="range" min="0" max="23" value={form.hour} onChange={e=>update('hour', Number(e.target.value))} className="w-full" />
        </label>
        <label className="text-sm text-blue-100">
          PSS-10 score (optional): {form.pss10_score ?? '—'}
          <input type="number" min="0" max="40" value={form.pss10_score ?? ''} onChange={e=>update('pss10_score', e.target.value === '' ? undefined : Number(e.target.value))} className="w-full bg-slate-900/50 border border-slate-600 rounded px-2 py-1 text-white" />
        </label>
      </div>
      <button onClick={submit} disabled={loading} className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white">
        {loading ? 'Predicting…' : 'Predict'}
      </button>

      {result && (
        <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100">
          <div className="text-white">Predicted level: <span className="font-semibold">{result.predicted_level}</span></div>
          <div className="text-white">Risk band: <span className={`font-semibold ${result.risk_band==='high'?'text-red-300':result.risk_band==='moderate'?'text-yellow-200':'text-green-300'}`}>{result.risk_band}</span></div>
          {result.factors?.length>0 && <div className="text-sm mt-2">Factors: {result.factors.join(', ')}</div>}
        </div>
      )}
    </div>
  )
}
