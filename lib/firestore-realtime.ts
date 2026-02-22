import { collection, doc, onSnapshot, Unsubscribe } from "firebase/firestore"
import { db } from "./firebase"

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

// Real-time listener for all hospitals
export const listenToAllHospitals = (callback: (hospitals: Hospital[]) => void): Unsubscribe => {
  const hospitalsCollection = collection(db, "hospitals")
  
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Hospital[]
    
    callback(hospitals)
  }, (error) => {
    console.error("Error listening to hospitals:", error)
  })
}

// Real-time listener for a specific hospital
export const listenToHospital = (hospitalId: string, callback: (hospital: Hospital | null) => void): Unsubscribe => {
  const hospitalDoc = doc(db, "hospitals", hospitalId)
  
  return onSnapshot(hospitalDoc, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      } as Hospital)
    } else {
      callback(null)
    }
  }, (error) => {
    console.error(`Error listening to hospital ${hospitalId}:`, error)
  })
}

// Real-time listener for hospitals in a specific city
export const listenToHospitalsByCity = (city: string, callback: (hospitals: Hospital[]) => void): Unsubscribe => {
  const hospitalsCollection = collection(db, "hospitals")
  
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Hospital)
      .filter(hospital => hospital.location.city === city)
    
    callback(hospitals)
  }, (error) => {
    console.error(`Error listening to hospitals in ${city}:`, error)
  })
}

// Real-time listener for hospitals with specific availability
export const listenToHospitalsWithICU = (callback: (hospitals: Hospital[]) => void): Unsubscribe => {
  const hospitalsCollection = collection(db, "hospitals")
  
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Hospital)
      .filter(hospital => hospital.icuAvailability)
    
    callback(hospitals)
  }, (error) => {
    console.error("Error listening to hospitals with ICU:", error)
  })
}

export const listenToHospitalsWithVentilators = (callback: (hospitals: Hospital[]) => void): Unsubscribe => {
  const hospitalsCollection = collection(db, "hospitals")
  
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Hospital)
      .filter(hospital => hospital.ventilatorAvailability)
    
    callback(hospitals)
  }, (error) => {
    console.error("Error listening to hospitals with ventilators:", error)
  })
}

export const listenToHospitalsWithEmergency = (callback: (hospitals: Hospital[]) => void): Unsubscribe => {
  const hospitalsCollection = collection(db, "hospitals")
  
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Hospital)
      .filter(hospital => hospital.emergencySupport)
    
    callback(hospitals)
  }, (error) => {
    console.error("Error listening to hospitals with emergency support:", error)
  })
}
