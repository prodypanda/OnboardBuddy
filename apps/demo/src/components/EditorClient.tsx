"use client";

import { DemoShell } from "@/components/DemoShell";
import { RestartTourButton } from "@/components/RestartTourButton";
import { sellerTour } from "@/lib/tours";
import type { BuddyAnimation, BuddyOverlay, BuddyTour } from "@onboardbuddy/react";
import { useMemo, useState } from "react";

const animationOptions: BuddyAnimation[] = ["none", "wiggle", "bounce", "pulse"];
const overlayOptions: BuddyOverlay[] = ["none", "dim", "spotlight", "blur"];

export function EditorClient() {
  const [tour, setTour] = useState<BuddyTour>(sellerTour);
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(sellerTour, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState(sellerTour.steps[0]?.id ?? "");

  const selectedStep = useMemo(
    () => tour.steps.find((step) => step.id === selectedStepId) ?? tour.steps[0],
    [selectedStepId, tour.steps]
  );

  const updateTour = (nextTour: BuddyTour) => {
    setTour(nextTour);
    setJsonDraft(JSON.stringify(nextTour, null, 2));
    setJsonError(null);
  };

  const updateSelectedStep = (changes: Partial<NonNullable<typeof selectedStep>>) => {
    if (!selectedStep) {
      return;
    }

    updateTour({
      ...tour,
      steps: tour.steps.map((step) =>
        step.id === selectedStep.id ? { ...step, ...changes } : step
      )
    });
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft) as BuddyTour;

      if (!parsed.id || !Array.isArray(parsed.steps)) {
        setJsonError("JSON must include an id and steps array.");
        return;
      }

      setTour(parsed);
      setSelectedStepId(parsed.steps[0]?.id ?? "");
      setJsonError(null);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON.");
    }
  };

  return (
    <DemoShell tours={[tour]}>
      <main className="editor-layout">
        <section className="editor-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Tour editor prototype</p>
              <h1>JSON + form preview</h1>
            </div>
            <RestartTourButton tourId={tour.id} />
          </div>

          <div className="editor-grid">
            <section className="panel">
              <h2>JSON editor</h2>
              <textarea
                aria-label="Tour JSON"
                value={jsonDraft}
                onChange={(event) => setJsonDraft(event.target.value)}
              />
              {jsonError ? <p className="error">{jsonError}</p> : null}
              <button className="primary-button" type="button" onClick={applyJson}>
                Apply JSON
              </button>
            </section>

            <section className="panel form-panel">
              <h2>Step form</h2>
              {selectedStep ? (
                <>
                  <label>
                    Step
                    <select
                      value={selectedStep.id}
                      onChange={(event) => setSelectedStepId(event.target.value)}
                    >
                      {tour.steps.map((step) => (
                        <option key={step.id} value={step.id}>
                          {step.id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Title
                    <input
                      value={selectedStep.title}
                      onChange={(event) => updateSelectedStep({ title: event.target.value })}
                    />
                  </label>
                  <label>
                    Body
                    <textarea
                      value={selectedStep.body}
                      onChange={(event) => updateSelectedStep({ body: event.target.value })}
                    />
                  </label>
                  <label>
                    Target selector
                    <input
                      value={selectedStep.target}
                      onChange={(event) => updateSelectedStep({ target: event.target.value })}
                    />
                  </label>
                  <div className="two-column">
                    <label>
                      Overlay
                      <select
                        value={selectedStep.overlay ?? "spotlight"}
                        onChange={(event) =>
                          updateSelectedStep({ overlay: event.target.value as BuddyOverlay })
                        }
                      >
                        {overlayOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Animation
                      <select
                        value={selectedStep.animation ?? "wiggle"}
                        onChange={(event) =>
                          updateSelectedStep({ animation: event.target.value as BuddyAnimation })
                        }
                      >
                        {animationOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="two-column">
                    <label>
                      Pointer X
                      <input
                        value={String(selectedStep.pointerAnchor?.x ?? "82%")}
                        onChange={(event) =>
                          updateSelectedStep({
                            pointerAnchor: {
                              x: event.target.value as `${number}%`,
                              y: selectedStep.pointerAnchor?.y ?? "40%"
                            }
                          })
                        }
                      />
                    </label>
                    <label>
                      Pointer Y
                      <input
                        value={String(selectedStep.pointerAnchor?.y ?? "40%")}
                        onChange={(event) =>
                          updateSelectedStep({
                            pointerAnchor: {
                              x: selectedStep.pointerAnchor?.x ?? "82%",
                              y: event.target.value as `${number}%`
                            }
                          })
                        }
                      />
                    </label>
                  </div>
                </>
              ) : null}
            </section>
          </div>
        </section>

        <section className="preview-dashboard">
          <div className="preview-targets">
            <div data-tour-id="overview" className="preview-card">
              Overview metrics
            </div>
            <div data-tour-id="products-table" className="preview-card wide">
              Products table
            </div>
            <button data-tour-id="add-product" className="primary-button" type="button">
              Add product
            </button>
            <div data-tour-id="orders" className="preview-card">
              Orders queue
            </div>
            <div data-tour-id="settings" className="preview-card">
              Store settings
            </div>
          </div>
        </section>
      </main>
    </DemoShell>
  );
}
