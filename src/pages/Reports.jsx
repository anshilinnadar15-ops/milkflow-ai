import { motion } from 'framer-motion'
import { FileText, Download, FileSpreadsheet, FileType } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { CardGridSkeleton } from '../components/LoadingSkeleton'
import { useFetchData } from '../hooks/useFetchData'
import { getReports } from '../services/api'
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils'

export default function Reports() {
  const { data, loading } = useFetchData(getReports, [])

  const handleExport = (type, report) => {
    const rows = [
      { Report: report.title, Description: report.description, LastGenerated: report.lastGenerated },
    ]
    if (type === 'csv') exportToCSV(report.id, rows)
    if (type === 'excel') exportToExcel(report.id, rows)
    if (type === 'pdf') exportToPDF()
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export production, machine, and feedback reports."
      />

      {loading ? (
        <CardGridSkeleton count={5} height={190} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.reportCards.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="card card-hover p-5 flex flex-col"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white">{report.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-1">{report.description}</p>
              <p className="text-xs text-slate-400 mt-3">Last generated: {report.lastGenerated}</p>

              <div className="flex items-center gap-2 mt-4">
                <ExportButton icon={Download} label="CSV" onClick={() => handleExport('csv', report)} />
                <ExportButton icon={FileSpreadsheet} label="Excel" onClick={() => handleExport('excel', report)} />
                <ExportButton icon={FileType} label="PDF" onClick={() => handleExport('pdf', report)} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function ExportButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  )
}
