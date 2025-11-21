import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function SetRow({ set, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-2">
      <div className="col-span-4">
        <input
          type="number"
          min={1}
          value={set.reps}
          onChange={e => onChange({ ...set, reps: Number(e.target.value) })}
          className="w-full bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white"
          placeholder="Повторы"
        />
      </div>
      <div className="col-span-6">
        <input
          type="number"
          min={0}
          step="0.5"
          value={set.weight}
          onChange={e => onChange({ ...set, weight: Number(e.target.value) })}
          className="w-full bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white"
          placeholder="Вес"
        />
      </div>
      <div className="col-span-2 text-right">
        <button onClick={onRemove} className="text-red-300 hover:text-red-200 text-sm">Удалить</button>
      </div>
    </div>
  )
}

function ExerciseBlock({ value, onChange, catalog }) {
  const [mode, setMode] = useState(value.exercise_name ? 'custom' : 'catalog')

  const handleAddSet = () => {
    onChange({ ...value, sets: [...value.sets, { reps: 10, weight: 0 }] })
  }

  const updateSet = (index, next) => {
    const sets = value.sets.slice()
    sets[index] = next
    onChange({ ...value, sets })
  }

  const removeSet = (index) => {
    const sets = value.sets.slice()
    sets.splice(index, 1)
    onChange({ ...value, sets })
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white"
        >
          <option value="catalog">Из каталога</option>
          <option value="custom">Свое</option>
        </select>

        {mode === 'catalog' ? (
          <select
            value={value.exercise_id || ''}
            onChange={e => onChange({ ...value, exercise_id: e.target.value, exercise_name: null })}
            className="flex-1 bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Выберите упражнение</option>
            {catalog.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        ) : (
          <input
            value={value.exercise_name || ''}
            onChange={e => onChange({ ...value, exercise_name: e.target.value, exercise_id: null })}
            placeholder="Название упражнения"
            className="flex-1 bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white"
          />
        )}

        <button onClick={handleAddSet} className="text-sm text-blue-300 hover:text-blue-200">+ Подход</button>
      </div>

      {value.sets.length === 0 && (
        <p className="text-blue-300/70 text-sm">Добавьте хотя бы один подход</p>
      )}

      {value.sets.map((s, idx) => (
        <SetRow
          key={idx}
          set={s}
          onChange={(next) => updateSet(idx, next)}
          onRemove={() => removeSet(idx)}
        />
      ))}
    </div>
  )
}

function WorkoutCreator({ onCreated }) {
  const [catalog, setCatalog] = useState([])
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addExercise = () => {
    setExercises(prev => [...prev, { exercise_id: null, exercise_name: '', sets: [] }])
  }

  const updateExercise = (index, next) => {
    const arr = exercises.slice()
    arr[index] = next
    setExercises(arr)
  }

  const removeExercise = (index) => {
    const arr = exercises.slice()
    arr.splice(index, 1)
    setExercises(arr)
  }

  const loadCatalog = async () => {
    try {
      const res = await fetch(`${API}/api/exercises`)
      const data = await res.json()
      setCatalog(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadCatalog()
  }, [])

  const saveWorkout = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        title: title || null,
        notes: notes || null,
        exercises,
      }
      const res = await fetch(`${API}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Не удалось сохранить тренировку')
      const data = await res.json()
      onCreated?.(data.id)
      setTitle('')
      setNotes('')
      setExercises([])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Название тренировки (опционально)"
            className="bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white"
          />
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Заметки"
            className="bg-slate-800/60 border border-blue-500/20 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      <div className="mb-4">
        <button onClick={addExercise} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Упражнение</button>
      </div>

      {exercises.length === 0 && (
        <p className="text-blue-300/70">Добавьте упражнение, затем подходы и вес для каждого подхода</p>
      )}

      {exercises.map((ex, idx) => (
        <div key={idx}>
          <ExerciseBlock value={ex} onChange={(n) => updateExercise(idx, n)} catalog={catalog} />
          <div className="text-right mb-6">
            <button onClick={() => removeExercise(idx)} className="text-red-300 hover:text-red-200 text-sm">Удалить упражнение</button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between mt-6">
        <div className="text-red-300 text-sm">{error}</div>
        <button
          onClick={saveWorkout}
          disabled={loading || exercises.length === 0}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
        >
          {loading ? 'Сохранение...' : 'Сохранить тренировку'}
        </button>
      </div>
    </div>
  )
}

export default WorkoutCreator
