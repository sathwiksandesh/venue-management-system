import { AlertTriangle, Heart, Users, Shield, Info, X } from 'lucide-react'

const typeConfig = {
  medical:  { icon: Heart,          color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20'    },
  crowd:    { icon: Users,          color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20'  },
  queue:    { icon: AlertTriangle,  color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  security: { icon: Shield,         color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  info:     { icon: Info,           color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20'   },
}

const severityBadge = {
  high:   'bg-red-500/20 text-red-300 border border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  low:    'bg-blue-500/20 text-blue-300 border border-blue-500/30',
}

export default function AlertPanel({ alerts, onDismiss }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">Live Alerts</h2>
        <div className="flex items-center gap-2">
          <div className="status-dot-red alert-pulse" />
          <span className="text-xs text-slate-400">{alerts.length} active</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 420 }}>
        {alerts.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-sm">
            ✓ All clear — no active incidents
          </div>
        )}
        {alerts.map(alert => {
          const cfg = typeConfig[alert.type] || typeConfig.info
          const Icon = cfg.icon
          return (
            <div key={alert.id}
              className={`slide-up flex gap-3 p-3 rounded-xl border ${cfg.border} ${cfg.bg}`}>
              <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-black/20`}>
                <Icon size={13} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-slate-600 text-xs font-mono">{alert.time}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-500 text-xs">{alert.zone}</span>
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-md font-medium ${severityBadge[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5"
              >
                <X size={13} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}