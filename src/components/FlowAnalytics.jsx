import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

export default function FlowAnalytics({ flowHistory, waitHistory }) {

  // ✅ MERGE DATA SAFELY
  const safeData = (flowHistory || []).map((f, i) => ({
    time: f.time,
    inflow: f.inflow || 0,
    outflow: f.outflow || 0,
    wait: waitHistory?.[i]?.wait || 0,
    incidents: f.incidents || 0,
  }));

  return (
    <div className="glass-card p-4 space-y-6">

      <h2 className="text-sm text-slate-400">Flow Analytics</h2>

      {/* INFLOW / OUTFLOW */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />

            <Line dataKey="inflow" stroke="#22c55e" strokeWidth={2} />
            <Line dataKey="outflow" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* WAIT TIMES */}
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData}>
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />

            <Line dataKey="wait" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* INCIDENTS */}
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData}>
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />

            <Bar dataKey="incidents" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}