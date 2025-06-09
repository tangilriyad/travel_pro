import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import clientPromise from "@/lib/mongodb"

// GET - Fetch all clients (both B2B and B2C)
export async function GET(request: NextRequest) {
  try {
    // Get the session to verify the user
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const category = searchParams.get("category") || ""

    const client = await clientPromise
    const db = client.db("manage_agency")
    const b2bClients = db.collection("b2b_clients")
    const b2cClients = db.collection("b2c_clients")

    // Get company ID from headers (set by middleware) or from session for company users
    let companyId: ObjectId | null = null;
    
    // For company users, get their company ID
    if (session.user?.role === "company" && session.user?.companyId) {
      try {
        companyId = new ObjectId(session.user.companyId);
      } catch (error) {
        console.error("Invalid company ID:", error);
        return NextResponse.json({ error: "Invalid company ID" }, { status: 400 });
      }
    } 
    // For admin users, check if they're requesting a specific company's data
    else if (session.user?.role === "admin") {
      const requestedCompanyId = searchParams.get("companyId");
      if (requestedCompanyId) {
        try {
          companyId = new ObjectId(requestedCompanyId);
        } catch (error) {
          console.error("Invalid requested company ID:", error);
          return NextResponse.json({ error: "Invalid company ID parameter" }, { status: 400 });
        }
      }
      // If no companyId is specified, admin can see all clients (no filter)
    } 
    else {
      // Regular users shouldn't access this endpoint
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build filter queries
    const b2cFilter: any = {}
    const b2bFilter: any = {}

    // Apply company filter for tenant isolation if not an admin viewing all
    if (companyId) {
      b2cFilter.companyId = companyId;
      b2bFilter.companyId = companyId;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" }
      b2cFilter.$or = [{ name: searchRegex }, { passportNumber: searchRegex }, { email: searchRegex }]
      b2bFilter.$or = [{ name: searchRegex }, { businessType: searchRegex }, { email: searchRegex }]
    }

    if (status && status !== "all") {
      b2cFilter.status = status
      b2bFilter.status = status
    }

    const allClients = []

    // Fetch B2C clients if category allows
    if (category === "all" || category === "B2C") {
      const b2cClientsList = await b2cClients.find(b2cFilter).toArray()
      allClients.push(...b2cClientsList.map(client => ({...client, type: "B2C"})))
    }

    // Fetch B2B clients if category allows
    if (category === "all" || category === "B2B") {
      const b2bClientsList = await b2bClients.find(b2bFilter).toArray()
      allClients.push(...b2bClientsList.map(client => ({...client, type: "B2B"})))
    }

    // Sort by creation date (newest first)
    allClients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply pagination
    const total = allClients.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClients = allClients.slice(startIndex, endIndex)

    return NextResponse.json({
      clients: paginatedClients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
