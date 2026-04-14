export default function MetricCard({
  label,
  title, // ✅ allow both
  value = 0,
  unit,
  sub,
  trend,
  color = 'green',
  icon: Icon
}) {
  const colors = {
    green:  { val: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    amber:  { val: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
    red:    { val: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20'     },
    blue:   { val: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20'    },
    purple: { val: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/20'  },
  }

  const c = colors[color] || colors.green

  // ✅ support both label & title
  const displayLabel = label || title || 'Metric'

  return (
    <div className={`glass-card p-4 border ${c.border} flex flex-col gap-2`}>

      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          {displayLabel}
        </span>

        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
            <Icon size={15} className={c.val} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`metric-value ${c.val}`}>
          {value ?? 0}
        </span>

        {unit && (
          <span className="text-slate-500 text-sm">{unit}</span>
        )}
      </div>

      {(sub || trend !== undefined) && (
        <div className="flex items-center justify-between mt-1">

          {sub && (
            <span className="text-slate-500 text-xs">{sub}</span>
          )}

          {trend !== undefined && (
            <span
              className={`text-xs font-medium ${
                trend >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}

        </div>
      )}

    </div>
  )
}