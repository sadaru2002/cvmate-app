import { MongoClient } from 'mongodb'

if (!process.env.MONGO_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"')
}

const uri = process.env.MONGO_URL

// More specific options for MongoDB Atlas
const options = {
  retryWrites: true,
  w: 'majority',
  authSource: 'admin', // Important for Atlas authentication
  ssl: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .then(client => {
        console.log('✅ NextAuth MongoDB Client connected')
        return client
      })
      .catch(error => {
        console.error('❌ NextAuth MongoDB Client failed:', error.message)
        throw error
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise