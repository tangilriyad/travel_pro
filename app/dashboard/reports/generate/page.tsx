"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  CalendarIcon,
  FileText,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Filter,
  PieChart,
  BarChart2,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const reportFormSchema = z.object({
  reportType: z.enum(["clients", "transactions", "financial", "summary"]),
  dateRange: z.enum(["last7days", "last30days", "thisMonth", "lastMonth", "custom"]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  clientType: z.enum(["all", "b2c", "b2b"]),
  b2cTypes: z.array(z.string()).optional(),
  statuses: z.array(z.string()).optional(),
  includeArchived: z.boolean().default(false),
  includeTransactionDetails: z.boolean().default(true),
  graphType: z.enum(["bar", "pie", "line", "none"]).default("bar"),
  outputFormat: z.enum(["pdf", "excel", "online"]).default("pdf"),
})

type ReportFormValues = z.infer<typeof reportFormSchema>

const clientStatuses = [
  { value: "file-ready", label: "File Ready" },
  { value: "medical", label: "Medical" },
  { value: "mofa", label: "MOFA" },
  { value: "visa-stamping", label: "Visa Stamping" },
  { value: "manpower", label: "Manpower" },
  { value: "flight-ticket", label: "Flight/Ticket" },
  { value: "completed", label: "Completed" },
]

export default function GenerateReportPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reportType: "clients",
      dateRange: "last30days",
      clientType: "all",
      b2cTypes: ["saudi-kuwait", "other-countries", "omra-visa"],
      statuses: ["file-ready", "medical", "mofa", "visa-stamping", "manpower", "flight-ticket", "completed"],
      includeArchived: false,
      includeTransactionDetails: true,
      graphType: "bar",
      outputFormat: "pdf",
    },
  })
  
  const reportType = form.watch("reportType")
  const dateRange = form.watch("dateRange")
  const clientType = form.watch("clientType")
  
  const generateReport = async (values: ReportFormValues) => {
    setIsGenerating(true)
    try {
      // In a real implementation, we'd call an API to generate the report
      console.log("Generating report with values:", values)
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to the report view page
      router.push(`/dashboard/reports/view?${new URLSearchParams({
        type: values.reportType,
        format: values.outputFormat
      }).toString()}`)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Report</h1>
          <p className="text-muted-foreground">Create custom reports for your business insights</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/clients">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(generateReport)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Report Type & Date Range */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Report Configuration</CardTitle>
                <CardDescription>Select the type of report and date range</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Report Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clients" id="clients" />
                            <Label htmlFor="clients" className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-primary" />
                              Client Report
                            </Label>
                          </div>
                          <FormDescription className="ml-6 text-xs">
                            Overview of clients, their statuses, and distribution
                          </FormDescription>
                          
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="transactions" id="transactions" />
                            <Label htmlFor="transactions" className="flex items-center">
                              <BarChart2 className="mr-2 h-4 w-4 text-indigo-600" />
                              Transaction Report
                            </Label>
                          </div>
                          <FormDescription className="ml-6 text-xs">
                            Summary of all financial transactions in the selected period
                          </FormDescription>
                          
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="financial" id="financial" />
                            <Label htmlFor="financial" className="flex items-center">
                              <PieChart className="mr-2 h-4 w-4 text-green-600" />
                              Financial Overview
                            </Label>
                          </div>
                          <FormDescription className="ml-6 text-xs">
                            Comprehensive financial analysis with revenue and due amounts
                          </FormDescription>
                          
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="summary" id="summary" />
                            <Label htmlFor="summary" className="flex items-center">
                              <Filter className="mr-2 h-4 w-4 text-amber-600" />
                              Business Summary
                            </Label>
                          </div>
                          <FormDescription className="ml-6 text-xs">
                            Complete business overview with all key metrics
                          </FormDescription>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Date Range</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="last7days" id="last7days" />
                            <Label htmlFor="last7days">Last 7 days</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="last30days" id="last30days" />
                            <Label htmlFor="last30days">Last 30 days</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="thisMonth" id="thisMonth" />
                            <Label htmlFor="thisMonth">This Month</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="lastMonth" id="lastMonth" />
                            <Label htmlFor="lastMonth">Last Month</Label>
                          </div>
                          <div className="flex items-center space-x-2 col-span-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom">Custom Date Range</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Card 2: Output Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Output Options</CardTitle>
                <CardDescription>Choose how your report will be displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="outputFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select output format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="online">Online Report</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="graphType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visualization Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select graph type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="none">No Charts</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includeTransactionDetails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md border">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Transaction Details</FormLabel>
                        <FormDescription>
                          Show individual transaction records in the report
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {reportType === "clients" && (
                  <FormField
                    control={form.control}
                    name="includeArchived"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include Archived Clients</FormLabel>
                          <FormDescription>
                            Include data from archived clients
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
            
            {/* Card 3: Client Data Filters */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Data Filters</CardTitle>
                <CardDescription>Customize which data appears in your report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="clientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            <SelectItem value="b2c">B2C Clients Only</SelectItem>
                            <SelectItem value="b2b">B2B Clients Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {(clientType === "all" || clientType === "b2c") && (
                    <FormField
                      control={form.control}
                      name="b2cTypes"
                      render={() => (
                        <FormItem>
                          <FormLabel>B2C Client Categories</FormLabel>
                          <div className="space-y-2 pt-1">
                            <FormField
                              control={form.control}
                              name="b2cTypes"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("saudi-kuwait")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked 
                                          ? [...field.value || [], "saudi-kuwait"]
                                          : field.value?.filter(val => val !== "saudi-kuwait") || [];
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    Saudi & Kuwait
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="b2cTypes"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("other-countries")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked 
                                          ? [...field.value || [], "other-countries"]
                                          : field.value?.filter(val => val !== "other-countries") || [];
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    Other Countries
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="b2cTypes"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("omra-visa")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked 
                                          ? [...field.value || [], "omra-visa"]
                                          : field.value?.filter(val => val !== "omra-visa") || [];
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    Omra Visa (Saudi)
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {(clientType === "all" || clientType === "b2c") && (
                    <FormField
                      control={form.control}
                      name="statuses"
                      render={() => (
                        <FormItem>
                          <div className="mb-2">
                            <FormLabel>Client Statuses</FormLabel>
                            <FormDescription>
                              Select which client statuses to include
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {clientStatuses.map(status => (
                              <FormField
                                key={status.value}
                                control={form.control}
                                name="statuses"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(status.value)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked 
                                            ? [...field.value || [], status.value]
                                            : field.value?.filter(val => val !== status.value) || [];
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {status.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-5">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/clients">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isGenerating} className="min-w-[150px]">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Report
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  )
} 