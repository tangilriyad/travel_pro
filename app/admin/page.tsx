"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Building2, Users, CreditCard, BarChart4 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
    expiredSubscriptions: 0,
    revenueThisMonth: 0,
  });

  useEffect(() => {
    // In a real implementation, you would fetch real data
    // For now, let's simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalCompanies: 42,
        totalUsers: 156,
        activeSubscriptions: 28,
        trialSubscriptions: 14,
        expiredSubscriptions: 8,
        revenueThisMonth: 12650,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return (
      <div className="container py-10">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don&apos;t have permission to access this page. Please log in with an admin account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, {session.user.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-gray-500 mt-1">
              <Link href="/admin/companies" className="text-primary">View all companies</Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              <Link href="/admin/users" className="text-primary">Manage users</Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500">+{stats.trialSubscriptions} trial</span> / <span className="text-red-500">{stats.expiredSubscriptions} expired</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <BarChart4 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenueThisMonth.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              <Link href="/admin/analytics" className="text-primary">View analytics</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest activities in your admin portal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-medium">New company registered</p>
              <p className="text-sm text-gray-500">TravelPlus Agency registered 2 hours ago</p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-medium">Subscription upgraded</p>
              <p className="text-sm text-gray-500">GlobeExplorer Agency upgraded to Premium 5 hours ago</p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="font-medium">Support request</p>
              <p className="text-sm text-gray-500">Adventure Travel reported an issue with payments 1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
