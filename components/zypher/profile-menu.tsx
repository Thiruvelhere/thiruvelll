"use client"

import { useEffect, useRef } from "react"
import {
  User,
  Shield,
  Settings,
  Moon,
  Sun,
  LogOut,
  Check,
  Building,
  KeyRound,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import type { AppPage } from "./types"

export function ProfileMenu({
  isOpen,
  onClose,
  onNavigate,
}: {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: AppPage) => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleAction = (label: string, msg: string) => {
    toast.success(label, { description: msg })
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="profile-dropdown-menu"
      role="menu"
      aria-label="User profile menu"
    >
      <div className="profile-menu-header">
        <div className="flex items-center gap-3">
          <div className="topbar-avatar size-10 text-sm">AV</div>
          <div className="leading-tight">
            <h4 className="font-semibold text-foreground text-sm">Ananya Verma</h4>
            <p className="text-xs text-muted-foreground">ananya.verma@aicte.gov.in</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Regional Reviewer · Tier 1
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-menu-section">
        <div className="profile-menu-section-label">Oversight Role</div>
        <div className="p-2 rounded bg-muted/40 border border-border/50 text-xs space-y-1">
          <div className="flex justify-between text-muted-foreground">
            <span>Jurisdiction:</span>
            <span className="font-medium text-foreground">Southwestern Region</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Approval Delegation:</span>
            <span className="font-medium text-foreground">Category B & C</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Certificate Signature:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">DSC Valid 2027</span>
          </div>
        </div>
      </div>

      <div className="profile-menu-items">
        <button
          type="button"
          className="profile-menu-item"
          onClick={() => {
            onNavigate("audit")
            onClose()
          }}
        >
          <Shield className="size-4 text-muted-foreground" />
          <span>My Activity & Security Logs</span>
        </button>

        <button
          type="button"
          className="profile-menu-item"
          onClick={() => handleAction("Reviewer Settings", "Preferences and notification channels updated.")}
        >
          <Settings className="size-4 text-muted-foreground" />
          <span>Inspection Preferences</span>
        </button>

        <button
          type="button"
          className="profile-menu-item"
          onClick={() => handleAction("Digital Signature Key", "e-Sign DSC cryptographic token validated.")}
        >
          <KeyRound className="size-4 text-muted-foreground" />
          <span>Digital Signature Token</span>
        </button>
      </div>

      <div className="profile-menu-footer">
        <button
          type="button"
          className="profile-menu-item profile-menu-item-danger"
          onClick={() => {
            toast.info("Logged Out", { description: "Session securely terminated for Ananya Verma." })
            onClose()
          }}
        >
          <LogOut className="size-4" />
          <span>Sign out session</span>
        </button>
      </div>
    </div>
  )
}
