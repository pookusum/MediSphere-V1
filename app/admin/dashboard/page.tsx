"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../../lib/firebase"
import { listenToAllHospitals, listenToHospital } from "../../../lib/firestore-realtime"
import { updateHospital } from "../../../lib/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Activity, MapPin, Clock } from "lucide-react"

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

export default function AdminDashboard() {
  const [user, loading] = useAuthState(auth)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updateStatus, setUpdateStatus] = useState<string>("")

  useEffect(() => {
    if (!user) return

    // Listen to all hospitals in real-time
    const unsubscribe = listenToAllHospitals((updatedHospitals) => {
      setHospitals(updatedHospitals)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    if (!selectedHospital) return

    // Listen to specific hospital updates
    const unsubscribe = listenToHospital(selectedHospital.id, (updatedHospital) => {
      if (updatedHospital) {
        setSelectedHospital(updatedHospital)
      }
    })

    return () => unsubscribe()
  }, [selectedHospital?.id])

  const handleUpdateHospital = async (hospitalId: string, updates: Partial<Hospital>) => {
    setUpdateStatus("Updating...")
    try {
      const result = await updateHospital(hospitalId, updates)
      if (result.success) {
        setUpdateStatus("Updated successfully!")
        setTimeout(() => setUpdateStatus(""), 3000)
      } else {
        setUpdateStatus("Update failed!")
        setTimeout(() => setUpdateStatus(""), 3000)
      }
    } catch (error) {
      console.error("Error updating hospital:", error)
      setUpdateStatus("Update failed!")
      setTimeout(() => setUpdateStatus(""), 3000)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access the admin dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading hospitals...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hospital Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">Real-time sync active</span>
        </div>
      </div>

      {updateStatus && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          updateStatus.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {updateStatus.includes("success") ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {updateStatus}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit Hospital</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {hospital.name}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHospital(hospital)}
                    >
                      Edit
                    </Button>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hospital.location.city}, {hospital.location.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Beds Available</span>
                      <Badge variant={hospital.availableBeds > 0 ? "default" : "destructive"}>
                        {hospital.availableBeds} / {hospital.totalBeds}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">ICU</span>
                      <Badge variant={hospital.icuAvailability ? "default" : "secondary"}>
                        {hospital.icuAvailability ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ventilators</span>
                      <Badge variant={hospital.ventilatorAvailability ? "default" : "secondary"}>
                        {hospital.ventilatorAvailability ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Emergency</span>
                      <Badge variant={hospital.emergencySupport ? "default" : "secondary"}>
                        {hospital.emergencySupport ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Last updated: {new Date(hospital.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="edit">
          {selectedHospital ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit: {selectedHospital.name}</CardTitle>
                <CardDescription>
                  Update hospital availability information. Changes will sync in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalBeds">Total Beds</Label>
                    <Input
                      id="totalBeds"
                      type="number"
                      value={selectedHospital.totalBeds}
                      onChange={(e) => setSelectedHospital({
                        ...selectedHospital,
                        totalBeds: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableBeds">Available Beds</Label>
                    <Input
                      id="availableBeds"
                      type="number"
                      value={selectedHospital.availableBeds}
                      onChange={(e) => setSelectedHospital({
                        ...selectedHospital,
                        availableBeds: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="icu"
                      checked={selectedHospital.icuAvailability}
                      onCheckedChange={(checked: boolean) => setSelectedHospital({
                        ...selectedHospital,
                        icuAvailability: checked
                      })}
                    />
                    <Label htmlFor="icu">ICU Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ventilators"
                      checked={selectedHospital.ventilatorAvailability}
                      onCheckedChange={(checked: boolean) => setSelectedHospital({
                        ...selectedHospital,
                        ventilatorAvailability: checked
                      })}
                    />
                    <Label htmlFor="ventilators">Ventilators Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emergency"
                      checked={selectedHospital.emergencySupport}
                      onCheckedChange={(checked: boolean) => setSelectedHospital({
                        ...selectedHospital,
                        emergencySupport: checked
                      })}
                    />
                    <Label htmlFor="emergency">Emergency Support</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateHospital(selectedHospital.id, selectedHospital)}
                    className="flex-1"
                  >
                    Update Hospital
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedHospital(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-gray-500">Select a hospital from the overview tab to edit</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
