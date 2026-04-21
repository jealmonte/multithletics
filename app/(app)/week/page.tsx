"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { WeekCalendar } from "@/components/week/week-calendar"
import { SessionEditor } from "@/components/week/session-editor"
import { sessions as initialSessions, weekDates } from "@/lib/mock-data"
import type { Session } from "@/lib/types"

export default function WeekPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session)
  }

  const handleUpdateSession = (updatedSession: Session) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    )
    setSelectedSession(updatedSession)
  }

  const handleSaveSession = () => {
    // In a real app, this would save to the database
    console.log("Saving session:", selectedSession)
  }

  const handleMarkComplete = () => {
    if (selectedSession) {
      const updated = { ...selectedSession, status: "Completed" as const }
      handleUpdateSession(updated)
    }
  }

  // Find the last session of the same type for comparison
  const findLastSession = (session: Session): Session | undefined => {
    const sameTypeSessions = sessions.filter(
      (s) =>
        s.name === session.name &&
        s.id !== session.id &&
        s.status === "Completed"
    )
    // Sort by date descending and get the most recent
    sameTypeSessions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return sameTypeSessions[0]
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar showWeekRange />
      <div className="flex flex-1 overflow-hidden">
        {/* Left pane: Week Calendar */}
        <div className="flex-1 overflow-auto border-r border-border">
          <WeekCalendar
            weekDates={weekDates}
            sessions={sessions}
            selectedSessionId={selectedSession?.id ?? null}
            onSelectSession={handleSelectSession}
          />
        </div>

        {/* Right pane: Session Editor */}
        <div className="w-[500px] flex-shrink-0 overflow-hidden bg-muted/30">
          {selectedSession ? (
            <SessionEditor
              session={selectedSession}
              lastSession={findLastSession(selectedSession)}
              onUpdate={handleUpdateSession}
              onSave={handleSaveSession}
              onMarkComplete={handleMarkComplete}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <p className="text-center text-muted-foreground">
                Select a session from the calendar to view and edit details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
