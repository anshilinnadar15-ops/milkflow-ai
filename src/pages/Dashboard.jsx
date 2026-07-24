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
  <div className="h-screen overflow-hidden p-3">

    <PageHeader
      title="FlowGenie Manufacturing Control Center"
      subtitle="Live overview of Mumbai Dairy Unit"
    />


    {/* KPI SECTION */}
    {loading ? (
      <KpiSkeleton count={8} />
    ) : (
      <div className="grid grid-cols-4 gap-3 mt-3">
        {kpiConfig.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            index={i}
            {...kpi}
          />
        ))}
      </div>
    )}



    {/* CHART SECTION */}
    <div className="grid grid-cols-2 gap-3 mt-3 h-[calc(100vh-220px)]">


      {loading ? (
        <>
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </>
      ) : (

        <>


        {/* Production Trend */}

        <ChartCard
          title="Production Trend"
          subtitle="Actual vs Target"
          index={0}
        >

        <ResponsiveContainer width="100%" height={190}>

          <LineChart data={data.productionTrend}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="time"/>

            <YAxis/>

            <Tooltip/>

            <Legend/>

            <Line
              dataKey="output"
              name="Output"
              stroke="#2563EB"
              strokeWidth={2}
            />

            <Line
              dataKey="target"
              name="Target"
              stroke="#94A3B8"
            />

          </LineChart>

        </ResponsiveContainer>


        </ChartCard>





        {/* Machine Utilization */}

        <ChartCard
          title="Machine Health"
          subtitle="Current utilization"
          index={1}
        >

        <ResponsiveContainer width="100%" height={190}>

          <BarChart data={data.machineUtilizationChart}>

            <XAxis
              dataKey="machine"
              tick={{fontSize:10}}
            />

            <YAxis/>

            <Tooltip/>

            <Bar
              dataKey="utilization"
              fill="#2563EB"
              radius={[6,6,0,0]}
            />


          </BarChart>


        </ResponsiveContainer>


        </ChartCard>







        {/* Workflow Completion */}


        <ChartCard
          title="Workflow Completion"
          subtitle="Current batch status"
          index={2}
        >


        <ResponsiveContainer width="100%" height={190}>


        <AreaChart data={data.workflowCompletion}>


        <XAxis dataKey="stage"/>

        <YAxis/>

        <Tooltip/>


        <Area
          dataKey="completion"
          stroke="#16A34A"
          fill="#16A34A"
        />


        </AreaChart>


        </ResponsiveContainer>


        </ChartCard>







        {/* Delay Trend */}


        <ChartCard
          title="Bottleneck Analysis"
          subtitle="Delay monitoring"
          index={3}
        >

        <ResponsiveContainer width="100%" height={190}>


        <LineChart data={data.delayTrend}>


        <XAxis dataKey="day"/>

        <YAxis/>

        <Tooltip/>


        <Line
          dataKey="delayMinutes"
          stroke="#DC2626"
          strokeWidth={2}
        />


        </LineChart>


        </ResponsiveContainer>


        </ChartCard>




        </>

      )}


    </div>


  </div>
)
}
