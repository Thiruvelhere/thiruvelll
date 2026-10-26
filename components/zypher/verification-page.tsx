"use client"

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FileSearch2,
  LoaderCircle,
  Play,
  ShieldAlert,
  ShieldCheck,
  Cpu,
} from "lucide-react"
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
import { PROCESSING_CHECKS, PROCESSING_STEPS } from "./data"
import { PageHeader } from "./shared"
import type { AppPage } from "./types"

export function VerificationPage({
  hasDemo,
  isProcessing,
  processingStep,
  validationComplete,
  onStartValidation,
  onLoadDemo,
  onViewResults,
}: {
  hasDemo: boolean
  isProcessing: boolean
  processingStep: number
  validationComplete: boolean
  onStartValidation: () => void
  onLoadDemo: () => void
  onViewResults: () => void
}) {
  const progressValue = Math.round((processingStep / PROCESSING_STEPS.length) * 100)

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Oversight workspace · Verification"
        title="Document Verification Engine"
        description="Multi-model automated pipeline running OCR text extraction, regulatory rules engines, and cross-document reconciliation."
      >
        {validationComplete ? (
          <Button type="button" onClick={onViewResults}>
            View findings & adjudication
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        ) : null}
      </PageHeader>

      <div className="verification-grid">
        <Card className="dashboard-card verification-card">
          <CardHeader className="verification-card-header">
            <div>
              <div className="verification-title-line">
                <CardTitle>Validation Run</CardTitle>
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary font-mono text-[11px]">
                  ENGINE v3.2.1
                </Badge>
              </div>
              <CardDescription>
                {hasDemo
                  ? "APP-2026-002 · Greenfield Engineering College · 2026–27"
                  : "Target dossier: APP-2026-002 (Greenfield Engineering College)"}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={
                validationComplete
                  ? "border-status-green/20 bg-status-green/10 text-status-green"
                  : isProcessing
                    ? "border-primary/20 bg-primary/5 text-primary"
                    : "border-border bg-muted/50 text-muted-foreground"
              }
            >
              {validationComplete ? "Complete" : isProcessing ? "In progress" : "Ready to run"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="verification-progress-summary">
              <span>
                {validationComplete
                  ? "All automated checks completed"
                  : isProcessing
                  ? PROCESSING_STEPS[Math.min(processingStep, PROCESSING_STEPS.length - 1)]?.label
                  : "6 statutory compliance checks"}
              </span>
              <span className="font-mono font-bold">{progressValue}%</span>
            </div>
            <Progress
              value={progressValue}
              aria-label={`Validation progress ${progressValue}%`}
              className="verification-progress [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-primary"
            />

            <div className="processing-step-list">
              {PROCESSING_STEPS.map((step, index) => {
                const isDone = validationComplete || index < processingStep
                const isCurrent = isProcessing && index === processingStep

                return (
                  <div
                    key={step.label}
                    className={`processing-step${isCurrent ? " processing-step-current" : ""}${isDone ? " processing-step-done" : ""}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <div className="processing-step-icon">
                      {isDone ? (
                        <Check aria-hidden="true" />
                      ) : isCurrent ? (
                        <LoaderCircle className="animate-spin text-primary" aria-hidden="true" />
                      ) : (
                        <Circle aria-hidden="true" />
                      )}
                    </div>
                    <div className="processing-step-copy">
                      <span className="font-medium">{step.label}</span>
                      <span className="text-xs text-muted-foreground">{step.detail}</span>
                    </div>
                    <span className="processing-step-state font-mono text-[11px]">
                      {isDone ? "PASS" : isCurrent ? "RUNNING" : "QUEUED"}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="verification-actions">
              {validationComplete ? (
                <>
                  <Button type="button" variant="outline" onClick={onStartValidation}>
                    <Play data-icon="inline-start" aria-hidden="true" />
                    Re-run verification pipeline
                  </Button>
                  <Button type="button" variant="default" onClick={onViewResults}>
                    Open findings
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={onStartValidation} disabled={isProcessing}>
                  {isProcessing ? (
                    <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
                  ) : (
                    <Play data-icon="inline-start" aria-hidden="true" />
                  )}
                  {isProcessing ? "Pipeline executing..." : "Execute verification pipeline"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card checks-card">
          <CardHeader>
            <div className="checks-card-icon">
              <ShieldCheck aria-hidden="true" />
            </div>
            <CardTitle>AICTE Statutory Verification Protocols</CardTitle>
            <CardDescription>
              Rules and AI models deployed across each uploaded institutional dossier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="verification-check-list">
              {PROCESSING_CHECKS.map((check, index) => (
                <li key={check}>
                  <span className="font-mono">{index + 1}</span>
                  {check}
                </li>
              ))}
            </ul>
            <div className="checks-card-footer">
              <Cpu className="size-4 text-primary shrink-0" aria-hidden="true" />
              <p>OCR cross-validation engine with SHA-256 cryptographic document verification.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {validationComplete ? (
        <div className="verification-complete-callout">
          <div className="verification-complete-icon">
            <ClipboardCheck aria-hidden="true" />
          </div>
          <div>
            <strong>Cross-verification complete</strong>
            <span>3 discrepancies identified requiring reviewer evaluation and final adjudication.</span>
          </div>
          <Button type="button" size="sm" onClick={onViewResults} className="ml-auto">
            View Discrepancies
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
