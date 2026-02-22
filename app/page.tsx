"use client"

import { NavBar } from "@/components/nav-bar"
import { Hero } from "@/components/hero"
import HospitalFinder from "@/components/hospital-map"
import { KeyFeatures } from "@/components/features"
import { AIPredictions } from "@/components/ai-predictions"
import { Contact } from "@/components/contact"
import { useAuth } from "@/contexts/firebase-auth-context"
import { Chatbot } from "@/components/chatbot"
import { useEffect, useState } from "react"
import type { Hospital } from "@/components/hospital-list"
import { HospitalList } from "@/components/hospital-list"
import { SearchFilters, type FilterValues } from "@/components/search-filters"
import { useHospitals } from "@/hooks/use-hospitals"
import { Button } from "@/components/ui/button"
import { BedPrediction } from "@/components/bed-prediction"

export default function Page() {
  const [filters, setFilters] = useState<FilterValues>({
    city: "Thane",
    type: "Government",
    specialization: "Orthopedics",
    emergencyLevel: "",
    facilities: [],
    doctorType: "",
    insuranceAccepted: false,
    cashlessFacility: false,
    minRating: "",
    maxDistance: "",
    showOnlyAvailable: false,
    showShortestQueue: false,
    genderSpecific: "",
    language: "",
    is24x7: false,
  })
  const [user, setUser] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [selected, setSelected] = useState<Hospital | undefined>(undefined)
  const [mode, setMode] = useState<"driving" | "walking" | "bicycling">("driving")
  const [shouldPredict, setShouldPredict] = useState(false)

  const { hospitals, isLoading: hospitalsLoading } = useHospitals({
    city: shouldPredict ? filters.city : undefined,
    type: shouldPredict ? filters.type : undefined,
    specialization: shouldPredict ? filters.specialization : undefined,
    lat: user?.lat,
    lng: user?.lng,
    radiusKm: 25,
  })

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUser({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [])

  function useMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    
    setLocationLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6)
        const lng = pos.coords.longitude.toFixed(6)
        const locationString = `${lat},${lng}`
        
        // Update user coordinates
        setUser({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        
        // Update the manual location field in filters
        setFilters(prev => ({ ...prev, location: locationString }))
        
        setLocationLoading(false)
        console.log("Location detected:", { lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      (error) => {
        console.error("Geolocation error:", error)
        
        // Show appropriate error message
        let errorMessage = "Unable to get your location. "
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location access was denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out."
            break
          default:
            errorMessage += "An unknown error occurred."
            break
        }
        
        alert(errorMessage)
        setLocationLoading(false)
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 60000 // 1 minute cache
      }
    )
  }

  function handleSearch() {
    setShouldPredict(true)
  }

  return (
    <main>
      <NavBar />
      <Hero />

      <section id="finder" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-4xl font-bold transition-all duration-300 hover:scale-105 hover:text-primary cursor-default">AI-Powered Hospital Finder</h2>
          <p className="text-balance text-lg text-muted-foreground">
            Get instant predictions on bed availability and find the nearest hospitals for your emergency needs
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters
            values={filters}
            onChange={(v) => setFilters(v)}
            onUseMyLocation={useMyLocation}
            onApply={handleSearch}
            isApplying={isLoading}
            locationLoading={locationLoading}
          />
        </div>

        {shouldPredict && (
          <div className="mb-8">
            <BedPrediction
              city={filters.city}
              type={filters.type}
              specialization={filters.specialization}
              shouldPredict={shouldPredict}
            />
          </div>
        )}

        {shouldPredict && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold transition-all duration-300 hover:scale-105 hover:text-primary cursor-default">Hospital Map & List View</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Travel Mode:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={mode === "driving" ? "default" : "outline"}
                    onClick={() => setMode("driving")}
                  >
                    Car
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === "bicycling" ? "default" : "outline"}
                    onClick={() => setMode("bicycling")}
                  >
                    Bike
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === "walking" ? "default" : "outline"}
                    onClick={() => setMode("walking")}
                  >
                    Walk
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <HospitalFinder
                  hospitals={hospitals}
                  user={user || undefined}
                  selected={selected}
                  onSelect={(h) => setSelected(h)}
                  mode={mode}
                />
              </div>

              <div className="md:col-span-2">
                <HospitalList onSelect={(h) => setSelected(h)} userCoords={user || undefined} mode={mode} hospitals={hospitals} />
              </div>
            </div>
          </>
        )}
      </section>

      <AIPredictions />
      <KeyFeatures />
      <Contact />
      <Chatbot />

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MediSphere</p>
          <p className="text-sm">Built for faster, safer access to care.</p>
        </div>
      </footer>
    </main>
  )
}
