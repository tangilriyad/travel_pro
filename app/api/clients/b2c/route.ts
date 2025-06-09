import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET - Fetch all B2C clients
export async function GET(request: NextRequest) {
  try {
    // Get company ID from header (set by middleware for company role)
    const companyId = request.headers.get('x-company-id')
    
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const category = searchParams.get("category") || ""
    const associatedB2BId = searchParams.get("associatedB2BId") || ""
    const includeArchived = searchParams.get("includeArchived") === "true"

    const client = await clientPromise
    const db = client.db("manage_agency")
    const b2cClients = db.collection("b2c_clients")

    // Build filter query
    const filter: any = {}

    // Exclude archived clients by default
    if (!includeArchived) {
      filter.$or = [
        { isArchived: { $exists: false } }, 
        { isArchived: false }
      ]
    }

    // Add company ID filter if available (for company role)
    if (companyId) {
      filter.companyId = companyId
    }

    if (search) {
      const searchFilter = [
        { name: { $regex: search, $options: "i" } },
        { passportNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
      
      // If we already have $or, we need to use $and to combine with search
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          { $or: searchFilter }
        ];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (associatedB2BId && associatedB2BId !== "all") {
      filter.associatedB2BId = associatedB2BId
    }

    console.log("B2C filter query:", filter)

    // Get total count for pagination
    const total = await b2cClients.countDocuments(filter)

    // Get clients with pagination
    const clients = await b2cClients
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching B2C clients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new B2C client
export async function POST(request: NextRequest) {
  try {
    // Get company ID from header (set by middleware for company role)
    const companyId = request.headers.get('x-company-id')

    const data = await request.json()

    const {
      name,
      email,
      phone,
      address,
      passportNumber,
      destination,
      visaType,
      clientType,
      associatedB2BId,
      status,
      contractAmount,
      initialPayment,
      notes,
    } = data

    // Validate required fields
    if (!name || !email || !passportNumber || !destination || !clientType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("manage_agency")
    const b2cClients = db.collection("b2c_clients")

    // Check if passport number already exists
    const existingClient = await b2cClients.findOne({ passportNumber })
    if (existingClient) {
      return NextResponse.json({ error: "Client with this passport number already exists" }, { status: 400 })
    }

    // Calculate due amount
    const contractAmountNum = Number.parseFloat(contractAmount) || 0
    const initialPaymentNum = Number.parseFloat(initialPayment) || 0
    const dueAmount = contractAmountNum - initialPaymentNum

    // Create client object
    const newClient = {
      name,
      email,
      phone,
      address,
      passportNumber,
      destination,
      visaType,
      clientType,
      clientCategory: "B2C",
      associatedB2BId: associatedB2BId || null,
      status: status || "file-ready",
      contractAmount: contractAmountNum,
      dueAmount,
      notes: notes || "",
      // Add company ID to create proper association
      companyId: companyId || null,
      statusHistory: [
        {
          status: status || "file-ready",
          date: new Date().toISOString().split("T")[0],
          notes: "Initial client registration",
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await b2cClients.insertOne(newClient)

    return NextResponse.json({
      message: "B2C client created successfully",
      clientId: result.insertedId,
      client: { ...newClient, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating B2C client:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
