import mongoose from 'mongoose'

declare global {
  var mongoose: any // This must be a `var` and not a `let / const`
}

const MONGO_URL = process.env.MONGO_URL!

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    console.log('Creating new MongoDB connection...')
    cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error)
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB