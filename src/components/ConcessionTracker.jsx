import { ShoppingCart, Clock, TrendingUp, Zap, Users } from 'lucide-react'

export default function ConcessionTracker({ concessions = [] }) {

  // ✅ SAFE SORT
  const sorted = [...(concessions || [])].sort((a, b) => (b.waitMin || 0) - (a.waitMin || 0))

  return (
    <div className="glass-card p-4 flex flex-col gap-4">
      
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">
          Concessions
        </h2>
        <span className="text-xs text-slate-500">Sorted by wait</span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 380 }}>

        {sorted.length === 0 && (
          <div className="text-center text-slate-600 text-sm py-6">
            No concession data available
          </div>
        )}

        {sorted.map(stand => {
          const pct = Math.min(100, ((stand.waitMin || 0) / 20) * 100)

          const barColor =
            stand.status === 'critical' ? 'bg-red-500' :
            stand.status === 'busy'     ? 'bg-amber-500' :
                                          'bg-emerald-500'

          const textColor =
            stand.status === 'critical' ? 'text-red-400' :
            stand.status === 'busy'     ? 'text-amber-400' :
                                          'text-emerald-400'

          return (
            <div
              key={stand.id}
              className="border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors"
            >

              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    {stand.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Zone {stand.zone}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Clock size={10} className={textColor} />
                  <span className={`text-xs font-mono font-bold ${textColor}`}>
                    {stand.waitMin || 0} min
                  </span>
                </div>
              </div>

              <div className="progress-bar">
                <div
                  className={`progress-fill ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <Users size={10} className="text-slate-600" />
                  <span className="text-xs text-slate-500">
                    {stand.queue || 0} in queue
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <TrendingUp size={10} className="text-emerald-600" />
                  <span className="text-xs text-slate-500">
                    {stand.salesRate || 0}/hr
                  </span>
                </div>
              </div>

              {/* ✅ SAFE ITEMS */}
              <div className="flex flex-wrap gap-1 mt-2">
                {(stand.items || []).map(item => (
                  <span
                    key={item}
                    className="text-xs px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>

            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="border border-purple-500/20 rounded-xl p-3 bg-purple-500/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-purple-400" />
        </div>
        <div>
          <div className="text-xs font-medium text-purple-300">
            Pre-Order Available
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Skip the queue — order from your seat
          </div>
        </div>
      </div>

    </div>
  )
}