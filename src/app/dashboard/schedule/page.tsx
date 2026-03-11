'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Event {
  id: string
  title: string
  event_type: string
  event_date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  notes: string | null
}

export default function SchedulePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'practice',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    notes: '',
  })

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const supabase = createClient()
        
        const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
        if (!teams?.[0]) return

        const { data, error } = await supabase
          .from('tm_schedule')
          .select('*')
          .eq('team_id', teams[0].id)
          .order('event_date', { ascending: true })

        if (!error && data) {
          setEvents(data)
        }
      } catch (err) {
        console.error('Error loading events:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'game':
        return '🏆'
      case 'practice':
        return '📚'
      case 'tournament':
        return '🎯'
      case 'meeting':
        return '👥'
      default:
        return '📅'
    }
  }

  const handleAddEvent = async () => {
    try {
      const supabase = createClient()
      
      const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
      if (!teams?.[0]) return

      const { error } = await supabase.from('tm_schedule').insert({
        team_id: teams[0].id,
        ...formData,
      })

      if (!error) {
        setFormData({
          title: '',
          event_type: 'practice',
          event_date: '',
          start_time: '',
          end_time: '',
          location: '',
          notes: '',
        })
        setShowModal(false)
        // Reload events
        window.location.reload()
      }
    } catch (err) {
      console.error('Error adding event:', err)
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schedule</h1>
          <p className="text-gray-400">Manage your team's events</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition"
        >
          + Add Event
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center text-gray-400">
            No events scheduled. Add your first event to get started.
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{getEventIcon(event.event_type)}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p>{event.event_date}</p>
                    </div>
                    {event.start_time && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Time</p>
                        <p>
                          {event.start_time}
                          {event.end_time && ` - ${event.end_time}`}
                        </p>
                      </div>
                    )}
                    {event.location && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p>{event.location}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="capitalize">{event.event_type}</p>
                    </div>
                  </div>
                  {event.notes && (
                    <p className="text-sm text-gray-400 mt-3 p-3 bg-gray-800 rounded">
                      {event.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add Event</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                  placeholder="e.g., Game vs. Lightning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                >
                  <option value="practice">Practice</option>
                  <option value="game">Game</option>
                  <option value="tournament">Tournament</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                    placeholder="e.g., Miami Ice Arena"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 h-24 resize-none"
                  placeholder="Add any additional notes"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-600 rounded-lg hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
