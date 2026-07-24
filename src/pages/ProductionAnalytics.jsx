import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import PageHeader from '../components/PageHeader'
import ChartCard from '../components/ChartCard'
import { ChartSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getProduction } from '../services/api'

const PIE_COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#7C3AED']

export default function ProductionAnalytics() {
  const { data, loading } = useFetchData(getProduction, [])

  return (
    <div>
      <PageHeader
        title="Production Analytics"
        subtitle="Deeper breakdown of output by day, week, shift, operator and product mix."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {loading ? (
          <>
            <ChartSkeleton /> <ChartSkeleton /> <ChartSkeleton /> <ChartSkeleton />
          </>
        ) : (
          <>
            <ChartCard title="Daily Production" subtitle="Liters processed per day, this week" index={0}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.dailyProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="liters" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Weekly Production" subtitle="Liters processed per week, this month" index={1}>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.weeklyProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Line type="monotone" dataKey="liters" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Shift Performance" subtitle="Output and efficiency by shift" index={2}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.shiftPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="shift" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Legend />
                  <Bar dataKey="output" name="Output (L)" fill="#2563EB" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="efficiency" name="Efficiency %" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Operator Performance" subtitle="Batches handled and efficiency by operator" index={3}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.operatorPerformance} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="operator" type="category" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="efficiency" name="Efficiency %" fill="#2563EB" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        {loading ? (
          <>
            <ChartSkeleton height={260} /> <ChartSkeleton height={260} /> <ChartSkeleton height={260} />
          </>
        ) : (
          <>
            <ChartCard title="Machine Utilization Heatmap" subtitle="Utilization % across the day" index={4}>
              <Heatmap data={data.machineUtilizationHeatmap} />
            </ChartCard>

            <ChartCard title="Product Mix" subtitle="Share of total production volume" index={5}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data.productMix} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {data.productMix.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Stacked Output" subtitle="Daily production stacked by volume band" index={6}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.dailyProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="liters" stackId="a" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  )
}

function Heatmap({ data }) {
  const max = Math.max(...data.values.flat())
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="border-separate" style={{ borderSpacing: 4 }}>
        <thead>
          <tr>
            <th></th>
            {data.hours.map((h) => (
              <th key={h} className="text-[10px] text-slate-400 font-medium px-1">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.machines.map((machine, r) => (
            <tr key={machine}>
              <td className="text-[11px] text-slate-500 pr-2 whitespace-nowrap text-right">{machine}</td>
              {data.values[r].map((v, c) => (
                <td key={c}>
                  <div
                    className="w-8 h-6 rounded-md flex items-center justify-center text-[9px] font-semibold text-white"
                    style={{ backgroundColor: `rgba(37, 99, 235, ${Math.max(0.15, v / max)})` }}
                    title={`${v}%`}
                  >
                    {v}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
