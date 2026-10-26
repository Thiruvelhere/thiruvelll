"use client"

import { useEffect, useRef, useState } from "react"
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Search,
} from "lucide-react"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ApplicationsPage } from "./applications-page"
import { AuditPage } from "./audit-page"
import { DashboardPage } from "./dashboard-page"
import {
  APPLICATIONS,
  DEMO_APPLICATION_FORM,
  DEMO_DOCUMENTS,
  NOTIFICATIONS,
  PROCESSING_STEPS,
} from "./data"
import { ReportPage } from "./report-page"
import { ResultsPage } from "./results-page"
import { AppSidebar } from "./sidebar"
import { SubmissionPage } from "./submission-page"
import { VerificationPage } from "./verification-page"
import { NotificationsPanel } from "./notifications-panel"
import { HelpModal } from "./help-modal"
import { ProfileMenu } from "./profile-menu"
import { CommandPalette } from "./command-palette"
import { ApplicationDetailDialog } from "./application-detail-dialog"
import { exportApplicationsCSV } from "./export-utils"
import {
  EMPTY_DEMO_FORM,
  EMPTY_DOCUMENTS,
} from "./types"
import type { AppPage, DemoForm, DocumentKey, DocumentMap, NotificationItem, UploadedDocument } from "./types"

const pageLabels: Record<AppPage, string> = {
  overview: "Overview",
  applications: "Applications",
  submission: "Submit application",
  verification: "Document verification",
  results: "Verification results",
  reports: "Compliance report",
  audit: "Audit trail",
}

export function ZypherApp() {
  const [activePage, setActivePage] = useState<AppPage>("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [application, setApplication] = useState<DemoForm>({ ...EMPTY_DEMO_FORM })
  const [documents, setDocuments] = useState<DocumentMap>({ ...EMPTY_DOCUMENTS })
  const [hasDemo, setHasDemo] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [validationComplete, setValidationComplete] = useState(false)
  const completionNoticeShown = useRef(false)

  // Interactive UI modals and popovers state
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  const navigateTo = (page: AppPage) => {
    setActivePage(page)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Keyboard shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const loadDemo = () => {
    setApplication({ ...DEMO_APPLICATION_FORM })
    setDocuments({ ...DEMO_DOCUMENTS })
    setHasDemo(true)
    setSubmitted(false)
    setIsProcessing(false)
    setProcessingStep(0)
    setValidationComplete(false)
    completionNoticeShown.current = false
    setSearchQuery("")
    navigateTo("submission")
    toast.success("Sample application dossier loaded", {
      description: "Greenfield Engineering College · APP-2026-002",
    })
  }

  const handleApplicationChange = (field: keyof DemoForm, value: string) => {
    setApplication((current) => ({ ...current, [field]: value }))
  }

  const handleFileChange = (key: DocumentKey, file: UploadedDocument | null) => {
    setDocuments((current) => ({ ...current, [key]: file }))
  }

  const submitApplication = () => {
    const hasRequiredFields = Object.values(application).every((value) => value.trim().length > 0)
    if (!hasRequiredFields) {
      toast.error("Complete all statutory fields", {
        description: "Institution name, application type, cycle, and state are required.",
      })
      return
    }

    setSubmitted(true)
    toast.success("Application successfully registered", {
      description: "APP-2026-026 indexed with cryptographic timestamps.",
    })
  }

  const startValidation = () => {
    completionNoticeShown.current = false
    setValidationComplete(false)
    setProcessingStep(0)
    setIsProcessing(true)
    navigateTo("verification")
    toast.info("Verification pipeline dispatched", {
      description: "Running OCR extraction, cadre analysis, and cross-document reconciliation.",
    })
  }

  useEffect(() => {
    if (!isProcessing) return

    const timer = window.setTimeout(() => {
      setProcessingStep((current) => Math.min(current + 1, PROCESSING_STEPS.length))
    }, 650)

    return () => window.clearTimeout(timer)
  }, [isProcessing, processingStep])

  useEffect(() => {
    if (
      !isProcessing ||
      processingStep < PROCESSING_STEPS.length ||
      completionNoticeShown.current
    ) {
      return
    }

    completionNoticeShown.current = true
    setIsProcessing(false)
    setValidationComplete(true)
    setActivePage("results")
    toast.success("Cross-verification complete", {
      description: "Discrepancy findings compiled for reviewer inspection.",
    })
  }, [isProcessing, processingStep])

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <DashboardPage onNavigate={navigateTo} onLoadDemo={loadDemo} />
      case "applications":
        return (
          <ApplicationsPage
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onNavigate={navigateTo}
          />
        )
      case "submission":
        return (
          <SubmissionPage
            application={application}
            documents={documents}
            hasDemo={hasDemo}
            submitted={submitted}
            onChange={handleApplicationChange}
            onFileChange={handleFileChange}
            onLoadDemo={loadDemo}
            onSubmit={submitApplication}
            onStartValidation={startValidation}
          />
        )
      case "verification":
        return (
          <VerificationPage
            hasDemo={hasDemo}
            isProcessing={isProcessing}
            processingStep={processingStep}
            validationComplete={validationComplete}
            onStartValidation={startValidation}
            onLoadDemo={loadDemo}
            onViewResults={() => navigateTo("results")}
          />
        )
      case "results":
        return <ResultsPage onNavigate={navigateTo} />
      case "reports":
        return <ReportPage onNavigate={navigateTo} />
      case "audit":
        return <AuditPage />
    }
  }

  return (
    <div className="zypher-root">
      <div className="zypher-shell">
        <AppSidebar
          activePage={activePage}
          collapsed={sidebarCollapsed}
          onNavigate={navigateTo}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
          onOpenSettings={() => setIsHelpOpen(true)}
        />
        <div className="zypher-main">
          <header className="app-topbar">
            <div className="topbar-breadcrumbs" aria-label="Breadcrumb">
              <span>AICTE</span>
              <ChevronRight aria-hidden="true" />
              <span>Oversight workspace</span>
              <ChevronRight aria-hidden="true" />
              <strong>{pageLabels[activePage]}</strong>
            </div>

            {/* Clickable Search Bar triggering Command Palette */}
            <div
              className="topbar-search-wrap cursor-pointer"
              onClick={() => setIsCommandPaletteOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Search applications or press Command K"
            >
              <Search aria-hidden="true" />
              <input
                type="text"
                readOnly
                aria-label="Search applications"
                placeholder="Search applications, institutions, actions..."
                value={searchQuery}
                className="topbar-search-input cursor-pointer"
              />
              <kbd>⌘ K</kbd>
            </div>

            <div className="topbar-actions relative">
              {/* Help & Guide Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="topbar-help-button"
                aria-label="Help and guidance"
                title="Help and guidance (Shortcuts, docs)"
                onClick={() => setIsHelpOpen(true)}
              >
                <CircleHelp aria-hidden="true" />
              </Button>

              {/* Real Notifications Dropdown Button */}
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="topbar-notification-button"
                  aria-label={`Notifications: ${unreadNotificationsCount} unread`}
                  title="Notifications"
                  onClick={() => setIsNotificationsOpen((prev) => !prev)}
                >
                  <Bell aria-hidden="true" />
                  {unreadNotificationsCount > 0 && (
                    <span className="notification-dot" aria-hidden="true" />
                  )}
                </Button>

                {isNotificationsOpen && (
                  <NotificationsPanel
                    notifications={notifications}
                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                    onMarkAsRead={handleMarkNotificationRead}
                    onNavigate={navigateTo}
                    onClose={() => setIsNotificationsOpen(false)}
                  />
                )}
              </div>

              {/* Reviewer Profile Dropdown Menu */}
              <div className="relative">
                <button
                  type="button"
                  className="topbar-profile cursor-pointer hover:bg-muted/40 p-1 rounded-lg transition-colors text-left"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-expanded={isProfileOpen}
                  aria-label="Reviewer profile and settings"
                >
                  <div className="topbar-avatar" aria-hidden="true">AV</div>
                  <div className="topbar-profile-copy">
                    <span>Ananya Verma</span>
                    <span>Regional reviewer</span>
                  </div>
                </button>

                <ProfileMenu
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onNavigate={navigateTo}
                />
              </div>
            </div>
          </header>

          <main className="zypher-content">{renderPage()}</main>

          <footer className="app-footer">
            <span>Zypher Regulatory Oversight Workspace · AICTE</span>
            <span>Academic Cycle 2026–27 · Ministry of Education, Govt. of India</span>
          </footer>
        </div>
      </div>

      {/* Global Modals & Dialogs */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigateTo}
        onOpenApplication={(id) => {
          setSelectedAppId(id)
        }}
        onExport={() => {
          exportApplicationsCSV(APPLICATIONS)
          toast.success("Applications exported successfully")
        }}
      />

      <ApplicationDetailDialog
        applicationId={selectedAppId}
        onClose={() => setSelectedAppId(null)}
        onNavigate={navigateTo}
      />

      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
