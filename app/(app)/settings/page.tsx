"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  // Weekly volume preferences
  const [chestSets, setChestSets] = useState("16")
  const [backSets, setBackSets] = useState("18")
  const [shoulderSets, setShoulderSets] = useState("12")
  const [legSets, setLegSets] = useState("14")

  // Hard finger day thresholds
  const [maxHardFingerDays, setMaxHardFingerDays] = useState("2")
  const [minRestDays, setMinRestDays] = useState("2")

  // Notion integration
  const [notionToken, setNotionToken] = useState("")
  const [notionDatabaseId, setNotionDatabaseId] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectNotion = () => {
    setIsConnecting(true)
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false)
      console.log("Notion connected:", { notionToken, notionDatabaseId })
    }, 1500)
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar title="Settings" showWeekRange={false} />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Weekly Volume Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Volume Preferences</CardTitle>
              <CardDescription>
                Set your target weekly set counts per muscle group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Chest (sets/week)</FieldLabel>
                  <Input
                    type="number"
                    value={chestSets}
                    onChange={(e) => setChestSets(e.target.value)}
                    placeholder="16"
                  />
                </Field>
                <Field>
                  <FieldLabel>Back (sets/week)</FieldLabel>
                  <Input
                    type="number"
                    value={backSets}
                    onChange={(e) => setBackSets(e.target.value)}
                    placeholder="18"
                  />
                </Field>
                <Field>
                  <FieldLabel>Shoulders (sets/week)</FieldLabel>
                  <Input
                    type="number"
                    value={shoulderSets}
                    onChange={(e) => setShoulderSets(e.target.value)}
                    placeholder="12"
                  />
                </Field>
                <Field>
                  <FieldLabel>Legs (sets/week)</FieldLabel>
                  <Input
                    type="number"
                    value={legSets}
                    onChange={(e) => setLegSets(e.target.value)}
                    placeholder="14"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Hard Finger Day Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle>Hard Finger Day Thresholds</CardTitle>
              <CardDescription>
                Configure limits for high-intensity climbing sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Max hard finger days per week</FieldLabel>
                  <Input
                    type="number"
                    value={maxHardFingerDays}
                    onChange={(e) => setMaxHardFingerDays(e.target.value)}
                    placeholder="2"
                  />
                </Field>
                <Field>
                  <FieldLabel>Min rest days between</FieldLabel>
                  <Input
                    type="number"
                    value={minRestDays}
                    onChange={(e) => setMinRestDays(e.target.value)}
                    placeholder="2"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Notion Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Notion Integration</CardTitle>
              <CardDescription>
                Connect your Notion workspace to sync training data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel>Notion API Token</FieldLabel>
                  <Input
                    type="password"
                    value={notionToken}
                    onChange={(e) => setNotionToken(e.target.value)}
                    placeholder="secret_..."
                  />
                </Field>
                <Field>
                  <FieldLabel>Training Sessions Database ID</FieldLabel>
                  <Input
                    value={notionDatabaseId}
                    onChange={(e) => setNotionDatabaseId(e.target.value)}
                    placeholder="Database ID from Notion"
                  />
                </Field>
              </FieldGroup>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Connection Status</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
                <Button
                  onClick={handleConnectNotion}
                  disabled={!notionToken || !notionDatabaseId || isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Notion"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg">Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
