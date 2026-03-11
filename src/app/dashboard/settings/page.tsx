'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      console.error('Error signing out:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl">
        {/* Account Section */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h2 className="text-xl font-bold mb-4">Account</h2>
          <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-left font-medium">
            👤 Edit Profile
          </button>
        </div>

        {/* Team Section */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h2 className="text-xl font-bold mb-4">Team</h2>
          <div className="space-y-3">
            <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-left font-medium">
              ⚙️ Team Settings
            </button>
            <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-left font-medium">
              👥 Manage Coaches
            </button>
            <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-left font-medium">
              💾 Integrations
            </button>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h2 className="text-xl font-bold mb-4">Subscription</h2>
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Current Plan</p>
              <p className="font-semibold">Starter - $29/month</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Trial Ends</p>
              <p className="font-semibold">March 17, 2026</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <span className="px-3 py-1 bg-green-900/20 text-green-300 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
          <button className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 rounded-lg transition font-medium mb-2">
            Upgrade Plan
          </button>
          <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-medium">
            Manage Subscription
          </button>
        </div>

        {/* Billing Section */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h2 className="text-xl font-bold mb-4">Billing</h2>
          <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-left font-medium mb-2">
            💳 Payment Method
          </button>
          <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-left font-medium">
            📋 Billing History
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>
          <p className="text-gray-400 text-sm mb-4">
            These actions are irreversible. Proceed with caution.
          </p>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 bg-red-900/20 hover:bg-red-900/30 border border-red-700 rounded-lg transition text-red-400 font-medium">
              🗑️ Delete All Data
            </button>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-2 px-4 bg-red-900/20 hover:bg-red-900/30 border border-red-700 rounded-lg transition text-red-400 font-medium disabled:opacity-50"
            >
              {loading ? 'Signing Out...' : '🚪 Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
