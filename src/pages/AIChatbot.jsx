import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { sendChatMessage } from '../services/api'

const suggestedQuestions = [
  "Why was today's production delayed?",
  'Which machine caused the bottleneck?',
  "Predict tomorrow's bottleneck.",
  'Summarize customer complaints.',
  'How can efficiency be improved?',
]

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm the MilkFlow AI assistant. Ask me about bottlenecks, machine health, predictions or customer feedback.",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (text) => {
    const message = text ?? input
    if (!message.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: message }])
    setInput('')
    setIsTyping(true)
    const reply = await sendChatMessage(message)
    setIsTyping(false)
    setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-11rem)]">
      <PageHeader title="AI Chatbot" subtitle="Ask natural-language questions about the plant's live production data." />

      <div className="card flex-1 flex flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-primary'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          <div className="flex gap-2 mb-3 flex-wrap">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about production, bottlenecks, or predictions…"
              className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
            />
            <button
              type="submit"
              className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
