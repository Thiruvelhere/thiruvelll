export type AppPage =
  | "overview"
  | "applications"
  | "submission"
  | "verification"
  | "results"
  | "reports"
  | "audit"

export type ApplicationStatus =
  | "Review Required"
  | "Pending Review"
  | "Ready for Review"
  | "Submitted"

export type DemoForm = {
  institutionName: string
  applicationType: string
  academicYear: string
  state: string
}

export type DocumentKey =
  | "applicationForm"
  | "affiliationCertificate"
  | "facultyDetails"
  | "infrastructureDeclaration"
  | "financialDocuments"

export type UploadedDocument = {
  name: string
  size: string
  isDemo: boolean
}

export type DocumentMap = Record<DocumentKey, UploadedDocument | null>

export type ApplicationRecord = {
  id: string
  institution: string
  academicYear: string
  applicationType: string
  submittedOn: string
  status: ApplicationStatus
  riskScore: number
}

export type Finding = {
  id: string
  title: string
  severity: "High" | "Medium"
  category: string
  applicationLabel: string
  applicationValue: string
  evidenceLabel: string
  evidenceValue: string
  explanation: string
  recommendation: string
}

export type AuditEvent = {
  date: string
  time: string
  actor: string
  action: string
  detail: string
  type: "System" | "Reviewer" | "Submission"
}

export const EMPTY_DEMO_FORM: DemoForm = {
  institutionName: "",
  applicationType: "",
  academicYear: "",
  state: "",
}

export const EMPTY_DOCUMENTS: DocumentMap = {
  applicationForm: null,
  affiliationCertificate: null,
  facultyDetails: null,
  infrastructureDeclaration: null,
  financialDocuments: null,
}

export type NotificationItem = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "action"
}

export type WorkspaceItem = {
  id: string
  name: string
  period: string
}

export type FindingAction = "pending" | "approved" | "clarification" | "rejected"

export type ApplicationDetail = {
  state: string
  contact: string
  email: string
  phone: string
  programs: string[]
  assignedReviewer: string
  notes: string[]
}
