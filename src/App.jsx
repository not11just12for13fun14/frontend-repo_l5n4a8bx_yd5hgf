import { useEffect, useState } from 'react'
import Header from './components/Header'
import WorkoutBuilder from './components/WorkoutBuilder'
import History from './components/History'
import Exercises from './components/Exercises'
import { api } from './lib/api'

function App() {
  const [tab, setTab] = useState('workout')
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.getRoot().then(d => setStatus(d.message)).catch(() => setStatus(''))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto relative">
        <Header currentTab={tab} onChange={setTab} />

        <div className="bg-slate-800/40 border border-blue-500/20 rounded-2xl p-6">
          {tab === 'workout' && <WorkoutBuilder onSaved={() => setTab('history')} />}
          {tab === 'history' && <History />}
          {tab === 'exercises' && <Exercises />}
        </div>

        <div className="mt-6 text-center text-blue-300/60 text-sm">
          {status}
        </div>
      </div>
    </div>
  )
}

export default App
