import React from 'react'

const questions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
]

const scale = [
  { v: 0, label: 'Never' },
  { v: 1, label: 'Almost Never' },
  { v: 2, label: 'Sometimes' },
  { v: 3, label: 'Fairly Often' },
  { v: 4, label: 'Very Often' }
]

export default function PSS10({ onSubmit }) {
  const [answers, setAnswers] = React.useState(Array(10).fill(null))
  const [step, setStep] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)

  const handleAnswer = (val) => {
    const copy = [...answers]
    copy[step] = val
    setAnswers(copy)
  }

  const next = () => setStep(s => Math.min(9, s + 1))
  const prev = () => setStep(s => Math.max(0, s - 1))
  const canNext = answers[step] !== null

  const submit = async () => {
    if (answers.some(a => a === null)) return
    try {
      setSubmitting(true)
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/survey/pss10/score`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ answers })
      })
      const data = await res.json()
      onSubmit?.(data)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 bg-slate-800/60 border border-blue-500/20 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="text-blue-200">Question {step+1} of 10</div>
        <div className="text-blue-200/70 text-sm">PSS-10</div>
      </div>

      <div className="text-white text-lg mb-6">{questions[step]}</div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {scale.map(s => (
          <button key={s.v} onClick={() => handleAnswer(s.v)}
            className={`px-3 py-2 rounded-lg border text-sm transition ${answers[step]===s.v ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-900/60 text-blue-100 border-slate-600 hover:border-blue-400/50'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={step===0}
          className="px-4 py-2 rounded-lg bg-slate-700 text-blue-100 disabled:opacity-50">Back</button>
        {step < 9 ? (
          <button onClick={next} disabled={!canNext}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50">Next</button>
        ) : (
          <button onClick={submit} disabled={submitting}
            className="px-4 py-2 rounded-lg bg-green-500 text-white">Finish</button>
        )}
      </div>

      <div className="mt-4 h-2 bg-slate-700 rounded">
        <div className="h-full bg-blue-500 rounded" style={{ width: `${((step+1)/10)*100}%` }} />
      </div>
    </div>
  )
}
