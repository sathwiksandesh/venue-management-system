import { DoorOpen } from 'lucide-react'

function LaneBar({ active = 0, total = 0 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total || 0 }, (_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-sm transition-colors duration-700 ${
            i < active ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  )
}

export default function GateManagement({ gates = [] }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">
          Gate Management
        </h2>
        <span className="text-xs text-slate-500">Live throughput</span>
      </div>

      <div className="grid grid-cols-1 gap-3">

        {(gates || []).length === 0 && (
          <div className="text-center text-slate-600 text-sm py-6">
            No gate data available
          </div>
        )}

        {(gates || []).map(gate => {
          const status = gate.status || 'normal'

          const borderColor =
            status === 'critical' ? 'border-red-500/30 bg-red-500/5' :
            status === 'busy'     ? 'border-amber-500/30 bg-amber-500/5' :
                                   'border-slate-700/50'

          const waitColor =
            status === 'critical' ? 'text-red-400' :
            status === 'busy'     ? 'text-amber-400' :
                                   'text-emerald-400'

          return (
            <div
              key={gate.id}
              className={`border rounded-xl p-3 ${borderColor}`}
            >

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DoorOpen size={14} className="text-slate-400" />
                  <span className="font-semibold text-slate-100 text-sm">
                    {gate.name || 'Gate'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      status === 'critical'
                        ? 'bg-red-400 animate-pulse'
                        : status === 'busy'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />

                  <span className={`text-xs font-mono ${waitColor}`}>
                    {gate.waitMin || 0} min
                  </span>
                </div>
              </div>

              <LaneBar
                active={gate.activeLanes || 0}
                total={gate.lanes || 0}
              />

              <div className="grid grid-cols-3 gap-2 mt-2">

                <div className="text-center">
                  <div className="text-xs text-slate-500">Lanes</div>
                  <div className="text-sm font-mono text-slate-300">
                    {gate.activeLanes || 0}/{gate.lanes || 0}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-slate-500">Queue</div>
                  <div className="text-sm font-mono text-slate-300">
                    {gate.queueLen || 0}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-slate-500">Per/hr</div>
                  <div className="text-sm font-mono text-emerald-400">
                    {(gate.throughput || 0) * 60}
                  </div>
                </div>

              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}