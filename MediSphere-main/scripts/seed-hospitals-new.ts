import { createHospital } from "../lib/firestore"

const hospitalData = [
  {
    id: "h1",
    name: "City Care Hospital",
    totalBeds: 120,
    availableBeds: 15,
    icuAvailability: true,
    ventilatorAvailability: true,
    emergencySupport: true,
    location: {
      address: "123 Main St, Delhi",
      coordinates: {
        latitude: 28.6448,
        longitude: 77.2167
      },
      city: "Delhi",
      state: "Delhi"
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "h2",
    name: "Green Valley Medical",
    totalBeds: 90,
    availableBeds: 10,
    icuAvailability: false,
    ventilatorAvailability: false,
    emergencySupport: true,
    location: {
      address: "456 Park Ave, Delhi",
      coordinates: {
        latitude: 28.6139,
        longitude: 77.209
      },
      city: "Delhi",
      state: "Delhi"
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "h3",
    name: "Metro Life Hospital",
    totalBeds: 200,
    availableBeds: 40,
    icuAvailability: true,
    ventilatorAvailability: true,
    emergencySupport: true,
    location: {
      address: "789 Hospital Rd, Noida",
      coordinates: {
        latitude: 28.5355,
        longitude: 77.391
      },
      city: "Noida",
      state: "Uttar Pradesh"
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "h4",
    name: "Thane Central Hospital",
    totalBeds: 140,
    availableBeds: 30,
    icuAvailability: true,
    ventilatorAvailability: true,
    emergencySupport: true,
    location: {
      address: "321 Central Rd, Thane",
      coordinates: {
        latitude: 19.2183,
        longitude: 72.9781
      },
      city: "Thane",
      state: "Maharashtra"
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "h5",
    name: "Mumbai Coastal Care",
    totalBeds: 250,
    availableBeds: 40,
    icuAvailability: true,
    ventilatorAvailability: true,
    emergencySupport: true,
    location: {
      address: "555 Beach Rd, Mumbai",
      coordinates: {
        latitude: 19.076,
        longitude: 72.8777
      },
      city: "Mumbai",
      state: "Maharashtra"
    },
    lastUpdated: new Date().toISOString()
  }
]

async function seedHospitals() {
  console.log("Starting to seed hospitals collection with new structure...")
  
  for (const hospital of hospitalData) {
    try {
      const result = await createHospital(hospital.id, hospital)
      if (result.success) {
        console.log(`✅ Successfully added hospital: ${hospital.name}`)
      } else {
        console.error(`❌ Failed to add hospital: ${hospital.name}`, result.error)
      }
    } catch (error) {
      console.error(`❌ Error adding hospital ${hospital.name}:`, error)
    }
  }
  
  console.log("Finished seeding hospitals collection.")
}

// Run the seeding function
seedHospitals().catch(console.error)
