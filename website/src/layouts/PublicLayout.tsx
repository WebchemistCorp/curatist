import React from 'react'
import { Outlet } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const PublicLayout: React.FC = () => (
  <div className="min-h-screen bg-[#09090b] text-zinc-50 flex flex-col">
    <Nav />
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
  </div>
)

export default PublicLayout
