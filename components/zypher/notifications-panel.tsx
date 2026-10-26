"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { NotificationItem, AppPage } from "./types"

export function NotificationsPanel({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onNavigate,
  onClose,
}: {
  notifications: NotificationItem[]
  onMarkAllAsRead: () => void
  onMarkAsRead: (id: string) => void
  onNavigate: (page: AppPage) => void
  onClose: () => void
}) {
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.read : true
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="size-4 text-amber-500" />
      case "success":
        return <CheckCircle2 className="size-4 text-emerald-500" />
      case "action":
        return <Clock className="size-4 text-sky-500" />
      default:
        return <Info className="size-4 text-blue-400" />
    }
  }

  return (
    <div
      ref={panelRef}
      className="notifications-dropdown-menu"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="notifications-header">
        <div className="notifications-header-title">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <span className="font-semibold text-foreground text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="outline" className="notifications-badge-pill">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="notifications-header-subtitle">Real-time oversight updates</p>
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
              title="Mark all as read"
            >
              <CheckCheck className="size-3.5 mr-1" />
              Mark all read
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label="Close notifications"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="notifications-filter-bar">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`notifications-tab ${filter === "all" ? "notifications-tab-active" : ""}`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`notifications-tab ${filter === "unread" ? "notifications-tab-active" : ""}`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <Check className="size-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-foreground">All caught up</p>
            <p className="text-xs text-muted-foreground">No new notifications right now</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onMarkAsRead(item.id)
                if (item.title.toLowerCase().includes("application") || item.title.toLowerCase().includes("finding")) {
                  onNavigate("applications")
                  onClose()
                } else if (item.title.toLowerCase().includes("report")) {
                  onNavigate("reports")
                  onClose()
                }
              }}
              className={`notification-item ${!item.read ? "notification-item-unread" : ""}`}
              role="button"
              tabIndex={0}
            >
              <div className="notification-icon-wrap">{getIcon(item.type)}</div>
              <div className="notification-content">
                <div className="notification-item-title-row">
                  <span className="notification-item-title">{item.title}</span>
                  {!item.read && <span className="notification-unread-dot" />}
                </div>
                <p className="notification-item-desc">{item.description}</p>
                <div className="notification-item-meta">
                  <span>{item.time}</span>
                  <span className="notification-view-action">
                    Click to view <ExternalLink className="size-3 inline ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notifications-footer">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-xs text-primary justify-center hover:bg-primary/5"
          onClick={() => {
            onNavigate("audit")
            onClose()
          }}
        >
          View complete audit trail
        </Button>
      </div>
    </div>
  )
}
