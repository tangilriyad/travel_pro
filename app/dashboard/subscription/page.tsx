"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SubscriptionData {
  status: "trial" | "active" | "expired" | "canceled";
  trialStartDate: string;
  trialEndDate: string;
  currentPeriodEnd?: string;
  isTrialExpired: boolean;
  isSubscriptionExpired: boolean;
  daysRemaining: number;
}

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        if (!session?.user?.companyId) {
          setError("No company ID found. Please contact support.");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/companies/${session.user.companyId}/subscription-status`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch subscription data");
        }
        
        const data = await response.json();
        setSubscriptionData(data);
      } catch (err) {
        setError("Failed to load subscription information. Please try again later.");
        console.error("Error fetching subscription data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptionData();
  }, [session]);

  const handleSubscribe = async () => {
    setProcessingPayment(true);
    try {
      // In a real implementation, this would redirect to a payment processor
      // For now, we'll simulate a successful payment after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful payment, update the subscription status
      // This would normally be handled by a webhook from the payment processor
      if (session?.user?.companyId) {
        await fetch(`/api/companies/${session.user.companyId}/update-subscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          }),
        });

        // Refresh subscription data
        const response = await fetch(`/api/companies/${session.user.companyId}/subscription-status`);
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (err) {
      setError("Payment processing failed. Please try again later.");
      console.error("Error processing payment:", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusBadge = () => {
    if (!subscriptionData) return null;

    switch (subscriptionData.status) {
      case "trial":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Trial
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Canceled
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionData?.status === "trial" && (
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Trial Period</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your trial will expire in{" "}
                        <span className="font-semibold">{subscriptionData.daysRemaining} days</span>.
                        Subscribe now to continue using all features without interruption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subscriptionData?.status === "expired" && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Subscription Expired</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Your subscription has expired. Subscribe now to regain access to all features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subscriptionData?.status === "active" && (
              <div className="rounded-lg bg-green-50 p-4 border border-green-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Active Subscription</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your subscription is active until{" "}
                        <span className="font-semibold">
                          {new Date(subscriptionData.currentPeriodEnd!).toLocaleDateString()}
                        </span>
                        . You have access to all features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Premium Plan</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Unlimited client management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Advanced reporting and analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Email notifications and reminders</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <div className="text-2xl font-bold">$29.99<span className="text-sm text-gray-500 font-normal">/month</span></div>
            </div>
          </CardContent>
          <CardFooter>
            {(subscriptionData?.status === "trial" || subscriptionData?.status === "expired") && (
              <Button 
                className="w-full" 
                onClick={handleSubscribe}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            )}
            
            {subscriptionData?.status === "active" && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push("/dashboard")}
              >
                Return to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 