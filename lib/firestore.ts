import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, DocumentData, Query } from "firebase/firestore"
import { db } from "./firebase"

// Generic collection operations
export const createDocument = async (collectionName: string, id: string, data: DocumentData) => {
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

export const updateDocument = async (collectionName: string, id: string, data: Partial<DocumentData>) => {
  try {
    await updateDoc(doc(db, collectionName, id), data)
    return { success: true }
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    return { success: false, error }
  }
}

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id))
    return { success: true }
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    return { success: false, error }
  }
}

export const getCollection = async (collectionName: string, queryFn?: (ref: any) => any) => {
  try {
    let q = collection(db, collectionName)
    if (queryFn) {
      q = queryFn(q)
    }
    const querySnapshot = await getDocs(q)
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return { success: true, data: documents }
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    return { success: false, error }
  }
}

// Specific hospital collection operations
export const hospitalsCollection = collection(db, "hospitals")

export const createHospital = async (id: string, hospitalData: DocumentData) => {
  return createDocument("hospitals", id, hospitalData)
}

export const getHospital = async (id: string) => {
  return getDocument("hospitals", id)
}

export const updateHospital = async (id: string, data: Partial<DocumentData>) => {
  return updateDocument("hospitals", id, data)
}

export const deleteHospital = async (id: string) => {
  return deleteDocument("hospitals", id)
}

export const getAllHospitals = async () => {
  return getCollection("hospitals")
}

export const getHospitalsByCity = async (city: string) => {
  return getCollection("hospitals", (ref) => query(ref, where("location.city", "==", city)))
}

export const getHospitalsByType = async (type: string) => {
  return getCollection("hospitals", (ref) => query(ref, where("type", "==", type)))
}

export const getHospitalsBySpecialization = async (specialization: string) => {
  return getCollection("hospitals", (ref) => 
    query(ref, where("specializations", "array-contains", specialization))
  )
}

export const getHospitalsWithICU = async (available: boolean = true) => {
  return getCollection("hospitals", (ref) => query(ref, where("icuAvailability", "==", available)))
}

export const getHospitalsWithVentilators = async (available: boolean = true) => {
  return getCollection("hospitals", (ref) => query(ref, where("ventilatorAvailability", "==", available)))
}

export const getHospitalsWithEmergencySupport = async (available: boolean = true) => {
  return getCollection("hospitals", (ref) => query(ref, where("emergencySupport", "==", available)))
}
