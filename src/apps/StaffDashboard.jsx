import { useState } from 'react'
import {
  MapPin, Clock, Star, Navigation, Bell,
  Utensils, Home, AlertTriangle
} from 'lucide-react'

const RECOMMENDATIONS = [
  { id: 1, icon: Navigation, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Fastest exit route', desc: 'Use South Gate — 3min less than North', action: 'Navigate' },
  { id: 2, icon: Utensils,   color: 'text-amber-400',   bg: 'bg-amber-400/10',   title: 'Hot Dog Express — 2min wait', desc: 'Section S2, Row 14 — nearby & quick', action: 'Pre-order' },
  { id: 3, icon: Bell,       color: 'text-purple-400',  bg: 'bg-purple-400/10',  title: 'Half-time in 8 minutes', desc: 'Head to concourse now to beat queues', action: 'Dismiss' },
  { id: 4, icon: Home,       color: 'text-blue-400',    bg: 'bg-blue-400/10',    title: 'Your seat: Block C, Row 12, Seat 7', desc: 'Gate E2 is closest — 4min walk', action: 'Navigate' },
]

const NEARBY = [
  { name: 'Burger King', wait: 8, walk: 2 },
  { name: 'Drink Station', wait: 2, walk: 1 },
  { name: 'Merchandise', wait: 4, walk: 3 },
  { name: 'Restroom (M)', wait: 1, walk: 1 },
]

export default function AttendeeApp({ concessions = [] }) {
  const [activeTab, setActiveTab] = useState('home')
  const [notifCount] = useState(3)
  const [dismissed, setDismissed] = useState([])

  const visibleRecs = RECOMMENDATIONS.filter(r => !dismissed.includes(r.id))

  return (
    <div className="glass-card p-4 h-full flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">
          Attendee App
        </h2>

        <div className="relative">
          <Bell size={14} className="text-slate-400" />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {notifCount}
            </span>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1.5">
        {['home','map','food','alerts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition ${
              activeTab === tab
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 border border-slate-700/50 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">

        {/* HOME */}
        {activeTab === 'home' && (
          <>
            <div className="border border-emerald-500/20 rounded-xl p-3 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
                  R
                </div>
                <span className="text-xs font-medium text-emerald-300">
                  Welcome back
                </span>
              </div>

              <div className="flex gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={10} /> 18:47
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={10} /> Concourse B
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500">Recommendations</div>

            {visibleRecs.map(rec => {
              const Icon = rec.icon
              return (
                <div key={rec.id} className="border border-slate-800 rounded-xl p-3">
                  <div className="flex gap-3">
                    <div className={`w-7 h-7 rounded-lg ${rec.bg} flex items-center justify-center`}>
                      <Icon size={13} className={rec.color} />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs text-slate-200">{rec.title}</div>
                      <div className="text-xs text-slate-500">{rec.desc}</div>
                    </div>

                    <button
                      onClick={() => setDismissed(d => [...d, rec.id])}
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      {rec.action}
                    </button>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* MAP */}
        {activeTab === 'map' && (
          <>
            <div className="text-xs text-slate-500">Nearby</div>

            {NEARBY.map(p => (
              <div key={p.name} className="border border-slate-800 rounded-xl p-3 flex justify-between">
                <div>
                  <div className="text-xs text-slate-200">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.walk} min walk</div>
                </div>

                <span className="text-xs text-emerald-400">{p.wait} min</span>
              </div>
            ))}
          </>
        )}

        {/* FOOD */}
        {activeTab === 'food' && (
          <>
            {(concessions || []).slice(0, 5).map(c => (
              <div key={c.id} className="border border-slate-800 rounded-xl p-3">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-200">{c.name}</span>
                  <span className="text-xs text-amber-400">{c.waitMin} min</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ALERTS */}
        {activeTab === 'alerts' && (
          <>
            <div className="border border-amber-500/20 p-3 rounded-xl bg-amber-500/5">
              <div className="flex items-center gap-2 text-amber-300 text-xs">
                <AlertTriangle size={12} />
                Crowd warning
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}