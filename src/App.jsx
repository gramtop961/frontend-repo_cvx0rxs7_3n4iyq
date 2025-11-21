import React from 'react'
import PSS10 from './components/PSS10'
import QuickPredictor from './components/QuickPredictor'

function App() {
  const [pss, setPss] = React.useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_45%)]"></div>

      <header className="relative z-10 px-6 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">ClamSense</h1>
        <p className="text-blue-200 mt-2">Real-time stress insights and relief, powered by AI.</p>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-20 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-white font-semibold mb-3">PSS-10 Onboarding</h2>
          <PSS10 onSubmit={(data) => setPss(data)} />
          {pss && (
            <div className="mt-4 p-4 rounded-xl bg-slate-800/60 border border-blue-500/20 text-blue-100">
              <div>Your baseline score is <span className="text-white font-semibold">{pss.score}</span> ({pss.band}).</div>
              <div className="text-sm mt-1">{pss.explanation}</div>
            </div>
          )}
        </section>
        <section>
          <h2 className="text-white font-semibold mb-3">Try a Quick Prediction</h2>
          <QuickPredictor />
        </section>
      </main>

      <footer className="relative z-10 text-center text-blue-300/60 pb-8">
        <div className="text-xs">Disclaimer: ClamSense is a wellness tool, not a medical device.</div>
        <a href="/test" className="inline-block mt-2 text-blue-300 underline">Backend status</a>
      </footer>
    </div>
  )
}

export default App
