import type { NextRequest } from "next/server"

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

const HOSPITALS: Hospital[] = [
  {
    id: "h1",
    name: "City Care Hospital",
    lat: 28.6448,
    lng: 77.2167,
    bedsTotal: 120,
    bedsOccupied: 105,
    opdQueue: 18,
    doctorsAvailable: 22,
    bloodBank: { A: 25, B: 19, O: 30, AB: 10 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Delhi",
    type: "Government",
    specializations: ["General", "Cardiology", "Orthopedics"],
  },
  {
    id: "h2",
    name: "Green Valley Medical",
    lat: 28.6139,
    lng: 77.209,
    bedsTotal: 90,
    bedsOccupied: 80,
    opdQueue: 12,
    doctorsAvailable: 15,
    bloodBank: { A: 10, B: 8, O: 20, AB: 5 },
    icuAvailable: false,
    updatedAt: new Date().toISOString(),
    city: "Delhi",
    type: "Private",
    specializations: ["Pediatrics", "General"],
  },
  {
    id: "h3",
    name: "Metro Life Hospital",
    lat: 28.5355,
    lng: 77.391,
    bedsTotal: 200,
    bedsOccupied: 160,
    opdQueue: 27,
    doctorsAvailable: 35,
    bloodBank: { A: 40, B: 30, O: 45, AB: 15 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Noida",
    type: "Trust",
    specializations: ["Orthopedics", "Multi-speciality", "Cardiology"],
  },
  {
    id: "h4",
    name: "Thane Central Hospital",
    lat: 19.2183,
    lng: 72.9781,
    bedsTotal: 140,
    bedsOccupied: 110,
    opdQueue: 15,
    doctorsAvailable: 20,
    bloodBank: { A: 15, B: 12, O: 25, AB: 7 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Thane",
    type: "Government",
    specializations: ["Orthopedics", "General"],
  },
  {
    id: "h5",
    name: "Mumbai Coastal Care",
    lat: 19.076,
    lng: 72.8777,
    bedsTotal: 250,
    bedsOccupied: 210,
    opdQueue: 32,
    doctorsAvailable: 42,
    bloodBank: { A: 35, B: 28, O: 50, AB: 18 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Mumbai",
    type: "Private",
    specializations: ["Multi-speciality", "Cardiology", "Pediatrics"],
  },
  // Punjab Hospitals
  {
    id: "h6",
    name: "Post Graduate Institute of Medical Education and Research (PGIMER)",
    lat: 30.7649,
    lng: 76.7794,
    bedsTotal: 1800,
    bedsOccupied: 1450,
    opdQueue: 85,
    doctorsAvailable: 320,
    bloodBank: { A: 450, B: 380, O: 520, AB: 180 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Chandigarh",
    type: "Government",
    specializations: ["Multi-speciality", "Cardiology", "Neurology", "Oncology", "Pediatrics"],
  },
  {
    id: "h7",
    name: "Government Medical College and Hospital",
    lat: 30.7021,
    lng: 76.7146,
    bedsTotal: 1200,
    bedsOccupied: 980,
    opdQueue: 65,
    doctorsAvailable: 240,
    bloodBank: { A: 320, B: 280, O: 380, AB: 120 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Chandigarh",
    type: "Government",
    specializations: ["General", "Surgery", "Orthopedics", "Gynecology"],
  },
  {
    id: "h8",
    name: "Fortis Hospital Mohali",
    lat: 30.6846,
    lng: 76.7185,
    bedsTotal: 350,
    bedsOccupied: 280,
    opdQueue: 35,
    doctorsAvailable: 85,
    bloodBank: { A: 120, B: 95, O: 140, AB: 45 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Mohali",
    type: "Private",
    specializations: ["Cardiology", "Neurology", "Orthopedics", "Multi-speciality"],
  },
  {
    id: "h9",
    name: "Max Super Speciality Hospital Bathinda",
    lat: 30.2164,
    lng: 74.9445,
    bedsTotal: 280,
    bedsOccupied: 220,
    opdQueue: 28,
    doctorsAvailable: 65,
    bloodBank: { A: 85, B: 72, O: 98, AB: 35 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Bathinda",
    type: "Private",
    specializations: ["Multi-speciality", "Cardiology", "Pediatrics"],
  },
  {
    id: "h10",
    name: "Civil Hospital Ludhiana",
    lat: 30.9010,
    lng: 75.8573,
    bedsTotal: 500,
    bedsOccupied: 420,
    opdQueue: 45,
    doctorsAvailable: 95,
    bloodBank: { A: 150, B: 125, O: 180, AB: 65 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Ludhiana",
    type: "Government",
    specializations: ["General", "Surgery", "Pediatrics", "Orthopedics"],
  },
  {
    id: "h11",
    name: "Dayanand Medical College",
    lat: 31.6315,
    lng: 75.1298,
    bedsTotal: 850,
    bedsOccupied: 680,
    opdQueue: 55,
    doctorsAvailable: 180,
    bloodBank: { A: 220, B: 185, O: 260, AB: 95 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Ludhiana",
    type: "Government",
    specializations: ["Multi-speciality", "General", "Surgery", "Pediatrics"],
  },
  {
    id: "h12",
    name: "Christian Medical College Ludhiana",
    lat: 30.9023,
    lng: 75.8426,
    bedsTotal: 750,
    bedsOccupied: 600,
    opdQueue: 48,
    doctorsAvailable: 160,
    bloodBank: { A: 195, B: 165, O: 230, AB: 80 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Ludhiana",
    type: "Private",
    specializations: ["Multi-speciality", "Cardiology", "Neurology", "Oncology"],
  },
  {
    id: "h13",
    name: "Sri Guru Ram Das Hospital Amritsar",
    lat: 31.6340,
    lng: 74.8723,
    bedsTotal: 650,
    bedsOccupied: 520,
    opdQueue: 42,
    doctorsAvailable: 140,
    bloodBank: { A: 175, B: 145, O: 200, AB: 70 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Amritsar",
    type: "Government",
    specializations: ["Multi-speciality", "General", "Surgery", "Pediatrics"],
  },
  {
    id: "h14",
    name: "Amandeep Hospital Jalandhar",
    lat: 31.3260,
    lng: 75.5762,
    bedsTotal: 300,
    bedsOccupied: 240,
    opdQueue: 32,
    doctorsAvailable: 75,
    bloodBank: { A: 95, B: 80, O: 115, AB: 40 },
    icuAvailable: true,
    updatedAt: new Date().toISOString(),
    city: "Jalandhar",
    type: "Private",
    specializations: ["Multi-speciality", "Cardiology", "Orthopedics", "Pediatrics"],
  },
]

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

  let list = HOSPITALS.map((h) => ({ ...h }))

  if (city) list = list.filter((h) => h.city?.toLowerCase() === city.toLowerCase())
  if (type) list = list.filter((h) => h.type?.toLowerCase() === type.toLowerCase())
  if (specialization)
    list = list.filter((h) => (h.specializations || []).some((s) => s.toLowerCase() === specialization.toLowerCase()))

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
  const updated: Hospital | undefined = body?.hospital
  if (!updated) return new Response("Invalid body", { status: 400 })
  const idx = HOSPITALS.findIndex((h) => h.id === updated.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  HOSPITALS[idx] = { ...updated, updatedAt: new Date().toISOString() }
  return Response.json({ ok: true })
}
