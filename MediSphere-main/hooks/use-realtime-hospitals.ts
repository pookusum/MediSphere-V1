"use client"

import { useState, useEffect } from "react"
import { listenToAllHospitals, listenToHospital, listenToHospitalsByCity } from "../lib/firestore-realtime"

type Hospital = {
  id: string
  name: string
  totalBeds: number
  availableBeds: number
  icuAvailability: boolean
  ventilatorAvailability: boolean
  emergencySupport: boolean
  location: {
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
    city: string
    state: string
  }
  lastUpdated: string
}

export const useRealtimeHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = listenToAllHospitals((updatedHospitals) => {
      setHospitals(updatedHospitals)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { hospitals, loading, error }
}

export const useRealtimeHospital = (hospitalId: string) => {
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hospitalId) return

    setLoading(true)
    setError(null)

    const unsubscribe = listenToHospital(hospitalId, (updatedHospital) => {
      setHospital(updatedHospital)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [hospitalId])

  return { hospital, loading, error }
}

export const useRealtimeHospitalsByCity = (city: string) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!city) return

    setLoading(true)
    setError(null)

    const unsubscribe = listenToHospitalsByCity(city, (updatedHospitals) => {
      setHospitals(updatedHospitals)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [city])

  return { hospitals, loading, error }
}
