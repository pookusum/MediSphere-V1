import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, Unsubscribe } from "firebase/firestore"
import { db } from "./firebase"

export type HospitalLevel = "PHC" | "CHC" | "District" | "Medical College"
export type HospitalType = "Government" | "Private" | "Trust"

export interface HospitalInfrastructure {
  id: string
  name: string
  city: string
  type: HospitalType
  level: HospitalLevel
  totalBeds: number
  availableBeds: number
  totalICU: number
  availableICU: number
  totalVentilators: number
  availableVentilators: number
  emergencyAvailability: boolean
  lastUpdated: string
}

// Generic collection operations
export const createDocument = async (collectionName: string, id: string, data: any) => {
  try {
    await setDoc(doc(db, collectionName, id), data)
    return { success: true, id }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    return { success: false, error }
  }
}

export const getDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    } else {
      return { success: false, error: "Document not found" }
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    return { success: false, error }
  }
}

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    await updateDoc(doc(db, collectionName, id), data)
    return { success: true }
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    return { success: false, error }
  }
}

// Hospital infrastructure operations
export const hospitalsCollection = collection(db, "hospitals")

export const createHospital = async (id: string, hospitalData: Omit<HospitalInfrastructure, 'id'>) => {
  return createDocument("hospitals", id, hospitalData)
}

export const getHospital = async (id: string) => {
  return getDocument("hospitals", id)
}

export const updateHospital = async (id: string, data: Partial<HospitalInfrastructure>) => {
  const updateData = {
    ...data,
    lastUpdated: new Date().toISOString()
  }
  return updateDocument("hospitals", id, updateData)
}

export const deleteHospital = async (id: string) => {
  return deleteDocument("hospitals", id)
}

export const getAllHospitals = async () => {
  try {
    const querySnapshot = await getDocs(hospitalsCollection)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error("Error getting all hospitals:", error)
    return { success: false, error }
  }
}

export const getHospitalsByCity = async (city: string) => {
  try {
    const q = query(hospitalsCollection, where("city", "==", city))
    const querySnapshot = await getDocs(q)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error(`Error getting hospitals in ${city}:`, error)
    return { success: false, error }
  }
}

export const getHospitalsByType = async (type: HospitalType) => {
  try {
    const q = query(hospitalsCollection, where("type", "==", type))
    const querySnapshot = await getDocs(q)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error(`Error getting ${type} hospitals:`, error)
    return { success: false, error }
  }
}

export const getHospitalsByLevel = async (level: HospitalLevel) => {
  try {
    const q = query(hospitalsCollection, where("level", "==", level))
    const querySnapshot = await getDocs(q)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error(`Error getting ${level} hospitals:`, error)
    return { success: false, error }
  }
}

export const getHospitalsWithAvailableBeds = async (minBeds: number = 1) => {
  try {
    const q = query(hospitalsCollection, where("availableBeds", ">=", minBeds))
    const querySnapshot = await getDocs(q)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error("Error getting hospitals with available beds:", error)
    return { success: false, error }
  }
}

export const getHospitalsWithICU = async (minICU: number = 1) => {
  try {
    const q = query(hospitalsCollection, where("availableICU", ">=", minICU))
    const querySnapshot = await getDocs(q)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error("Error getting hospitals with ICU:", error)
    return { success: false, error }
  }
}

export const getHospitalsWithVentilators = async (minVentilators: number = 1) => {
  try {
    const q = query(hospitalsCollection, where("availableVentilators", ">=", minVentilators))
    const querySnapshot = await getDocs(q)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error("Error getting hospitals with ventilators:", error)
    return { success: false, error }
  }
}

export const getHospitalsWithEmergency = async () => {
  try {
    const q = query(hospitalsCollection, where("emergencyAvailability", "==", true))
    const querySnapshot = await getDocs(q)
    const hospitals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    return { success: true, data: hospitals }
  } catch (error) {
    console.error("Error getting hospitals with emergency:", error)
    return { success: false, error }
  }
}

// Real-time listeners
export const listenToAllHospitals = (callback: (hospitals: HospitalInfrastructure[]) => void): Unsubscribe => {
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HospitalInfrastructure[]
    callback(hospitals)
  }, (error) => {
    console.error("Error listening to hospitals:", error)
  })
}

export const listenToHospital = (hospitalId: string, callback: (hospital: HospitalInfrastructure | null) => void): Unsubscribe => {
  const hospitalDoc = doc(db, "hospitals", hospitalId)
  
  return onSnapshot(hospitalDoc, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      } as HospitalInfrastructure)
    } else {
      callback(null)
    }
  }, (error) => {
    console.error(`Error listening to hospital ${hospitalId}:`, error)
  })
}

export const listenToHospitalsByCity = (city: string, callback: (hospitals: HospitalInfrastructure[]) => void): Unsubscribe => {
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as HospitalInfrastructure)
      .filter(hospital => hospital.city === city)
    callback(hospitals)
  }, (error) => {
    console.error(`Error listening to hospitals in ${city}:`, error)
  })
}

export const listenToHospitalsWithAvailableBeds = (callback: (hospitals: HospitalInfrastructure[]) => void, minBeds: number = 1): Unsubscribe => {
  return onSnapshot(hospitalsCollection, (snapshot) => {
    const hospitals = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as HospitalInfrastructure)
      .filter(hospital => hospital.availableBeds >= minBeds)
    callback(hospitals)
  }, (error) => {
    console.error("Error listening to hospitals with available beds:", error)
  })
}
