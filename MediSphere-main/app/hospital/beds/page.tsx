"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Bed,
  BedDouble,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Activity,
  Clock,
  MapPin,
  Phone,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Settings
} from "lucide-react"

export default function HospitalBeds() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [beds, setBeds] = useState([
    {
      id: "B001",
      bedNumber: "ICU-1A-1",
      type: "ICU",
      department: "Cardiology",
      floor: "2nd Floor",
      room: "ICU-1A",
      status: "occupied",
      patient: {
        id: "P001",
        name: "Rajesh Kumar",
        age: 45,
        condition: "Cardiac Arrhythmia",
        admissionDate: "2025-01-15",
        doctor: "Dr. Priya Sharma"
      },
      equipment: ["Ventilator", "Cardiac Monitor", "Infusion Pump"],
      lastCleaned: "2025-01-14",
      nextCleaning: "2025-01-16",
      price: 5000,
      insurance: "Max Health Insurance"
    },
    {
      id: "B002",
      bedNumber: "ICU-1A-2", 
      type: "ICU",
      department: "Cardiology",
      floor: "2nd Floor",
      room: "ICU-1A",
      status: "available",
      patient: null,
      equipment: ["Ventilator", "Cardiac Monitor", "Infusion Pump"],
      lastCleaned: "2025-01-14",
      nextCleaning: "2025-01-16",
      price: 5000,
      insurance: null
    },
    {
      id: "B003",
      bedNumber: "W-3B-1",
      type: "General Ward",
      department: "General Medicine",
      floor: "3rd Floor", 
      room: "Ward-3B",
      status: "occupied",
      patient: {
        id: "P002",
        name: "Meera Patel",
        age: 32,
        condition: "Pneumonia",
        admissionDate: "2025-01-15",
        doctor: "Dr. Amit Verma"
      },
      equipment: ["Oxygen Cylinder", "Call Bell"],
      lastCleaned: "2025-01-13",
      nextCleaning: "2025-01-17",
      price: 1500,
      insurance: "ICICI Lombard"
    },
    {
      id: "B004",
      bedNumber: "W-3B-2",
      type: "General Ward", 
      department: "General Medicine",
      floor: "3rd Floor",
      room: "Ward-3B",
      status: "maintenance",
      patient: null,
      equipment: ["Oxygen Cylinder", "Call Bell"],
      lastCleaned: "2025-01-12",
      nextCleaning: "2025-01-18",
      price: 1500,
      insurance: null,
      maintenanceReason: "Equipment Repair"
    },
    {
      id: "B005",
      bedNumber: "ICU-2A-1",
      type: "ICU",
      department: "Neurology",
      floor: "2nd Floor",
      room: "ICU-2A", 
      status: "occupied",
      patient: {
        id: "P003",
        name: "Sunil Singh",
        age: 58,
        condition: "Diabetes Complications",
        admissionDate: "2025-01-14",
        doctor: "Dr. Neha Gupta"
      },
      equipment: ["Ventilator", "EEG Monitor", "Infusion Pump", "Feeding Tube"],
      lastCleaned: "2025-01-14",
      nextCleaning: "2025-01-16",
      price: 6000,
      insurance: "Bajaj Allianz"
    },
    {
      id: "B006",
      bedNumber: "W-2A-1",
      type: "Private",
      department: "Orthopedics",
      floor: "1st Floor",
      room: "Private-2A",
      status: "available",
      patient: null,
      equipment: ["TV", "Refrigerator", "Attached Bathroom"],
      lastCleaned: "2025-01-15",
      nextCleaning: "2025-01-16",
      price: 3000,
      insurance: null
    }
  ])

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || bed.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'occupied': return 'default'
      case 'available': return 'secondary'
      case 'maintenance': return 'destructive'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'ICU': return <Bed className="size-5" />
      case 'Private': return <BedDouble className="size-5" />
      default: return <Bed className="size-5" />
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
          <h1 className="text-3xl font-bold">Bed Management</h1>
          <p className="text-muted-foreground">Manage hospital bed occupancy and availability</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Beds</p>
                <p className="text-2xl font-bold">{beds.length}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Bed className="size-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {beds.filter(b => b.status === 'available').length}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="size-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-orange-600">
                  {beds.filter(b => b.status === 'occupied').length}
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Users className="size-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-red-600">
                  {beds.filter(b => b.status === 'maintenance').length}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="size-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2">Search Beds</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by bed number, type, or department..."
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
                All ({beds.length})
              </Button>
              <Button
                variant={filterStatus === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("available")}
              >
                Available ({beds.filter(b => b.status === 'available').length})
              </Button>
              <Button
                variant={filterStatus === "occupied" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("occupied")}
              >
                Occupied ({beds.filter(b => b.status === 'occupied').length})
              </Button>
              <Button
                variant={filterStatus === "maintenance" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("maintenance")}
              >
                Maintenance ({beds.filter(b => b.status === 'maintenance').length})
              </Button>
            </div>
          </div>
        </Card>

        {/* Beds List */}
        <Card className="p-6">
          <div className="space-y-4">
            {filteredBeds.map((bed) => (
              <div key={bed.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex items-center justify-center">
                      {getTypeIcon(bed.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{bed.bedNumber}</h3>
                      <p className="text-sm text-muted-foreground">{bed.type} - {bed.department}</p>
                      <p className="text-sm text-muted-foreground">{bed.floor} - {bed.room}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant={getStatusColor(bed.status)}>
                        {bed.status.toUpperCase()}
                      </Badge>
                      <span className="ml-2">Status</span>
                    </div>
                    {bed.maintenanceReason && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertTriangle className="size-4" />
                        <span>{bed.maintenanceReason}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {bed.patient ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="size-4 text-muted-foreground" />
                          <span>{bed.patient.name} (Age: {bed.patient.age})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="size-4 text-muted-foreground" />
                          <span>Dr: {bed.patient.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span>Since: {bed.patient.admissionDate}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                        <span>Last cleaned: {bed.lastCleaned}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{bed.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span>{bed.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="size-4 text-muted-foreground" />
                      <span>₹{bed.price.toLocaleString()}/day</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="size-4 text-muted-foreground" />
                      <span>Equipment: {bed.equipment.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="size-4 text-muted-foreground" />
                      <span>Next cleaning: {bed.nextCleaning}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {bed.status === 'available' && (
                      <Button className="bg-primary text-primary-foreground">
                        <Plus className="size-4 mr-2" />
                        Assign Patient
                      </Button>
                    )}
                    {bed.status === 'occupied' && (
                      <Button variant="outline">
                        <Activity className="size-4 mr-2" />
                        View Details
                      </Button>
                    )}
                    {bed.status === 'maintenance' && (
                      <Button variant="outline">
                        <Settings className="size-4 mr-2" />
                        Manage Maintenance
                      </Button>
                    )}
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
                <span>Add New Bed</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Download className="size-6" />
                <span>Export Bed List</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calendar className="size-6" />
                <span>Cleaning Schedule</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Settings className="size-6" />
                <span>Bed Settings</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
