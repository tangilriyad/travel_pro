import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// POST - Restore an archived B2C client
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get company ID from header (set by middleware for company role)
    const companyId = request.headers.get('x-company-id')
    
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const b2cClients = db.collection("b2c_clients")

    // Build query with company filtering
    const query: any = { 
      _id: new ObjectId(id),
      isArchived: true // Ensure we're only restoring archived clients
    }
    
    // Filter by company ID if present (for company role)
    if (companyId) {
      query.companyId = companyId
    }

    // Check if client exists
    const existingClient = await b2cClients.findOne(query);
    if (!existingClient) {
      return NextResponse.json({ error: "Archived client not found or access denied" }, { status: 404 });
    }

    // Update to remove archived status
    const result = await b2cClients.updateOne(query, { 
      $set: { 
        isArchived: false,
        updatedAt: new Date()
      },
      $unset: { 
        archivedAt: "",
        archivedReason: "",
        hadTransactions: ""
      } 
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Archived client not found or access denied" }, { status: 404 })
    }

    return NextResponse.json({ 
      message: "Client restored successfully" 
    })
  } catch (error) {
    console.error("Error restoring B2C client:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 