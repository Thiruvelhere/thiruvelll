"use client"

import type { FormEvent } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, FilePlus2, Play, Send, ShieldCheck, Sparkles } from "lucide-react"
import { DOCUMENT_REQUIREMENTS } from "./data"
import { DocumentUpload } from "./document-upload"
import { PageHeader } from "./shared"
import type { DemoForm, DocumentKey, DocumentMap, UploadedDocument } from "./types"

export function SubmissionPage({
  application,
  documents,
  hasDemo,
  submitted,
  onChange,
  onFileChange,
  onLoadDemo,
  onSubmit,
  onStartValidation,
}: {
  application: DemoForm
  documents: DocumentMap
  hasDemo: boolean
  submitted: boolean
  onChange: (field: keyof DemoForm, value: string) => void
  onFileChange: (key: DocumentKey, file: UploadedDocument | null) => void
  onLoadDemo: () => void
  onSubmit: () => void
  onStartValidation: () => void
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  const uploadedCount = Object.values(documents).filter(Boolean).length

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Oversight workspace · New submission"
        title="Submit Institution Application"
        description="Ingest institution application dossiers and supporting compliance documents for automated cross-validation."
      >
        <Button type="button" variant="outline" onClick={onLoadDemo}>
          <Sparkles data-icon="inline-start" aria-hidden="true" />
          Pre-fill sample dossier
        </Button>
      </PageHeader>

      {submitted ? (
        <Alert role="status" className="submission-success-alert border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="text-emerald-500" aria-hidden="true" />
          <div className="flex-1">
            <AlertTitle className="font-semibold text-emerald-900 dark:text-emerald-100">
              Application dossier registered (APP-2026-026)
            </AlertTitle>
            <AlertDescription className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
              Document package indexed with cryptographic timestamps. Ready for automated cross-verification engine.
            </AlertDescription>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onStartValidation}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white ml-2"
          >
            <Play className="size-3.5 mr-1 fill-white" />
            Proceed to Verification
          </Button>
        </Alert>
      ) : null}

      {hasDemo && !submitted ? (
        <div className="loaded-demo-banner">
          <span className="loaded-demo-icon">
            <ShieldCheck aria-hidden="true" />
          </span>
          <span className="loaded-demo-copy">
            <strong>Greenfield Engineering College dossier pre-filled</strong>
            <span>APP-2026-002 · Extension of Approval 2026–27 · 4 documents attached</span>
          </span>
          <Button type="button" onClick={onStartValidation}>
            <Play data-icon="inline-start" aria-hidden="true" />
            Start verification pipeline
          </Button>
        </div>
      ) : null}

      <form className="page-stack submission-form" onSubmit={handleSubmit}>
        <Card className="dashboard-card form-card">
          <CardHeader className="form-card-header">
            <div className="form-step-number">01</div>
            <div>
              <CardTitle>Institution and Application Profile</CardTitle>
              <CardDescription>Enter the statutory institution information for this oversight review.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup className="submission-field-grid">
              <Field>
                <FieldLabel htmlFor="institution-name">
                  Institution Name <span className="required-mark" aria-hidden="true">*</span>
                </FieldLabel>
                <Input
                  id="institution-name"
                  required
                  value={application.institutionName}
                  placeholder="e.g. Greenfield Engineering College"
                  onChange={(event) => onChange("institutionName", event.currentTarget.value)}
                  className="form-control"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="application-type">
                  Application Type <span className="required-mark" aria-hidden="true">*</span>
                </FieldLabel>
                <Select
                  value={application.applicationType || null}
                  onValueChange={(value) => onChange("applicationType", value ?? "")}
                >
                  <SelectTrigger id="application-type" className="form-control" aria-label="Application type">
                    <SelectValue placeholder="Select application type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Extension of Approval">Extension of Approval</SelectItem>
                      <SelectItem value="New Institution">New Institution</SelectItem>
                      <SelectItem value="New Program">New Program</SelectItem>
                      <SelectItem value="Change in Intake">Change in Intake</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="academic-year">
                  Academic Cycle <span className="required-mark" aria-hidden="true">*</span>
                </FieldLabel>
                <Select
                  value={application.academicYear || null}
                  onValueChange={(value) => onChange("academicYear", value ?? "")}
                >
                  <SelectTrigger id="academic-year" className="form-control" aria-label="Academic year">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="2026–27">2026–27</SelectItem>
                      <SelectItem value="2027–28">2027–28</SelectItem>
                      <SelectItem value="2028–29">2028–29</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="institution-state">
                  State / Union Territory <span className="required-mark" aria-hidden="true">*</span>
                </FieldLabel>
                <Select
                  value={application.state || null}
                  onValueChange={(value) => onChange("state", value ?? "")}
                >
                  <SelectTrigger id="institution-state" className="form-control" aria-label="State or Union Territory">
                    <SelectValue placeholder="Select state or territory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Kerala">Kerala</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Telangana">Telangana</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="dashboard-card form-card">
          <CardHeader className="form-card-header">
            <div className="form-step-number">02</div>
            <div>
              <CardTitle>Statutory Supporting Documents</CardTitle>
              <CardDescription>
                Attach required documentation for AICTE regulatory oversight ({uploadedCount}/5 attached).
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <FieldSet className="document-fieldset">
              <FieldLegend className="sr-only">Required documents</FieldLegend>
              <FieldDescription className="document-fieldset-description">
                Accepted formats: PDF, DOCX, XLSX, JPG, PNG up to 20 MB each.
              </FieldDescription>
              <FieldGroup className="document-grid">
                {DOCUMENT_REQUIREMENTS.map((document) => (
                  <DocumentUpload
                    key={document.key}
                    id={`document-${document.key}`}
                    label={document.label}
                    helper={document.helper}
                    required={document.required}
                    file={documents[document.key]}
                    onChange={(file) => onFileChange(document.key, file)}
                  />
                ))}
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <div className="submission-actions">
          <p>Fields marked with <span className="required-mark">*</span> are required statutory declarations.</p>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="default">
              <Send data-icon="inline-start" aria-hidden="true" />
              Register submission
            </Button>
            <Button type="button" variant="outline" onClick={onStartValidation}>
              <Play data-icon="inline-start" aria-hidden="true" />
              Run verification pipeline
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
