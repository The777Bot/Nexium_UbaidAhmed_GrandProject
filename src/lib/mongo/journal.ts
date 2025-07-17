// lib/mongo/journal.ts
import { connectToDatabase } from './mongoClient'

export async function createJournalEntry(userId: string, content: string) {
  const { db } = await connectToDatabase()
  const result = await db.collection('journalEntries').insertOne({
    userId,
    content,
    createdAt: new Date(),
  })
  return result
}

export async function fetchJournalEntries(userId: string) {
  const { db } = await connectToDatabase()
  const entries = await db
    .collection('journalEntries')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  return entries
}
