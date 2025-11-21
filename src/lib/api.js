const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  baseUrl: BASE_URL,
  getRoot: () => request('/'),
  // Exercises
  listExercises: () => request('/api/exercises'),
  createExercise: (payload) => request('/api/exercises', { method: 'POST', body: JSON.stringify(payload) }),

  // Workouts
  createWorkout: (payload) => request('/api/workouts', { method: 'POST', body: JSON.stringify(payload) }),
  listWorkouts: (limit = 50) => request(`/api/workouts?limit=${limit}`),
}
