import type { ApplicationRecord, AuditEvent } from "./types"

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? "").replace(/"/g, '""')
    return `"${str}"`
  }

  const csvContent = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ].join("\r\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportApplicationsCSV(applications: ApplicationRecord[]) {
  const headers = ["Application ID", "Institution", "Academic Year", "Application Type", "Submitted Date", "Status", "Risk Score"]
  const rows = applications.map((app) => [
    app.id,
    app.institution,
    app.academicYear,
    app.applicationType,
    app.submittedOn,
    app.status,
    app.riskScore,
  ])
  const dateStr = new Date().toISOString().split("T")[0]
  downloadCSV(`aicte-applications-export-${dateStr}.csv`, headers, rows)
}

export function exportAuditTrailCSV(events: AuditEvent[]) {
  const headers = ["Date", "Time (IST)", "Actor", "Action", "Category", "Details"]
  const rows = events.map((event) => [
    event.date,
    event.time,
    event.actor,
    event.action,
    event.type,
    event.detail,
  ])
  const dateStr = new Date().toISOString().split("T")[0]
  downloadCSV(`aicte-audit-trail-${dateStr}.csv`, headers, rows)
}

export function downloadTextReport(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
