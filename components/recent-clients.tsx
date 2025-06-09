import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { clients } from "@/data/clients"

export function RecentClients() {
  // Get the 5 most recent clients
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5)

  const getStatusBadge = (status) => {
    const statusStyles = {
      "file-ready": "bg-blue-100 text-blue-800",
      medical: "bg-purple-100 text-purple-800",
      mofa: "bg-yellow-100 text-yellow-800",
      "visa-stamping": "bg-indigo-100 text-indigo-800",
      fingerprint: "bg-pink-100 text-pink-800",
      manpower: "bg-orange-100 text-orange-800",
      "flight-ticket": "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
    }

    const statusLabels = {
      "file-ready": "File Ready",
      medical: "Medical",
      mofa: "MOFA",
      "visa-stamping": "Visa Stamping",
      fingerprint: "Fingerprint",
      manpower: "Manpower",
      "flight-ticket": "Flight/Ticket",
      completed: "Completed",
    }

    return (
      <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"}>{statusLabels[status] || status}</Badge>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Client Type</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Contract Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentClients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.destination}</TableCell>
            <TableCell>
              {client.clientType === "saudi-kuwait" && "Saudi & Kuwait"}
              {client.clientType === "other-countries" && "Other Countries"}
              {client.clientType === "omra-visa" && "Omra Visa (Saudi)"}
            </TableCell>
            <TableCell>{client.registrationDate}</TableCell>
            <TableCell>{getStatusBadge(client.status)}</TableCell>
            <TableCell>${client.contractAmount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
