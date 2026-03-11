'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Payment {
  id: string
  player_id: string
  description: string
  amount_cents: number
  due_date: string | null
  paid_date: string | null
  status: string
  notes: string | null
}

interface Player {
  id: string
  first_name: string
  last_name: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [players, setPlayers] = useState<Map<string, Player>>(new Map())
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        
        const { data: teams } = await supabase.from('tm_teams').select('id').limit(1)
        if (!teams?.[0]) return

        // Load payments
        const { data: paymentsData } = await supabase
          .from('tm_payments')
          .select('*')
          .eq('team_id', teams[0].id)
          .order('due_date', { ascending: true })

        if (paymentsData) {
          setPayments(paymentsData)
        }

        // Load players
        const { data: playersData } = await supabase
          .from('tm_players')
          .select('*')
          .eq('team_id', teams[0].id)

        if (playersData) {
          const playerMap = new Map(playersData.map(p => [p.id, p]))
          setPlayers(playerMap)
        }
      } catch (err) {
        console.error('Error loading payments:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-900/20 text-green-300'
      case 'unpaid':
        return 'bg-red-900/20 text-red-300'
      case 'partial':
        return 'bg-yellow-900/20 text-yellow-300'
      case 'waived':
        return 'bg-gray-800 text-gray-300'
      default:
        return 'bg-gray-800 text-gray-300'
    }
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const filteredPayments = filterStatus === 'all'
    ? payments
    : payments.filter(p => p.status === filterStatus)

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  const totals = {
    unpaid: payments
      .filter(p => p.status === 'unpaid')
      .reduce((sum, p) => sum + p.amount_cents, 0),
    paid: payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount_cents, 0),
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Payments</h1>
          <p className="text-gray-400">Track team payments and fees</p>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition">
          + Add Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Unpaid</p>
          <p className="text-3xl font-bold text-red-400">{formatCurrency(totals.unpaid)}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(totals.paid)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {['all', 'unpaid', 'paid', 'partial'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              filterStatus === status
                ? 'bg-violet-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Player</th>
              <th className="px-6 py-4 text-left font-semibold">Description</th>
              <th className="px-6 py-4 text-left font-semibold">Amount</th>
              <th className="px-6 py-4 text-left font-semibold">Due Date</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-semibold">
                    {players.get(payment.player_id)
                      ? `${players.get(payment.player_id)!.first_name} ${players.get(payment.player_id)!.last_name}`
                      : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {formatCurrency(payment.amount_cents)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {payment.due_date || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
