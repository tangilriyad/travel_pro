"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Plane, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileCheck, 
  Download, 
  Landmark, 
  MapPin,
  Calendar,
  ArrowRight,
  Loader2,
  Stamp,
  Lock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StatusCheckPage() {
  const [passportNumber, setPassportNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientData, setClientData] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNumber.trim()) {
      setError("Please enter a valid passport number");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/status-check?passportNumber=${encodeURIComponent(passportNumber.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch status");
      }
      
      const data = await response.json();
      setClientData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while checking status");
      setClientData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "in-progress":
        return <Clock className="h-6 w-6 text-blue-500" />;
      case "rejected":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "file-ready":
        return <FileCheck className="h-6 w-6 text-purple-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "rejected":
        return "Rejected";
      case "file-ready":
        return "File Ready";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "file-ready":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 md:px-8 flex items-center justify-between backdrop-blur-lg bg-black/20 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Plane className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">TravelPro</h1>
        </div>
        <Link href="/auth/signin">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Check Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Application Status</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Enter your passport number to instantly track the status of your visa or travel application.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Application Status Tracker
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your passport number to check your application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-400/50 bg-red-500/10 backdrop-blur-sm">
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="relative group">
                <Landmark className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  type="text"
                  placeholder="Enter your passport number"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Check Status
                  </>
                )}
              </Button>
            </form>

            {clientData && (
              <div className="mt-10 space-y-6">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm">Client Name</p>
                      <p className="text-white text-xl font-medium">{clientData.name}</p>
                    </div>
                    
                                         <div className={`inline-flex px-4 py-2 rounded-full border items-center gap-2 text-sm font-medium 
                      ${getStatusColor(clientData.status)}`}>
                      {getStatusIcon(clientData.status)}
                      <span>{getStatusLabel(clientData.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Landmark className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Passport Number</p>
                        <p className="text-white font-medium">{clientData.passportNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Stamp className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Visa Type</p>
                        <p className="text-white font-medium">{clientData.visaType || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <MapPin className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Destination</p>
                        <p className="text-white font-medium">{clientData.destination || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Last Updated</p>
                        <p className="text-white font-medium">
                          {clientData.updatedAt ? new Date(clientData.updatedAt).toLocaleDateString() : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {clientData.statusHistory && clientData.statusHistory.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Status Timeline</h3>
                    <div className="space-y-4">
                      {clientData.statusHistory.map((item: any, index: number) => (
                        <div key={index} className="relative pl-6 pb-6 border-l border-gray-700">
                          <div className="absolute left-0 top-0 -translate-x-1/2 rounded-full w-4 h-4 border border-gray-700 bg-gray-900"></div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white/5 p-4 rounded-lg border border-white/10">
                            <div>
                              <p className="text-white font-medium">
                                {getStatusLabel(item.status)}
                              </p>
                              <p className="text-gray-400 text-sm">{item.notes || "No notes"}</p>
                            </div>
                            <p className="text-gray-400 text-sm whitespace-nowrap">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-400 text-sm mt-8 text-center">
                  For any questions regarding your application, please contact your travel agent.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="py-6 px-4 md:px-8 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">TravelPro © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Privacy Policy</Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Terms of Service</Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Contact Us</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}