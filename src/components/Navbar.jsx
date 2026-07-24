import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sun, Moon, Menu, ChevronDown } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const notifications = [
  { id: 1, title: 'Pasteurizer P-1 running hot', time: '4 min ago', severity: 'danger' },
  { id: 2, title: 'CIP cycle recommended for P-1', time: '12 min ago', severity: 'warning' },
  { id: 3, title: 'Daily report generated', time: '1 hr ago', severity: 'success' },
]

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center px-4 lg:px-8 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search machines, batches, reports…"
          className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger" />
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 card p-2 z-50"
              >
                <p className="text-xs font-semibold text-slate-400 px-3 py-2">NOTIFICATIONS</p>
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span
                      className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        n.severity === 'danger' ? 'bg-danger' : n.severity === 'warning' ? 'bg-warning' : 'bg-success'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
              PN
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Priya Nair</p>
              <p className="text-xs text-slate-400 leading-tight">Plant Manager</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 card p-2 z-50 text-sm"
              >
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">My Profile</button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Account Settings</button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-danger">Sign Out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
