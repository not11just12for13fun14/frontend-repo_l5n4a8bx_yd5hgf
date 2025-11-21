import { useState } from 'react'

function Header({ currentTab, onChange }) {
  const tabs = [
    { id: 'workout', label: 'Тренировка' },
    { id: 'history', label: 'История' },
    { id: 'exercises', label: 'Упражнения' },
  ]

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Трекер тренировок</h1>
        <p className="text-blue-200/80 text-sm">Добавляйте подходы и веса, ведите историю</p>
      </div>
      <div className="flex gap-2 bg-slate-800/60 p-1 rounded-xl border border-blue-500/20">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === t.id
                ? 'bg-blue-500 text-white'
                : 'text-blue-200 hover:bg-slate-700/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Header
