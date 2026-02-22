"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface User {
  uid: string
  email: string
  name: string
  phone?: string
  role: "patient" | "hospital"
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: {
    email: string
    password: string
    name: string
    phone?: string
    role: "patient" | "hospital"
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), uid: firebaseUser.uid } as User)
          } else {
            // Create user document if it doesn't exist
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "",
              role: "patient",
              createdAt: new Date()
            }
            await setDoc(doc(db, "users", firebaseUser.uid), newUser)
            setUser(newUser)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      if (userDoc.exists()) {
        setUser({ ...userDoc.data(), uid: firebaseUser.uid } as User)
      }
      
      return { success: true }
    } catch (error: any) {
      console.error("Firebase login error:", error)
      let errorMessage = "Login failed"
      
      if (error?.code === "auth/user-not-found") {
        errorMessage = "No account found with this email"
      } else if (error?.code === "auth/wrong-password") {
        errorMessage = "Incorrect password"
      } else if (error?.code === "auth/invalid-email") {
        errorMessage = "Invalid email address"
      } else if (error?.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password"
      } else if (error?.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later"
      } else if (error?.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection"
      } else if (error?.code === "auth/configuration-not-found") {
        errorMessage = "Firebase configuration error. Please check setup"
      } else if (error?.message) {
        errorMessage = error.message
      }

      return { success: false, error: errorMessage, message: errorMessage }
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    name: string
    phone?: string
    role: "patient" | "hospital"
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const firebaseUser = userCredential.user
      
      // Create user document in Firestore
      const newUser: User = {
        uid: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        createdAt: new Date()
      }
      
      await setDoc(doc(db, "users", firebaseUser.uid), newUser)
      setUser(newUser)
      
      return { success: true }
    } catch (error: any) {
      console.error("Firebase signup error:", error)
      let errorMessage = "Signup failed"

      if (error?.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists"
      } else if (error?.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters"
      } else if (error?.code === "auth/invalid-email") {
        errorMessage = "Invalid email address"
      } else if (error?.code === "auth/too-many-requests") {
        errorMessage = "Too many signup attempts. Please try again later"
      } else if (error?.message) {
        errorMessage = error.message
      }

      return { success: false, error: errorMessage, message: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" }
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...userData,
        updatedAt: serverTimestamp()
      })
      
      setUser({ ...user, ...userData })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: "Failed to update profile" }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
