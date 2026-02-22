import type { NextRequest } from "next/server"
import { getAllHospitals, getHospitalsByCity, getHospitalsByType, getHospitalsBySpecialization, updateHospital } from "../../../lib/firestore"

type Hospital = {
  id: string
  name: string
  lat: number
  lng: number
  bedsTotal: number
  bedsOccupied: number
  opdQueue: number
  doctorsAvailable: number
  bloodBank: Record<string, number>
  icuAvailable: boolean
  updatedAt: string
  city?: string
  type?: string
  specializations?: string[]
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
  const type = searchParams.get("type") || undefined
  const specialization = searchParams.get("specialization") || undefined
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radiusKm = Number(searchParams.get("radiusKm") || "25")

  const origin =
    lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
      ? { lat: Number(lat), lng: Number(lng) }
      : undefined

  let result

  // Try to get from Firestore first
  if (city) {
    result = await getHospitalsByCity(city)
  } else if (type) {
    result = await getHospitalsByType(type)
  } else if (specialization) {
    result = await getHospitalsBySpecialization(specialization)
  } else {
    result = await getAllHospitals()
  }

  if (!result.success) {
    return new Response("Error fetching hospitals from Firestore", { status: 500 })
  }

  let list = result.data as Hospital[]

  // Apply additional filtering for type and specialization if needed
  if (type && city) {
    list = list.filter((h) => h.type?.toLowerCase() === type.toLowerCase())
  }
  if (specialization && (city || type)) {
    list = list.filter((h) => 
      (h.specializations || []).some((s) => s.toLowerCase() === specialization.toLowerCase())
    )
  }

  // Apply distance filtering if coordinates are provided
  if (origin) {
    list = list
      .map((h) => ({ ...h, distanceKm: haversineKm(origin.lat, origin.lng, h.lat, h.lng) }))
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
    updatedAt: new Date().toISOString()
  })

  if (result.success) {
    return Response.json({ ok: true })
  } else {
    return new Response("Failed to update hospital", { status: 500 })
  }
}
