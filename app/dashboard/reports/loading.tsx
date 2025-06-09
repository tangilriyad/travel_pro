import { RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Simple loading skeleton component
const Skeleton = () => (
  <div className="space-y-3">
    <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
  </div>
)

export default function Loading() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-40 animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
      </div>
      
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
    </div>
  )
} 