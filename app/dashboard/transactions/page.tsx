"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PlusCircle, Search, FileText, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { clients } from "@/data/clients"
import { transactionRecords } from "@/data/transaction-records"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedTransactionType, setSelectedTransactionType] = useState("B2C")
  const [selectedServices, setSelectedServices] = useState(["Visa Processing"])
  const [newService, setNewService] = useState("")

  // Filter B2B clients for dropdown
  const b2bClients = clients.filter((client) => client.clientCategory === "B2B")

  // Filter B2C clients for dropdown
  const b2cClients = clients.filter((client) => client.clientCategory === "B2C")

  // Filter transactions based on search and type
  const filteredTransactions = transactionRecords.filter((transaction) => {
    const matchesSearch =
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || transaction.transactionType === typeFilter

    return matchesSearch && matchesType
  })

  // Calculate total amounts
  const totalContractAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.contractAmount, 0)
  const totalReceivedAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.receivedAmount, 0)
  const totalOutstandingAmount = totalContractAmount - totalReceivedAmount

  // Handle adding a new service
  const handleAddService = () => {
    if (newService.trim() && !selectedServices.includes(newService.trim())) {
      setSelectedServices([...selectedServices, newService.trim()])
      setNewService("")
    }
  }

  // Handle removing a service
  const handleRemoveService = (service) => {
    setSelectedServices(selectedServices.filter((s) => s !== service))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Records</h1>
          <p className="text-muted-foreground">Track and manage all financial transactions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>Record a new financial transaction</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Transaction Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                    <SelectTrigger id="transactionType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2B">B2B</SelectItem>
                      <SelectItem value="B2C">B2C</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTransactionType === "B2B" && (
                <div className="space-y-2">
                  <Label htmlFor="b2bClient">Select B2B Client</Label>
                  <Select>
                    <SelectTrigger id="b2bClient">
                      <SelectValue placeholder="Select B2B client" />
                    </SelectTrigger>
                    <SelectContent>
                      {b2bClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedTransactionType === "B2C" && (
                <div className="space-y-2">
                  <Label htmlFor="b2cClient">Select B2C Client</Label>
                  <Select>
                    <SelectTrigger id="b2cClient">
                      <SelectValue placeholder="Select B2C client" />
                    </SelectTrigger>
                    <SelectContent>
                      {b2cClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedTransactionType === "Personal" && (
                <div className="space-y-2">
                  <Label htmlFor="personalName">Description</Label>
                  <Input id="personalName" placeholder="Office Supplies, Staff Salaries, etc." />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractAmount">Contract Amount</Label>
                  <Input id="contractAmount" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receivedAmount">Received Amount</Label>
                  <Input id="receivedAmount" type="number" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Services</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedServices.map((service) => (
                    <Badge key={service} className="flex items-center gap-1 px-3 py-1">
                      {service}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveService(service)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a service"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddService()
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddService}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional details about this transaction" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Transaction</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalContractAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {filteredTransactions.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalReceivedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalReceivedAmount / totalContractAmount) * 100).toFixed(1)}% of total contract value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOutstandingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalOutstandingAmount / totalContractAmount) * 100).toFixed(1)}% of total contract value
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by client or transaction ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="B2C">B2C</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client/Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contract Amount</TableHead>
              <TableHead>Received Amount</TableHead>
              <TableHead>Services</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.clientName}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      transaction.transactionType === "B2B"
                        ? "bg-blue-100 text-blue-800"
                        : transaction.transactionType === "B2C"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {transaction.transactionType}
                  </Badge>
                </TableCell>
                <TableCell>${transaction.contractAmount.toLocaleString()}</TableCell>
                <TableCell>${transaction.receivedAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {transaction.services.slice(0, 2).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {transaction.services.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{transaction.services.length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
