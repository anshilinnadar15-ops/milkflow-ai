// Central Axios instance for MilkFlow AI.
// All AI + dashboard endpoints are configured through VITE_API_BASE_URL,
// so the app can be pointed at a real backend without any code changes.
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// --- Local mock data fallback -------------------------------------------------
// The dashboard ships with realistic mock JSON in src/data/ so the UI works
// fully offline / in demo mode. Each function below tries the real API first
// (if configured) and gracefully falls back to the bundled mock data.
import workflowData from '../data/workflow.json'
import productionData from '../data/production.json'
import machinesData from '../data/machines.json'
import feedbackData from '../data/feedback.json'
import predictionsData from '../data/predictions.json'
import reportsData from '../data/reports.json'

const withFallback = async (requestFn, fallbackData) => {
  try {
    const response = await requestFn()
    return response.data
  } catch (error) {
    // Backend not reachable / not configured yet — use bundled demo data.
    return fallbackData
  }
}

export const getWorkflow = () => withFallback(() => apiClient.get('/workflow'), workflowData)
export const getProduction = () => withFallback(() => apiClient.get('/production'), productionData)
export const getMachines = () => withFallback(() => apiClient.get('/machines'), machinesData)
export const getFeedback = () => withFallback(() => apiClient.get('/feedback'), feedbackData)
export const getPredictions = () => withFallback(() => apiClient.get('/predictions'), predictionsData)
export const getReports = () => withFallback(() => apiClient.get('/reports'), reportsData)

// AI Chatbot endpoint — POST /api/chat
// Falls back to a small canned-response engine so the chatbot page always works in demo mode.
export const sendChatMessage = async (message) => {
  try {
    const response = await apiClient.post('/chat', { message })
    return response.data.reply
  } catch (error) {
    return getMockChatReply(message)
  }
}

const getMockChatReply = (message) => {
  const text = message.toLowerCase()
  if (text.includes('delay')) {
    return "Today's main delay is at Pasteurization (HTST Pasteurizer P-1), running 23 minutes behind schedule due to plate heat exchanger fouling. Cooling is a secondary contributor at 11 minutes behind."
  }
  if (text.includes('bottleneck') || text.includes('cause')) {
    return 'Pasteurizer P-1 is the current bottleneck. Flow rate has dropped below the safe threshold, most likely caused by fouling in the plate heat exchanger after an extended run without a CIP cycle.'
  }
  if (text.includes('predict') || text.includes('tomorrow')) {
    return "Based on current wear trends, Pasteurizer P-1 has a 74% failure risk in the next 24 hours. I'd recommend scheduling a CIP cycle tonight to avoid a repeat bottleneck tomorrow morning."
  }
  if (text.includes('complaint') || text.includes('feedback') || text.includes('summarize')) {
    return 'Customer feedback this week is 62% positive overall. Packaging seal issues and shelf-life on curd are the top two complaint categories — taste and quality feedback remain strong.'
  }
  if (text.includes('efficien')) {
    return 'To improve efficiency: prioritize the overdue CIP cycle on P-1, rebalance chiller load between C-3 and C-2, and review sensor calibration on Lab Analyzer QT-2, which is drifting.'
  }
  return "I've reviewed the live production, machine health and feedback data. Could you ask about a specific stage, machine, or trend — for example delays, bottlenecks, predictions, or customer feedback?"
}
