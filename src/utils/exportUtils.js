// Lightweight, dependency-free export helpers for the Reports page.
// These generate real files client-side (CSV always works; the "Excel" export
// produces a .xls file via an HTML table, and "PDF" uses the browser's print dialog,
// which reliably works with no modification needed on Render's static hosting).

export function exportToCSV(filename, rows) {
  if (!rows || rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
  downloadBlob(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;')
}

export function exportToExcel(filename, rows) {
  if (!rows || rows.length === 0) return
  const headers = Object.keys(rows[0])
  const table = `
    <table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows
        .map((row) => `<tr>${headers.map((h) => `<td>${row[h]}</td>`).join('')}</tr>`)
        .join('')}</tbody>
    </table>`
  downloadBlob(table, `${filename}.xls`, 'application/vnd.ms-excel')
}

export function exportToPDF() {
  window.print()
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
