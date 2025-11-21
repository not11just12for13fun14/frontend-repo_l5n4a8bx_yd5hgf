import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function WorkoutCard({ item }) {
  const dt = item.performed_at ? new Date(item.performed_at) : null
  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-white font-semibold">{item.title || 'Тренировка'}</div>
        <div className="text-blue-200/70 text-sm">{dt ? dt.toLocaleString() : ''}</div>
      </div>
      <div className="space-y-2">
        {item.exercises?.map((ex, i) => (
          <div key={i} className="text-blue-100/90">
            <div className="font-medium">{ex.exercise_name || 'Упражнение'}</div>
            <div className="text-sm opacity-80">
              {ex.sets?.map((s, idx) => `${idx + 1}) ${s.reps} x ${s.weight}кг`).join('  •  ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function History() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.listWorkouts(100)
      setItems(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="text-blue-200">Загрузка...</div>

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-blue-200/80">Пока нет записей</div>
      ) : (
        items.map(it => <WorkoutCard key={it.id} item={it} />)
      )}
    </div>
  )
}
