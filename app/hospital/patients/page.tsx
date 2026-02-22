"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Users,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Bed,
  Heart,
  Activity,
  Clock,
  Stethoscope,
  FileText,
  Download,
  Edit,
  Trash2,
  ChevronRight
} from "lucide-react"

export default function HospitalPatients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [patients, setPatients] = useState([
    {
      id: "P001",
      name: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      bloodGroup: "B+",
      contact: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      address: "123, Sector 15, Chandigarh",
      emergencyContact: "+91 98765 43211",
      admissionDate: "2025-01-15",
      condition: "Cardiac Arrhythmia",
      doctor: "Dr. Priya Sharma",
      department: "Cardiology",
      room: "ICU-2A",
      bedNumber: "ICU-2A-1",
      status: "stable",
      insurance: "Max Health Insurance",
      policyNumber: "MH-456789",
      allergies: "Penicillin",
      medications: ["Aspirin", "Metoprolol", "Lisinopril"],
      lastVitals: {
        bloodPressure: "120/80",
        heartRate: 72,
        temperature: 98.6,
        oxygenLevel: 96
      }
    },
    {
      id: "P002",
      name: "Meera Patel", 
      age: 32,
      gender: "Female",
      bloodGroup: "A+",
      contact: "+91 98765 54321",
      email: "meera.patel@email.com",
      address: "456, Sector 22, Mohali",
      emergencyContact: "+91 98765 54322",
      admissionDate: "2025-01-15",
      condition: "Pneumonia",
      doctor: "Dr. Amit Verma",
      department: "Pulmonology",
      room: "Ward-3B",
      bedNumber: "W-3B-2",
      status: "recovering",
      insurance: "ICICI Lombard",
      policyNumber: "IL-789012",
      allergies: "None",
      medications: ["Amoxicillin", "Paracetamol"],
      lastVitals: {
        bloodPressure: "110/70",
        heartRate: 88,
        temperature: 99.2,
        oxygenLevel: 98
      }
    },
    {
      id: "P003",
      name: "Sunil Singh",
      age: 58,
      gender: "Male", 
      bloodGroup: "O+",
      contact: "+91 98765 67890",
      email: "sunil.singh@email.com",
      address: "789, Sector 17, Panchkula",
      emergencyContact: "+91 98765 67891",
      admissionDate: "2025-01-14",
      condition: "Diabetes Complications",
      doctor: "Dr. Neha Gupta",
      department: "Endocrinology",
      room: "ICU-1A",
      bedNumber: "ICU-1A-1",
      status: "critical",
      insurance: "Bajaj Allianz",
      policyNumber: "BA-345678",
      allergies: "Sulfa drugs",
      medications: ["Insulin", "Metformin"],
      lastVitals: {
        bloodPressure: "140/90",
        heartRate: 95,
        temperature: 101.2,
        oxygenLevel: 92
      }
    }
  ])

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'destructive'
      case 'stable': return 'default'
      case 'recovering': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/hospital/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground">Manage and monitor all hospital patients</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2">Search Patients</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, ID, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All ({patients.length})
              </Button>
              <Button
                variant={filterStatus === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("critical")}
              >
                Critical (1)
              </Button>
              <Button
                variant={filterStatus === "stable" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("stable")}
              >
                Stable (1)
              </Button>
              <Button
                variant={filterStatus === "recovering" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("recovering")}
              >
                Recovering (1)
              </Button>
            </div>
          </div>
        </Card>

        {/* Patients List */}
        <Card className="p-6">
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex items-center justify-center">
                      <Users className="size-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="size-4 text-muted-foreground" />
                      <span>Age: {patient.age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span>{patient.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{patient.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      <span>{patient.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Stethoscope className="size-4 text-muted-foreground" />
                      <span>Dr: {patient.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="size-4 text-muted-foreground" />
                      <span>Dept: {patient.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="size-4 text-muted-foreground" />
                      <span>{patient.room} - {patient.bedNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="size-4 text-muted-foreground" />
                      <span>Blood: {patient.bloodGroup}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>Admitted: {patient.admissionDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="size-4 text-muted-foreground" />
                      <span>Condition: {patient.condition}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(patient.status)}>
                      {patient.status.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-16 flex-col gap-2">
                <Plus className="size-6" />
                <span>Admit Patient</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Download className="size-6" />
                <span>Export Reports</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calendar className="size-6" />
                <span>Schedule Appointments</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Bed className="size-6" />
                <span>Bed Management</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
