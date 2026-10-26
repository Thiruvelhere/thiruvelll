"use client"

import { useState } from "react"
import { FileCheck2, FileText, UploadCloud, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import type { UploadedDocument } from "./types"

const acceptedFileTypes = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"

function readableFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentUpload({
  id,
  label,
  helper,
  required,
  file,
  onChange,
}: {
  id: string
  label: string
  helper: string
  required: boolean
  file: UploadedDocument | null
  onChange: (file: UploadedDocument | null) => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  const saveFile = (selectedFile: File | null) => {
    if (!selectedFile) return

    onChange({
      name: selectedFile.name,
      size: readableFileSize(selectedFile.size),
      isDemo: false,
    })
  }

  return (
    <Field className="document-upload-field">
      <div className="document-upload-heading">
        <FieldLabel htmlFor={id}>
          {label}
          {required ? <span className="required-mark" aria-hidden="true">*</span> : null}
        </FieldLabel>
        {file ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="remove-file-button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label}`}
          >
            <X data-icon="inline-start" aria-hidden="true" />
            Remove
          </Button>
        ) : null}
      </div>
      <p id={`${id}-help`} className="upload-helper">{helper}</p>
      <div
        className={`upload-dropzone${isDragging ? " upload-dropzone-active" : ""}${file ? " upload-dropzone-filled" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragging(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          saveFile(event.dataTransfer.files.item(0))
        }}
      >
        <input
          id={id}
          type="file"
          accept={acceptedFileTypes}
          className="sr-only"
          aria-describedby={`${id}-help`}
          onChange={(event) => saveFile(event.currentTarget.files?.item(0) ?? null)}
        />
        <label htmlFor={id} className="upload-dropzone-label">
          {file ? (
            <>
              <span className="upload-file-icon"><FileCheck2 aria-hidden="true" /></span>
              <span className="upload-file-copy">
                <span className="upload-file-name" title={file.name}>{file.name}</span>
                <span className="upload-file-meta">
                  {file.size}
                  <span aria-hidden="true">·</span>
                  Verified document format
                </span>
              </span>
              <Badge variant="outline" className="upload-attached-badge">Attached</Badge>
            </>
          ) : (
            <>
              <span className="upload-empty-icon"><UploadCloud aria-hidden="true" /></span>
              <span className="upload-empty-copy">
                <span><strong>Choose a file</strong> or drag it here</span>
                <span>PDF, DOCX, XLSX, JPG or PNG · up to 20 MB</span>
              </span>
              <FileText className="upload-empty-trailing" aria-hidden="true" />
            </>
          )}
        </label>
      </div>
    </Field>
  )
}
