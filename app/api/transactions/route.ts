import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch transactions for a specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const transactions = db.collection("transactions")

    // Build filter query
    const filter = { clientId }

    // Get total count for pagination
    const total = await transactions.countDocuments(filter)

    // Get transactions with pagination
    const transactionList = await transactions
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      transactions: transactionList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { clientId, clientName, date, receivedAmount, refundAmount, notes, transactionType } = data

    // Validate required fields
    if (!clientId || !clientName || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const transactions = db.collection("transactions")

    // Create transaction object
    const newTransaction = {
      clientId,
      clientName,
      date,
      receivedAmount: Number.parseFloat(receivedAmount) || 0,
      refundAmount: Number.parseFloat(refundAmount) || 0,
      notes: notes || "",
      transactionType: transactionType || "B2C",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await transactions.insertOne(newTransaction)

    // Update client's due amount based on transaction
    const b2cClients = db.collection("b2c_clients")
    const netAmount = newTransaction.receivedAmount - newTransaction.refundAmount

    await b2cClients.updateOne({ _id: new ObjectId(clientId) }, { $inc: { dueAmount: -netAmount } })

    return NextResponse.json({
      message: "Transaction created successfully",
      transactionId: result.insertedId,
      transaction: { ...newTransaction, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
