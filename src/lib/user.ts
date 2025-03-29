import clientPromise from "@/lib/dbConfig"
import { hash } from "bcryptjs"
import { ObjectId } from "mongodb"

export async function getUserByEmail(email: string) {
  const client = await clientPromise
  const db = client.db()

  return db.collection("users").findOne({ email })
}

export async function getUserById(id: string) {
  const client = await clientPromise
  const db = client.db()

  return db.collection("users").findOne({ _id: new ObjectId(id) })
}

export async function createUser(userData: { name: string; email: string; password: string }) {
  const client = await clientPromise
  const db = client.db()

  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await hash(userData.password, 10)

  // Create user
  const result = await db.collection("users").insertOne({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date(),
  })

  return result
}

