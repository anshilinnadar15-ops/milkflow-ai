import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageHeader from '../components/PageHeader'
import ChartCard from '../components/ChartCard'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { TableSkeleton, ChartSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getReports } from '../services/api'

export default function BottleneckAnalysis() {
  const { data, loading } = useFetchData(getReports, [])
  const [selectedRow, setSelectedRow] = useState(null)

  return (
    <div>
      <PageHeader
        title="Bottleneck Analysis"
        subtitle="Root-cause breakdown of delays across every stage in today's production run."
      />

      {loading ? (
        <TableSkeleton rows={7} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-0 overflow-hidden"
        >
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-left text-xs text-slate-400 uppercase tracking-wide">
                  <th className="px-5 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 font-semibold">Expected</th>
                  <th className="px-5 py-3 font-semibold">Actual</th>
                  <th className="px-5 py-3 font-semibold">Delay</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Affected Machine</th>
                  <th className="px-5 py-3 font-semibold">Impact</th>
                </tr>
              </thead>
              <tbody>
                {data.bottleneckTable.map((row, i) => (
                  <motion.tr
                    key={row.stage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedRow(row)}
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-100">{row.stage}</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.expectedTime} min</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.actualTime || '—'} min</td>
                    <td className={`px-5 py-3.5 font-semibold ${row.delay > 15 ? 'text-danger' : row.delay > 5 ? 'text-warning' : 'text-slate-500'}`}>
                      {row.delay} min
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-3.5 text-slate-500">{row.affectedMachine}</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.impact}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">
        {loading ? (
          <>
            <ChartSkeleton height={260} /> <ChartSkeleton height={260} /> <ChartSkeleton height={260} />
          </>
        ) : (
          <>
            <ChartCard title="Delay by Stage" subtitle="Minutes behind schedule" index={0}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.delayByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={55} interval={0} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="delay" fill="#DC2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Queue Time" subtitle="Minutes waiting per stage" index={1}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.queueTimeByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={55} interval={0} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="queue" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Machine Load" subtitle="Percentage load per machine" index={2}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.machineLoad}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="machine" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={55} interval={0} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="load" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      <Modal open={!!selectedRow} onClose={() => setSelectedRow(null)} title={selectedRow?.stage}>
        {selectedRow && (
          <div className="space-y-4 text-sm">
            <div className="bg-primary-50 dark:bg-primary/10 rounded-xl p-4">
              <p className="font-semibold text-primary mb-1">AI Explanation</p>
              <p className="text-slate-600 dark:text-slate-300">
                The <strong>{selectedRow.stage}</strong> stage recorded a delay of <strong>{selectedRow.delay} minutes</strong> against
                an expected duration of {selectedRow.expectedTime} minutes. The model attributes this to{' '}
                <strong>{selectedRow.rootCause.toLowerCase()}</strong> on {selectedRow.affectedMachine}, producing a{' '}
                {selectedRow.impact.toLowerCase()}-impact effect on downstream throughput.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Root Cause" value={selectedRow.rootCause} />
              <DetailRow label="Affected Machine" value={selectedRow.affectedMachine} />
              <DetailRow label="Impact" value={selectedRow.impact} />
              <DetailRow label="Status" value={selectedRow.status} />
            </div>
            <div className="bg-success-50 dark:bg-success/10 rounded-xl p-4">
              <p className="font-semibold text-success mb-1">Recommendation</p>
              <p className="text-slate-600 dark:text-slate-300">{selectedRow.recommendation}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  )
}
