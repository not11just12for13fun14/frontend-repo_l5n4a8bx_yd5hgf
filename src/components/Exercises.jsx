import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Exercises() {
  const [name, setName] = useState('')
  const [list, setList] = useState([])

  const load = async () => {
    try {
      const res = await api.listExercises()
      setList(res)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim()) return
    try {
      await api.createExercise({ name })
      setName('')
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 bg-slate-900/50 border border-blue-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Название упражнения"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={add} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4">Добавить</button>
      </div>
      <ul className="space-y-2">
        {list.map(it => (
          <li key={it.id} className="bg-slate-800/50 border border-blue-500/20 rounded-lg px-3 py-2 text-white">
            {it.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
