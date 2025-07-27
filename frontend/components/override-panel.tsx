"use client"

import { useState } from "react"

export default function OverridePanel() {
  const [hintStrictness, setHintStrictness] = useState(50)
  const [modelInput, setModelInput] = useState("default")
  const [customFeature, setCustomFeature] = useState("")

  const handleApplyOverride = () => {
    console.log("Applying override:", { hintStrictness, modelInput, customFeature })
    alert(`Override Applied!
  Hint Strictness: ${hintStrictness}%
  Model Input: ${modelInput}
  Custom Feature: ${customFeature || "N/A"}
  Action logged to audit trail.`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Override Panel: Tweak LLM Tutor Assumptions</h2>
      <p className="text-muted">
        Adjust parameters for LLM tutor behavior and model inputs. All changes are logged for audit.
      </p>

      <div className="grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Hint Strictness</div>
            <div className="card-description">Control how direct or subtle the tutor&apos;s hints are.</div>
          </div>
          <div className="card-content">
            <div className="flex-container items-center">
              <div className="slider-container" style={{ width: "calc(100% - 60px)" }}>
                <div
                  className="slider-thumb"
                  style={{ left: `${hintStrictness}%` }}
                  onMouseDown={(e) => {
                    const startX = e.clientX
                    const startHintStrictness = hintStrictness
                    const sliderWidth = e.currentTarget.parentElement?.offsetWidth || 1

                    const onMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = moveEvent.clientX - startX
                      const newHintStrictness = Math.max(
                        0,
                        Math.min(100, startHintStrictness + (deltaX / sliderWidth) * 100),
                      )
                      setHintStrictness(Math.round(newHintStrictness))
                    }

                    const onMouseUp = () => {
                      document.removeEventListener("mousemove", onMouseMove)
                      document.removeEventListener("mouseup", onMouseUp)
                    }

                    document.addEventListener("mousemove", onMouseMove)
                    document.addEventListener("mouseup", onMouseUp)
                  }}
                ></div>
              </div>
              <span className="w-12 text-right font-medium">{hintStrictness}%</span>
            </div>
            <p className="text-sm text-muted mt-2">
              Current: {hintStrictness}% (Lower = more subtle, Higher = more direct)
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Model Input Adjustment</div>
            <div className="card-description">Select a predefined feature set or input for the LLM.</div>
          </div>
          <div className="card-content">
            <select value={modelInput} onChange={(e) => setModelInput(e.target.value)} className="select-field">
              <option value="default">Default (Standard Curriculum)</option>
              <option value="simplified">Simplified Language (ELL Support)</option>
              <option value="advanced">Advanced Concepts (Gifted Students)</option>
              <option value="custom">Custom Feature Set</option>
            </select>
            <p className="text-sm text-muted mt-2">
              Selected: <span className="capitalize">{modelInput.replace("-", " ")}</span>
            </p>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Custom Feature Input</div>
            <div className="card-description">
              Provide specific keywords or concepts to influence the LLM&apos;s focus.
            </div>
          </div>
          <div className="card-content">
            <label htmlFor="custom-feature" className="label sr-only">
              Custom Feature
            </label>
            <input
              type="text"
              id="custom-feature"
              placeholder="e.g., 'focus on problem-solving steps', 'emphasize conceptual understanding'"
              value={customFeature}
              onChange={(e) => setCustomFeature(e.target.value)}
              className="input-field"
            />
            <p className="text-sm text-muted mt-2">
              This input will be used if &quot;Custom Feature Set&quot; is selected above.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-container justify-end">
        <button onClick={handleApplyOverride} className="button primary">
          Apply Override
        </button>
      </div>

      <p className="text-sm text-muted mt-4 p-4 border rounded-md bg-muted">
        Note: All override actions are automatically logged to the Audit Log Viewer for compliance and traceability.
      </p>
    </div>
  )
}
