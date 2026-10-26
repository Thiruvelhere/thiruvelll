"use client"

import { useMemo, useState } from "react"
import { Download, Filter, Search, ShieldCheck, Lock } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AUDIT_EVENTS } from "./data"
import { PageHeader } from "./shared"
import { exportAuditTrailCSV } from "./export-utils"

const eventTone = {
  System: "border-primary/15 bg-primary/5 text-primary",
  Reviewer: "border-status-amber/20 bg-status-amber/10 text-status-amber",
  Submission: "border-status-blue/20 bg-status-blue/10 text-status-blue",
}

export function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return AUDIT_EVENTS.filter((event) => {
      const matchesQuery =
        !q ||
        event.actor.toLowerCase().includes(q) ||
        event.action.toLowerCase().includes(q) ||
        event.detail.toLowerCase().includes(q) ||
        event.date.toLowerCase().includes(q)

      const matchesType = typeFilter === "all" || event.type === typeFilter
      return matchesQuery && matchesType
    })
  }, [searchQuery, typeFilter])

  const exportAudit = () => {
    exportAuditTrailCSV(filteredEvents)
    toast.success("Audit trail exported", {
      description: `Downloaded ${filteredEvents.length} security audit records in CSV format.`,
    })
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Oversight workspace · Governance"
        title="Immutable Regulatory Audit Trail"
        description="Comprehensive immutable sequence of officer decisions, AI extraction events, and institutional submissions."
      >
        <Button type="button" variant="outline" onClick={exportAudit}>
          <Download data-icon="inline-start" aria-hidden="true" />
          Export audit trail (CSV)
        </Button>
      </PageHeader>

      <div className="audit-summary-grid">
        <Card className="dashboard-card audit-stat-card">
          <CardContent>
            <span className="audit-stat-icon">
              <ShieldCheck aria-hidden="true" />
            </span>
            <span className="audit-stat-value font-mono">{AUDIT_EVENTS.length}</span>
            <span className="audit-stat-label">Security & review events</span>
          </CardContent>
        </Card>
        <Card className="dashboard-card audit-stat-card">
          <CardContent>
            <span className="audit-stat-icon audit-stat-icon-blue">
              <span>SHA</span>
            </span>
            <span className="audit-stat-value font-mono text-xs">256-Bit</span>
            <span className="audit-stat-label">Cryptographic hash chain</span>
          </CardContent>
        </Card>
        <Card className="dashboard-card audit-stat-card">
          <CardContent>
            <span className="audit-stat-icon audit-stat-icon-green">
              <span>IST</span>
            </span>
            <span className="audit-stat-value font-mono">100%</span>
            <span className="audit-stat-label">Timestamp compliance</span>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card audit-table-card">
        <CardHeader className="dashboard-card-header">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle>System & Reviewer Events</CardTitle>
              <CardDescription>
                Showing {filteredEvents.length} of {AUDIT_EVENTS.length} chronological audit events
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter audit log..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs w-48 md:w-64"
                />
              </div>
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val ?? "all")}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="System">System & OCR</SelectItem>
                    <SelectItem value="Reviewer">Reviewer Decisions</SelectItem>
                    <SelectItem value="Submission">Submissions</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="application-table audit-table">
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time (IST)</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event, idx) => (
                <TableRow key={`${event.date}-${event.time}-${idx}`}>
                  <TableCell>
                    <div className="audit-datetime">
                      <strong>{event.date}</strong>
                      <span className="font-mono text-xs">{event.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="audit-actor-cell font-medium">{event.actor}</TableCell>
                  <TableCell className="audit-action-cell">{event.action}</TableCell>
                  <TableCell className="audit-detail-cell text-muted-foreground">{event.detail}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={eventTone[event.type]}>
                      {event.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                    No audit records match your search query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="audit-table-footer flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Immutable cryptographic hash ledger · SHA-256 chain verified</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">NODE: BLR-DC-04</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
