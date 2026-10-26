"use client"

import { useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileText,
  Info,
  ShieldAlert,
  Check,
  HelpCircle,
  XCircle,
  Send,
  Download,
  AlertTriangle,
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
import { Progress } from "@/components/ui/progress"
import { DEMO_APPLICATION_ID, DEMO_RISK_SCORE, FINDINGS } from "./data"
import { PageHeader, SeverityBadge } from "./shared"
import { downloadTextReport } from "./export-utils"
import type { AppPage, FindingAction } from "./types"

export function ResultsPage({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  const [expandedFinding, setExpandedFinding] = useState<string | null>(FINDINGS[0]?.id ?? null)
  const [findingActions, setFindingActions] = useState<Record<string, FindingAction>>({
    "FIND-001": "pending",
    "FIND-002": "pending",
    "FIND-003": "pending",
  })
  const [overallDecision, setOverallDecision] = useState<string | null>(null)

  // Calculate dynamic risk score based on actions
  const resolvedCount = Object.values(findingActions).filter((a) => a === "rejected").length
  const clarificationCount = Object.values(findingActions).filter((a) => a === "clarification").length
  const currentRiskScore = Math.max(
    15,
    DEMO_RISK_SCORE - resolvedCount * 22 - clarificationCount * 10
  )

  const handleFindingAction = (findingId: string, action: FindingAction, title: string) => {
    setFindingActions((prev) => ({ ...prev, [findingId]: action }))
    if (action === "approved") {
      toast.error(`Finding Flagged: ${title}`, {
        description: "Recorded as an unresolved deficiency in the institutional report.",
      })
    } else if (action === "clarification") {
      toast.warning(`Clarification Notice Issued`, {
        description: "Official inquiry dispatched to Greenfield Engineering College.",
      })
    } else if (action === "rejected") {
      toast.success(`Finding Waived / Resolved`, {
        description: "Reviewer accepted institution justification. Risk score recalculated.",
      })
    }
  }

  const handleApplicationDecision = (decision: string) => {
    setOverallDecision(decision)
    toast.success(`Regulatory Ruling Recorded: ${decision}`, {
      description: "Signed with reviewer DSC token and archived in national audit trail.",
    })
  }

  const exportFindingsReport = () => {
    const reportText = `
================================================================================
AICTE REGULATORY OVERSIGHT - FINDINGS ADJUDICATION DOSSIER
================================================================================
Application ID:    ${DEMO_APPLICATION_ID}
Institution:       Greenfield Engineering College
Academic Year:     2026–27
Current Risk:      ${currentRiskScore} / 100
Reviewing Officer: Ananya Verma (Regional Reviewer)
Overall Decision:  ${overallDecision || "Under Active Adjudication"}

INSPECTED DISCREPANCIES (${FINDINGS.length}):
${FINDINGS.map((f, i) => {
  const action = findingActions[f.id] || "pending"
  return `
--------------------------------------------------------------------------------
[${i + 1}] ${f.id} - ${f.title} (${f.severity} Severity)
Category:           ${f.category}
Declared:           ${f.applicationLabel}: ${f.applicationValue}
Evidence Checked:   ${f.evidenceLabel}: ${f.evidenceValue}
Analysis:           ${f.explanation}
Recommendation:     ${f.recommendation}
Officer Decision:   ${action.toUpperCase()}
`
}).join("\n")}

================================================================================
Authenticated by AICTE Regional Oversight Engine v3.2.1
================================================================================
`
    downloadTextReport(`${DEMO_APPLICATION_ID}-findings-dossier.txt`, reportText.trim())
    toast.success("Findings dossier downloaded", { description: "Text report generated." })
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Oversight workspace · Verification results"
        title="Verification Results & Adjudication"
        description={`${DEMO_APPLICATION_ID} · Greenfield Engineering College · Academic year 2026–27`}
      >
        <Button type="button" variant="outline" onClick={exportFindingsReport}>
          <Download data-icon="inline-start" aria-hidden="true" />
          Export findings dossier
        </Button>
        <Button type="button" variant="outline" onClick={() => onNavigate("reports")}>
          <FileText data-icon="inline-start" aria-hidden="true" />
          Open compliance report
        </Button>
      </PageHeader>

      <section className="risk-summary-grid" aria-label="Risk summary">
        <Card className="dashboard-card risk-score-card">
          <CardContent className="risk-score-content">
            <div className="risk-score-copy">
              <span className="summary-label">Dynamic risk score</span>
              <div className="risk-score-value-line">
                <span className="risk-score-value font-mono">{currentRiskScore}</span>
                <span className="risk-score-scale">/ 100</span>
              </div>
              <SeverityBadge severity={currentRiskScore >= 70 ? "High" : "Medium"} />
              <p>
                {resolvedCount > 0
                  ? `${resolvedCount} finding(s) waived. Risk score dynamically reduced.`
                  : "Manual review recommended before an approval decision."}
              </p>
            </div>
            <div className="risk-score-art" aria-hidden="true">
              <div className="risk-score-ring">
                <span className="font-mono font-bold">{currentRiskScore}</span>
              </div>
              <span className="risk-ring-caption">RISK INDEX</span>
            </div>
            <Progress
              value={currentRiskScore}
              aria-label={`Overall risk score ${currentRiskScore} out of 100`}
              className={`risk-progress [&_[data-slot=progress-track]]:h-2 ${
                currentRiskScore >= 70
                  ? "[&_[data-slot=progress-indicator]]:bg-status-red"
                  : "[&_[data-slot=progress-indicator]]:bg-status-amber"
              }`}
            />
          </CardContent>
        </Card>

        <Card className="dashboard-card reviewer-action-card">
          <CardHeader>
            <div className="reviewer-action-icon">
              <ShieldAlert aria-hidden="true" />
            </div>
            <Badge variant="outline" className="review-action-badge">
              Officer Adjudication
            </Badge>
            <CardTitle>
              {overallDecision ? overallDecision : "Action Required by Reviewer"}
            </CardTitle>
            <CardDescription>
              {overallDecision
                ? "Ruling recorded. All updates logged in immutable audit records."
                : "Evaluate discrepancies and submit your regulatory finding on this application."}
            </CardDescription>
          </CardHeader>
          <CardContent className="reviewer-action-content">
            <div className="flex flex-wrap gap-2 w-full mt-2">
              <Button
                type="button"
                size="sm"
                variant={overallDecision === "Approved with Conditions" ? "default" : "outline"}
                onClick={() => handleApplicationDecision("Approved with Conditions")}
                className="text-xs flex-1"
              >
                <Check className="size-3.5 mr-1 text-emerald-500" />
                Conditional Approval
              </Button>
              <Button
                type="button"
                size="sm"
                variant={overallDecision === "Clarification Notice Issued" ? "default" : "outline"}
                onClick={() => handleApplicationDecision("Clarification Notice Issued")}
                className="text-xs flex-1"
              >
                <HelpCircle className="size-3.5 mr-1 text-amber-500" />
                Issue Notice
              </Button>
              <Button
                type="button"
                size="sm"
                variant={overallDecision === "Escalated to Hearing Committee" ? "destructive" : "outline"}
                onClick={() => handleApplicationDecision("Escalated to Hearing Committee")}
                className="text-xs flex-1"
              >
                <XCircle className="size-3.5 mr-1" />
                Escalate Committee
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="findings-section-heading">
        <div>
          <p className="page-eyebrow">Cross-document analysis</p>
          <h2>Discrepancies & Regulatory Evidence</h2>
          <p>Review OCR matches, cross-check evidence, and record your individual finding decision.</p>
        </div>
        <Badge variant="outline" className="finding-count-badge">
          {FINDINGS.length} findings
        </Badge>
      </div>

      <div className="finding-list">
        {FINDINGS.map((finding, index) => {
          const isExpanded = expandedFinding === finding.id
          const detailsId = `finding-detail-${finding.id}`
          const currentAction = findingActions[finding.id] || "pending"

          return (
            <Card className="dashboard-card finding-card" key={finding.id}>
              <CardHeader className="finding-card-header">
                <Button
                  type="button"
                  variant="ghost"
                  className="finding-toggle"
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                >
                  <span className="finding-index font-mono">0{index + 1}</span>
                  <span className="finding-heading-copy">
                    <span className="finding-meta-line">
                      <SeverityBadge severity={finding.severity} />
                      <span className="text-xs text-muted-foreground">{finding.category}</span>
                      {currentAction === "approved" && (
                        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 text-[10px]">
                          Flag Confirmed
                        </Badge>
                      )}
                      {currentAction === "clarification" && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                          Clarification Dispatched
                        </Badge>
                      )}
                      {currentAction === "rejected" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                          Deficiency Waived
                        </Badge>
                      )}
                    </span>
                    <span className="finding-title">{finding.title}</span>
                  </span>
                  <ChevronDown
                    data-icon="inline-end"
                    className={`finding-chevron${isExpanded ? " finding-chevron-open" : ""}`}
                    aria-hidden="true"
                  />
                </Button>
              </CardHeader>
              <div id={detailsId} hidden={!isExpanded}>
                <CardContent className="finding-details">
                  <div className="finding-comparison" aria-label={`${finding.title} evidence comparison`}>
                    <div className="comparison-value comparison-application">
                      <span>{finding.applicationLabel}</span>
                      <strong>{finding.applicationValue}</strong>
                    </div>
                    <div className="comparison-connector" aria-hidden="true">
                      <ArrowRight />
                    </div>
                    <div className="comparison-value comparison-evidence">
                      <span>{finding.evidenceLabel}</span>
                      <strong>{finding.evidenceValue}</strong>
                    </div>
                  </div>
                  <section className="finding-explanation" aria-labelledby={`${finding.id}-why`}>
                    <div className="finding-explanation-heading">
                      <Info aria-hidden="true" />
                      <h3 id={`${finding.id}-why`}>Discrepancy Root Cause</h3>
                    </div>
                    <p>{finding.explanation}</p>
                  </section>
                  <div className="finding-recommendation">
                    <CheckCircle2 aria-hidden="true" />
                    <div>
                      <span>Statutory recommendation</span>
                      <p>{finding.recommendation}</p>
                    </div>
                  </div>

                  {/* Reviewer Action Bar */}
                  <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Adjudicate this discrepancy:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={currentAction === "approved" ? "destructive" : "outline"}
                        onClick={() => handleFindingAction(finding.id, "approved", finding.title)}
                        className="text-xs h-8"
                      >
                        <ShieldAlert className="size-3.5 mr-1" />
                        Confirm Flag
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={currentAction === "clarification" ? "default" : "outline"}
                        onClick={() => handleFindingAction(finding.id, "clarification", finding.title)}
                        className="text-xs h-8"
                      >
                        <Send className="size-3.5 mr-1" />
                        Request Proof
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={currentAction === "rejected" ? "secondary" : "outline"}
                        onClick={() => handleFindingAction(finding.id, "rejected", finding.title)}
                        className="text-xs h-8"
                      >
                        <Check className="size-3.5 mr-1" />
                        Waive / Resolve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="results-bottom-actions">
        <span>All findings require reviewer adjudication before issuing official certificates.</span>
        <Button type="button" variant="outline" onClick={() => onNavigate("applications")}>
          Return to applications
        </Button>
      </div>
    </div>
  )
}
