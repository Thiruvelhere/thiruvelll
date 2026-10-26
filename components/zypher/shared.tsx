"use client"

import type { ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "./types"

const statusClasses: Record<ApplicationStatus, string> = {
  "Ready for Review":
    "border-status-green/20 bg-status-green/10 text-status-green",
  "Pending Review":
    "border-status-amber/20 bg-status-amber/10 text-status-amber",
  "Review Required": "border-status-red/20 bg-status-red/10 text-status-red",
  Submitted: "border-primary/15 bg-primary/5 text-primary",
}

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusClasses[status], className)}
    >
      {status}
    </Badge>
  )
}

export function SeverityBadge({
  severity,
}: {
  severity: "High" | "Medium"
}) {
  return (
    <Badge
      variant="outline"
      className={
        severity === "High"
          ? "border-status-red/20 bg-status-red/10 text-status-red"
          : "border-status-amber/20 bg-status-amber/10 text-status-amber"
      }
    >
      {severity} severity
    </Badge>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div className="page-heading-copy">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {children ? <div className="page-actions">{children}</div> : null}
    </div>
  )
}

export function SimulationNote({
  children = "This workspace uses fictional records and a timed demonstration simulation. No documents are processed, stored, or verified by an AI service.",
}: {
  children?: ReactNode
}) {
  return (
    <Alert role="note" className="simulation-note">
      <Info aria-hidden="true" />
      <div>
        <AlertTitle>Demonstration environment</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </div>
    </Alert>
  )
}
