import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Bell, Globe, UserCircle2, Server, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useTheme } from '../hooks/useTheme'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    bottleneckAlerts: true,
    machineHealthAlerts: true,
    dailyReportEmail: false,
    feedbackDigest: true,
  })
  const [language, setLanguage] = useState('English (India)')
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_BASE_URL || '/api')
  const [saved, setSaved] = useState(false)

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your appearance, notifications, language and API configuration." />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SettingsSection icon={theme === 'dark' ? Moon : Sun} title="Appearance" index={0}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</p>
              <p className="text-xs text-slate-400">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="w-14 h-8 rounded-full bg-slate-100 dark:bg-primary relative transition-colors"
            >
              <motion.span
                animate={{ x: theme === 'dark' ? 24 : 2 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-primary" /> : <Sun className="w-3.5 h-3.5 text-warning" />}
              </motion.span>
            </button>
          </div>
        </SettingsSection>

        <SettingsSection icon={Bell} title="Notification Settings" index={1}>
          <div className="space-y-3">
            {Object.entries({
              bottleneckAlerts: 'Bottleneck alerts',
              machineHealthAlerts: 'Machine health alerts',
              dailyReportEmail: 'Daily report email',
              feedbackDigest: 'Weekly feedback digest',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    notifications[key] ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <motion.span
                    animate={{ x: notifications[key] ? 20 : 2 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                  />
                </button>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection icon={Globe} title="Language" index={2}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-700 dark:text-slate-200"
          >
            <option>English (India)</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>English (US)</option>
          </select>
        </SettingsSection>

        <SettingsSection icon={UserCircle2} title="Profile" index={3}>
          <div className="space-y-3">
            <Field label="Full Name" defaultValue="Priya Nair" />
            <Field label="Role" defaultValue="Plant Manager" />
            <Field label="Email" defaultValue="priya.nair@milkflow.example.com" />
          </div>
        </SettingsSection>

        <SettingsSection icon={Server} title="API Endpoint Configuration" index={4} full>
          <p className="text-xs text-slate-400 mb-2">
            Configure the base URL used for all dashboard and AI chatbot API calls (VITE_API_BASE_URL).
          </p>
          <input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-700 dark:text-slate-200 font-mono"
          />
        </SettingsSection>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          Save changes
        </button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-success flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Settings saved
          </motion.span>
        )}
      </div>
    </div>
  )
}

function SettingsSection({ icon: Icon, title, children, index, full }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`card p-5 ${full ? 'xl:col-span-2' : ''}`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
          <Icon className="w-4.5 h-4.5" />
        </div>
        <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

function Field({ label, defaultValue }) {
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <input
        defaultValue={defaultValue}
        className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-700 dark:text-slate-200"
      />
    </div>
  )
}
