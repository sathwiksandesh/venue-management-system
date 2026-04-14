import { Play, Pause, Zap, Activity } from 'lucide-react'

export default function Header({
  tick = 0,
  paused = false,
  speed = 1,
  metrics = {},
  onTogglePause,
  onSpeedChange
}) {
  const matchMinute = Math.min(90, tick % 180)
  const half = matchMinute <= 45 ? '1st Half' : '2nd Half'
  const displayMin = matchMinute <= 45 ? matchMinute : matchMinute - 45

  const hours = String(Math.floor((tick / 60) % 24)).padStart(2, '0')
  const minutes = String(tick % 60).padStart(2, '0')

  const totalCount = metrics?.totalCount || 0
  const overallPct = metrics?.overallPct || 0

  return (
    <header className="glass-card px-5 py-3 flex items-center justify-between gap-4">

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
          <Activity size={16} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-slate-100 text-sm tracking-tight">
            SmartVenue
          </div>
          <div className="text-xs text-slate-500 font-mono">
            v2.4.1
          </div>
        </div>
      </div>

      {/* Event info */}
      <div className="hidden md:flex items-center gap-4 px-4 py-2 border border-slate-700/50 rounded-xl bg-slate-900/50">
        <div>
          <div className="text-xs text-slate-500">Event</div>
          <div className="text-sm font-semibold text-slate-100">
            Mumbai FC vs Bengaluru SC
          </div>
        </div>

        <div className="w-px h-8 bg-slate-700" />

        <div className="text-center">
          <div className="text-xs text-slate-500">{half}</div>
          <div className="text-sm font-mono font-bold text-emerald-400">
            {displayMin}'
          </div>
        </div>

        <div className="w-px h-8 bg-slate-700" />

        <div className="text-center">
          <div className="text-xs text-slate-500">Attendance</div>
          <div className="text-sm font-mono font-bold text-slate-100">
            {totalCount.toLocaleString()}
          </div>
        </div>

        <div className="w-px h-8 bg-slate-700" />

        <div className="text-center">
          <div className="text-xs text-slate-500">Capacity</div>
          <div
            className={`text-sm font-mono font-bold ${
              overallPct > 85
                ? 'text-red-400'
                : overallPct > 70
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {overallPct}%
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">

        {/* Speed */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700/50 bg-slate-900/50">
          <Zap size={11} className="text-slate-500" />

          {[1, 2, 5].map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange?.(s)}
              className={`text-xs px-1.5 py-0.5 rounded font-mono transition-colors ${
                speed === s
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Pause */}
        <button
          onClick={onTogglePause}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            paused
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          {paused ? <Play size={11} /> : <Pause size={11} />}
          {paused ? 'Resume' : 'Pause'}
        </button>

        {/* Clock */}
        <div className="font-mono text-sm font-bold text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700/50 bg-slate-900/50">
          {hours}:{minutes}
        </div>

      </div>
    </header>
  )
}   