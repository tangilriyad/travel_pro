import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { transactions } from "@/data/transactions"
import { transactionRecords } from "@/data/transaction-records"

export function ClientDetails({ client, defaultTab = "info" }) {
  // Find transactions for this client
  const clientTransactions = transactions.filter((transaction) => transaction.clientId === client.id)

  // Find transaction records for this client
  const clientTransactionRecords = transactionRecords.filter((record) => record.clientId === client.id)

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} DBT`
  }

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
    <Tabs defaultValue={defaultTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="info">Personal Info</TabsTrigger>
        <TabsTrigger value="status">Status History</TabsTrigger>
        <TabsTrigger value="payments">Payment History</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Full Name:</div>
                <div className="col-span-2">{client.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{client.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Phone:</div>
                <div className="col-span-2">{client.phone}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Address:</div>
                <div className="col-span-2">{client.address}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">Client Category:</div>
                <div className="col-span-2">
                  <Badge
                    className={
                      client.clientCategory === "B2B" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }
                  >
                    {client.clientCategory}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Travel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {client.clientCategory === "B2C" && (
                <>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Passport No:</div>
                    <div className="col-span-2">{client.passportNumber}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Destination:</div>
                    <div className="col-span-2">{client.destination}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Client Type:</div>
                    <div className="col-span-2">
                      {client.clientType === "saudi-kuwait" && "Saudi & Kuwait"}
                      {client.clientType === "other-countries" && "Other Countries"}
                      {client.clientType === "omra-visa" && "Omra Visa (Saudi)"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Current Status:</div>
                    <div className="col-span-2">{getStatusBadge(client.status)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Visa Type:</div>
                    <div className="col-span-2">{client.visaType}</div>
                  </div>
                </>
              )}
              {client.clientCategory === "B2B" && (
                <>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Business Type:</div>
                    <div className="col-span-2">{client.businessType}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Registration Date:</div>
                    <div className="col-span-2">{client.registrationDate}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-2">
                <div className="font-medium">Contract Amount:</div>
                <div className="text-2xl font-bold">{formatCurrency(client.contractAmount)}</div>
              </div>
              <div className="col-span-2">
                <div className="font-medium">Paid Amount:</div>
                <div className="text-2xl font-bold">{formatCurrency(client.contractAmount - client.dueAmount)}</div>
              </div>
              <div className="col-span-2">
                <div className="font-medium">Due Amount:</div>
                <div className="text-2xl font-bold">{formatCurrency(client.dueAmount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="status" className="pt-4">
        {client.clientCategory === "B2C" ? (
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
              <CardDescription>History of client's visa processing stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {client.statusHistory &&
                  client.statusHistory.map((status, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                          {index + 1}
                        </div>
                        {index < client.statusHistory.length - 1 && <div className="h-full w-px bg-gray-200" />}
                      </div>
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(status.status)}
                          <span className="text-sm text-muted-foreground">{status.date}</span>
                        </div>
                        <p className="text-sm">{status.notes}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Status history is not applicable for B2B clients</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="payments" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Record of all financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "payment" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.type === "payment" ? "Payment" : "Contract"}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                  </TableRow>
                ))}
                {clientTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No payment history found for this client
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="transactions" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
            <CardDescription>Detailed transaction history with services</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Contract Amount</TableHead>
                  <TableHead>Received Amount</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientTransactionRecords.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{formatCurrency(transaction.contractAmount)}</TableCell>
                    <TableCell>{formatCurrency(transaction.receivedAmount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {transaction.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.notes}</TableCell>
                  </TableRow>
                ))}
                {clientTransactionRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No transaction records found for this client
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
