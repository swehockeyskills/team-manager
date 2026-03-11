'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Roster', href: '/dashboard/roster', icon: '👥' },
    { label: 'Schedule', href: '/dashboard/schedule', icon: '📅' },
    { label: 'Payments', href: '/dashboard/payments', icon: '💰' },
    { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: '📚' },
    { label: 'AI Chat', href: '/dashboard/ai', icon: '🤖' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 border-r border-gray-800 transition-all duration-300`}>
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full py-2 px-3 rounded-lg hover:bg-gray-800 transition text-left"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full py-2 px-3 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition text-sm">
            {isSidebarOpen ? 'Sign Out' : '↓'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
