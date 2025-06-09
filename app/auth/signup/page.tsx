"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Plane, Mail, Lock, User, ArrowRight, CheckCircle, Sparkles, Building, Phone, MapPin } from "lucide-react"

export default function SignUpPage() {
  const [step, setStep] = useState(1) // Step 1: Personal info, Step 2: Company info
  const [formData, setFormData] = useState({
    // Personal info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Company info
    companyName: "",
    companyEmail: "",
    companyMobile: "",
    companyAddress: "",
    companyLogo: null as File | null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate personal info
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    setError("")
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Create form data for file upload
    const submitData = new FormData()
    submitData.append("name", formData.name)
    submitData.append("email", formData.email)
    submitData.append("password", formData.password)
    submitData.append("companyName", formData.companyName)
    submitData.append("companyEmail", formData.companyEmail)
    submitData.append("companyMobile", formData.companyMobile)
    submitData.append("companyAddress", formData.companyAddress)
    if (formData.companyLogo) {
      submitData.append("companyLogo", formData.companyLogo)
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: submitData,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "An error occurred")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, companyLogo: e.target.files[0] })
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-xl border border-white/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-2xl">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Check Your Email</h1>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  We've sent a verification link to <strong className="text-emerald-400">{formData.email}</strong>.
                  Please check your email and click the link to verify your account.
                </p>
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-base shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Go to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Join TravelPro</h1>
          <p className="text-gray-300 text-lg flex items-center justify-center">
            <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
            Create your account to get started
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-3xl font-bold text-center text-white">
              {step === 1 ? "Sign Up" : "Company Information"}
            </CardTitle>
            <CardDescription className="text-center text-gray-300 text-base">
              {step === 1 
                ? "Fill in your details to create an account" 
                : "Tell us about your travel agency"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-6">
              {error && (
                <Alert className="border-red-400/50 bg-red-500/10 backdrop-blur-sm">
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-200">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12 pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-12 pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-base shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                  </div>
                ) : (
                    <>
                      Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="text-center text-gray-300">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    Sign In
                  </Link>
                  </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="border-red-400/50 bg-red-500/10 backdrop-blur-sm">
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-200">
                    Company Name
                  </Label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                      required
                    />
                  </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="companyEmail" className="text-sm font-medium text-gray-200">
                    Company Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="Enter company email"
                      value={formData.companyEmail}
                      onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                      className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                      required
                    />
              </div>
            </div>

                <div className="space-y-2">
                  <Label htmlFor="companyMobile" className="text-sm font-medium text-gray-200">
                    Mobile Number
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      id="companyMobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      value={formData.companyMobile}
                      onChange={(e) => setFormData({ ...formData, companyMobile: e.target.value })}
                      className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress" className="text-sm font-medium text-gray-200">
                    Company Address
                  </Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                      id="companyAddress"
                      type="text"
                      placeholder="Enter company address"
                      value={formData.companyAddress}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                      className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyLogo" className="text-sm font-medium text-gray-200">
                    Company Logo (Optional)
                  </Label>
                  <Input
                    id="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="h-14 bg-white/10 border-white/20 text-white focus:border-indigo-400 focus:ring-indigo-400/20 backdrop-blur-sm"
                  />
            </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 bg-gray-600/50 hover:bg-gray-600/70 text-white font-semibold text-base shadow-xl transition-all duration-300"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-base shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
            </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
