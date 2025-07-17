// app/journal/page.tsx

'use client'

import { useState } from 'react'

export default function JournalPage() {
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userId = 'your_supabase_user_id_here' // replace this with actual user ID (you’ll later get it from Supabase session)

    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content }),
    })

    const data = await res.json()
    if (data.success) {
      setMessage('Journal saved!')
      setContent('')
    } else {
      setMessage('Error saving journal.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Journal Entry</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows={6}
          placeholder="Write your thoughts here..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  )
}
