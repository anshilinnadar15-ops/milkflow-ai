import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

// Reusable KPI card used across Dashboard and other pages.
export default function KpiCard({ icon: Icon, label, value, unit, change, trend, accent = 'primary', index = 0 }) {
  const isPositiveTrend = trend === 'up'
  const accentClasses = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-success-50 text-success',
    warning: 'bg-warning-50 text-warning',
    danger: 'bg-danger-50 text-danger',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="card card-hover p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClasses[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <span
            className={`badge ${
              isPositiveTrend ? 'bg-success-50 text-success' : 'bg-danger-50 text-danger'
            }`}
          >
            {isPositiveTrend ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}{typeof change === 'number' && Math.abs(change) < 100 ? (unit === '%' ? 'pt' : '%') : ''}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-slate-900 dark:text-white leading-tight">
          {value}
          {unit && <span className="text-base font-medium text-slate-400 ml-1">{unit}</span>}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
