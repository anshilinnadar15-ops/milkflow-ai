import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import WorkflowMonitoring from './pages/WorkflowMonitoring'
import BottleneckAnalysis from './pages/BottleneckAnalysis'
import AIPredictions from './pages/AIPredictions'
import MachineHealth from './pages/MachineHealth'
import ProductionAnalytics from './pages/ProductionAnalytics'
import FeedbackAnalysis from './pages/FeedbackAnalysis'
import Reports from './pages/Reports'
import AIChatbot from './pages/AIChatbot'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workflow-monitoring" element={<WorkflowMonitoring />} />
        <Route path="/bottleneck-analysis" element={<BottleneckAnalysis />} />
        <Route path="/ai-predictions" element={<AIPredictions />} />
        <Route path="/machine-health" element={<MachineHealth />} />
        <Route path="/production-analytics" element={<ProductionAnalytics />} />
        <Route path="/feedback-analysis" element={<FeedbackAnalysis />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-chatbot" element={<AIChatbot />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
