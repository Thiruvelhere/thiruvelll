"use client"

import { toast } from "sonner"
import { ArrowRight, Download, FileCheck2, FileWarning, ShieldCheck, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AUDIT_EVENTS, DEMO_DOCUMENTS, FINDINGS, REPORT_RECOMMENDATIONS } from "./data"
import { PageHeader, SeverityBadge } from "./shared"
import { downloadTextReport } from "./export-utils"
import type { AppPage } from "./types"

export function ReportPage({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  const downloadReport = () => {
    const reportContent = `
================================================================================
ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
NATIONAL INSTITUTIONAL OVERSIGHT & COMPLIANCE REPORT
================================================================================
Report Reference:      AIC-REG-2026-00481
Generation Timestamp:  ${new Date().toLocaleDateString("en-IN", { dateStyle: "full" })} IST
Digital Certificate:   SHA-256: 7f8a9b2c3d4e5f601a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f

1. INSTITUTION IDENTIFICATION
--------------------------------------------------------------------------------
Institution Name:      Greenfield Engineering College
Application Number:    APP-2026-002
Application Category:  Extension of Approval (EoA)
Academic Cycle:        2026–27
Jurisdiction:          Karnataka State / Southwest Region
Submission Date:       23 Oct 2026
Assigned Officer:      Ananya Verma (Regional Reviewer)

2. COMPLIANCE STANDING & RISK ASSESSMENT
--------------------------------------------------------------------------------
Composite Risk Index:  76 / 100
Statutory Status:      Review Required (Manual Adjudication Mandatory)
Deficiency Count:      3 Identified Discrepancies
Affiliation Check:     EXPIRED (2025-26 on record)
Faculty Cadre Ratio:   DEFICIT (24 declared vs 18 verified)
Infrastructure Title:  PENDING VERIFICATION

3. VERIFIED DOCUMENTS & SUBMISSION RECORD
--------------------------------------------------------------------------------
- Application Form:              greenfield-application-form-2026.pdf (1.2 MB) [VERIFIED]
- Affiliation Certificate:       greenfield-affiliation-cert.pdf (820 KB) [FLAGGED EXPIRED]
- Faculty Roster:                greenfield-faculty-roster.xlsx (460 KB) [RATIO MISMATCH]
- Infrastructure Declaration:    MISSING / OMITTED
- Financial Statements:          greenfield-audited-financials-2025.pdf (3.4 MB) [VERIFIED]

4. REGULATORY FINDINGS SUMMARY
--------------------------------------------------------------------------------
${FINDINGS.map((f, i) => `[Finding 0${i + 1}] ${f.id}: ${f.title}
Severity:       ${f.severity}
Category:       ${f.category}
Declared:       ${f.applicationLabel}: ${f.applicationValue}
Evidence:       ${f.evidenceLabel}: ${f.evidenceValue}
Root Cause:     ${f.explanation}
Recommendation: ${f.recommendation}
`).join("\n")}

5. STATUTORY RECOMMENDATIONS
--------------------------------------------------------------------------------
${REPORT_RECOMMENDATIONS.map((r, i) => `${i + 1}. [${r.badge}] ${r.title}\n   ${r.detail}`).join("\n\n")}

6. REGULATORY SIGN-OFF
--------------------------------------------------------------------------------
Officer in Charge:     Ananya Verma
Designation:           Regional Reviewer, Southwestern Region
Council:               All India Council for Technical Education, New Delhi
Digital Signature:     VERIFIED VALID · DSC TOKEN ID: DSC-AIC-99214

================================================================================
OFFICIAL CONFIDENTIAL COMPLIANCE REPORT · AICTE REGULATORY PLATFORM v3.2.1
================================================================================
`
    downloadTextReport("AIC-REG-2026-00481-compliance-report.txt", reportContent.trim())
    toast.success("Compliance report downloaded", {
      description: "Report AIC-REG-2026-00481 downloaded successfully.",
    })
  }

  const printReport = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Oversight workspace · Compliance"
        title="Institutional Compliance Report"
        description="Official regulatory summary and risk dossier for Greenfield Engineering College (APP-2026-002)."
      >
        <Button type="button" variant="outline" onClick={printReport}>
          <Printer data-icon="inline-start" aria-hidden="true" />
          Print report
        </Button>
        <Button type="button" variant="outline" onClick={() => onNavigate("audit")}>
          View audit trail
        </Button>
        <Button type="button" onClick={downloadReport}>
          <Download data-icon="inline-start" aria-hidden="true" />
          Download report
        </Button>
      </PageHeader>

      <Card className="dashboard-card report-summary-card">
        <CardContent className="report-summary-content">
          <div className="report-summary-brand">
            <div className="report-summary-icon">
              <ShieldCheck aria-hidden="true" />
            </div>
            <div>
              <p className="page-eyebrow">AICTE · Official Compliance Dossier</p>
              <h2>Application Compliance Summary</h2>
              <p>Report AIC-REG-2026-00481 <span aria-hidden="true">·</span> Verified 26 Oct 2026</p>
            </div>
          </div>
          <div className="report-decision">
            <span>Reviewer Adjudication Status</span>
            <Badge variant="outline" className="border-status-red/20 bg-status-red/10 text-status-red">
              Manual review required
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="report-overview-grid">
        <Card className="dashboard-card report-institution-card">
          <CardHeader>
            <CardTitle>Institution Details</CardTitle>
            <CardDescription>Application record and review context</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="report-detail-grid">
              <div><dt>Institution</dt><dd>Greenfield Engineering College</dd></div>
              <div><dt>Application ID</dt><dd className="font-mono">APP-2026-002</dd></div>
              <div><dt>Application type</dt><dd>Extension of Approval</dd></div>
              <div><dt>Academic year</dt><dd>2026–27</dd></div>
              <div><dt>State</dt><dd>Karnataka</dd></div>
              <div><dt>Submitted on</dt><dd>23 Oct 2026</dd></div>
            </dl>
          </CardContent>
        </Card>

        <Card className="dashboard-card report-risk-card">
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>AICTE automated validation score</CardDescription>
          </CardHeader>
          <CardContent className="report-risk-content">
            <span className="report-risk-number font-mono">76<span>/100</span></span>
            <Badge variant="outline" className="border-status-red/20 bg-status-red/10 text-status-red">
              High risk
            </Badge>
            <p>Three findings require statutory clarification before approval issuance.</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("results")}>
              Review findings
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card report-documents-card">
        <CardHeader>
          <CardTitle>Document Verification Status</CardTitle>
          <CardDescription>Summary of statutory attachments evaluated during this cycle</CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="report-table">
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Filename</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(DEMO_DOCUMENTS).map(([key, doc]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">
                    {key === "applicationForm"
                      ? "Application Form"
                      : key === "affiliationCertificate"
                      ? "Affiliation Certificate"
                      : key === "facultyDetails"
                      ? "Faculty Details Roster"
                      : key === "infrastructureDeclaration"
                      ? "Infrastructure Declaration"
                      : "Financial Statements"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {doc ? doc.name : "Not provided"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc ? doc.size : "—"}
                  </TableCell>
                  <TableCell>
                    {doc ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <FileCheck2 className="size-3.5" /> Attached & Indexed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                        <FileWarning className="size-3.5" /> Missing Statutory Doc
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="dashboard-card report-recommendations-card">
        <CardHeader>
          <CardTitle>Statutory Recommendations</CardTitle>
          <CardDescription>Required actions for council reviewers and institution authorities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {REPORT_RECOMMENDATIONS.map((rec) => (
              <div key={rec.title} className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {rec.badge}
                  </Badge>
                  <h4 className="font-semibold text-sm text-foreground">{rec.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{rec.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
