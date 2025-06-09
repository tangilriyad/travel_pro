import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, photoURL } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const users = db.collection("users")

    // Check if user already exists
    let user = await users.findOne({ email })

    if (!user) {
      // Create a new user if they don't exist
      const newUser = {
        email,
        name,
        photoURL: photoURL || null,
        role: "company", // Default role is "company" for travel agency owners
        isVerified: true, // Google accounts are pre-verified
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await users.insertOne(newUser)
      user = {
        ...newUser,
        _id: result.insertedId,
      }
    } else if (!user.isVerified) {
      // If the user exists but isn't verified, mark them as verified
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            isVerified: true,
            updatedAt: new Date(),
          },
        },
      )
      user.isVerified = true
    }

    // Generate JWT token
    const token = generateToken(user._id.toString())

    // Create response with token in cookie
    const response = NextResponse.json({
      message: "Signed in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        photoURL: user.photoURL,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
