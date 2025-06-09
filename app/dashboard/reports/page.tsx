"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ArrowLeft,
  FileText,
  PrinterIcon,
  BarChart2,
  User,
  Download,
  RefreshCw,
  Calendar
} from "lucide-react"
import axios from "axios"
import { format } from "date-fns"

// Simple loading skeleton component
const Skeleton = () => (
  <div className="space-y-3">
    <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
  </div>
)

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)
  const [dateRange, setDateRange] = useState("last30days")
  const [clientType, setClientType] = useState("all")
  const [error, setError] = useState("")

  const generateReport = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await axios.get(`/api/reports?range=${dateRange}&clientType=${clientType}`)
      setReportData(response.data)
    } catch (error) {
      console.error("Failed to generate report:", error)
      setError("Failed to generate report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateReport()
  }, [dateRange, clientType])

  return (
    <div className="container py-6">
      {/* Report Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Client Reports
          </h1>
          <p className="text-muted-foreground">Generate and view reports for your agency</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button onClick={generateReport}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Report Options */}
      <div className="mb-6 print:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Report Options</CardTitle>
            <CardDescription>Customize your report view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Client Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                >
                  <option value="all">All Clients</option>
                  <option value="b2c">B2C Clients</option>
                  <option value="b2b">B2B Clients</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Travel Agency Admin</h1>
          <h2 className="text-xl font-semibold mb-4">Client Report</h2>
          <p className="text-sm">Generated on {format(new Date(), "PPP 'at' p")}</p>
          <p className="text-sm">Report Period: {dateRange === "last7days" ? "Last 7 Days" : 
                              dateRange === "last30days" ? "Last 30 Days" :
                              dateRange === "thisMonth" ? "This Month" : "Last Month"}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-muted/50 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton />
            </CardHeader>
            <CardContent>
              <div className="h-72 bg-muted/50 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={generateReport}>Try Again</Button>
          </CardContent>
        </Card>
      ) : reportData && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Client Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{reportData.summary.totalClients}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold">{reportData.summary.activeClients}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">B2C / B2B Split</p>
                  <p className="text-2xl font-bold">{reportData.summary.b2cClients} / {reportData.summary.b2bClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Client Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                {Object.entries(reportData.statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex flex-col items-center p-4 border rounded-md">
                    <div className="h-16 flex items-end mb-2">
                      <div 
                        className="w-8 bg-primary rounded-t-md"
                        style={{ 
                          height: `${Math.max(20, (count as number / Math.max(...Object.values(reportData.statusDistribution) as number[])) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="font-bold text-lg">{count}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {status.replace(/-/g, " ")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">Total Payments Received</p>
                  <p className="text-3xl font-bold">BDT {reportData.financial.totalPaid.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">Total Due Amount</p>
                  <p className="text-3xl font-bold text-amber-600">BDT {reportData.financial.totalDue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Client List */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Client List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Name</th>
                      <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Passport</th>
                      <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Type</th>
                      <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Status</th>
                      <th className="py-3 px-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Total Paid</th>
                      <th className="py-3 px-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.clients.map((client: any) => (
                      <tr key={client.id} className="hover:bg-muted/30">
                        <td className="py-3 px-2 whitespace-nowrap">{client.name}</td>
                        <td className="py-3 px-2 whitespace-nowrap font-mono text-sm">{client.passport}</td>
                        <td className="py-3 px-2 whitespace-nowrap">{client.type}</td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-2 
                              ${client.status === 'COMPLETED' ? 'bg-green-500' : 
                                client.status === 'FLIGHT' ? 'bg-blue-500' :
                                client.status === 'STAMPING' ? 'bg-amber-500' : 'bg-gray-500'
                              }`}>
                            </div>
                            <span className="capitalize">{client.status?.replace(/_/g, " ").toLowerCase() || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap text-right font-medium">BDT {client.totalPaid.toLocaleString()}</td>
                        <td className="py-3 px-2 whitespace-nowrap text-right font-medium">
                          <span className={client.totalDue > 0 ? "text-amber-600" : "text-green-600"}>
                            BDT {client.totalDue.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/30">
                    <tr>
                      <td colSpan={4} className="py-3 px-2 text-right font-medium">Totals:</td>
                      <td className="py-3 px-2 text-right font-medium">
                        BDT {reportData.financial.totalPaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-amber-600">
                        BDT {reportData.financial.totalDue.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer with pagination and print info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Travel Agency Admin — Business Intelligence Report</p>
        <p className="mt-1">Page 1 of 1</p>
      </div>
    </div>
  )
} 