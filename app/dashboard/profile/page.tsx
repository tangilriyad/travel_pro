"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  Building, 
  CheckCircle, 
  Clock, 
  Loader2, 
  Save, 
  Upload, 
  Mail, 
  Phone, 
  MapPin,
  Building2,
  Users,
  CreditCard,
  Plane
} from "lucide-react";
import { toast } from "sonner";

interface Company {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  businessType?: string;
  logoUrl?: string;
  subscription: {
    status: "trial" | "active" | "expired" | "canceled";
    trialStartDate: string;
    trialEndDate: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  };
  createdAt: string;
  updatedAt?: string;
  clientsCount?: {
    b2b: number;
    b2c: number;
    total: number;
  };
}

export default function CompanyProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    businessType: "",
  });

  // Debug log session data
  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.role !== "company") {
      console.log("Access denied. User role:", session?.user?.role);
      router.push("/dashboard");
      return;
    }

    async function fetchCompanyProfile() {
      try {
        console.log("Fetching company profile...");
        const response = await fetch("/api/companies/profile");
        console.log("Profile API response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API error:", response.status, errorData);
          throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Profile data received:", data);
        
        if (!data.company) {
          console.error("No company data in response:", data);
          throw new Error("Invalid response format");
        }
        
        setCompany(data.company);
        setFormData({
          name: data.company.name || "",
          email: data.company.email || "",
          mobileNumber: data.company.mobileNumber || "",
          address: data.company.address || "",
          businessType: data.company.businessType || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load company profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyProfile();
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setUpdateSuccess(false);
    
    console.log("Submitting form data:", formData);

    try {
      const response = await fetch("/api/companies/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      console.log("Update API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update error:", response.status, errorData);
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Update success response:", data);
      
      setUpdateSuccess(true);
      toast.success("Company profile updated successfully");
      
      // Update local state with the new data
      if (company) {
        setCompany({
          ...company,
          ...formData,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update company profile. Please try again.");
      toast.error("Failed to update company profile");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "trial":
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/30 py-1.5 px-3">
            <Clock className="w-4 h-4 mr-1.5" />
            Trial
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30 py-1.5 px-3">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30 py-1.5 px-3">
            <AlertCircle className="w-4 h-4 mr-1.5" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading your company profile...</p>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="container max-w-5xl mx-auto py-10">
        <Card className="border-red-200 shadow-lg">
          <CardContent className="pt-10">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Company Profile Not Found</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
              <Button onClick={() => router.push("/dashboard")} size="lg">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Company Profile</h1>
          <p className="text-gray-500">Manage your company information and view subscription details</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => router.push("/dashboard")}
          >
            <Building2 className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Company Info Cards */}
        <div className="space-y-6">
          {/* Company Overview Card */}
          <Card className="border border-gray-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                {company?.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company?.name}
                    className="h-16 w-16 object-cover rounded-full"
                  />
                ) : (
                  <Building className="h-16 w-16 text-gray-400" />
                )}
              </div>
            </div>
            <CardContent className="pt-14 -mt-10 text-center">
              <h3 className="text-2xl font-bold mb-1">{company?.name}</h3>
              <p className="text-gray-500 mb-4">{company?.businessType || "Travel Agency"}</p>
              
              <div className="flex justify-center mb-4">
                {company?.subscription && getStatusBadge(company.subscription.status)}
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-left">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{company?.email}</span>
                </div>
                {company?.mobileNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{company.mobileNumber}</span>
                  </div>
                )}
                {company?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <span className="text-gray-700">{company.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <div>{company?.subscription && getStatusBadge(company.subscription.status)}</div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium">{company?.subscription && formatDate(company.subscription.trialStartDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">End Date</span>
                <span className="font-medium">{company?.subscription && formatDate(company.subscription.trialEndDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Client Stats Card */}
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Client Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold text-blue-700">{company?.clientsCount?.b2c || 0}</span>
                  <p className="text-xs text-blue-600 mt-1">B2C Clients</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold text-purple-700">{company?.clientsCount?.b2b || 0}</span>
                  <p className="text-xs text-purple-600 mt-1">B2B Clients</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold text-green-700">{company?.clientsCount?.total || 0}</span>
                  <p className="text-xs text-green-600 mt-1">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Update Company Information</CardTitle>
              <CardDescription>
                Update your company details and keep your information current
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="border-red-400/50 bg-red-500/10">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {updateSuccess && (
                  <Alert className="border-green-400/50 bg-green-500/10">
                    <AlertDescription className="text-green-700">
                      Company profile updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">
                      Company Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your company name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 py-6 border-gray-300 bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 py-6 border-gray-300 bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-gray-700">
                      Business Type
                    </Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="businessType"
                        name="businessType"
                        placeholder="Travel Agency, Tour Operator, etc."
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="pl-10 py-6 border-gray-300 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber" className="text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        placeholder="Your phone number"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className="pl-10 py-6 border-gray-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700">
                    Company Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Your company address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="pl-10 pt-2 border-gray-300 bg-white resize-none"
                    />
                  </div>
                </div>
                
                {/* Logo upload preview - future implementation */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <Label className="text-gray-700">Company Logo</Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                      {company?.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building className="h-10 w-10 text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button type="button" variant="outline" className="flex items-center gap-2" disabled>
                        <Upload className="h-4 w-4" />
                        <span>Upload New Logo</span>
                      </Button>
                      <p className="text-xs text-gray-500">
                        For best results, use a square image at least 200x200 pixels (Coming soon)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2 border-t pt-6">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 h-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
} 