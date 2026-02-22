"use client"

import { useRealtimeHospitals } from "../hooks/use-realtime-hospitals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, MapPin, Clock, Bed, AlertTriangle } from "lucide-react"

export default function HospitalListRealtime() {
  const { hospitals, loading, error } = useRealtimeHospitals()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 animate-pulse text-blue-500" />
          <span>Loading hospitals...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-red-500">Error loading hospitals: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Hospital Availability</h2>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">Real-time updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((hospital) => (
          <Card key={hospital.id} className="relative">
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{hospital.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {hospital.location.city}, {hospital.location.state}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    <span className="text-sm font-medium">Beds Available</span>
                  </div>
                  <Badge 
                    variant={hospital.availableBeds > 0 ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {hospital.availableBeds > 0 ? (
                      <Bed className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {hospital.availableBeds} / {hospital.totalBeds}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className={`font-medium ${
                      hospital.icuAvailability ? "text-green-600" : "text-red-600"
                    }`}>
                      {hospital.icuAvailability ? "ICU ✓" : "ICU ✗"}
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className={`font-medium ${
                      hospital.ventilatorAvailability ? "text-green-600" : "text-red-600"
                    }`}>
                      {hospital.ventilatorAvailability ? "Vent ✓" : "Vent ✗"}
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className={`font-medium ${
                      hospital.emergencySupport ? "text-green-600" : "text-red-600"
                    }`}>
                      {hospital.emergencySupport ? "ER ✓" : "ER ✗"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t">
                  <Clock className="w-3 h-3" />
                  Updated: {new Date(hospital.lastUpdated).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hospitals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hospitals found in the database.
        </div>
      )}
    </div>
  )
}
