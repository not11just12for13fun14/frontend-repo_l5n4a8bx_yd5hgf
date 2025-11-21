import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

function SetRow({ idx, value, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      <div className="col-span-2 text-blue-200/80 text-sm">#{idx + 1}</div>
      <input
        type="number"
        min="1"
        className="col-span-5 bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        value={value.reps}
        onChange={e => onChange({ ...value, reps: Number(e.target.value) })}
        placeholder="Повторения"
      />
      <input
        type="number"
        min="0"
        step="0.5"
        className="col-span-5 bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        value={value.weight}
        onChange={e => onChange({ ...value, weight: Number(e.target.value) })}
        placeholder="Вес, кг"
      />
      <button onClick={onRemove} className="col-span-12 sm:col-span-2 mt-2 sm:mt-0 bg-red-500/80 hover:bg-red-500 text-white rounded-lg px-3 py-2 text-sm">Удалить</button>
    </div>
  )
}

function ExerciseBlock({ data, onChange, onRemove }) {
  const update = (patch) => onChange({ ...data, ...patch })

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          className="flex-1 bg-slate-900/50 border border-blue-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Название упражнения"
          value={data.exercise_name || ''}
          onChange={e => update({ exercise_name: e.target.value })}
        />
        <button onClick={onRemove} className="bg-red-500/80 hover:bg-red-500 text-white rounded-lg px-3 py-2 text-sm">Удалить</button>
      </div>

      <div className="space-y-2">
        {data.sets.map((s, i) => (
          <SetRow
            key={i}
            idx={i}
            value={s}
            onChange={v => {
              const copy = [...data.sets]
              copy[i] = v
              update({ sets: copy })
            }}
            onRemove={() => update({ sets: data.sets.filter((_, idx) => idx !== i) })}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => update({ sets: [...data.sets, { reps: 10, weight: 0 }] })}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 text-sm"
        >
          + Подход
        </button>
      </div>
    </div>
  )
}

export default function WorkoutBuilder({ onSaved }) {
  const [exercises, setExercises] = useState([{ exercise_name: '', sets: [] }])
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const isValid = useMemo(() => exercises.some(e => e.exercise_name && e.sets.length > 0), [exercises])

  const addExercise = () => setExercises(prev => [...prev, { exercise_name: '', sets: [] }])
  const updateExercise = (idx, patch) => setExercises(prev => prev.map((it, i) => (i === idx ? patch : it)))
  const removeExercise = (idx) => setExercises(prev => prev.filter((_, i) => i !== idx))

  const saveWorkout = async () => {
    if (!isValid) return
    setLoading(true)
    try {
      const payload = {
        title: title || undefined,
        notes: notes || undefined,
        exercises: exercises.map(e => ({ exercise_name: e.exercise_name, sets: e.sets })),
      }
      await api.createWorkout(payload)
      setExercises([{ exercise_name: '', sets: [] }])
      setTitle('')
      setNotes('')
      onSaved?.()
    } catch (e) {
      alert(`Ошибка сохранения: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="bg-slate-900/50 border border-blue-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Название тренировки (опционально)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="bg-slate-900/50 border border-blue-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Заметки (опционально)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {exercises.map((ex, idx) => (
          <ExerciseBlock
            key={idx}
            data={ex}
            onChange={v => updateExercise(idx, v)}
            onRemove={() => removeExercise(idx)}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={addExercise} className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-2">
          + Упражнение
        </button>
        <button
          onClick={saveWorkout}
          disabled={!isValid || loading}
          className={`px-4 py-2 rounded-lg text-white ${
            !isValid || loading ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          Сохранить тренировку
        </button>
      </div>
    </div>
  )
}
