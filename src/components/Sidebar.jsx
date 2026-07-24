import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  GitBranch,
  AlertTriangle,
  BrainCircuit,
  HeartPulse,
  BarChart3,
  MessageSquareText,
  FileBarChart2,
  Bot,
  Settings,
  Milk,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workflow-monitoring', label: 'Workflow Monitoring', icon: GitBranch },
  { to: '/bottleneck-analysis', label: 'Bottleneck Analysis', icon: AlertTriangle },
  { to: '/ai-predictions', label: 'AI Predictions', icon: BrainCircuit },
  { to: '/machine-health', label: 'Machine Health', icon: HeartPulse },
  { to: '/production-analytics', label: 'Production Analytics', icon: BarChart3 },
  { to: '/feedback-analysis', label: 'Feedback Analysis', icon: MessageSquareText },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 },
  { to: '/ai-chatbot', label: 'AI Chatbot', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onNavigate }) {
  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`fixed z-40 inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-card">
          <Milk className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-slate-900 dark:text-white leading-tight">MilkFlow AI</p>
          <p className="text-[11px] text-slate-400 leading-tight">AI Powered Manufacturing Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item, i) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
            >
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-card'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-0.5">Plant status</p>
          <p>Line 1 · Nashik Road facility</p>
          <p className="mt-1 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live data connected
          </p>
        </div>
      </div>
    </motion.aside>
  )
}
