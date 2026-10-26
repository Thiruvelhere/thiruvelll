"use client"

import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Search,
} from "lucide-react"
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
import { APPLICATIONS } from "./data"
import { PageHeader, StatusBadge } from "./shared"
import { exportApplicationsCSV } from "./export-utils"
import { ApplicationDetailDialog } from "./application-detail-dialog"
import type { AppPage, ApplicationRecord, ApplicationStatus } from "./types"

type SortField = "id" | "institution" | "applicationType" | "submittedOn" | "status" | "riskScore"
type SortOrder = "asc" | "desc"

const ITEMS_PER_PAGE = 8

export function ApplicationsPage({
  searchQuery,
  onSearchQueryChange,
  onNavigate,
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  onNavigate: (page: AppPage) => void
}) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("submittedOn")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const list = APPLICATIONS.filter((application) => {
      const matchesQuery =
        !query ||
        [
          application.id,
          application.institution,
          application.academicYear,
          application.applicationType,
          application.status,
        ].some((value) => value.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "flagged" && application.status === "Review Required") ||
        (statusFilter === "pending" && application.status === "Pending Review") ||
        (statusFilter === "ready" && application.status === "Ready for Review") ||
        (statusFilter === "submitted" && application.status === "Submitted")

      return matchesQuery && matchesStatus
    })

    return list.sort((a, b) => {
      let comparison = 0
      if (sortField === "riskScore") {
        comparison = a.riskScore - b.riskScore
      } else {
        const valA = String(a[sortField]).toLowerCase()
        const valB = String(b[sortField]).toLowerCase()
        comparison = valA.localeCompare(valB)
      }
      return sortOrder === "asc" ? comparison : -comparison
    })
  }, [searchQuery, statusFilter, sortField, sortOrder])

  // Pagination calculation
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE) || 1
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredApplications.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredApplications, currentPage])

  const handleExport = () => {
    exportApplicationsCSV(filteredApplications)
    toast.success("Applications exported successfully", {
      description: `Downloaded ${filteredApplications.length} records in CSV format.`,
    })
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 inline ml-1 text-muted-foreground/60" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3 inline ml-1 text-primary" />
    ) : (
      <ArrowDown className="size-3 inline ml-1 text-primary" />
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Oversight workspace · Submissions"
        title="Applications Registry"
        description="Comprehensive directory of technical institutions, intake applications, and compliance standing."
      >
        <Button type="button" variant="outline" onClick={handleExport} className="export-btn">
          <Download data-icon="inline-start" aria-hidden="true" />
          Export registry ({filteredApplications.length})
        </Button>
      </PageHeader>

      <Card className="dashboard-card applications-card">
        <CardHeader className="applications-card-header">
          <div className="applications-title-row">
            <div>
              <CardTitle>Institution Applications</CardTitle>
              <CardDescription>
                Showing {paginatedApps.length} of {filteredApplications.length} active applications
              </CardDescription>
            </div>
            <Badge variant="outline" className="cycle-badge">
              2026–27 cycle
            </Badge>
          </div>
          <div className="application-filters">
            <div className="search-field application-search-field">
              <Search aria-hidden="true" />
              <Input
                aria-label="Search applications"
                placeholder="Search by institution, ID, or type..."
                value={searchQuery}
                onChange={(event) => {
                  onSearchQueryChange(event.currentTarget.value)
                  setCurrentPage(1)
                }}
                className="filter-input"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value ?? "all")
                setCurrentPage(1)
              }}
            >
              <SelectTrigger aria-label="Filter by status" className="status-filter-trigger">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="flagged">Review required</SelectItem>
                  <SelectItem value="pending">Pending review</SelectItem>
                  <SelectItem value="ready">Ready for review</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="application-table applications-table">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("id")}
                >
                  Application {renderSortIcon("id")}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("institution")}
                >
                  Institution {renderSortIcon("institution")}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("applicationType")}
                >
                  Application type {renderSortIcon("applicationType")}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("submittedOn")}
                >
                  Submitted {renderSortIcon("submittedOn")}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("status")}
                >
                  Status {renderSortIcon("status")}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("riskScore")}
                >
                  Risk {renderSortIcon("riskScore")}
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApps.map((application) => (
                <TableRow
                  key={application.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setSelectedAppId(application.id)}
                >
                  <TableCell className="table-id-cell font-mono font-medium text-primary">
                    {application.id}
                  </TableCell>
                  <TableCell className="table-institution-cell font-medium">
                    {application.institution}
                  </TableCell>
                  <TableCell className="table-muted-cell">
                    {application.applicationType}
                  </TableCell>
                  <TableCell className="table-muted-cell">
                    {application.submittedOn}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`risk-number ${
                        application.riskScore >= 70
                          ? "risk-number-high"
                          : application.riskScore >= 40
                          ? "risk-number-medium"
                          : "risk-number-low"
                      }`}
                    >
                      {application.riskScore}
                    </span>
                    <span className="risk-out-of">/ 100</span>
                  </TableCell>
                  <TableCell className="table-action-cell" onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`View ${application.id}`}
                      onClick={() => setSelectedAppId(application.id)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      View
                      <ArrowRight data-icon="inline-end" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="table-empty-cell py-8 text-center text-muted-foreground">
                    No applications match these filters. Try another search or status.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>

          {/* Pagination & Summary Footer */}
          <div className="table-pagination-row flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing page {currentPage} of {totalPages} ({filteredApplications.length} total applications)
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 text-xs"
              >
                <ChevronLeft className="size-3.5 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    type="button"
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    className="size-8 text-xs font-medium"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 text-xs"
              >
                Next
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Detail Dialog */}
      <ApplicationDetailDialog
        applicationId={selectedAppId}
        onClose={() => setSelectedAppId(null)}
        onNavigate={onNavigate}
      />
    </div>
  )
}
