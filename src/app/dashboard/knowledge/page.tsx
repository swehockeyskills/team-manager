'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface KnowledgeBase {
  id: string
  topic: string | null
  question: string
  answer: string
  tags: string[]
  source: string
  is_active: boolean
}

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    topic: '',
    question: '',
    answer: '',
    tags: '',
  })

  useEffect(() => {
    const loadKnowledge = async () => {
      try {
        const supabase = createClient()
        
        const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
        if (!teams?.[0]) return

        const { data, error } = await supabase
          .from('tm_knowledge')
          .select('*')
          .eq('team_id', teams[0].id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setKnowledge(data)
        }
      } catch (err) {
        console.error('Error loading knowledge:', err)
      } finally {
        setLoading(false)
      }
    }

    loadKnowledge()
  }, [])

  const handleAddKnowledge = async () => {
    try {
      const supabase = createClient()
      
      const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
      if (!teams?.[0]) return

      const { error } = await supabase.from('tm_knowledge').insert({
        team_id: teams[0].id,
        topic: formData.topic || null,
        question: formData.question,
        answer: formData.answer,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        source: 'manual',
      })

      if (!error) {
        setFormData({
          topic: '',
          question: '',
          answer: '',
          tags: '',
        })
        setShowModal(false)
        window.location.reload()
      }
    } catch (err) {
      console.error('Error adding knowledge:', err)
    }
  }

  const filteredKnowledge = knowledge.filter(k =>
    k.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-gray-400">AI learns from these Q&As to answer parent questions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition"
        >
          + Add Q&A
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-violet-600"
        />
      </div>

      {/* Knowledge Items */}
      <div className="space-y-4">
        {filteredKnowledge.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center text-gray-400">
            No Q&As yet. Add your first entry to help the AI.
          </div>
        ) : (
          filteredKnowledge.map((item) => (
            <div key={item.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{item.question}</h3>
                  <p className="text-gray-400 mb-3">{item.answer}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.topic && (
                      <span className="px-2 py-1 bg-violet-900/50 text-violet-300 text-xs rounded-full">
                        {item.topic}
                      </span>
                    )}
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white">
                    ✏️
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-red-400">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Knowledge Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add Q&A</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Topic (optional)</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                  placeholder="e.g., Fees, Schedule, Rules"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                  placeholder="What do parents frequently ask?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Answer</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 h-32 resize-none"
                  placeholder="Provide a clear, helpful answer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600"
                  placeholder="e.g., payment, schedule, rules"
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
                onClick={handleAddKnowledge}
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition"
              >
                Add Q&A
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
