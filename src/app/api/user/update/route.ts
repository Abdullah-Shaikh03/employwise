import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/dbConfig"
import { ObjectId } from "mongodb"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    await db.collection("users").updateOne({ _id: new ObjectId(session.user.id) }, { $set: { name } })

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Profile update error:", error)

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

