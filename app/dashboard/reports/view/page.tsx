"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { format as dateFormat } from "date-fns"
import {
  ArrowLeft,
  Download,
  FileText,
  Filter,
  BarChart2,
  PieChart,
  ChevronDown,
  Table,
  User,
  RefreshCw,
  PrinterIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for the report
const mockClients = [
  {
    id: "c1",
    name: "Ahmed Hossain",
    passport: "BX0123456",
    phone: "01712345678",
    type: "saudi-kuwait",
    status: "medical",
    created: "2023-12-15",
    totalPaid: 95000,
    totalDue: 15000,
  },
  {
    id: "c2",
    name: "Mariam Khatun",
    passport: "BX9876543",
    phone: "01812345678", 
    type: "other-countries",
    status: "visa-stamping",
    created: "2023-11-10",
    totalPaid: 120000,
    totalDue: 30000,
  },
  {
    id: "c3",
    name: "Rahman Ali",
    passport: "BX5432109",
    phone: "01912345678",
    type: "saudi-kuwait",
    status: "mofa",
    created: "2024-01-05",
    totalPaid: 80000,
    totalDue: 70000,
  },
  {
    id: "c4",
    name: "Fatima Begum", 
    passport: "BX6540123",
    phone: "01612345678",
    type: "omra-visa",
    status: "completed",
    created: "2023-10-20",
    totalPaid: 150000,
    totalDue: 0,
  },
  {
    id: "c5",
    name: "Karim Uddin",
    passport: "BX7896541",
    phone: "01512345678",
    type: "saudi-kuwait",
    status: "flight-ticket",
    created: "2024-02-01",
    totalPaid: 110000,
    totalDue: 40000,
  },
]

const statusCount = {
  "file-ready": 12,
  "medical": 24,
  "mofa": 18,
  "visa-stamping": 31,
  "manpower": 15,
  "flight-ticket": 9,
  "completed": 43,
}

const mockFinancialData = {
  totalRevenue: 3250000,
  totalDue: 850000,
  lastMonth: {
    revenue: 980000,
    due: 320000,
  },
  thisMonth: {
    revenue: 850000,
    due: 270000,
  },
  b2c: {
    revenue: 2350000,
    due: 650000,
  },
  b2b: {
    revenue: 900000,
    due: 200000,
  },
}

export default function ReportViewPage() {
  const searchParams = useSearchParams()
  const reportType = searchParams.get("type") || "clients"
  const reportFormat = searchParams.get("format") || "pdf"
  
  const [currentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium mt-4">Preparing your report...</p>
      </div>
    )
  }
  
  return (
    <div className="container py-6">
      {/* Report Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            {reportType === "clients" && <FileText className="mr-2 h-6 w-6" />}
            {reportType === "transactions" && <BarChart2 className="mr-2 h-6 w-6" />}
            {reportType === "financial" && <PieChart className="mr-2 h-6 w-6" />}
            {reportType === "summary" && <Filter className="mr-2 h-6 w-6" />}
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </h1>
          <p className="text-muted-foreground">Generated on {dateFormat(currentDate, "PPP 'at' p")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/reports/generate">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Report Generator
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Report
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.print()}>
                <PrinterIcon className="mr-2 h-4 w-4" />
                Print Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Table className="mr-2 h-4 w-4" />
                Export to Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Travel Agency Admin</h1>
          <h2 className="text-xl font-semibold mb-4">
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </h2>
          <p className="text-sm">Generated on {dateFormat(currentDate, "PPP 'at' p")}</p>
          <p className="text-sm">Report Period: Last 30 Days</p>
        </div>
      </div>
      
      {/* Report Summary */}
      <Card className="mb-8">
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="text-lg">Report Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportType === "clients" && (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{mockClients.length + statusCount.completed}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold">
                    {Object.values(statusCount).reduce((a, b) => a + b, 0) - statusCount.completed}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completed Cases</p>
                  <p className="text-2xl font-bold">{statusCount.completed}</p>
                </div>
              </>
            )}
            
            {reportType === "financial" && (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">BDT {mockFinancialData.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Due Amount</p>
                  <p className="text-2xl font-bold text-amber-600">BDT {mockFinancialData.totalDue.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Month Revenue</p>
                  <p className="text-2xl font-bold text-green-600">BDT {mockFinancialData.thisMonth.revenue.toLocaleString()}</p>
                </div>
              </>
            )}
            
            {reportType === "transactions" && (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-2xl font-bold">62</p>
                </div>
              </>
            )}
            
            {reportType === "summary" && (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Business Health</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-2xl font-bold">Excellent</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-2xl font-bold text-green-600">+24%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Clients this Month</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Report Content */}
      {reportType === "clients" && (
        <>
          {/* Status Distribution */}
          <Card className="mb-8">
            <CardHeader className="bg-muted/50">
              <CardTitle>Client Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                {Object.entries(statusCount).map(([status, count]) => (
                  <div key={status} className="flex flex-col items-center p-4 border rounded-md">
                    <div className="h-16 flex items-end mb-2">
                      <div 
                        className="w-8 bg-primary rounded-t-md"
                        style={{ 
                          height: `${Math.max(20, (count / Math.max(...Object.values(statusCount))) * 100)}%` 
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
          
          {/* Client List */}
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle>
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Client List
                </div>
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
                      <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Created</th>
                      <th className="py-3 px-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Total Paid</th>
                      <th className="py-3 px-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockClients.map((client) => (
                      <tr key={client.id} className="hover:bg-muted/30">
                        <td className="py-3 px-2 whitespace-nowrap">{client.name}</td>
                        <td className="py-3 px-2 whitespace-nowrap font-mono text-sm">{client.passport}</td>
                        <td className="py-3 px-2 whitespace-nowrap capitalize">{client.type.replace(/-/g, " ")}</td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-2 
                              ${client.status === 'completed' ? 'bg-green-500' : 
                                client.status === 'flight-ticket' ? 'bg-blue-500' :
                                client.status === 'visa-stamping' ? 'bg-amber-500' : 'bg-gray-500'
                              }`}>
                            </div>
                            <span className="capitalize">{client.status.replace(/-/g, " ")}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap">{dateFormat(new Date(client.created), "MMM d, yyyy")}</td>
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
                      <td colSpan={5} className="py-3 px-2 text-right font-medium">Totals:</td>
                      <td className="py-3 px-2 text-right font-medium">
                        BDT {mockClients.reduce((sum, client) => sum + client.totalPaid, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-amber-600">
                        BDT {mockClients.reduce((sum, client) => sum + client.totalDue, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {reportType === "financial" && (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="due">Due Amounts</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle>Revenue by Client Type</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    {/* Simple pie chart visualization */}
                    <div className="relative w-48 h-48">
                      <div className="rounded-full overflow-hidden w-48 h-48">
                        <div 
                          className="absolute bg-primary h-48" 
                          style={{ 
                            width: '48px', 
                            transform: 'rotate(0deg)',
                            transformOrigin: 'bottom right',
                            bottom: '24px',
                            right: '24px',
                          }}
                        ></div>
                        <div 
                          className="absolute bg-primary-foreground h-48" 
                          style={{ 
                            width: '48px', 
                            transform: 'rotate(72deg)',
                            transformOrigin: 'bottom right',
                            bottom: '24px',
                            right: '24px',
                          }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-36 h-36 bg-background rounded-full flex items-center justify-center">
                          <span className="font-bold">BDT {mockFinancialData.totalRevenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary mr-2"></div>
                      <div>
                        <p className="text-sm font-medium">B2C Clients</p>
                        <p className="text-xs text-muted-foreground">
                          BDT {mockFinancialData.b2c.revenue.toLocaleString()} 
                          ({Math.round((mockFinancialData.b2c.revenue / mockFinancialData.totalRevenue) * 100)}%)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary-foreground mr-2"></div>
                      <div>
                        <p className="text-sm font-medium">B2B Clients</p>
                        <p className="text-xs text-muted-foreground">
                          BDT {mockFinancialData.b2b.revenue.toLocaleString()}
                          ({Math.round((mockFinancialData.b2b.revenue / mockFinancialData.totalRevenue) * 100)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle>Monthly Comparison</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-end justify-center h-48 gap-16 py-8">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-24 bg-primary rounded-t-md"
                        style={{ height: `${(mockFinancialData.lastMonth.revenue / Math.max(mockFinancialData.lastMonth.revenue, mockFinancialData.thisMonth.revenue)) * 200}px` }}
                      ></div>
                      <p className="mt-2 font-medium">Last Month</p>
                      <p className="text-sm text-muted-foreground">BDT {mockFinancialData.lastMonth.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-24 bg-green-500 rounded-t-md"
                        style={{ height: `${(mockFinancialData.thisMonth.revenue / Math.max(mockFinancialData.lastMonth.revenue, mockFinancialData.thisMonth.revenue)) * 200}px` }}
                      ></div>
                      <p className="mt-2 font-medium">This Month</p>
                      <p className="text-sm text-muted-foreground">BDT {mockFinancialData.thisMonth.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Total Revenue</h3>
                    <p className="text-2xl font-bold">BDT {mockFinancialData.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Total Due</h3>
                    <p className="text-2xl font-bold text-amber-600">BDT {mockFinancialData.totalDue.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Collection Rate</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((mockFinancialData.totalRevenue / (mockFinancialData.totalRevenue + mockFinancialData.totalDue)) * 100)}%
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Monthly Growth</h3>
                    <p className="text-2xl font-bold">
                      {mockFinancialData.thisMonth.revenue > mockFinancialData.lastMonth.revenue ? (
                        <span className="text-green-600">
                          +{Math.round(((mockFinancialData.thisMonth.revenue - mockFinancialData.lastMonth.revenue) / mockFinancialData.lastMonth.revenue) * 100)}%
                        </span>
                      ) : (
                        <span className="text-red-600">
                          -{Math.round(((mockFinancialData.lastMonth.revenue - mockFinancialData.thisMonth.revenue) / mockFinancialData.lastMonth.revenue) * 100)}%
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="income">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle>Income Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Detailed income breakdown by client type and service</p>
                
                {/* Placeholder for income details that would be populated with real data */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Revenue by Client Type</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">B2C Clients</span>
                          <span className="text-green-600 font-bold">BDT {mockFinancialData.b2c.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(mockFinancialData.b2c.revenue / mockFinancialData.totalRevenue) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">B2B Clients</span>
                          <span className="text-green-600 font-bold">BDT {mockFinancialData.b2b.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(mockFinancialData.b2b.revenue / mockFinancialData.totalRevenue) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Revenue by Service Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Visa Processing</span>
                          <span className="text-green-600 font-bold">BDT 1,450,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Travel Packages</span>
                          <span className="text-green-600 font-bold">BDT 980,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Other Services</span>
                          <span className="text-green-600 font-bold">BDT 820,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="due">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle>Due Amount Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Analysis of outstanding amounts by client category</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Due by Client Type</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">B2C Clients</span>
                          <span className="text-amber-600 font-bold">BDT {mockFinancialData.b2c.due.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(mockFinancialData.b2c.due / mockFinancialData.totalDue) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">B2B Clients</span>
                          <span className="text-amber-600 font-bold">BDT {mockFinancialData.b2b.due.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(mockFinancialData.b2b.due / mockFinancialData.totalDue) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Outstanding Amount Aging</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Less than 30 days</p>
                        <p className="text-xl font-bold">BDT 320,000</p>
                        <p className="text-xs text-muted-foreground">38% of total</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">30-60 days</p>
                        <p className="text-xl font-bold">BDT 280,000</p>
                        <p className="text-xs text-muted-foreground">33% of total</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">60-90 days</p>
                        <p className="text-xl font-bold">BDT 170,000</p>
                        <p className="text-xs text-muted-foreground">20% of total</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Over 90 days</p>
                        <p className="text-xl font-bold text-red-600">BDT 80,000</p>
                        <p className="text-xs text-muted-foreground">9% of total</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Footer with pagination and print info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Travel Agency Admin — Business Intelligence Report</p>
        <p className="mt-1">Page 1 of 1</p>
      </div>
    </div>
  )
} 