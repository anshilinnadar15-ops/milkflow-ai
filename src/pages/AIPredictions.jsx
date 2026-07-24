import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertOctagon, Percent, Timer, Target, ListOrdered } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ChartCard from '../components/ChartCard'
import GaugeChart from '../components/GaugeChart'
import { CardGridSkeleton, ChartSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getPredictions } from '../services/api'

const severityColor = {
  info: 'bg-primary', warning: 'bg-warning', danger: 'bg-danger', success: 'bg-success',
}

export default function AIPredictions() {
  const { data, loading } = useFetchData(getPredictions, [])

  return (
    <div>
      <PageHeader
        title="AI Predictions"
        subtitle="Forward-looking risk model for bottlenecks, machine failure and queue buildup."
      />

      {loading ? (
        <CardGridSkeleton count={5} height={190} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <PredictionCard index={0} icon={AlertOctagon} accent="danger" label="Next Expected Bottleneck">
            <p className="font-display font-semibold text-slate-900 dark:text-white">{data.nextBottleneck.stage}</p>
            <p className="text-xs text-slate-400 mt-1">{data.nextBottleneck.machine}</p>
            <p className="text-xs text-slate-400 mt-2">ETA: <span className="font-semibold text-slate-600 dark:text-slate-300">{data.nextBottleneck.etaMinutes} min</span></p>
          </PredictionCard>

          <PredictionCard index={1} icon={Percent} accent="warning" label="Machine Failure Probability">
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{data.machineFailureProbability[0].probability}%</p>
            <p className="text-xs text-slate-400 mt-1">{data.machineFailureProbability[0].machine}</p>
          </PredictionCard>

          <PredictionCard index={2} icon={Timer} accent="primary" label="Predicted Delay">
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{data.predictedDelay.minutes} min</p>
            <p className="text-xs text-slate-400 mt-1">{data.predictedDelay.affectedStage}</p>
          </PredictionCard>

          <PredictionCard index={3} icon={Target} accent="success" label="Confidence Score">
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{data.confidenceScore}%</p>
            <p className="text-xs text-slate-400 mt-1">Model confidence, last 6h window</p>
          </PredictionCard>

          <PredictionCard index={4} icon={ListOrdered} accent="primary" label="Predicted Queue Length">
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{data.predictedQueueLength.batches} batches</p>
            <p className="text-xs text-slate-400 mt-1">Avg wait ~{data.predictedQueueLength.avgWaitMinutes} min</p>
          </PredictionCard>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">
        {loading ? (
          <>
            <ChartSkeleton height={240} /> <ChartSkeleton height={240} /> <ChartSkeleton height={240} />
          </>
        ) : (
          <>
            <ChartCard title="Failure Risk Gauge" subtitle="Pasteurizer P-1 — highest risk machine" index={0}>
              <div className="flex justify-center py-2">
                <GaugeChart value={data.machineFailureProbability[0].probability} color="#DC2626" label="Failure risk" />
              </div>
            </ChartCard>

            <ChartCard title="Confidence Gauge" subtitle="Overall model confidence" index={1}>
              <div className="flex justify-center py-2">
                <GaugeChart value={data.confidenceScore} color="#16A34A" label="Confidence" />
              </div>
            </ChartCard>

            <ChartCard title="Risk Trend" subtitle="Predicted risk score over time" index={2}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Line type="monotone" dataKey="riskScore" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      {!loading && (
        <ChartCard title="Prediction Timeline" subtitle="Projected sequence of events for the current shift" index={3}>
          <div className="mt-2">
            {data.timeline.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 pb-6 last:pb-0 relative"
              >
                <div className="flex flex-col items-center">
                  <span className={`w-3 h-3 rounded-full ${severityColor[event.severity]} shrink-0 mt-1`} />
                  {i < data.timeline.length - 1 && <span className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />}
                </div>
                <div className="pb-1">
                  <p className="text-xs font-semibold text-slate-400">{event.time}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-0.5">{event.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      )}

      {!loading && (
        <div className="mt-6 card p-5">
          <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 mb-3">AI Recommendations</h3>
          <ul className="space-y-2">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-primary-50 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PredictionCard({ icon: Icon, label, accent, children, index }) {
  const accentClasses = {
    primary: 'bg-primary-50 text-primary', success: 'bg-success-50 text-success',
    warning: 'bg-warning-50 text-warning', danger: 'bg-danger-50 text-danger',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="card card-hover p-5"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accentClasses[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {children}
    </motion.div>
  )
}
