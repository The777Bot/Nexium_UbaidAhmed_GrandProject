// app/api/journal/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { clientPromise } from '@/lib/mongo/mongoClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, content } = body

    if (!userId || !content) {
      return NextResponse.json({ error: 'Missing userId or content' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('mindmonitor')
    const collection = db.collection('journals')

    const result = await collection.insertOne({
      userId,
      content,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('POST /api/journal error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('mindmonitor')
    const collection = db.collection('journals')

    const entries = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('GET /api/journal error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
