import type { NextRequest } from "next/server"
import { 
  getAllHospitals, 
  getHospitalsByCity, 
  getHospitalsWithICU, 
  getHospitalsWithVentilators, 
  getHospitalsWithEmergencySupport,
  updateHospital 
} from "../../../lib/firestore"

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

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get("city") || undefined
  const icu = searchParams.get("icu")
  const ventilators = searchParams.get("ventilators")
  const emergency = searchParams.get("emergency")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radiusKm = Number(searchParams.get("radiusKm") || "25")

  const origin =
    lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
      ? { lat: Number(lat), lng: Number(lng) }
      : undefined

  let result

  // Get hospitals from Firestore based on filters
  if (city) {
    result = await getHospitalsByCity(city)
  } else if (icu !== null) {
    result = await getHospitalsWithICU(icu === "true")
  } else if (ventilators !== null) {
    result = await getHospitalsWithVentilators(ventilators === "true")
  } else if (emergency !== null) {
    result = await getHospitalsWithEmergencySupport(emergency === "true")
  } else {
    result = await getAllHospitals()
  }

  if (!result.success) {
    return new Response("Error fetching hospitals from Firestore", { status: 500 })
  }

  let list = result.data as Hospital[]

  // Apply additional filtering if multiple filters are specified
  if (city && icu !== null) {
    list = list.filter((h) => h.icuAvailability === (icu === "true"))
  }
  if (city && ventilators !== null) {
    list = list.filter((h) => h.ventilatorAvailability === (ventilators === "true"))
  }
  if (city && emergency !== null) {
    list = list.filter((h) => h.emergencySupport === (emergency === "true"))
  }

  // Apply distance filtering if coordinates are provided
  if (origin) {
    list = list
      .map((h) => ({ 
        ...h, 
        distanceKm: haversineKm(origin.lat, origin.lng, h.location.coordinates.latitude, h.location.coordinates.longitude) 
      }))
      .filter((h) => typeof h.distanceKm === "number" && (h.distanceKm as number) <= radiusKm)
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
  }

  return Response.json({ hospitals: list })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const updated = body?.hospital
  if (!updated) return new Response("Invalid body", { status: 400 })

  const result = await updateHospital(updated.id, {
    ...updated,
    lastUpdated: new Date().toISOString()
  })

  if (result.success) {
    return Response.json({ ok: true })
  } else {
    return new Response("Failed to update hospital", { status: 500 })
  }
}
