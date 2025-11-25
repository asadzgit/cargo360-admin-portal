/**
 * Utility function to convert data array to CSV format and download it
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} headers - Array of header objects with 'label' and 'key' properties
 * @param {String} filename - Name of the CSV file to download
 */
export const exportToCSV = (data, headers, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Create CSV header row
  const headerRow = headers.map(h => h.label).join(',')

  // Create CSV data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = header.key.split('.').reduce((obj, key) => obj?.[key], row) ?? ''
      // Escape commas and quotes, and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value).replace(/"/g, '""')
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue}"`
      }
      return stringValue
    }).join(',')
  })

  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

