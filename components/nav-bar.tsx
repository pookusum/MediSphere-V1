"use client"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, Activity, LogIn, LogOut, User, ChevronDown, Users, Building } from "lucide-react"
import { useAuth } from "@/contexts/firebase-auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserRole = "patient" | "hospital"

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("patient")
  const { user, logout, isAuthenticated } = useAuth()
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent p-0.5 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-background">
                <Activity className="size-5 text-primary" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MediSphere
            </span>
          </Link>
        </div>

        {/* Center Section: Role Switcher */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-background p-1">
            <Button
              variant={userRole === "patient" ? "default" : "ghost"}
              size="sm"
              onClick={() => setUserRole("patient")}
              className="gap-2"
            >
              <Users className="size-4" />
              P
            </Button>
            <Button
              variant={userRole === "hospital" ? "default" : "ghost"}
              size="sm"
              onClick={() => setUserRole("hospital")}
              className="gap-2"
            >
              <Building className="size-4" />
              H
            </Button>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {userRole === "patient" ? (
            <>
              <a href="#finder" className="text-sm font-medium transition-colors hover:text-primary">
                Find Hospitals
              </a>
              <a href="#ai" className="text-sm font-medium transition-colors hover:text-primary">
                AI Predictions
              </a>
            </>
          ) : (
            <>
              <a href="/hospital/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </a>
              <a href="#patients" className="text-sm font-medium transition-colors hover:text-primary">
                Patients
              </a>
              <a href="#beds" className="text-sm font-medium transition-colors hover:text-primary">
                Bed Management
              </a>
            </>
          )}
          
          <a href="#features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </a>
          <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </a>
          
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              className="gap-2 bg-transparent"
              onClick={logout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          ) : (
            <>
              <Link href="/profile">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <LogIn className="size-4" />
                  Login
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg">
                  <User className="size-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          
          <ThemeToggle />
        </nav>

        <button
          className="rounded-lg p-2 transition-colors hover:bg-secondary md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-card md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {/* Mobile Role Switcher */}
            <div className="mb-4">
              <div className="flex items-center rounded-lg border bg-background p-1">
                <Button
                  variant={userRole === "patient" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUserRole("patient")}
                  className="gap-2 flex-1"
                >
                  <Users className="size-4" />
                  P
                </Button>
                <Button
                  variant={userRole === "hospital" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUserRole("hospital")}
                  className="gap-2 flex-1"
                >
                  <Building className="size-4" />
                  H
                </Button>
              </div>
            </div>

            {userRole === "patient" ? (
              <>
                <a
                  href="#finder"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                >
                  Find Hospitals
                </a>
                <a
                  href="#ai"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                >
                  AI Predictions
                </a>
              </>
            ) : (
              <>
                <a
                  href="/hospital/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                >
                  Dashboard
                </a>
                <a
                  href="#patients"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                >
                  Patients
                </a>
                <a
                  href="#beds"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                >
                  Bed Management
                </a>
              </>
            )}
            
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
            >
              Features
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
            >
              Contact
            </a>
            
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                >
                  Profile Settings
                </Link>
                {userRole === "hospital" && (
                  <>
                    <Link
                      href="/hospital/patients"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                    >
                      Manage Patients
                    </Link>
                    <Link
                      href="/hospital/beds"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                    >
                      Bed Management
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-lg px-3 py-2 font-medium text-red-600 transition-colors hover:bg-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-secondary"
                >
                  Login
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
