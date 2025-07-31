// lib/mongo/mongoClient.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!
const options = {}

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

const client = new MongoClient(uri, options)
const clientPromise: Promise<MongoClient> = global._mongoClientPromise || client.connect()

if (!global._mongoClientPromise) {
  global._mongoClientPromise = clientPromise
}

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db('mindmonitor')
  return { client, db }
}
