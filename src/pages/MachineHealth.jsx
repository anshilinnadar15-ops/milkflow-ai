import { motion } from 'framer-motion'
import { Thermometer, Gauge as GaugeIcon, Clock3, Wrench, ShieldAlert } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { CardGridSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getMachines } from '../services/api'
import { riskColors } from '../utils/formatters'

function healthColor(health) {
  if (health >= 80) return '#16A34A'
  if (health >= 60) return '#F59E0B'
  return '#DC2626'
}

export default function MachineHealth() {
  const { data, loading } = useFetchData(getMachines, [])

  return (
    <div>
      <PageHeader
        title="Machine Health"
        subtitle="Real-time condition monitoring across every machine on the processing line."
      />

      {loading ? (
        <CardGridSkeleton count={7} height={280} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.machines.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="card card-hover p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400">{m.type}</p>
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white">{m.name}</h3>
                </div>
                <span className={`badge ${riskColors[m.failureRisk]}`}>
                  <ShieldAlert className="w-3 h-3" /> {m.failureRisk} risk
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Health</span>
                  <span className="font-semibold" style={{ color: healthColor(m.health) }}>{m.health}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.health}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: healthColor(m.health) }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow icon={Thermometer} label="Temperature" value={`${m.temperature}°C`} />
                <InfoRow icon={GaugeIcon} label="Pressure" value={`${m.pressure} bar`} />
                <InfoRow icon={Clock3} label="Running Hours" value={m.runningHours.toLocaleString()} />
                <InfoRow icon={Wrench} label="Maintenance Due" value={m.maintenanceDue} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] text-slate-400 leading-tight">{label}</p>
        <p className="font-medium text-slate-700 dark:text-slate-200 leading-tight">{value}</p>
      </div>
    </div>
  )
}
