"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  createdAt: string
  lastLogin: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (userData: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('medisphere_user')
        const storedSession = localStorage.getItem('medisphere_session')
        
        if (storedUser && storedSession) {
          const userData = JSON.parse(storedUser)
          const sessionData = JSON.parse(storedSession)
          
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - sessionData.timestamp
          if (sessionAge < 24 * 60 * 60 * 1000) { // 24 hours
            setUser(userData)
            
            // Update last login time
            const updatedUser = { ...userData, lastLogin: new Date().toISOString() }
            localStorage.setItem('medisphere_user', JSON.stringify(updatedUser))
            setUser(updatedUser)
          } else {
            // Session expired, clear storage
            localStorage.removeItem('medisphere_user')
            localStorage.removeItem('medisphere_session')
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        localStorage.removeItem('medisphere_user')
        localStorage.removeItem('medisphere_session')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('medisphere_users') || '[]')
      const existingUser = users.find((u: any) => u.email === email && u.password === password)
      
      if (!existingUser) {
        return { success: false, message: 'Invalid email or password' }
      }
      
      // Create user object for session
      const userSession: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        createdAt: existingUser.createdAt,
        lastLogin: new Date().toISOString()
      }
      
      // Store user data and session
      localStorage.setItem('medisphere_user', JSON.stringify(userSession))
      localStorage.setItem('medisphere_session', JSON.stringify({
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }))
      
      setUser(userSession)
      return { success: true }
      
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed. Please try again.' }
    }
  }

  const signup = async (userData: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem('medisphere_users') || '[]')
      
      // Check if user already exists
      if (users.find((u: any) => u.email === userData.email)) {
        return { success: false, message: 'User with this email already exists' }
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        createdAt: new Date().toISOString()
      }
      
      // Store user in users array
      users.push(newUser)
      localStorage.setItem('medisphere_users', JSON.stringify(users))
      
      // Create user session
      const userSession: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
        lastLogin: new Date().toISOString()
      }
      
      // Store user data and session
      localStorage.setItem('medisphere_user', JSON.stringify(userSession))
      localStorage.setItem('medisphere_session', JSON.stringify({
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }))
      
      setUser(userSession)
      return { success: true }
      
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'Signup failed. Please try again.' }
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('medisphere_user')
      localStorage.removeItem('medisphere_session')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('medisphere_user', JSON.stringify(updatedUser))
      
      // Also update in users array
      const users = JSON.parse(localStorage.getItem('medisphere_users') || '[]')
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData }
        localStorage.setItem('medisphere_users', JSON.stringify(users))
      }
    }
  }

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
