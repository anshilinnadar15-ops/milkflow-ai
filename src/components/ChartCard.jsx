import { motion } from 'framer-motion'

export default function ChartCard({ title, subtitle, children, index = 0, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
      className="card p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </motion.div>
  )
}
