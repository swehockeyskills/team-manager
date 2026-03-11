'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  message_in: string
  message_out: string
  self_rating: number | null
  flagged: boolean
  created_at: string
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [testInput, setTestInput] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResponse, setTestResponse] = useState('')

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const supabase = createClient()
        
        const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
        if (!teams?.[0]) return

        const { data, error } = await supabase
          .from('tm_conversations')
          .select('*')
          .eq('team_id', teams[0].id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!error && data) {
          setMessages(data)
        }
      } catch (err) {
        console.error('Error loading conversations:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  const handleTestMessage = async () => {
    if (!testInput.trim()) return

    setTesting(true)
    setTestResponse('')

    try {
      // Call n8n webhook
      const response = await fetch('https://nillel25.app.n8n.cloud/webhook/shs-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testInput,
          channel: 'test',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTestResponse(data.response || 'No response from AI')

        // Save to database
        const supabase = createClient()
        const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
        if (teams?.[0]) {
          await supabase.from('tm_conversations').insert({
            team_id: teams[0].id,
            channel: 'test',
            message_in: testInput,
            message_out: data.response || '',
          })
        }
      } else {
        setTestResponse('Error calling AI. Check your n8n webhook.')
      }
    } catch (err) {
      setTestResponse(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setTesting(false)
      setTestInput('')
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">AI Chat Test</h1>
        <p className="text-gray-400 mb-8">Test your AI assistant before going live</p>
      </div>

      {/* Test Interface */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Chat Input */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Send Test Message</h2>
          
          <div className="space-y-4">
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Type a message to test..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 h-32 resize-none"
              disabled={testing}
            />

            <button
              onClick={handleTestMessage}
              disabled={testing || !testInput.trim()}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 rounded-lg font-semibold transition"
            >
              {testing ? 'Sending...' : 'Send Message'}
            </button>

            {testResponse && (
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">AI Response:</p>
                <p className="text-white">{testResponse}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>✅ AI learns from your Knowledge Base</li>
              <li>✅ Handles 24/7 parent questions</li>
              <li>✅ Responds via text, email, or chat</li>
              <li>✅ Escalates complex issues to you</li>
              <li>✅ Gets smarter over time</li>
            </ul>
          </div>

          <div className="bg-violet-900/20 border border-violet-600/30 p-6 rounded-lg">
            <h3 className="font-bold mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-gray-400">
              The more Q&As you add to your Knowledge Base, the better the AI responds. Start with common parent questions!
            </p>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Recent Conversations</h2>
        
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No conversations yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-gray-300 mb-2">{msg.message_in}</p>
                    <p className="text-violet-400 text-sm">{msg.message_out}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {msg.self_rating && (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        Rating: {msg.self_rating}/10
                      </span>
                    )}
                    {msg.flagged && (
                      <span className="text-xs bg-red-900/20 text-red-300 px-2 py-1 rounded">
                        Flagged
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
