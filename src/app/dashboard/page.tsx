'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Team {
  id: string
  name: string
  organization_id: string
}

interface Player {
  id: string
  first_name: string
  last_name: string
}

interface Event {
  id: string
  title: string
  event_type: string
  event_date: string
  start_time: string
}

export default function DashboardPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [playerCount, setPlayerCount] = useState(0)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const supabase = createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw userError

        // Get team (simplified: get first team for this user's organization)
        // In a real app, we'd store the current team in the session
        const { data: teams, error: teamsError } = await supabase
          .from('tm_teams')
          .select('*')
          .limit(1)

        if (teamsError) throw teamsError
        if (teams && teams.length > 0) {
          setTeam(teams[0])

          // Get player count
          const { count, error: playersError } = await supabase
            .from('tm_players')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', teams[0].id)

          if (!playersError && count !== null) {
            setPlayerCount(count)
          }

          // Get upcoming events
          const today = new Date().toISOString().split('T')[0]
          const { data: events, error: eventsError } = await supabase
            .from('tm_schedule')
            .select('*')
            .eq('team_id', teams[0].id)
            .gte('event_date', today)
            .order('event_date', { ascending: true })
            .limit(3)

          if (!eventsError && events) {
            setUpcomingEvents(events)
          }
        }
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{team?.name || 'Dashboard'}</h1>
        <p className="text-gray-400">Welcome back! Here's your team overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Players</p>
          <p className="text-3xl font-bold">{playerCount}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Events This Week</p>
          <p className="text-3xl font-bold">{upcomingEvents.length}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Pending Payments</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">AI Conversations</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-3 bg-gray-800 rounded-lg">
                  <span className="text-xl">{
                    event.event_type === 'game' ? '🏆' :
                    event.event_type === 'practice' ? '📚' :
                    event.event_type === 'tournament' ? '🎯' :
                    '📅'
                  }</span>
                  <div className="flex-1">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-400">
                      {event.event_date} {event.start_time ? `@ ${event.start_time}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 rounded-lg transition">
              + Add Player
            </button>
            <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              + Add Event
            </button>
            <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              View Payments
            </button>
            <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              Knowledge Base
            </button>
          </div>
        </div>
      </div>

      {/* Recent AI Conversations */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Recent AI Conversations</h2>
        <p className="text-gray-400 text-sm">No conversations yet. Start chatting with parents!</p>
      </div>
    </div>
  )
}
