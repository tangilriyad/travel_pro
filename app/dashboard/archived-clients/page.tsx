"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Undo2,
  Search,
  Loader2,
  Eye,
  ArrowLeft,
  ArchiveRestore,
  Archive,
  Calendar,
} from "lucide-react"
import { useClients, type B2CClient } from "@/hooks/use-clients"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination"

export default function ArchivedClientsPage() {
  const { data: session, status } = useSession()
  const { fetchClients, restoreClient } = useClients()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [archivedClients, setArchivedClients] = useState<B2CClient[]>([])
  const [totalClients, setTotalClients] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isRestoring, setIsRestoring] = useState(false)
  const [clientToRestore, setClientToRestore] = useState<B2CClient | null>(null)
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false)
  const itemsPerPage = 10

  const fetchArchivedClients = async (page = 1, search = "") => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        includeArchived: "true"
      })

      if (search) {
        queryParams.append("search", search)
      }

      const response = await fetch(`/api/clients/b2c?${queryParams}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch archived clients")
      }

      const data = await response.json()
      
      // Filter to only include archived clients (server should already do this, but double check)
      const onlyArchived = data.clients.filter((client: B2CClient) => client.isArchived === true)
      
      setArchivedClients(onlyArchived)
      setTotalClients(data.pagination.total)
      setTotalPages(data.pagination.pages)
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching archived clients:", error)
      setError("Failed to load archived clients. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading") return
    fetchArchivedClients(1, searchTerm)
  }, [status])

  const handleSearch = () => {
    fetchArchivedClients(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    fetchArchivedClients(page, searchTerm)
  }

  const handleRestoreClient = (client: B2CClient) => {
    setClientToRestore(client)
    setRestoreConfirmOpen(true)
  }

  const confirmRestoreClient = async () => {
    if (!clientToRestore) return

    try {
      setIsRestoring(true)
      
      await restoreClient(clientToRestore._id, "B2C")

      toast({
        title: "Client Restored",
        description: `${clientToRestore.name} has been restored successfully.`
      })

      setRestoreConfirmOpen(false)
      setClientToRestore(null)
      
      // Refresh the list of archived clients
      fetchArchivedClients(currentPage, searchTerm)
    } catch (error) {
      console.error("Error restoring client:", error)
      toast({
        title: "Restore Failed",
        description: error instanceof Error ? error.message : "Failed to restore client",
        variant: "destructive"
      })
    } finally {
      setIsRestoring(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const generatePagination = () => {
    const pages = []
    const maxVisiblePages = 5
    
    // Always add first page
    pages.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    
    // Add last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    return pages
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archived Clients</h1>
          <p className="text-muted-foreground">View and restore previously archived clients</p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/dashboard/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Active Clients
          </Link>
        </Button>
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
            placeholder="Search archived clients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Passport</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Archived Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Loading archived clients...</p>
                  </TableCell>
                </TableRow>
              ) : archivedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <Archive className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No archived clients found</p>
                      <Link href="/dashboard/clients" className="mt-4">
                        <Button variant="outline" size="sm">
                          View Active Clients
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                archivedClients.map((client) => (
                  <TableRow key={client._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.passportNumber}</TableCell>
                    <TableCell>{client.destination}</TableCell>
                    <TableCell>
                      {client.archivedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(client.archivedAt)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 w-fit">
                        <Archive className="h-3 w-3" />
                        Archived
                        {client.hadTransactions && (
                          <span className="bg-amber-200 text-amber-800 text-xs rounded-full px-1 ml-1">
                            Has Transactions
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreClient(client)}
                          className="h-8"
                        >
                          <ArchiveRestore className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Pagination className="mx-auto">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </PaginationLink>
              </PaginationItem>
            )}
            
            {generatePagination()}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreConfirmOpen} onOpenChange={setRestoreConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Client</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                Are you sure you want to restore this client? They will be moved back to the active clients list.
              </p>
              {clientToRestore?.hadTransactions && (
                <Alert className="mt-2 border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    This client has transaction records which will be reactivated along with the client profile.
                  </AlertDescription>
                </Alert>
              )}
              <p className="font-medium mt-2">
                Client: <span className="font-bold">{clientToRestore?.name}</span>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRestoreClient}
              disabled={isRestoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Restore Client
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}