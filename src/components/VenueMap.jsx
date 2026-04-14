import { useState } from 'react'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function getHeatColor(occupancy = 0, type) {
  if (type === 'field')   return '#1a3a1a'
  if (type === 'parking') return occupancy > 0.8 ? '#7c3aed' : '#4c1d95'
  if (occupancy > 0.85)  return '#dc2626'
  if (occupancy > 0.70)  return '#d97706'
  if (occupancy > 0.50)  return '#16a34a'
  if (occupancy > 0.25)  return '#0369a1'
  return '#1e3a5f'
}

function getHeatOpacity(occupancy = 0, type) {
  if (type === 'field')   return 0.9
  if (type === 'parking') return 0.5
  return 0.3 + occupancy * 0.65
}

function getStatusGlow(status, isActive) {
  if (isActive)              return 'drop-shadow(0 0 5px rgba(255,255,255,0.38))'
  if (status === 'critical') return 'drop-shadow(0 0 6px rgba(220,38,38,0.85))'
  if (status === 'busy')     return 'drop-shadow(0 0 4px rgba(217,119,6,0.65))'
  return 'none'
}

function getZoneRadius(type) {
  switch (type) {
    case 'stand':   return 4.5
    case 'gate':    return 3
    case 'parking': return 4
    case 'food':    return 2.5
    default:        return 2.5
  }
}

function getZoneShortLabel(zone) {
  if (!zone) return ''
  const id    = zone.id || ''
  const words = id.replace(/-/g, ' ').split(' ')
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  if (zone.name) {
    const n = zone.name.split(' ')
    if (n.length >= 2) return (n[0][0] + n[1][0]).toUpperCase()
    return zone.name.slice(0, 2).toUpperCase()
  }
  return id.slice(0, 2).toUpperCase()
}

/* ─── Football Field ─────────────────────────────────────────────────────────── */
function FootballField() {
  const x = 32, y = 38, w = 36, h = 24
  const cx = x + w / 2, cy = y + h / 2
  const pa_w = 8, pa_h = 7, ga_w = 4, ga_h = 3.5, cr = 4.5

  const line = { fill:'none', stroke:'rgba(255,255,255,0.55)', strokeWidth:0.35, strokeLinejoin:'round' }
  const thin = { ...line, strokeWidth:0.25, stroke:'rgba(255,255,255,0.35)' }

  return (
    <g>
      <defs>
        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a4a1a" />
          <stop offset="50%"  stopColor="#1f5c1f" />
          <stop offset="100%" stopColor="#1a4a1a" />
        </linearGradient>
        <pattern id="grassStripes" x="0" y="0" width={w/6} height={h}
          patternUnits="userSpaceOnUse" patternTransform={`translate(${x},${y})`}>
          <rect width={w/12} height={h} fill="rgba(0,0,0,0.08)" />
        </pattern>
      </defs>

      <rect x={x} y={y} width={w} height={h} fill="url(#grassGrad)" rx={0.5} />
      <rect x={x} y={y} width={w} height={h} fill="url(#grassStripes)" rx={0.5} opacity={0.6} />
      <rect x={x} y={y} width={w} height={h} {...line} rx={0.5} />
      <line x1={cx} y1={y} x2={cx} y2={y+h} {...line} />
      <circle cx={cx} cy={cy} r={cr} {...line} />
      <circle cx={cx} cy={cy} r={0.5} fill="rgba(255,255,255,0.6)" />

      <rect x={x}           y={cy-pa_h/2} width={pa_w} height={pa_h} {...line} />
      <rect x={x}           y={cy-ga_h/2} width={ga_w} height={ga_h} {...thin} />
      <circle cx={x+pa_w*0.7} cy={cy} r={0.35} fill="rgba(255,255,255,0.5)" />
      <path d={`M ${x+pa_w} ${cy-2.5} A ${cr} ${cr} 0 0 1 ${x+pa_w} ${cy+2.5}`} {...thin} />

      <rect x={x+w-pa_w} y={cy-pa_h/2} width={pa_w} height={pa_h} {...line} />
      <rect x={x+w-ga_w} y={cy-ga_h/2} width={ga_w} height={ga_h} {...thin} />
      <circle cx={x+w-pa_w*0.7} cy={cy} r={0.35} fill="rgba(255,255,255,0.5)" />
      <path d={`M ${x+w-pa_w} ${cy-2.5} A ${cr} ${cr} 0 0 0 ${x+w-pa_w} ${cy+2.5}`} {...thin} />

      {[[x,y,'M 0 1 A 1 1 0 0 1 1 0'],[x+w,y,'M 0 0 A 1 1 0 0 0 -1 1'],
        [x,y+h,'M 1 0 A 1 1 0 0 0 0 -1'],[x+w,y+h,'M -1 0 A 1 1 0 0 1 0 -1']].map(([tx,ty,d],i)=>(
        <path key={i} d={d} transform={`translate(${tx},${ty})`} {...thin} />
      ))}
      <rect x={x-1.2} y={cy-1.5} width={1.2} height={3} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.3} />
      <rect x={x+w}   y={cy-1.5} width={1.2} height={3} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.3} />
    </g>
  )
}

/* ─── Zone Node ──────────────────────────────────────────────────────────────── */
function ZoneNode({ zone, isSelected, isHovered, onEnter, onLeave, onClick }) {
  const occupancy = zone.occupancy || 0
  const type      = zone.type      || 'stand'
  const color     = getHeatColor(occupancy, type)
  const opacity   = getHeatOpacity(occupancy, type)
  const radius    = getZoneRadius(type)
  const label     = getZoneShortLabel(zone)
  const isActive  = isHovered || isSelected
  const zx        = zone.x || 0
  const zy        = zone.y || 0
  const name      = zone.name || zone.id || ''
  const pillW     = Math.max(14, name.length * 1.75 + 4)
  const pillH     = 4.4

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Pulse ring */}
      <circle
        cx={zx} cy={zy}
        r={radius + 2.4}
        fill="none"
        stroke={zone.status === 'critical' ? '#dc2626' : '#c7d2fe'}
        strokeWidth={0.55}
        style={{
          opacity:    isActive ? 0.7 : (zone.status === 'critical' ? 0.4 : 0),
          transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      />

      {/* Main circle — radius animates via CSS on the SVG element */}
      <circle
        cx={zx} cy={zy}
        r={isActive ? radius + 0.7 : radius}
        fill={color}
        stroke={isSelected ? '#22c55e' : isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}
        strokeWidth={isActive ? 0.6 : 0.3}
        style={{
          opacity:    isActive ? 1 : opacity,
          filter:     getStatusGlow(zone.status, isActive),
          transition: 'opacity 0.28s ease, stroke 0.28s ease, stroke-width 0.28s ease',
        }}
      />

      {/* Short label inside circle */}
      <text
        x={zx} y={zy + 0.45}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isActive ? 2.7 : 2.05}
        fontWeight="700"
        fontFamily="'Rajdhani', sans-serif"
        letterSpacing="0.06em"
        fill="rgba(255,255,255,0.95)"
        style={{
          pointerEvents: 'none',
          userSelect:    'none',
          transition:    'font-size 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {label}
      </text>

      {/* Hover callout group — fade + slide up */}
      <g style={{
        opacity:         isHovered ? 1 : 0,
        transform:       isHovered ? 'translateY(0px)' : 'translateY(2px)',
        transition:      'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents:   'none',
      }}>
        {/* Dashed connector */}
        <line
          x1={zx} y1={zy - radius - 1}
          x2={zx} y2={zy - radius - 5}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.3}
          strokeDasharray="0.6 0.5"
        />

        {/* Pill bg */}
        <rect
          x={zx - pillW / 2}
          y={zy - radius - 5 - pillH}
          width={pillW}
          height={pillH}
          rx={1.5}
          fill="rgba(8,14,40,0.95)"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={0.28}
        />

        {/* Zone name */}
        <text
          x={zx - pillW / 2 + 2}
          y={zy - radius - 5 - pillH / 2 + 0.25}
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={2.0}
          fontWeight="600"
          fontFamily="'Rajdhani', sans-serif"
          letterSpacing="0.07em"
          fill="#f1f5f9"
          style={{ userSelect: 'none' }}
        >
          {name}
        </text>

        {/* Occupancy % — right side of pill */}
        <text
          x={zx + pillW / 2 - 1.5}
          y={zy - radius - 5 - pillH / 2 + 0.25}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={1.75}
          fontWeight="600"
          fontFamily="'JetBrains Mono', monospace"
          fill={occupancy > 0.85 ? '#f87171' : occupancy > 0.70 ? '#fbbf24' : '#34d399'}
          style={{ userSelect: 'none' }}
        >
          {Math.round(occupancy * 100)}%
        </text>
      </g>
    </g>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function VenueMap({ zones = [], onSelectZone, selectedZone }) {
  const [hoveredZone, setHoveredZone] = useState(null)
  const tooltip    = hoveredZone || selectedZone
  const otherZones = zones.filter(z => z?.type !== 'field')

  return (
    <div className="glass-card p-4 h-full flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 style={{
          fontFamily:    "'Rajdhani', sans-serif",
          fontSize:      '0.82rem',
          fontWeight:    700,
          letterSpacing: '0.14em',
          color:         '#e2e8f0',
          textTransform: 'uppercase',
        }}>
          Venue Heatmap
        </h2>

        <div className="flex items-center gap-3">
          {[['Low','#0369a1'],['Moderate','#16a34a'],['Busy','#d97706'],['Critical','#dc2626']].map(([l,c]) => (
            <span key={l} className="flex items-center gap-1" style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize:   '0.72rem',
              fontWeight: 500,
              color:      '#94a3b8',
            }}>
              <span style={{ background:c, width:8, height:8, borderRadius:2, display:'inline-block', opacity:0.85 }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1" style={{ minHeight: 320 }}>

        {/* Load Rajdhani font */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
        `}</style>

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ background:'rgba(2,6,23,0.6)', borderRadius:12 }}
        >
          {/* Atmosphere rings */}
          <circle cx={50} cy={50} r={47} fill="none" stroke="rgba(100,148,237,0.07)" strokeWidth={0.5} strokeDasharray="1.5 1" />
          <circle cx={50} cy={50} r={40} fill="none" stroke="rgba(100,148,237,0.05)" strokeWidth={0.4} strokeDasharray="1 1.5" />
          <circle cx={50} cy={50} r={32} fill="none" stroke="rgba(100,148,237,0.04)" strokeWidth={0.3} />

          <FootballField />

          {otherZones.map(zone => zone && (
            <ZoneNode
              key={zone.id}
              zone={zone}
              isSelected={selectedZone?.id === zone.id}
              isHovered={hoveredZone?.id === zone.id}
              onEnter={() => setHoveredZone(zone)}
              onLeave={() => setHoveredZone(null)}
              onClick={() => onSelectZone?.(zone)}
            />
          ))}

          {/* Compass */}
          {[['N',50,4.5],['S',50,97],['W',3,51],['E',97,51]].map(([d,x,y]) => (
            <text key={d} x={x} y={y} textAnchor="middle" fontSize={2.4} fill="#94a3b8"
              fontWeight="600" fontFamily="'Rajdhani', sans-serif" opacity={0.3}>{d}</text>
          ))}
        </svg>

        {/* Tooltip card — slides up on appear */}
        <div style={{
          position:      'absolute',
          bottom:        12,
          left:          12,
          background:    'rgba(8,14,40,0.95)',
          border:        '1px solid rgba(255,255,255,0.09)',
          borderRadius:  10,
          backdropFilter:'blur(12px)',
          minWidth:      170,
          padding:       '10px 13px',
          opacity:       tooltip ? 1 : 0,
          transform:     tooltip ? 'translateY(0px)' : 'translateY(8px)',
          transition:    'opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: 'none',
        }}>
          {tooltip && (<>
            <div style={{
              fontFamily:    "'Rajdhani', sans-serif",
              fontSize:      '0.85rem',
              fontWeight:    700,
              letterSpacing: '0.08em',
              color:         '#f1f5f9',
              textTransform: 'uppercase',
              marginBottom:  7,
            }}>
              {tooltip.name || tooltip.id}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:5 }}>
              <div style={{
                width:8, height:8, borderRadius:'50%',
                background: getHeatColor(tooltip.occupancy, tooltip.type),
                flexShrink:0,
              }} />
              <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'0.75rem', color:'#94a3b8' }}>
                {Math.round((tooltip.occupancy||0)*100)}% occupied
              </span>
            </div>

            {tooltip.capacity && (
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.68rem', color:'#64748b' }}>
                {Math.round((tooltip.occupancy||0)*tooltip.capacity).toLocaleString()}
                {' / '}
                {tooltip.capacity.toLocaleString()}
              </div>
            )}

            {tooltip.status && (
              <div style={{
                marginTop:     8,
                fontFamily:    "'Rajdhani',sans-serif",
                fontSize:      '0.72rem',
                fontWeight:    600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: tooltip.status==='critical'?'#f87171'
                     : tooltip.status==='busy'    ?'#fbbf24'
                     :                             '#34d399',
              }}>
                ● {tooltip.status}
              </div>
            )}
          </>)}
        </div>
      </div>
    </div>
  )
}