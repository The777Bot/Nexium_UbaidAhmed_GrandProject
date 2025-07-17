// lib/mongo/mongoClient.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db('mindmonitor')
  return { client, db }
}
