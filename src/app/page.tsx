import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white">
            Your AI Team Manager.
            <span className="text-violet-600"> Handles the chaos so you don't have to.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Parents get instant answers 24/7. You get your evenings back. Same price as TeamSnap.
          </p>
          
          {/* Stat Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="px-4 py-2 bg-gray-900 rounded-full text-sm">
              📊 Answers 80% of parent questions
            </div>
            <div className="px-4 py-2 bg-gray-900 rounded-full text-sm">
              💰 $29/month
            </div>
            <div className="px-4 py-2 bg-gray-900 rounded-full text-sm">
              ⚡ Setup in 10 minutes
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/signup" className="px-8 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition">
              Start Free Trial
            </Link>
            <button className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold transition text-white">
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">AI Handles Parent Questions</h3>
              <p className="text-gray-400">
                24/7 answers about schedule, payments, hotel links. Responds via text, chat, or email.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-2xl font-bold mb-4">Smart Scheduling & RSVP</h3>
              <p className="text-gray-400">
                Post events, collect RSVPs automatically. Know who's coming before practice.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-4">Payment Tracking</h3>
              <p className="text-gray-400">
                See who's paid and who hasn't. Send reminders automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">vs. TeamSnap</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 font-bold text-white">Feature</th>
                  <th className="text-center p-4 font-bold text-white">TeamSnap<br/><span className="text-sm font-normal text-gray-400">$99/yr</span></th>
                  <th className="text-center p-4 font-bold text-white">Team Manager AI<br/><span className="text-sm font-normal text-violet-400">$29/mo</span></th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="p-4">Schedule & roster</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4">AI answers questions</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4">24/7 parent support</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4">Payment reminders</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr>
                  <td className="p-4">Gets smarter over time</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Simple Pricing</h2>
          <p className="text-center text-gray-400 mb-16">Pay only for what you use</p>

          {/* Founding Member Banner */}
          <div className="mb-12 p-4 bg-violet-900 border border-violet-600 rounded-lg text-center">
            <p className="text-violet-200 font-semibold">
              🚀 Founding member offer: <span className="text-violet-300">$19/mo locked</span> — first 50 teams only
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Starter */}
            <div className="p-8 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-4xl font-bold text-violet-600 mb-6">$29<span className="text-lg text-gray-400">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✅ AI Q&A</li>
                <li>✅ Schedule & RSVP</li>
                <li>✅ 200 texts/mo</li>
              </ul>
              <button className="w-full py-2 border border-violet-600 rounded-lg hover:bg-violet-600 transition">
                Start Free Trial
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 bg-gray-800 rounded-lg border border-violet-600 ring-2 ring-violet-600">
              <div className="mb-2 px-3 py-1 bg-violet-600 w-fit rounded text-sm font-semibold">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold text-violet-600 mb-6">$79<span className="text-lg text-gray-400">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✅ Everything in Starter</li>
                <li>✅ Payment tracking</li>
                <li>✅ Tournament coordination</li>
                <li>✅ 1000 texts/mo</li>
              </ul>
              <button className="w-full py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition font-semibold">
                Start Free Trial
              </button>
            </div>

            {/* Club */}
            <div className="p-8 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Club</h3>
              <p className="text-4xl font-bold text-violet-600 mb-6">$199<span className="text-lg text-gray-400">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✅ All teams</li>
                <li>✅ Multi-dashboard</li>
                <li>✅ Unlimited texts</li>
                <li>✅ Priority support</li>
              </ul>
              <button className="w-full py-2 border border-violet-600 rounded-lg hover:bg-violet-600 transition">
                Contact Sales
              </button>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Annual plans: 2 months free
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Ready to get your evenings back?</h2>
          <Link href="/signup" className="inline-block px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold text-lg transition">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; 2026 Team Manager AI. All rights reserved.</p>
      </footer>
    </main>
  )
}
