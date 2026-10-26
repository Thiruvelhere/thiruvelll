"use client"

import { useState, useRef, useEffect } from "react"
import {
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FilePlus2,
  Files,
  LayoutDashboard,
  ScrollText,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { WORKSPACES } from "./data"
import type { AppPage } from "./types"

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: Files, count: "248" },
  { id: "submission", label: "Submit application", icon: FilePlus2 },
  { id: "verification", label: "Document verification", icon: ScanSearch },
  { id: "reports", label: "Compliance reports", icon: ClipboardCheck },
  { id: "audit", label: "Audit trail", icon: ScrollText },
] as const

export function AppSidebar({
  activePage,
  collapsed,
  onNavigate,
  onToggleCollapse,
  onOpenSettings,
}: {
  activePage: AppPage
  collapsed: boolean
  onNavigate: (page: AppPage) => void
  onToggleCollapse: () => void
  onOpenSettings?: () => void
}) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(WORKSPACES[0])
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false)
  const workspaceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setIsWorkspaceMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <aside className="zypher-sidebar" data-collapsed={collapsed}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <ShieldCheck aria-hidden="true" />
        </div>
        <div className="sidebar-brand-copy">
          <span className="sidebar-brand-name">Zypher</span>
          <span className="sidebar-brand-caption">AICTE OVERSIGHT</span>
        </div>
      </div>

      <div className="relative" ref={workspaceRef}>
        <button
          type="button"
          className="sidebar-workspace w-full text-left"
          onClick={() => setIsWorkspaceMenuOpen((prev) => !prev)}
          aria-expanded={isWorkspaceMenuOpen}
          aria-label="Switch workspace"
        >
          <div className="sidebar-workspace-icon">
            <Activity aria-hidden="true" />
          </div>
          <div className="sidebar-workspace-copy">
            <span>{selectedWorkspace.name}</span>
            <span>{selectedWorkspace.period}</span>
          </div>
          <ChevronDown className="sidebar-workspace-chevron" aria-hidden="true" />
        </button>

        {isWorkspaceMenuOpen && !collapsed && (
          <div className="workspace-switcher-menu">
            <div className="workspace-switcher-header">Select Workspace</div>
            {WORKSPACES.map((ws) => (
              <button
                key={ws.id}
                type="button"
                className={`workspace-switcher-item ${selectedWorkspace.id === ws.id ? "workspace-switcher-item-active" : ""}`}
                onClick={() => {
                  setSelectedWorkspace(ws)
                  setIsWorkspaceMenuOpen(false)
                  toast.success(`Switched to ${ws.name}`, {
                    description: ws.period,
                  })
                }}
              >
                <div>
                  <span className="font-semibold block text-xs">{ws.name}</span>
                  <span className="text-[11px] text-muted-foreground">{ws.period}</span>
                </div>
                {selectedWorkspace.id === ws.id && (
                  <Check className="size-3.5 text-primary ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="sidebar-section-label">WORKSPACE</p>
      <nav className="sidebar-navigation" aria-label="Main navigation">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive =
            activePage === item.id ||
            (activePage === "results" && item.id === "verification")

          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-link${isActive ? " sidebar-link-active" : ""}`}
            >
              <Icon data-icon="inline-start" aria-hidden="true" />
              <span className="sidebar-link-label">{item.label}</span>
              {"count" in item && !collapsed ? (
                <span className="sidebar-nav-count">{item.count}</span>
              ) : null}
            </Button>
          )
        })}
      </nav>

      <div className="sidebar-spacer" />

      {/* Realistic System Status Card */}
      <div className="sidebar-status-card">
        <div className="sidebar-status-icon text-emerald-500">
          <ShieldCheck aria-hidden="true" />
        </div>
        <div className="sidebar-status-copy">
          <span className="font-semibold text-foreground">AI Engine Online</span>
          <span className="text-muted-foreground text-[11px]">v3.2.1 · 99.98% uptime</span>
        </div>
        <span className="sidebar-status-dot bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" aria-label="Engine active" />
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar" aria-hidden="true">AV</div>
        <div className="sidebar-profile-copy">
          <span>Ananya Verma</span>
          <span>Regional reviewer</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="sidebar-settings"
          aria-label="Reviewer settings"
          title="Reviewer settings"
          onClick={() => onOpenSettings ? onOpenSettings() : onNavigate("audit")}
        >
          <Settings2 aria-hidden="true" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="sidebar-collapse"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCollapse}
      >
        {collapsed ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}
      </Button>
    </aside>
  )
}
