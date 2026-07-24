import { statusColors } from '../utils/formatters'

export default function StatusBadge({ status }) {
  const colors = statusColors[status] || statusColors.pending
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
  return (
    <span className={`badge ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  )
}
