import { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Droplets, Factory, Gauge, Cpu, AlertTriangle, Clock, Smile, Award } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import { KpiSkeleton, ChartSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getProduction } from '../services/api'
import { formatNumber } from '../utils/formatters'

export default function Dashboard() {
  const { data, loading } = useFetchData(getProduction, [])

  const kpiConfig = useMemo(() => {
    if (!data) return []
    const k = data.kpis
    return [
      { icon: Droplets, label: 'Total Milk Processed', value: formatNumber(k.totalMilkProcessed.value), unit: k.totalMilkProcessed.unit, change: k.totalMilkProcessed.change, trend: k.totalMilkProcessed.trend, accent: 'primary' },
      { icon: Factory, label: "Today's Production", value: formatNumber(k.todaysProduction.value), unit: k.todaysProduction.unit, change: k.todaysProduction.change, trend: k.todaysProduction.trend, accent: 'primary' },
      { icon: Gauge, label: 'Production Efficiency', value: k.productionEfficiency.value, unit: k.productionEfficiency.unit, change: k.productionEfficiency.change, trend: k.productionEfficiency.trend, accent: 'success' },
      { icon: Cpu, label: 'Machine Utilization', value: k.machineUtilization.value, unit: k.machineUtilization.unit, change: k.machineUtilization.change, trend: k.machineUtilization.trend, accent: 'primary' },
      { icon: AlertTriangle, label: "Today's Bottlenecks", value: k.todaysBottlenecks.value, unit: '', change: k.todaysBottlenecks.change, trend: k.todaysBottlenecks.trend, accent: 'warning' },
      { icon: Clock, label: 'Delayed Batches', value: k.delayedBatches.value, unit: '', change: k.delayedBatches.change, trend: k.delayedBatches.trend, accent: 'danger' },
      { icon: Smile, label: 'Customer Satisfaction', value: k.customerSatisfaction.value, unit: k.customerSatisfaction.unit, change: k.customerSatisfaction.change, trend: k.customerSatisfaction.trend, accent: 'success' },
      { icon: Award, label: 'Overall Equipment Effectiveness', value: k.oee.value, unit: k.oee.unit, change: k.oee.change, trend: k.oee.trend, accent: 'primary' },
    ]
  }, [data])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Live overview of the Nashik Road milk processing line — updated every few minutes."
      />

      {loading ? (
        <KpiSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiConfig.map((kpi, i) => (
            <KpiCard key={kpi.label} index={i} {...kpi} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">
        {loading ? (
          <>
            <ChartSkeleton /> <ChartSkeleton /> <ChartSkeleton /> <ChartSkeleton />
          </>
        ) : (
          <>
            <ChartCard title="Production Trend" subtitle="Output vs target across today's shifts (liters)" index={0}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.productionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Legend />
                  <Line type="monotone" dataKey="output" name="Actual Output" stroke="#2563EB" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Machine Utilization" subtitle="Percentage utilization by machine, today" index={1}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.machineUtilizationChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="machine" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="utilization" name="Utilization %" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Workflow Completion" subtitle="Percent complete by manufacturing stage, current batch" index={2}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.workflowCompletion}>
                  <defs>
                    <linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Area type="monotone" dataKey="completion" name="Completion %" stroke="#16A34A" fill="url(#completionFill)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Delay Trend" subtitle="Average delay (minutes) over the past 7 days" index={3}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.delayTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Line type="monotone" dataKey="delayMinutes" name="Delay (min)" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  )
}
