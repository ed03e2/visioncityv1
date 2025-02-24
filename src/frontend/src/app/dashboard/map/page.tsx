"use client"
import PineMap from "@/app/components/map/PineMap"
import Sidebar from "@/app/components/map/Sidebar"

export default function MapPage() {
  return (
    <div className="relative w-screen h-screen">
      <Sidebar />
      <PineMap />
    </div>
  )
}