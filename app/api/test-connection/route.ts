import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import clientPromise from '@/lib/mongodb-client'
import User from '@/lib/models/User'

export async function GET() {
  const results = {
    mongoose: { status: 'failed', error: null, userCount: 0 },
    mongoClient: { status: 'failed', error: null, collections: [] }
  }

  // Test Mongoose connection
  try {
    console.log('Testing Mongoose connection...')
    await connectDB()
    const userCount = await User.countDocuments()
    results.mongoose = { status: 'success', error: null, userCount }
    console.log('✅ Mongoose connection successful')
  } catch (error: any) {
    console.error('❌ Mongoose connection failed:', error.message)
    results.mongoose.error = error.message
  }

  // Test MongoDB Client connection (for NextAuth)
  try {
    console.log('Testing MongoDB Client connection...')
    const client = await clientPromise
    const db = client.db()
    const collections = await db.listCollections().toArray()
    results.mongoClient = { 
      status: 'success', 
      error: null, 
      collections: collections.map(c => c.name) 
    }
    console.log('✅ MongoDB Client connection successful')
  } catch (error: any) {
    console.error('❌ MongoDB Client connection failed:', error.message)
    results.mongoClient.error = error.message
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results
  })
}