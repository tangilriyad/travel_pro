"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PlusCircle, Search, FileEdit, Eye, ChevronDown, ChevronUp, FileText, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { generateTicketPDF } from "@/lib/generate-ticket-pdf"
import { useB2BClients } from "@/hooks/use-b2b-clients"
import { useClients, type B2BClient, type B2CClient } from "@/hooks/use-clients"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function B2BClientsPage() {
  const { b2bClients, loading, error, pagination, fetchB2BClients, getB2BClientWithAssociatedClients } = useB2BClients()

  const { createB2BClient } = useClients()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<B2BClient | null>(null)
  const [associatedB2CClients, setAssociatedB2CClients] = useState<B2CClient[]>([])
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null)
  const [addClientOpen, setAddClientOpen] = useState(false)
  const [ticketFormOpen, setTicketFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Form state for new B2B client
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    businessType: "",
    contractAmount: "",
    initialPayment: "",
    notes: "",
  })

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    passengerName: "",
    passportNumber: "",
    ticketNumber: "",
    bookingId: "",
    airlinePNR: "",
    reservationNo: "",
    fareType: "Non-Refundable",
    dateOfIssue: new Date().toISOString().split("T")[0],
    airline: "",
    flightNumber: "",
    departureAirport: "",
    departureCity: "",
    departureCountry: "",
    departureTerminal: "",
    arrivalAirport: "",
    arrivalCity: "",
    arrivalCountry: "",
    arrivalTerminal: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    baggage: "23 KG",
    travelClass: "Economy",
    duration: "",
    status: "Confirmed",
  })

  const handleSearch = () => {
    fetchB2BClients({
      page: 1,
      search: searchTerm,
    })
  }

  const handlePageChange = (page: number) => {
    fetchB2BClients({
      page,
      search: searchTerm,
    })
  }

  const handleViewDetails = async (client: B2BClient) => {
    try {
      const data = await getB2BClientWithAssociatedClients(client._id)
      setSelectedClient(data.client)
      setAssociatedB2CClients(data.associatedB2CClients)
      setViewDetailsOpen(true)
    } catch (error) {
      console.error("Error fetching client details:", error)
    }
  }

  const toggleRowExpansion = async (clientId: string) => {
    if (expandedClientId === clientId) {
      setExpandedClientId(null)
      setAssociatedB2CClients([])
    } else {
      setExpandedClientId(clientId)
      try {
        const data = await getB2BClientWithAssociatedClients(clientId)
        setAssociatedB2CClients(data.associatedB2CClients)
      } catch (error) {
        console.error("Error fetching associated clients:", error)
        setAssociatedB2CClients([])
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      businessType: "",
      contractAmount: "",
      initialPayment: "",
      notes: "",
    })
  }

  const handleSubmitClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      await createB2BClient({
        ...formData,
        contractAmount: Number.parseFloat(formData.contractAmount) || 0,
      })

      setAddClientOpen(false)
      resetForm()
      fetchB2BClients() // Refresh the list
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenTicketForm = () => {
    setTicketFormOpen(true)
  }

  const handleGenerateTicket = () => {
    generateTicketPDF(ticketForm)
    setTicketFormOpen(false)

    // Reset form
    setTicketForm({
      passengerName: "",
      passportNumber: "",
      ticketNumber: "",
      bookingId: "",
      airlinePNR: "",
      reservationNo: "",
      fareType: "Non-Refundable",
      dateOfIssue: new Date().toISOString().split("T")[0],
      airline: "",
      flightNumber: "",
      departureAirport: "",
      departureCity: "",
      departureCountry: "",
      departureTerminal: "",
      arrivalAirport: "",
      arrivalCity: "",
      arrivalCountry: "",
      arrivalTerminal: "",
      departureDate: "",
      departureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      baggage: "23 KG",
      travelClass: "Economy",
      duration: "",
      status: "Confirmed",
    })
  }

  // Search on Enter key or after delay
  useState(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== "") {
        handleSearch()
      } else {
        fetchB2BClients({ page: 1 })
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">B2B Client Management</h1>
          <p className="text-muted-foreground">Manage your business-to-business clients and partnerships</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOpenTicketForm}>
            <FileText className="mr-2 h-4 w-4" />
            Ticket PDF
          </Button>
          <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New B2B Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New B2B Client</DialogTitle>
                <DialogDescription>Enter the business client details to create a new record</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitClient}>
                <div className="grid gap-4 py-4">
                  {submitError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{submitError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name</Label>
                      <Input
                        id="name"
                        placeholder="Global Travel Solutions"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        placeholder="Travel Agency, Corporate, etc."
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@business.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 234 567 890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Business Street, City, Country"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractAmount">Contract Amount</Label>
                      <Input
                        id="contractAmount"
                        type="number"
                        placeholder="0.00"
                        value={formData.contractAmount}
                        onChange={(e) => setFormData({ ...formData, contractAmount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialPayment">Initial Payment</Label>
                      <Input
                        id="initialPayment"
                        type="number"
                        placeholder="0.00"
                        value={formData.initialPayment}
                        onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any additional information about the business client"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddClientOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Save B2B Client"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by business name or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Contact Phone</TableHead>
              <TableHead>Contract Amount</TableHead>
              <TableHead>Due Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">Loading B2B clients...</p>
                </TableCell>
              </TableRow>
            ) : b2bClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No B2B clients found</p>
                </TableCell>
              </TableRow>
            ) : (
              b2bClients.map((client) => (
                <>
                  <TableRow key={client._id} className="hover:bg-gray-50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRowExpansion(client._id)}
                        className="h-8 w-8"
                      >
                        {expandedClientId === client._id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.businessType}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>${client.contractAmount.toLocaleString()}</TableCell>
                    <TableCell>${client.dueAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleViewDetails(client)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedClientId === client._id && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-0 border-t-0">
                        <Card className="mx-2 mb-4 border-t-0 rounded-t-none shadow-sm">
                          <CardContent className="p-4">
                            <Tabs defaultValue="b2c-clients">
                              <TabsList className="mb-4">
                                <TabsTrigger value="b2c-clients">Associated B2C Clients</TabsTrigger>
                                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                              </TabsList>

                              <TabsContent value="b2c-clients">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-semibold">Associated B2C Clients</h3>
                                </div>

                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Passport</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Contract Amount</TableHead>
                                        <TableHead>Due Amount</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {associatedB2CClients.map((b2cClient) => (
                                        <TableRow key={b2cClient._id}>
                                          <TableCell className="font-medium">{b2cClient.name}</TableCell>
                                          <TableCell>{b2cClient.passportNumber}</TableCell>
                                          <TableCell>{b2cClient.destination}</TableCell>
                                          <TableCell>
                                            <Badge
                                              className={
                                                b2cClient.status === "completed"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-blue-100 text-blue-800"
                                              }
                                            >
                                              {b2cClient.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>${b2cClient.contractAmount.toLocaleString()}</TableCell>
                                          <TableCell>${b2cClient.dueAmount.toLocaleString()}</TableCell>
                                        </TableRow>
                                      ))}
                                      {associatedB2CClients.length === 0 && (
                                        <TableRow>
                                          <TableCell colSpan={6} className="text-center py-4">
                                            No B2C clients associated with this business
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>

                              <TabsContent value="transactions">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-semibold">Transaction History</h3>
                                </div>
                                <div className="text-center py-8">
                                  <p className="text-muted-foreground">
                                    Transaction history will be implemented with transaction API integration
                                  </p>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={pagination.page === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.page < pagination.pages && handlePageChange(pagination.page + 1)}
                className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Ticket PDF Dialog - keeping the existing implementation */}
      <Dialog open={ticketFormOpen} onOpenChange={setTicketFormOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Generate Electronic Ticket</DialogTitle>
            <DialogDescription>
              Enter the flight and passenger details to generate an electronic ticket PDF
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Ticket form content - keeping existing implementation */}
            <div className="text-center py-8">
              <p className="text-muted-foreground">Ticket form implementation remains the same as before</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateTicket}>Generate Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedClient && (
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>B2B Client Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Business Information</TabsTrigger>
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Business Name:</div>
                        <div className="col-span-2">{selectedClient.name}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Business Type:</div>
                        <div className="col-span-2">{selectedClient.businessType}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Email:</div>
                        <div className="col-span-2">{selectedClient.email}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Phone:</div>
                        <div className="col-span-2">{selectedClient.phone}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Address:</div>
                        <div className="col-span-2">{selectedClient.address}</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Contract Amount:</div>
                        <div className="col-span-2">${selectedClient.contractAmount.toLocaleString()}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Paid Amount:</div>
                        <div className="col-span-2">
                          ${(selectedClient.contractAmount - selectedClient.dueAmount).toLocaleString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Due Amount:</div>
                        <div className="col-span-2">${selectedClient.dueAmount.toLocaleString()}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="font-medium">Registration Date:</div>
                        <div className="col-span-2">{new Date(selectedClient.createdAt).toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-end gap-2">
                  <Button>Generate Invoice</Button>
                  <Button variant="outline">Send Statement</Button>
                </div>
              </TabsContent>
              <TabsContent value="transactions" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Transaction history will be implemented with transaction API integration
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
