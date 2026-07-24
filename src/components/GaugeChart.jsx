import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

// Semi-circular gauge built on Recharts' RadialBarChart, used for
// health %, confidence score, and failure-probability visuals.
export default function GaugeChart({ value, size = 160, color = '#2563EB', label, sublabel }) {
  const data = [{ value }]
  return (
    <div className="flex flex-col items-center">
      <RadialBarChart
        width={size}
        height={size / 1.6 + 20}
        cx={size / 2}
        cy={size / 1.6}
        innerRadius={size / 2.6}
        outerRadius={size / 2}
        barSize={size / 10}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background={{ fill: '#F1F5F9' }} dataKey="value" cornerRadius={20} fill={color} angleAxisId={0} />
      </RadialBarChart>
      <div className="-mt-8 text-center">
        <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}{typeof value === 'number' ? '%' : ''}</p>
        {label && <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>}
      </div>
      {sublabel && <p className="text-[11px] text-slate-400 mt-1">{sublabel}</p>}
    </div>
  )
}
