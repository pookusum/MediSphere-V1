"use client"

import HospitalListRealtime from "@/components/hospital-list-realtime"
import { NavBar } from "@/components/nav-bar"

export default function RealtimePage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <HospitalListRealtime />
      </section>
      
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MediSphere</p>
          <p className="text-sm">Real-time hospital availability updates</p>
        </div>
      </footer>
    </main>
  )
}
