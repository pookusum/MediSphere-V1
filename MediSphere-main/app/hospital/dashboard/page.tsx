"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  Users, 
  Bed, 
  Calendar, 
  TrendingUp, 
  Activity,
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Heart,
  FileText,
  Settings,
  Plus,
  Search,
  Filter,
  Bell
} from "lucide-react"

export default function HospitalDashboard() {
  const [stats, setStats] = useState({
    totalBeds: 450,
    occupiedBeds: 320,
    availableBeds: 130,
    totalPatients: 1250,
    todayAppointments: 45,
    emergencyCases: 8,
    staffOnDuty: 24,
    averageWaitTime: 18,
    occupancyRate: 71
  })

  const [recentPatients, setRecentPatients] = useState([
    {
      id: "P001",
      name: "Rajesh Kumar",
      age: 45,
      condition: "Cardiac Arrhythmia",
      admissionDate: "2025-01-15",
      doctor: "Dr. Priya Sharma",
      status: "stable",
      room: "ICU-2A"
    },
    {
      id: "P002", 
      name: "Meera Patel",
      age: 32,
      condition: "Pneumonia",
      admissionDate: "2025-01-15",
      doctor: "Dr. Amit Verma",
      status: "recovering",
      room: "Ward-3B"
    },
    {
      id: "P003",
      name: "Sunil Singh",
      age: 58,
      condition: "Diabetes Complications",
      admissionDate: "2025-01-14",
      doctor: "Dr. Neha Gupta",
      status: "critical",
      room: "ICU-1A"
    }
  ])

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: "A001",
      patientName: "Anjali Deshmukh",
      time: "09:00 AM",
      type: "Cardiology Consultation",
      doctor: "Dr. Rohan Mehta"
    },
    {
      id: "A002",
      patientName: "Vikram Malhotra",
      time: "10:30 AM", 
      type: "Post-Surgery Checkup",
      doctor: "Dr. Sneha Kapoor"
    },
    {
      id: "A003",
      patientName: "Kavita Nair",
      time: "02:00 PM",
      type: "Emergency Admission",
      doctor: "Dr. Arjun Rao"
    }
  ])

  const [notifications, setNotifications] = useState([
    {
      id: "N001",
      type: "emergency",
      message: "Critical patient admitted to ICU",
      time: "2 mins ago",
      read: false
    },
    {
      id: "N002", 
      type: "info",
      message: "Staff meeting at 3:00 PM",
      time: "1 hour ago",
      read: true
    },
    {
      id: "N003",
      type: "warning",
      message: "Bed occupancy rate exceeds 80%",
      time: "3 hours ago",
      read: false
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
          <p className="text-muted-foreground">Manage your hospital operations and patient care</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Beds</p>
                <p className="text-2xl font-bold">{stats.totalBeds}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Bed className="size-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Beds</p>
                <p className="text-2xl font-bold text-green-600">{stats.availableBeds}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="size-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold text-orange-600">{stats.occupancyRate}%</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <TrendingUp className="size-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="size-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Patients */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Patients</h3>
              <Button variant="outline" size="sm">
                <Plus className="size-4 mr-2" />
                Add Patient
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex items-center justify-center">
                        <Users className="size-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                        <p className="text-sm text-muted-foreground">Condition: {patient.condition}</p>
                        <p className="text-sm text-muted-foreground">Dr: {patient.doctor}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={patient.status === 'critical' ? 'destructive' : patient.status === 'recovering' ? 'default' : 'secondary'}>
                      {patient.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{patient.room}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link href="/hospital/patients">
                <Button className="w-full">
                  View All Patients
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Today's Appointments</h3>
              <Button variant="outline" size="sm">
                <Calendar className="size-4 mr-2" />
                Schedule
              </Button>
            </div>
            
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    <p className="text-sm text-muted-foreground">Dr: {appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link href="/hospital/appointments">
                <Button className="w-full">
                  View All Appointments
                </Button>
              </Link>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <Button variant="outline" size="sm">
                <Bell className="size-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                  !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    notification.type === 'emergency' ? 'bg-red-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Users className="size-6" />
                <span>Manage Patients</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Bed className="size-6" />
                <span>Bed Management</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calendar className="size-6" />
                <span>Appointments</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <FileText className="size-6" />
                <span>Reports</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Settings className="size-6" />
                <span>Settings</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Stethoscope className="size-6" />
                <span>Staff Management</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Heart className="size-6" />
                <span>Emergency</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Phone className="size-6" />
                <span>Contact</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
