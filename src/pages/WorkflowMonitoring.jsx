import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Clock, Timer, Cog, User, Gauge } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { CardGridSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getWorkflow } from '../services/api'

export default function WorkflowMonitoring() {
  const { data, loading } = useFetchData(getWorkflow, [])
  const [selectedStage, setSelectedStage] = useState(null)

  return (
    <div>
      <PageHeader
        title="Workflow Monitoring"
        subtitle="Live status of every manufacturing stage, from milk collection through dispatch."
      />

      {loading ? (
        <CardGridSkeleton count={7} height={210} />
      ) : (
        <div className="flex flex-col items-stretch">
          {data.stages.map((stage, i) => (
            <div key={stage.id} className="flex flex-col items-center">
              <motion.button
                onClick={() => setSelectedStage(stage)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="card card-hover w-full max-w-3xl p-5 text-left"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">STAGE {stage.order}</p>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg">{stage.name}</h3>
                  </div>
                  <StatusBadge status={stage.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <Stat icon={Clock} label="Expected" value={`${stage.expectedTime} min`} />
                  <Stat icon={Timer} label="Actual" value={stage.actualTime ? `${stage.actualTime} min` : '—'} />
                  <Stat icon={Gauge} label="Delay" value={`${stage.delay} min`} highlight={stage.delay > 15} />
                  <Stat icon={Cog} label="Machine" value={stage.machine} />
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5" /> Operator: <span className="text-slate-600 dark:text-slate-300 font-medium">{stage.operator}</span>
                  <span className="mx-1">·</span>
                  Queue time: <span className="text-slate-600 dark:text-slate-300 font-medium">{stage.queueTime} min</span>
                </div>
              </motion.button>

              {i < data.stages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                  className="py-1.5 text-slate-300 dark:text-slate-700"
                >
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selectedStage} onClose={() => setSelectedStage(null)} title={selectedStage?.name}>
        {selectedStage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Current status</span>
              <StatusBadge status={selectedStage.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailRow label="Expected Time" value={`${selectedStage.expectedTime} min`} />
              <DetailRow label="Actual Time" value={selectedStage.actualTime ? `${selectedStage.actualTime} min` : 'Not started'} />
              <DetailRow label="Delay" value={`${selectedStage.delay} min`} />
              <DetailRow label="Queue Time" value={`${selectedStage.queueTime} min`} />
              <DetailRow label="Machine Used" value={selectedStage.machine} />
              <DetailRow label="Operator" value={selectedStage.operator} />
              <DetailRow label="Throughput" value={selectedStage.throughput} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Notes</p>
              {selectedStage.notes}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Stat({ icon: Icon, label, value, highlight }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className={`text-sm font-semibold ${highlight ? 'text-danger' : 'text-slate-700 dark:text-slate-200'}`}>{value}</p>
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
