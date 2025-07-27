"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LtiLaunchPage() {
  const [ltiParams, setLtiParams] = useState({
    lis_person_sourcedid: "student_123",
    lis_person_name_full: "John Doe",
    context_title: "Algebra I - Fall 2025",
    roles: "Student",
    oauth_consumer_key: "mock_consumer_key",
    oauth_signature: "mock_signature",
    oauth_timestamp: Date.now().toString(),
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_version: "1.0",
    oauth_signature_method: "HMAC-SHA1",
    lti_message_type: "basic-lti-launch-request",
    lti_version: "LTI-1p0",
    resource_link_id: "mock_resource_link_id",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLtiParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Simulating LTI Launch with params:", ltiParams)
    // In a real scenario, this would typically involve a POST request to the LTI consumer's endpoint
    // with these parameters, often signed. For this demo, we just log.
    alert("LTI Launch Simulated! Check console for parameters.")
  }

  return (
    <div className="flex-col flex-1 overflow-auto p-20 flex-container items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Simulated LTI Launch Page</CardTitle>
          <CardDescription>
            This page simulates an LTI launch from a Learning Management System (LMS) like Canvas. Adjust parameters and
            click Launch to see how the dashboard would receive data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(ltiParams).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Label>
                <Input
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  readOnly={key.startsWith("oauth_") || key.startsWith("lti_")}
                  className={key.startsWith("oauth_") || key.startsWith("lti_") ? "bg-gray-100" : ""}
                />
              </div>
            ))}
            <div className="md:col-span-2 flex justify-end mt-4">
              <Button type="submit">Simulate LTI Launch</Button>
            </div>
          </form>
          <p className="text-sm text-muted mt-4">
            Note: In a real LTI integration, these parameters would be sent via a POST request from the LMS.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
