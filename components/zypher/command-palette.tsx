"use client"

import { useEffect, useRef, useState } from "react"
import {
  Search,
  Files,
  FilePlus2,
  ScanSearch,
  ClipboardCheck,
  ScrollText,
  LayoutDashboard,
  Download,
  AlertCircle,
  Building2,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react"
import { APPLICATIONS } from "./data"
import type { AppPage, ApplicationRecord } from "./types"

type ActionItem = {
  id: string
  title: string
  category: "Navigation" | "Actions" | "Applications"
  icon: any
  action: () => void
  meta?: string
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenApplication,
  onExport,
}: {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: AppPage) => void
  onOpenApplication: (id: string) => void
  onExport: () => void
}) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const navigationItems: ActionItem[] = [
    {
      id: "nav-overview",
      title: "Overview Dashboard",
      category: "Navigation",
      icon: LayoutDashboard,
      action: () => onNavigate("overview"),
      meta: "Platform metrics & risk distribution",
    },
    {
      id: "nav-apps",
      title: "Applications Master Registry",
      category: "Navigation",
      icon: Files,
      action: () => onNavigate("applications"),
      meta: "Browse 248 submitted institutions",
    },
    {
      id: "nav-submit",
      title: "Submit New Institution Package",
      category: "Navigation",
      icon: FilePlus2,
      action: () => onNavigate("submission"),
      meta: "New approval & change in intake",
    },
    {
      id: "nav-verify",
      title: "Document Verification Engine",
      category: "Navigation",
      icon: ScanSearch,
      action: () => onNavigate("verification"),
      meta: "Automated OCR & cross-validation",
    },
    {
      id: "nav-reports",
      title: "Compliance Reports & Certificates",
      category: "Navigation",
      icon: ClipboardCheck,
      action: () => onNavigate("reports"),
      meta: "Official AICTE oversight reports",
    },
    {
      id: "nav-audit",
      title: "Immutable Regulatory Audit Trail",
      category: "Navigation",
      icon: ScrollText,
      action: () => onNavigate("audit"),
      meta: "Security timestamps & reviewer logs",
    },
  ]

  const actionItems: ActionItem[] = [
    {
      id: "act-export",
      title: "Export Applications Registry (CSV)",
      category: "Actions",
      icon: Download,
      action: onExport,
      meta: "Download full table as CSV",
    },
    {
      id: "act-greenfield",
      title: "Open Greenfield High-Risk Finding Case",
      category: "Actions",
      icon: AlertCircle,
      action: () => {
        onNavigate("results")
      },
      meta: "APP-2026-002 · Risk 76/100",
    },
  ]

  const applicationItems: ActionItem[] = APPLICATIONS.map((app) => ({
    id: `app-${app.id}`,
    title: `${app.id} · ${app.institution}`,
    category: "Applications",
    icon: Building2,
    action: () => onOpenApplication(app.id),
    meta: `${app.applicationType} · ${app.status} · Risk ${app.riskScore}/100`,
  }))

  const allItems: ActionItem[] = [...navigationItems, ...actionItems, ...applicationItems]

  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      (item.meta && item.meta.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    )
  })

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return

      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1))
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault()
        filteredItems[selectedIndex].action()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div className="zypher-modal-backdrop" onClick={onClose}>
      <div
        className="command-palette-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="command-palette-search-wrap">
          <Search className="size-5 text-muted-foreground ml-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Type a command or search applications, pages, actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
          />
          <kbd className="command-palette-esc">ESC</kbd>
        </div>

        <div ref={listRef} className="command-palette-results">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex

              return (
                <div
                  key={item.id}
                  className={`command-palette-item ${isSelected ? "command-palette-item-selected" : ""}`}
                  onClick={() => {
                    item.action()
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="command-palette-item-icon">
                    <Icon className="size-4" />
                  </div>
                  <div className="command-palette-item-content">
                    <span className="command-palette-item-title">{item.title}</span>
                    {item.meta && (
                      <span className="command-palette-item-meta">{item.meta}</span>
                    )}
                  </div>
                  <span className="command-palette-item-badge">{item.category}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground/60 shrink-0 ml-1" />
                </div>
              )
            })
          )}
        </div>

        <div className="command-palette-footer">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span><kbd className="command-key">↑</kbd> <kbd className="command-key">↓</kbd> to navigate</span>
            <span><kbd className="command-key">↵</kbd> to select</span>
            <span><kbd className="command-key">ESC</kbd> to close</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">Zypher Search Engine</span>
        </div>
      </div>
    </div>
  )
}
