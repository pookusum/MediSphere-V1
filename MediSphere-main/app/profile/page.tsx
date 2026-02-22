"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/firebase-auth-context"
import { ArrowLeft, User, Mail, Phone, Calendar, Save, Activity, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, updateUser, login, signup, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
    setSuccess("Profile updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    })
    setIsEditing(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields")
      return
    }
    
    const result = await login(loginData.email, loginData.password)
    if (!result.success) {
      setError(result.message || "Login failed")
    } else {
      setSuccess("Login successful!")
      setLoginData({ email: "", password: "" })
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!signupData.name || !signupData.email || !signupData.phone || !signupData.password) {
      setError("Please fill in all fields")
      return
    }
    
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    const result = await signup({
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      password: signupData.password,
    })
    
    if (!result.success) {
      setError(result.message || "Signup failed")
    } else {
      setSuccess("Account created successfully!")
      setSignupData({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold">Welcome to MediSphere</h1>
            <p className="text-muted-foreground">Sign in or create an account to get started</p>
          </div>

          {/* Login/Signup Card */}
          <Card className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="text-base">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-base">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 mb-6">
                  <CheckCircle2 className="size-4" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-6">
                  <AlertCircle className="size-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2 font-semibold">
                      <Mail className="size-4" />
                      Email Address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2 font-semibold">
                      <Lock className="size-4" />
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="size-4 rounded border-gray-300" />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <button type="button" className="font-medium text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-md hover:shadow-lg"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2 font-semibold">
                      <User className="size-4" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2 font-semibold">
                      <Mail className="size-4" />
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="flex items-center gap-2 font-semibold">
                      <Phone className="size-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      required
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2 font-semibold">
                      <Lock className="size-4" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password (min 6 chars)"
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="flex items-center gap-2 font-semibold">
                      <Lock className="size-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Re-enter your password"
                      required
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="size-4 rounded border-gray-300" />
                      <span className="text-muted-foreground">I agree to the terms and conditions</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-md hover:shadow-lg"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 mb-6">
            <CheckCircle2 className="size-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Profile Card */}
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <User className="size-10 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="size-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="max-w-md"
                />
              ) : (
                <p className="text-lg">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="max-w-md"
                />
              ) : (
                <p className="text-lg">{user.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="size-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="max-w-md"
                />
              ) : (
                <p className="text-lg">{user.phone || "Not provided"}</p>
              )}
            </div>

            {/* Account Info */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="size-4" />
                Account Information
              </Label>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Member ID: {user.id}</p>
                <p>Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <User className="size-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
