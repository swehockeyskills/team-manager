'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    teamName: '',
    sport: 'hockey',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const supabase = createClient()

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      const userId = authData.user?.id

      if (!userId) {
        throw new Error('Failed to create user')
      }

      // Create organization (slug from team name)
      const slug = formData.teamName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      const { data: orgData, error: orgError } = await supabase
        .from('tm_organizations')
        .insert({
          name: formData.teamName,
          slug,
          sport: formData.sport,
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from('tm_teams')
        .insert({
          organization_id: orgData.id,
          name: formData.teamName,
          sport: formData.sport,
        })
        .select()
        .single()

      if (teamError) throw teamError

      // Create coach record
      const { error: coachError } = await supabase
        .from('tm_coaches')
        .insert({
          team_id: teamData.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          is_owner: true,
        })

      if (coachError) throw coachError

      // Sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Team Manager AI</h1>
          <p className="text-gray-400">Start your free 7-day trial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-8 rounded-lg border border-gray-800">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="teamName" className="block text-sm font-medium mb-2">
              Team Name
            </label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              value={formData.teamName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 transition"
              placeholder="e.g., Lightning U12"
            />
          </div>

          <div>
            <label htmlFor="sport" className="block text-sm font-medium mb-2">
              Sport
            </label>
            <select
              id="sport"
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 transition"
            >
              <option value="hockey">Hockey</option>
              <option value="soccer">Soccer</option>
              <option value="baseball">Baseball</option>
              <option value="basketball">Basketball</option>
              <option value="lacrosse">Lacrosse</option>
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 transition"
              placeholder="Coach Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 transition"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-violet-600 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 rounded-lg font-semibold transition"
          >
            {loading ? 'Creating account...' : 'Get Started'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>

        <p className="text-center text-gray-500 mt-4 text-xs">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
