"use client"

import { useEffect, useRef } from "react"
import {
  BookOpen,
  Command,
  FileCheck2,
  Headphones,
  Keyboard,
  ShieldCheck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function HelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="zypher-modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="zypher-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        <div className="zypher-modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-base font-semibold text-foreground">
                AICTE Zypher Oversight Help & Guide
              </h2>
              <p className="text-xs text-muted-foreground">Version 3.2.1 · Compliance Engine</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="zypher-modal-body space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              <Keyboard className="size-3.5 text-primary" />
              Keyboard Shortcuts
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/50">
                <span className="text-muted-foreground">Command palette</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[11px] font-mono text-foreground font-semibold">⌘ K / Ctrl K</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/50">
                <span className="text-muted-foreground">Close modal</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[11px] font-mono text-foreground font-semibold">ESC</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/50">
                <span className="text-muted-foreground">Filter search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[11px] font-mono text-foreground font-semibold">/</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/50">
                <span className="text-muted-foreground">Export CSV</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[11px] font-mono text-foreground font-semibold">Alt + E</kbd>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              <FileCheck2 className="size-3.5 text-primary" />
              Regulatory Oversight Workflow
            </div>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <div className="p-2.5 rounded-md bg-muted/30 border border-border/40">
                <strong className="text-foreground block mb-0.5">1. Submission & Ingestion:</strong>
                Institutions upload application forms, university affiliations, faculty rosters, infrastructure deeds, and balance sheets.
              </div>
              <div className="p-2.5 rounded-md bg-muted/30 border border-border/40">
                <strong className="text-foreground block mb-0.5">2. Automated Cross-Validation:</strong>
                Zypher runs OCR extraction, faculty-to-cadre ratio calculation, land title verification, and discrepancy cross-checks.
              </div>
              <div className="p-2.5 rounded-md bg-muted/30 border border-border/40">
                <strong className="text-foreground block mb-0.5">3. Reviewer Adjudication:</strong>
                Regional officers examine high-risk red flags, review extracted evidence, and record regulatory rulings or clarification requests.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 flex items-start gap-3">
            <Headphones className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-foreground block">Need AICTE Directorate Support?</span>
              <span className="text-muted-foreground">
                Email oversight-desk@aicte-india.org or dial National Oversight Helpdesk at 1800-11-2233 (Mon–Sat, 09:00–18:00 IST).
              </span>
            </div>
          </div>
        </div>

        <div className="zypher-modal-footer">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
