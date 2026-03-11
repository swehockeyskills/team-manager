'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Player {
  id: string
  first_name: string
  last_name: string
  jersey_number: string | null
  position: string | null
  birth_year: number | null
  status: string
}

export default function RosterPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const supabase = createClient()
        
        // Get first team
        const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
        if (!teams?.[0]) return

        const { data, error } = await supabase
          .from('tm_players')
          .select('*')
          .eq('team_id', teams[0].id)
          .order('last_name')

        if (!error && data) {
          setPlayers(data)
        }
      } catch (err) {
        console.error('Error loading players:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/20 text-green-300'
      case 'inactive':
        return 'bg-gray-800 text-gray-300'
      case 'tryout':
        return 'bg-yellow-900/20 text-yellow-300'
      default:
        return 'bg-gray-800 text-gray-300'
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Roster</h1>
          <p className="text-gray-400">Manage your team's players</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition"
        >
          + Add Player
        </button>
      </div>

      {/* Players Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Jersey</th>
              <th className="px-6 py-4 text-left font-semibold">Position</th>
              <th className="px-6 py-4 text-left font-semibold">Birth Year</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No players yet. Add your first player to get started.
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr
                  key={player.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition cursor-pointer"
                  onClick={() => setSelectedPlayer(player)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold">
                      {player.first_name} {player.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    #{player.jersey_number || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {player.position || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {player.birth_year || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(player.status)}`}>
                      {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Player Detail Side Panel */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full md:w-96 bg-gray-900 border-l border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">
                {selectedPlayer.first_name} {selectedPlayer.last_name}
              </h2>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Jersey Number</p>
                <p className="text-lg font-semibold">#{selectedPlayer.jersey_number || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Position</p>
                <p className="text-lg font-semibold">{selectedPlayer.position || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Birth Year</p>
                <p className="text-lg font-semibold">{selectedPlayer.birth_year || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPlayer.status)}`}>
                  {selectedPlayer.status.charAt(0).toUpperCase() + selectedPlayer.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 space-y-2">
              <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                Edit Player
              </button>
              <button className="w-full py-2 text-red-400 hover:text-red-300 transition">
                Delete Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
