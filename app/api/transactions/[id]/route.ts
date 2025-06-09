import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single transaction
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const transactions = db.collection("transactions")

    const transaction = await transactions.findOne({ _id: new ObjectId(id) })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update transaction
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const transactions = db.collection("transactions")
    const b2cClients = db.collection("b2c_clients")

    // Get the old transaction to calculate the difference
    const oldTransaction = await transactions.findOne({ _id: new ObjectId(id) })

    if (!oldTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Calculate old and new net amounts
    const oldNetAmount = oldTransaction.receivedAmount - (oldTransaction.refundAmount || 0)
    const newNetAmount = (data.receivedAmount || oldTransaction.receivedAmount) - (data.refundAmount || 0)
    const amountDifference = newNetAmount - oldNetAmount

    // Update timestamp
    data.updatedAt = new Date()

    const result = await transactions.updateOne({ _id: new ObjectId(id) }, { $set: data })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Update client's due amount based on the difference
    if (amountDifference !== 0) {
      await b2cClients.updateOne(
        { _id: new ObjectId(oldTransaction.clientId) },
        { $inc: { dueAmount: -amountDifference } },
      )
    }

    return NextResponse.json({ message: "Transaction updated successfully" })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete transaction
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const transactions = db.collection("transactions")
    const b2cClients = db.collection("b2c_clients")

    // Get the transaction before deleting to reverse its effect
    const transaction = await transactions.findOne({ _id: new ObjectId(id) })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const result = await transactions.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Reverse the transaction's effect on client due amount
    const netAmount = transaction.receivedAmount - (transaction.refundAmount || 0)
    await b2cClients.updateOne({ _id: new ObjectId(transaction.clientId) }, { $inc: { dueAmount: netAmount } })

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
