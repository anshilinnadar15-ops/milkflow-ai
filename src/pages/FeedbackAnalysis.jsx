import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ChartCard from '../components/ChartCard'
import { ChartSkeleton, TableSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getFeedback } from '../services/api'

const SENTIMENT_COLORS = { Positive: '#16A34A', Neutral: '#F59E0B', Negative: '#DC2626' }

export default function FeedbackAnalysis() {
  const { data, loading } = useFetchData(getFeedback, [])

  const sentimentPie = data
    ? [
        { name: 'Positive', value: data.summary.positivePct },
        { name: 'Neutral', value: data.summary.neutralPct },
        { name: 'Negative', value: data.summary.negativePct },
      ]
    : []

  return (
    <div>
      <PageHeader
        title="Feedback Analysis"
        subtitle="Customer sentiment and recurring product issues from the past 7 days."
      />

      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 mb-5 flex gap-4 items-start bg-gradient-to-r from-primary-50/60 to-transparent dark:from-primary/10"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-semibold text-slate-800 dark:text-slate-100 mb-1">AI Summary</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{data.aiSummary}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {loading ? (
          <>
            <ChartSkeleton height={240} /> <ChartSkeleton height={240} /> <ChartSkeleton height={240} />
          </>
        ) : (
          <>
            <ChartCard title="Sentiment Breakdown" subtitle={`${data.summary.totalFeedback} responses this week`} index={0}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={sentimentPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {sentimentPie.map((entry) => (
                      <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Complaint Categories" subtitle="Most reported issue types" index={1}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.categories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={55} interval={0} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sentiment Trend" subtitle="Daily sentiment split, past 7 days" index={2}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.sentimentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Line type="monotone" dataKey="positive" stroke="#16A34A" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="negative" stroke="#DC2626" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        <div className="xl:col-span-2">
          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-0 overflow-hidden">
              <div className="p-5 pb-0">
                <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100">Recent Feedback</h3>
              </div>
              <div className="overflow-x-auto scrollbar-thin mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-left text-xs text-slate-400 uppercase">
                      <th className="px-5 py-2.5 font-semibold">Feedback</th>
                      <th className="px-5 py-2.5 font-semibold">Sentiment</th>
                      <th className="px-5 py-2.5 font-semibold">Category</th>
                      <th className="px-5 py-2.5 font-semibold">Rating</th>
                      <th className="px-5 py-2.5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((entry) => (
                      <tr key={entry.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-300 max-w-xs">{entry.text}</td>
                        <td className="px-5 py-3">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: `${SENTIMENT_COLORS[entry.sentiment]}1A`,
                              color: SENTIMENT_COLORS[entry.sentiment],
                            }}
                          >
                            {entry.sentiment}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{entry.category}</td>
                        <td className="px-5 py-3 text-slate-500">{'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}</td>
                        <td className="px-5 py-3 text-slate-400 text-xs">{entry.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

        {!loading && (
          <div className="space-y-5">
            <ChartCard title="Word Cloud" subtitle="Most common terms in feedback (placeholder)" index={3}>
              <div className="flex flex-wrap gap-2 items-center justify-center py-6">
                {[
                  ['Packaging', 26], ['Fresh', 22], ['Leak', 18], ['Taste', 20],
                  ['Cold', 16], ['Seal', 15], ['Shelf life', 19], ['Quality', 17], ['Delivery', 13],
                ].map(([word, size]) => (
                  <span
                    key={word}
                    className="font-display font-semibold text-primary/80"
                    style={{ fontSize: `${size * 0.9}px`, opacity: 0.5 + size / 40 }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Most Common Issues" subtitle="Ranked by mention count" index={4}>
              <ul className="space-y-2">
                {data.categories
                  .slice()
                  .sort((a, b) => b.count - a.count)
                  .map((c, i) => (
                    <li key={c.category} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{i + 1}. {c.category}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{c.count}</span>
                    </li>
                  ))}
              </ul>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  )
}
