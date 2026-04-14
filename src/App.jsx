import { useState } from 'react'
import {
  LayoutDashboard, Map, ShieldCheck, BarChart2,
  Smartphone, Users2, Users, Activity, Clock,
  AlertTriangle, Star, TrendingUp, TrendingDown,
  RefreshCw, Download, Settings, Bell, Zap,
  CheckCircle, XCircle, ChevronRight, Radio,
  Thermometer, Wind, Eye, Filter, ArrowUpRight,
  ArrowDownRight, MoreHorizontal,
} from 'lucide-react'
import  useVenue from './hooks/useVenue'
import Header            from './components/Header'
import MetricCard        from './components/MetricCard'
import VenueMap          from './components/VenueMap'
import AlertPanel        from './components/AlertPanel'
import GateManagement    from './components/GateManagement'
import ConcessionTracker from './components/ConcessionTracker'
import FlowAnalytics     from './components/FlowAnalytics'
import AttendeeApp       from './apps/AttendeeApp'
import StaffDashboard    from './apps/StaffDashboard'

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',   icon: LayoutDashboard },
  { id: 'crowd',     label: 'Crowd Map',  icon: Map             },
  { id: 'gates',     label: 'Gates',      icon: ShieldCheck     },
  { id: 'food',      label: 'Food & Bev', icon: Users           },
  { id: 'analytics', label: 'Analytics',  icon: BarChart2       },
  { id: 'attendee',  label: 'Attendee',   icon: Smartphone      },
  { id: 'staff',     label: 'Staff Ops',  icon: Users2          },
]

// ─── Reusable mini-components ────────────────────────────────────────────────

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {children}
      </span>
      {action && (
        <span className="text-xs text-slate-600 cursor-pointer hover:text-slate-400 transition-colors select-none">
          {action}
        </span>
      )}
    </div>
  )
}

function Badge({ label, color = 'slate' }) {
  const map = {
    green:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    amber:  'bg-amber-500/15   text-amber-300   border-amber-500/25',
    red:    'bg-red-500/15     text-red-300     border-red-500/25',
    blue:   'bg-blue-500/15    text-blue-300    border-blue-500/25',
    purple: 'bg-purple-500/15  text-purple-300  border-purple-500/25',
    slate:  'bg-slate-700/40   text-slate-400   border-slate-600/30',
  }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium border ${map[color] ?? map.slate}`}>
      {label}
    </span>
  )
}

function StatRow({ label, value, valueColor = 'text-slate-200', sub }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="text-right">
        <span className={`text-xs font-mono font-semibold ${valueColor}`}>{value}</span>
        {sub && <span className="text-xs text-slate-600 ml-2">{sub}</span>}
      </div>
    </div>
  )
}

function MiniBar({ pct, color = 'bg-emerald-500' }) {
  return (
    <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  )
}

function ActionBtn({ label, icon: Icon, variant = 'ghost', onClick, small = false }) {
  const base = `inline-flex items-center gap-1.5 font-medium rounded-lg transition-all cursor-pointer border select-none ${
    small ? 'text-xs px-2 py-1' : 'text-xs px-3 py-1.5'
  }`
  const variants = {
    ghost:  'bg-transparent     text-slate-400   border-slate-700/50  hover:bg-slate-800    hover:text-slate-200',
    green:  'bg-emerald-500/15  text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25',
    amber:  'bg-amber-500/10    text-amber-300   border-amber-500/25  hover:bg-amber-500/20',
    red:    'bg-red-500/15      text-red-300     border-red-500/30    hover:bg-red-500/25',
    blue:   'bg-blue-500/10     text-blue-300    border-blue-500/25   hover:bg-blue-500/20',
    purple: 'bg-purple-500/10   text-purple-300  border-purple-500/25 hover:bg-purple-500/20',
  }
  return (
    <button className={`${base} ${variants[variant] ?? variants.ghost}`} onClick={onClick}>
      {Icon && <Icon size={11} />}{label}
    </button>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,     setActiveTab]     = useState('overview')
  const [selectedZone,  setSelectedZone]  = useState(null)
  const [gateFilter,    setGateFilter]    = useState('all')
  const [foodSort,      setFoodSort]      = useState('wait')
  const [showBenchmark, setShowBenchmark] = useState(true)
  const [expandedGate,  setExpandedGate]  = useState(null)
  const [staffView,     setStaffView]     = useState('tasks')
  const [laneActions,   setLaneActions]   = useState({})

  const {
    tick, paused, speed,
    zones, gates, concessions, metrics, flowHistory, waitHistory, alerts,
    setPaused, setSpeed, dismissAlert,
  } = useVenue()

  // Derived data
  const filteredGates = gateFilter === 'all'
    ? gates
    : gates.filter(g => g.status === gateFilter)

  const sortedConcessions = [...concessions].sort((a, b) =>
    foodSort === 'wait'  ? b.waitMin   - a.waitMin  :
    foodSort === 'sales' ? b.salesRate - a.salesRate :
                           b.queue     - a.queue
  )

  const avgConcessionWait = concessions.length
    ? Math.round(concessions.reduce((s, c) => s + c.waitMin, 0) / concessions.length)
    : 0

  const criticalConcessions = concessions.filter(c => c.status === 'critical')
  const busyConcessions     = concessions.filter(c => c.status === 'busy')

  const handleGateAction = (gateId, action) => {
    setLaneActions(prev => ({ ...prev, [gateId]: action }))
    setTimeout(() => setLaneActions(prev => { const n = { ...prev }; delete n[gateId]; return n }), 4000)
  }

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg,#020617 0%,#0a1628 50%,#020617 100%)' }}>

      {/* ═══ HEADER ═══════════════════════════════════════════════════════════ */}
      <div className="p-3 pb-0">
        <Header
          tick={tick} paused={paused} speed={speed} metrics={metrics}
          onTogglePause={() => setPaused(p => !p)}
          onSpeedChange={setSpeed}
        />
      </div>

      {/* ═══ TAB BAR ══════════════════════════════════════════════════════════ */}
      <div className="px-3 pt-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const hasDot =
              (tab.id === 'overview'  && alerts.filter(a => a.severity === 'high').length > 0) ||
              (tab.id === 'gates'     && gates.some(g => g.status === 'critical')) ||
              (tab.id === 'food'      && criticalConcessions.length > 0)
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <Icon size={12} />
                {tab.label}
                {hasDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-slate-900" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ MAIN ══════════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-3 overflow-auto">

        {/* ──────────────────────── OVERVIEW ────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-3">

            {/* KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard label="Attendance"     icon={Users2}        color="blue"
                value={metrics.totalCount.toLocaleString()}
                sub={`of ${metrics.totalCap.toLocaleString()}`} />
              <MetricCard label="Capacity"       icon={Activity}
                color={metrics.overallPct > 85 ? 'red' : metrics.overallPct > 70 ? 'amber' : 'green'}
                value={`${metrics.overallPct}%`} sub="overall" />
              <MetricCard label="Avg Wait"       icon={Clock}         unit="min"
                color={metrics.avgWait > 10 ? 'red' : metrics.avgWait > 5 ? 'amber' : 'green'}
                value={metrics.avgWait} sub="gates + food" />
              <MetricCard label="Critical Zones" icon={AlertTriangle}
                color={metrics.criticalZones > 2 ? 'red' : metrics.criticalZones > 0 ? 'amber' : 'green'}
                value={metrics.criticalZones} sub=">85% capacity" />
              <MetricCard label="NPS Score"      icon={Star}          color="purple"
                value={metrics.npsScore} sub="satisfaction" />
              <MetricCard label="Live Alerts"    icon={AlertTriangle}
                color={alerts.filter(a => a.severity === 'high').length > 0 ? 'red' : 'amber'}
                value={alerts.length}
                sub={`${alerts.filter(a => a.severity === 'high').length} high priority`} />
            </div>

            {/* Map + Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2" style={{ minHeight: 420 }}>
                <VenueMap zones={zones} onSelectZone={setSelectedZone} selectedZone={selectedZone} />
              </div>
              <div style={{ minHeight: 420 }}>
                <AlertPanel alerts={alerts} onDismiss={dismissAlert} />
              </div>
            </div>

            {/* Gate + Food + Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <GateManagement gates={gates} />
              <ConcessionTracker concessions={concessions} />
              <FlowAnalytics flowHistory={flowHistory} waitHistory={waitHistory} />
            </div>

            {/* Quick-action bar */}
            <div className="glass-card p-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 mr-1 font-semibold uppercase tracking-widest">
                Quick Actions
              </span>
              <ActionBtn label="Export Report"       icon={Download}      variant="ghost"  />
              <ActionBtn label="Broadcast Alert"     icon={Bell}          variant="amber"  />
              <ActionBtn label="Open All Gates"      icon={Zap}           variant="green"  />
              <ActionBtn label="Emergency Protocol"  icon={AlertTriangle} variant="red"    />
              <ActionBtn label="Refresh Data"        icon={RefreshCw}     variant="ghost"  />
              <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live — updating every second
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────── CROWD MAP ───────────────────────────────── */}
        {activeTab === 'crowd' && (
          <div className="flex flex-col gap-3">

            {/* Stand KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {zones.filter(z => z.type === 'stand').map(zone => (
                <MetricCard key={zone.id} label={zone.name} icon={Users2}
                  color={zone.status === 'critical' ? 'red' : zone.status === 'busy' ? 'amber' : 'green'}
                  value={`${Math.round(zone.occupancy * 100)}%`}
                  sub={`${zone.count.toLocaleString()} / ${zone.capacity.toLocaleString()}`} />
              ))}
            </div>

            {/* Map + right col */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div style={{ minHeight: 480 }}>
                <VenueMap zones={zones} onSelectZone={setSelectedZone} selectedZone={selectedZone} />
              </div>

              <div className="flex flex-col gap-3">
                <AlertPanel alerts={alerts.filter(a => a.type === 'crowd')} onDismiss={dismissAlert} />

                {/* Zone status bars */}
                <div className="glass-card p-4">
                  <SectionTitle action="See all">Zone Status</SectionTitle>
                  <div className="flex flex-col gap-2.5">
                    {zones.filter(z => z.capacity > 0).slice(0, 12).map(zone => (
                      <div key={zone.id} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-600 w-7 flex-shrink-0">{zone.id}</span>
                        <span className="text-xs text-slate-300 w-24 truncate flex-shrink-0">{zone.name}</span>
                        <div className="flex-1">
                          <MiniBar
                            pct={Math.round(zone.occupancy * 100)}
                            color={
                              zone.status === 'critical' ? 'bg-red-500' :
                              zone.status === 'busy'     ? 'bg-amber-500' :
                              zone.status === 'moderate' ? 'bg-emerald-500' : 'bg-blue-500'
                            }
                          />
                        </div>
                        <span className={`text-xs font-mono w-9 text-right flex-shrink-0 ${
                          zone.status === 'critical' ? 'text-red-400' :
                          zone.status === 'busy'     ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {Math.round(zone.occupancy * 100)}%
                        </span>
                        {zone.status === 'critical' && (
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 alert-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crowd action buttons */}
                <div className="glass-card p-4">
                  <SectionTitle>Crowd Management Actions</SectionTitle>
                  <div className="grid grid-cols-2 gap-2">
                    <ActionBtn label="Reroute North → East" icon={ArrowUpRight}   variant="amber" />
                    <ActionBtn label="Open South Overflow"  icon={Zap}            variant="green" />
                    <ActionBtn label="Alert All Stewards"   icon={Bell}           variant="blue"  />
                    <ActionBtn label="Close West Entry"     icon={XCircle}        variant="red"   />
                  </div>
                  <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-800">
                    <span className="text-slate-500">Critical threshold: 85%</span>
                    <span className="text-emerald-400 font-mono">
                      {zones.filter(z => z.status === 'critical').length} zones over limit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────── GATES ───────────────────────────────────── */}
        {activeTab === 'gates' && (
          <div className="flex flex-col gap-3">

            {/* Gate KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gates.map(gate => (
                <MetricCard key={gate.id} label={gate.name} icon={Clock}
                  color={gate.status === 'critical' ? 'red' : gate.status === 'busy' ? 'amber' : 'green'}
                  value={`${gate.waitMin}min`}
                  sub={`${gate.activeLanes}/${gate.lanes} lanes · ${gate.queueLen} queued`} />
              ))}
            </div>

            {/* Filter bar */}
            <div className="glass-card p-3 flex items-center gap-2 flex-wrap">
              <Filter size={12} className="text-slate-500 flex-shrink-0" />
              <span className="text-xs text-slate-500">Filter:</span>
              {['all', 'critical', 'busy', 'normal'].map(f => (
                <button key={f} onClick={() => setGateFilter(f)}
                  className={`text-xs px-2.5 py-1 rounded-md capitalize transition-all ${
                    gateFilter === f ? 'tab-active' : 'tab-inactive'
                  }`}>{f}</button>
              ))}
              <div className="ml-auto flex items-center gap-4 text-xs text-slate-600">
                <span>Total queuing: <span className="text-slate-300 font-mono">{gates.reduce((s,g)=>s+g.queueLen,0)}</span></span>
                <span>Avg wait: <span className="text-amber-400 font-mono">{Math.round(gates.reduce((s,g)=>s+g.waitMin,0)/Math.max(1,gates.length))}min</span></span>
              </div>
            </div>

            {/* Gate cards + intelligence panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <GateManagement gates={filteredGates} />

              <div className="flex flex-col gap-3">
                {filteredGates.map(gate => {
                  const isExpanded = expandedGate === gate.id
                  const actionDone = laneActions[gate.id]
                  const statusBorder =
                    gate.status === 'critical' ? 'border-red-500/25 bg-red-500/5' :
                    gate.status === 'busy'     ? 'border-amber-500/20 bg-amber-500/4' :
                                                 'border-slate-700/40'
                  return (
                    <div key={gate.id} className={`glass-card p-4 border transition-all ${statusBorder}`}>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            gate.status === 'critical' ? 'bg-red-400 alert-pulse' :
                            gate.status === 'busy'     ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span className="font-semibold text-slate-100 text-sm">{gate.name}</span>
                          <Badge
                            label={gate.status.toUpperCase()}
                            color={gate.status === 'critical' ? 'red' : gate.status === 'busy' ? 'amber' : 'green'}
                          />
                        </div>
                        <button onClick={() => setExpandedGate(isExpanded ? null : gate.id)}
                          className="text-slate-600 hover:text-slate-300 transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-4 gap-2 text-center mb-3">
                        {[
                          { l:'Wait',    v:`${gate.waitMin}m`, c:gate.status==='critical'?'text-red-400':gate.status==='busy'?'text-amber-400':'text-emerald-400' },
                          { l:'Queue',   v:gate.queueLen,       c:'text-slate-200' },
                          { l:'Per/min', v:gate.throughput,     c:'text-emerald-400' },
                          { l:'Lanes',   v:`${gate.activeLanes}/${gate.lanes}`, c:'text-blue-400' },
                        ].map(s => (
                          <div key={s.l} className="bg-slate-900/50 rounded-lg p-2">
                            <div className="text-xs text-slate-600 mb-0.5">{s.l}</div>
                            <div className={`text-sm font-mono font-bold ${s.c}`}>{s.v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Lane visualiser */}
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: gate.lanes }, (_, i) => (
                          <div key={i}
                            title={i < gate.activeLanes ? `Lane ${i+1} — Open` : `Lane ${i+1} — Closed`}
                            className={`flex-1 rounded transition-all duration-700 ${
                              i < gate.activeLanes ? 'bg-emerald-500 h-3' : 'bg-slate-700 h-2'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {gate.status !== 'normal' && (
                          <ActionBtn
                            label={actionDone === 'opened' ? '✓ Lane Opened' : 'Open Extra Lane'}
                            icon={actionDone === 'opened' ? CheckCircle : Zap}
                            variant={actionDone === 'opened' ? 'ghost' : 'green'}
                            onClick={() => handleGateAction(gate.id, 'opened')}
                          />
                        )}
                        {gate.status !== 'normal' && (
                          <ActionBtn
                            label={actionDone === 'redirected' ? '✓ Redirecting' : 'Redirect Crowd'}
                            icon={actionDone === 'redirected' ? CheckCircle : ArrowUpRight}
                            variant={actionDone === 'redirected' ? 'ghost' : 'blue'}
                            onClick={() => handleGateAction(gate.id, 'redirected')}
                          />
                        )}
                        <ActionBtn label="Alert Staff"  icon={Bell}  variant="amber" small />
                        <ActionBtn label="View Camera"  icon={Eye}   variant="ghost" small />
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800 slide-up">
                          <StatRow label="Zone ID"          value={gate.zone} />
                          <StatRow label="Total lanes"      value={gate.lanes} />
                          <StatRow label="Throughput/hr"    value={(gate.throughput * 60).toLocaleString()} valueColor="text-emerald-400" />
                          <StatRow label="Est. clear time"  value={`${Math.round(gate.queueLen / Math.max(1, gate.throughput))}min`} />
                        </div>
                      )}
                    </div>
                  )
                })}
                {filteredGates.length === 0 && (
                  <div className="glass-card p-8 text-center text-slate-600 text-sm">
                    No gates match filter &ldquo;{gateFilter}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────── FOOD & BEV ──────────────────────────────── */}
        {activeTab === 'food' && (
          <div className="flex flex-col gap-3">

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="Avg Wait"     icon={Clock}         color="amber"
                value={`${avgConcessionWait}min`} sub="across all stands" />
              <MetricCard label="Critical"     icon={AlertTriangle} color="red"
                value={criticalConcessions.length} sub=">12min wait" />
              <MetricCard label="Busy Stands"  icon={Activity}      color="amber"
                value={busyConcessions.length} sub="7–12min wait" />
              <MetricCard label="Normal"       icon={CheckCircle}   color="green"
                value={concessions.filter(c => c.status === 'normal').length} sub="under 7min" />
            </div>

            {/* Sort bar */}
            <div className="glass-card p-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Sort by:</span>
              {[['wait','Wait Time'],['sales','Sales Rate'],['queue','Queue Length']].map(([k,l]) => (
                <button key={k} onClick={() => setFoodSort(k)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                    foodSort === k ? 'tab-active' : 'tab-inactive'
                  }`}>{l}</button>
              ))}
              <div className="ml-auto flex gap-2">
                <ActionBtn label="Broadcast Wait Times" icon={Bell}    variant="amber" small />
                <ActionBtn label="Enable Pre-Order"     icon={Zap}     variant="purple" small />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

              {/* Sorted concession list */}
              <div className="glass-card p-4 flex flex-col gap-3">
                <SectionTitle action={`${concessions.length} stands`}>All Concession Stands</SectionTitle>
                <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 500 }}>
                  {sortedConcessions.map((c, idx) => {
                    const barColor  = c.status === 'critical' ? 'bg-red-500' : c.status === 'busy' ? 'bg-amber-500' : 'bg-emerald-500'
                    const textColor = c.status === 'critical' ? 'text-red-400' : c.status === 'busy' ? 'text-amber-400' : 'text-emerald-400'
                    const cardBorder = c.status === 'critical' ? 'border-red-500/25 bg-red-500/5' :
                                       c.status === 'busy'     ? 'border-amber-500/20' : 'border-slate-800'
                    return (
                      <div key={c.id} className={`border rounded-xl p-3 transition-all ${cardBorder}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono text-slate-600">{String(idx+1).padStart(2,'0')}</span>
                              <span className="text-xs font-semibold text-slate-100">{c.name}</span>
                            </div>
                            <span className="text-xs text-slate-600 block mt-0.5">Zone {c.zone}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-sm font-mono font-bold ${textColor}`}>{c.waitMin}min</div>
                            <div className="text-xs text-slate-600">{c.queue} queued</div>
                          </div>
                        </div>
                        <MiniBar pct={Math.min(100,(c.waitMin/20)*100)} color={barColor} />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1 flex-wrap">
                            {c.items.map(item => (
                              <span key={item} className="text-xs px-1.5 py-0.5 bg-slate-800/80 text-slate-500 rounded-md">{item}</span>
                            ))}
                          </div>
                          <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{c.salesRate}/hr</span>
                        </div>
                        {c.status !== 'normal' && (
                          <div className="flex gap-1.5 mt-2 pt-2 border-t border-slate-800">
                            <ActionBtn label="Open Counter" icon={Zap}         variant="green"  small />
                            <ActionBtn label="Alert Staff"  icon={Bell}        variant="amber"  small />
                            <ActionBtn label="Pre-order"    icon={Smartphone}  variant="purple" small />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right col */}
              <div className="flex flex-col gap-3">

                {/* AI Recommendations */}
                <div className="glass-card p-4">
                  <SectionTitle>AI Recommendations</SectionTitle>
                  <div className="flex flex-col gap-2">
                    {concessions.filter(c => c.status !== 'normal').slice(0,4).map(c => (
                      <div key={c.id} className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-xl">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-amber-300">{c.name}</span>
                          <Badge label={`${c.waitMin}min`} color={c.status==='critical'?'red':'amber'} />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {c.status === 'critical'
                            ? `Open overflow counter. Redirect attendees from zone ${c.zone} to nearest alternative.`
                            : `Queue trending up. Pre-open second serving window to prevent critical threshold.`}
                        </p>
                        <div className="flex gap-1.5 mt-2">
                          <ActionBtn label="Apply Fix" icon={CheckCircle} variant="green" small />
                          <ActionBtn label="Dismiss"   icon={XCircle}     variant="ghost" small />
                        </div>
                      </div>
                    ))}
                    {concessions.filter(c => c.status !== 'normal').length === 0 && (
                      <div className="text-slate-600 text-sm text-center py-6">✓ All stands operating normally</div>
                    )}
                  </div>
                </div>

                {/* Sales rate ranking */}
                <div className="glass-card p-4">
                  <SectionTitle>Sales Rate Ranking</SectionTitle>
                  <div className="flex flex-col gap-2">
                    {[...concessions].sort((a,b) => b.salesRate - a.salesRate).map((c, i) => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-700 w-4 flex-shrink-0">{i+1}</span>
                        <span className="text-xs text-slate-400 w-28 truncate flex-shrink-0">{c.name.split('—')[0].trim()}</span>
                        <div className="flex-1"><MiniBar pct={(c.salesRate/100)*100} color="bg-purple-500" /></div>
                        <span className="text-xs font-mono text-purple-400 w-14 text-right flex-shrink-0">{c.salesRate}/hr</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pre-order panel */}
                <div className="glass-card p-4">
                  <SectionTitle>Pre-Order System</SectionTitle>
                  <StatRow label="Active pre-orders"   value="247"    valueColor="text-purple-400" />
                  <StatRow label="Avg collection time" value="1.4min" valueColor="text-emerald-400" />
                  <StatRow label="Skip-queue users"    value="38%"    valueColor="text-blue-400" />
                  <StatRow label="Revenue via app"     value="₹1.24L" valueColor="text-amber-400" />
                  <div className="flex gap-2 mt-3">
                    <ActionBtn label="Push Pre-order Promo" icon={Bell}          variant="purple" />
                    <ActionBtn label="View All Orders"      icon={ChevronRight}  variant="ghost"  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────── ANALYTICS ───────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-3">

            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="Peak Inflow"     icon={TrendingUp}    color="green"
                value="3,840" unit="/hr" sub="at 18:15 today" />
              <MetricCard label="Total Scanned"   icon={Activity}      color="blue"
                value="74,218" sub="ticketing events" />
              <MetricCard label="Incidents Today" icon={AlertTriangle}  color="amber"
                value={alerts.length + 3} sub="resolved + active" />
              <MetricCard label="Staff Deployed"  icon={Users2}         color="purple"
                value="48" sub="across all zones" />
            </div>

            {/* Charts + sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2">
                <FlowAnalytics flowHistory={flowHistory} waitHistory={waitHistory} />
              </div>

              <div className="flex flex-col gap-3">

                {/* Benchmarks */}
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Benchmarks vs. Last Event
                    </span>
                    <button onClick={() => setShowBenchmark(b => !b)}
                      className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                      {showBenchmark ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showBenchmark && (
                    <div className="slide-up">
                      {[
                        { label:'Gate avg wait',  cur:`${metrics.avgWait}min`,    prev:'9min',  better: metrics.avgWait < 9           },
                        { label:'NPS score',      cur:`${metrics.npsScore}`,       prev:'68',    better: metrics.npsScore > 68         },
                        { label:'Critical zones', cur:`${metrics.criticalZones}`,  prev:'4',     better: metrics.criticalZones < 4     },
                        { label:'Concession avg', cur:`${avgConcessionWait}min`,   prev:'11min', better: avgConcessionWait < 11        },
                        { label:'Alerts total',   cur:`${alerts.length}`,          prev:'8',     better: alerts.length < 8             },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                          <span className="text-xs text-slate-500">{row.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-700">prev: {row.prev}</span>
                            <div className={`flex items-center gap-0.5 text-xs font-mono font-bold ${row.better ? 'text-emerald-400' : 'text-red-400'}`}>
                              {row.better ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
                              {row.cur}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Heatmap grid */}
                <div className="glass-card p-4">
                  <SectionTitle>Zone Utilisation Grid</SectionTitle>
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                    {zones.filter(z => z.capacity > 0).map(zone => (
                      <div key={zone.id}
                        title={`${zone.name}: ${Math.round(zone.occupancy * 100)}%`}
                        className="heatmap-cell aspect-square flex items-center justify-center"
                        style={{
                          background:
                            zone.occupancy > 0.85 ? '#7f1d1d' :
                            zone.occupancy > 0.70 ? '#78350f' :
                            zone.occupancy > 0.50 ? '#14532d' :
                            zone.occupancy > 0.25 ? '#1e3a5f' : '#1e293b',
                          opacity: 0.5 + zone.occupancy * 0.5,
                        }}
                      >
                        <span className="zone-label" style={{ color:'rgba(255,255,255,0.6)' }}>{zone.id}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    {[['Low','#1e3a5f'],['Mid','#14532d'],['Busy','#78350f'],['Full','#7f1d1d']].map(([l,c]) => (
                      <span key={l} className="flex items-center gap-1 text-xs text-slate-500">
                        <span style={{ background:c }} className="w-2 h-2 rounded-sm inline-block" />{l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Export */}
                <div className="glass-card p-4">
                  <SectionTitle>Export & Reports</SectionTitle>
                  <div className="flex flex-col gap-2">
                    <ActionBtn label="Download Full Report (PDF)"  icon={Download}  variant="ghost"  />
                    <ActionBtn label="Export CSV — All Zones"      icon={Download}  variant="ghost"  />
                    <ActionBtn label="Export CSV — Wait Times"     icon={Download}  variant="ghost"  />
                    <ActionBtn label="Share Live Dashboard"        icon={Radio}     variant="blue"   />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────── ATTENDEE APP ────────────────────────────── */}
        {activeTab === 'attendee' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <AttendeeApp zones={zones} concessions={concessions} />

            <div className="flex flex-col gap-3">
              {/* Engagement stats */}
              <div className="glass-card p-4">
                <SectionTitle>App Engagement</SectionTitle>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label:'Active users',        value:'12,841', color:'text-blue-400'   },
                    { label:'Pre-orders placed',    value:'1,247',  color:'text-purple-400' },
                    { label:'Navigation requests',  value:'4,392',  color:'text-emerald-400'},
                    { label:'Notifications sent',   value:'28,105', color:'text-amber-400'  },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-900/60 rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                      <div className={`text-xl font-mono font-bold ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <ActionBtn label="Push Notification"  icon={Bell}   variant="amber" />
                  <ActionBtn label="Broadcast Message"  icon={Radio}  variant="blue"  />
                </div>
              </div>

              {/* Feature list */}
              <div className="glass-card p-4">
                <SectionTitle>App Features</SectionTitle>
                {[
                  { icon:'🗺️', title:'Real-time crowd density',     desc:'Live heatmap to avoid congestion zones',          status:'live'  },
                  { icon:'🍔', title:'Smart concession pre-ordering',desc:'Order from seat, collect in seconds',             status:'live'  },
                  { icon:'🧭', title:'AI route recommendations',     desc:'Fastest paths to exits, seats, facilities',       status:'live'  },
                  { icon:'🔔', title:'Push notifications',           desc:'Half-time alerts, queue warnings, event updates', status:'live'  },
                  { icon:'📱', title:'NFC seat finder',              desc:'Tap any kiosk to navigate to your seat',          status:'beta'  },
                  { icon:'🏥', title:'Medical & safety alerts',      desc:'Emergency notifications, nearest first aid',      status:'live'  },
                  { icon:'⭐', title:'Post-match feedback',          desc:'Rate experience, submit instant feedback',        status:'soon'  },
                  { icon:'🎟️', title:'Digital ticket wallet',        desc:'Store, transfer and scan tickets in-app',         status:'live'  },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-3 py-2.5 border-b border-slate-800/70 last:border-0">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-200">{f.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                    </div>
                    <Badge
                      label={f.status.toUpperCase()}
                      color={f.status==='live'?'green':f.status==='beta'?'amber':'slate'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────── STAFF OPS ───────────────────────────────── */}
        {activeTab === 'staff' && (
          <div className="flex flex-col gap-3">

            {/* Staff KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="On Duty"         icon={Users2}      color="green"
                value="48"   sub="across all zones" />
              <MetricCard label="Active Tasks"    icon={Radio}       color="amber"
                value="12"   sub="in progress" />
              <MetricCard label="Resolved Today"  icon={CheckCircle} color="blue"
                value="34"   sub="incidents closed" />
              <MetricCard label="Response Time"   icon={Clock}       color="purple"
                value="2.4"  unit="min" sub="avg response" />
            </div>

            {/* View toggle */}
            <div className="glass-card p-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">View:</span>
              {[['tasks','Tasks & Staff'],['comms','Comms Log']].map(([k,l]) => (
                <button key={k} onClick={() => setStaffView(k)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                    staffView === k ? 'tab-active' : 'tab-inactive'
                  }`}>{l}</button>
              ))}
              <div className="ml-auto flex gap-2">
                <ActionBtn label="Assign Task"         icon={ChevronRight} variant="green" small />
                <ActionBtn label="All-Staff Broadcast" icon={Radio}        variant="amber" small />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Staff dashboard or comms log */}
              {staffView === 'tasks' && <StaffDashboard />}

              {staffView === 'comms' && (
                <div className="glass-card p-4 flex flex-col gap-3">
                  <SectionTitle>Communications Log</SectionTitle>
                  <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 380 }}>
                    {[
                      { from:'Priya S.',  msg:'Lane 7 at North Gate opened. Queue reducing.',     time:'18:44', type:'info'   },
                      { from:'Arjun M.',  msg:'North Stand Zone 4 — stewards deployed.',           time:'18:41', type:'action' },
                      { from:'Control',   msg:'Crowd surge alert issued to all North zone staff.', time:'18:39', type:'alert'  },
                      { from:'Kavya P.',  msg:'Medical Bay restocked. Ready for next incident.',   time:'18:38', type:'info'   },
                      { from:'Rohan S.',  msg:'West Gate perimeter check complete. All clear.',    time:'18:36', type:'info'   },
                      { from:'Anjali N.', msg:'Food Court 2 overflow counter is now open.',        time:'18:33', type:'action' },
                      { from:'Control',   msg:'Half-time in 8 minutes. All staff on standby.',    time:'18:32', type:'alert'  },
                      { from:'Vikram D.', msg:'Parking Zone A at 87%. Directing to Zone B.',      time:'18:30', type:'info'   },
                    ].map((m, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-xl border ${
                        m.type === 'alert'  ? 'border-amber-500/20 bg-amber-500/5' :
                        m.type === 'action' ? 'border-blue-500/15  bg-blue-500/5'  :
                                              'border-slate-800'
                      }`}>
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                          {m.from.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-slate-200">{m.from}</span>
                            <Badge label={m.type} color={m.type==='alert'?'amber':m.type==='action'?'blue':'slate'} />
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{m.msg}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-600 flex-shrink-0">{m.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Broadcast to all staff..."
                      className="flex-1 bg-slate-900/70 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
                    />
                    <ActionBtn label="Send" icon={Radio} variant="blue" />
                  </div>
                </div>
              )}

              {/* Right: Alerts + Emergency protocols */}
              <div className="flex flex-col gap-3">
                <AlertPanel alerts={alerts} onDismiss={dismissAlert} />

                <div className="glass-card p-4">
                  <SectionTitle>Emergency Protocols</SectionTitle>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label:'Medical Emergency', variant:'red',    icon: Thermometer },
                      { label:'Crowd Evacuation',  variant:'amber',  icon: Wind        },
                      { label:'Security Alert',    variant:'purple', icon: ShieldCheck },
                      { label:'Power Failure',     variant:'blue',   icon: Zap         },
                    ].map(p => <ActionBtn key={p.label} label={p.label} icon={p.icon} variant={p.variant} />)}
                  </div>

                  {/* Emergency contacts */}
                  <div className="p-3 border border-slate-700/40 rounded-xl bg-slate-900/40">
                    <div className="text-xs text-slate-500 mb-2 font-medium">Emergency Contacts</div>
                    {[
                      { role:'Police Control Room',  num:'100'            },
                      { role:'Ambulance Dispatch',   num:'108'            },
                      { role:'Fire Brigade',         num:'101'            },
                      { role:'Venue Security Head',  num:'+91 98765 43210'},
                    ].map(c => (
                      <div key={c.role} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
                        <span className="text-xs text-slate-500">{c.role}</span>
                        <span className="text-xs font-mono font-semibold text-emerald-400">{c.num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}