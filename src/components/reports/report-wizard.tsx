"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, LocateFixed, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AIAnalysisCard } from "@/components/reports/ai-analysis-card";
import { CategorySelector } from "@/components/reports/category-selector";
import { ContactSuggestions } from "@/components/reports/contact-suggestions";
import { GeneratedMessagesTabs } from "@/components/reports/generated-messages-tabs";
import { ImageUploader } from "@/components/reports/image-uploader";
import { PDFDownloadButton } from "@/components/reports/pdf-download-button";
import {
  RecipientReview,
  type RecipientConfirmationState
} from "@/components/reports/recipient-review";
import { recipientConfirmationComplete } from "@/lib/recipient-confirmation";
import { CopyButton } from "@/components/ui/copy-button";
import { issueCategories, reportStatuses } from "@/lib/constants";
import type { AIReportResult } from "@/lib/ai/types";
import type { SuggestedContactDTO } from "@/lib/contacts/directory";
import type { ContactRoutingResult } from "@/lib/contact-routing/types";
import { reportInputSchema, type ReportInputValues } from "@/lib/validators/report";
import { cn, formatDate, statusLabel } from "@/lib/utils";

const steps = [
  "Upload photo",
  "Describe issue",
  "AI analysis",
  "Recipient review",
  "Generated report",
  "Review and save"
];

const defaultInput: ReportInputValues = {
  title: "",
  description: "",
  category: issueCategories[0],
  address: "",
  city: "",
  county: "",
  state: "",
  zip: "",
  latitude: null,
  longitude: null,
  dateObserved: new Date().toISOString().slice(0, 10),
  urgent: false,
  optionalNotes: "",
  imagePath: ""
};

export function ReportWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ReportInputValues>(defaultInput);
  const [ai, setAi] = useState<AIReportResult | null>(null);
  const [contacts, setContacts] = useState<SuggestedContactDTO[]>([]);
  const [routingDecision, setRoutingDecision] = useState<ContactRoutingResult | null>(null);
  const [recipientConfirmation, setRecipientConfirmation] = useState<RecipientConfirmationState>({
    selectedContactIndex: 0,
    manualMode: false,
    manualContact: null,
    verified: false,
    emergencyAcknowledged: false
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialStatus, setInitialStatus] = useState("DRAFT");

  const location = `${form.address}, ${form.city}, ${form.state} ${form.zip}`.replace(/,\s*,/g, ",");
  const recipientReviewComplete = recipientConfirmationComplete(recipientConfirmation, routingDecision);
  const selectedRecipient = recipientConfirmation.manualMode
    ? recipientConfirmation.manualContact
    : typeof recipientConfirmation.selectedContactIndex === "number"
      ? contacts[recipientConfirmation.selectedContactIndex]
      : contacts[0];
  const pdfData = useMemo(() => {
    if (!ai) return null;
    return {
      title: form.title || "ReportRight report",
      category: form.category,
      location,
      dateObserved: form.dateObserved ? formatDate(form.dateObserved) : "",
      description: form.description,
      optionalNotes: form.optionalNotes,
      analysis: ai.analysis,
      contacts,
      messages: ai.messages
    };
  }, [ai, contacts, form, location]);

  function canOpenStep(index: number) {
    if (index <= step) return true;
    if (!ai) return false;
    if (index >= 4 && !recipientReviewComplete) return false;
    return true;
  }

  function setField<K extends keyof ReportInputValues>(key: K, value: ReportInputValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (ai) {
      setAi(null);
      setContacts([]);
      setRoutingDecision(null);
      setRecipientConfirmation({
        selectedContactIndex: 0,
        manualMode: false,
        manualContact: null,
        verified: false,
        emergencyAcknowledged: false
      });
    }
  }

  function firstValidationMessage() {
    const parsed = reportInputSchema.safeParse(form);
    if (parsed.success) return null;
    const flattened = parsed.error.flatten().fieldErrors;
    const first = Object.values(flattened).flat()[0];
    return first || "Check the report details.";
  }

  async function runAnalysis() {
    const validationMessage = firstValidationMessage();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setStep(2);
    setAnalyzing(true);

    try {
      const response = await fetch("/api/reports/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI analysis failed.");
      }

      setAi(data.ai);
      setContacts(data.contacts);
      setRoutingDecision(data.routingDecision);
      setRecipientConfirmation({
        selectedContactIndex: 0,
        manualMode: false,
        manualContact: null,
        verified: false,
        emergencyAcknowledged: false
      });
      toast.success("AI report generated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function saveReport() {
    if (!ai || contacts.length === 0 || !routingDecision) {
      toast.error("Generate the AI report before saving.");
      return;
    }
    if (!recipientReviewComplete) {
      toast.error("Verify the recipient before saving.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: form,
          ai,
          contacts,
          routingDecision,
          recipientConfirmation: {
            selectedContactIndex: recipientConfirmation.selectedContactIndex,
            manualContact: recipientConfirmation.manualMode ? recipientConfirmation.manualContact : null,
            verified: recipientConfirmation.verified,
            emergencyAcknowledged: recipientConfirmation.emergencyAcknowledged
          }
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save report.");
      }

      if (initialStatus !== "DRAFT") {
        await fetch(`/api/reports/${data.report.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: initialStatus,
            note: "Status set during report creation."
          })
        });
      }

      toast.success("Report saved.");
      router.push(`/reports/${data.report.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save report.");
    } finally {
      setSaving(false);
    }
  }

  const canGoForward = step === 0 ? Boolean(form.imagePath) : true;

  async function useCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setForm((current) => ({ ...current, latitude, longitude }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.address ?? {};
          setForm((current) => ({
            ...current,
            latitude,
            longitude,
            address:
              [address.house_number, address.road].filter(Boolean).join(" ") ||
              data.display_name ||
              current.address,
            city: address.city || address.town || address.village || current.city,
            county: address.county || current.county,
            state: address.state_code || address.state || current.state,
            zip: address.postcode || current.zip
          }));
          toast.success("Location added. Please verify the address.");
        } catch {
          toast.error("GPS captured, but reverse geocoding failed. Enter the address manually.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        toast.error("Could not access your location.");
      }
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Create report</p>
          <div className="mt-4 space-y-2">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (canOpenStep(index)) setStep(index);
                }}
                className={cn(
                  "focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                  step === index
                    ? "bg-civic-ink text-white"
                    : canOpenStep(index)
                      ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      : "cursor-not-allowed bg-white text-slate-400"
                )}
                >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs">
                  {index < step ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {step === 0 ? (
          <section>
            <h1 className="text-3xl font-bold tracking-normal text-civic-ink">Upload a photo</h1>
            <p className="mt-2 text-slate-600">
              Start with one clear photo. The app stores it locally in development.
            </p>
            <div className="mt-6">
              <ImageUploader imagePath={form.imagePath} onUploaded={(path) => setField("imagePath", path)} />
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <section>
            <h1 className="text-3xl font-bold tracking-normal text-civic-ink">Describe the issue</h1>
            <p className="mt-2 text-slate-600">
              Add enough detail for a city office, property manager, HOA, or utility to route it.
            </p>

            <div className="mt-6 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="grid gap-2">
                <label className="form-label" htmlFor="title">
                  Issue title
                </label>
                <input
                  id="title"
                  className="form-input"
                  value={form.title}
                  onChange={(event) => setField("title", event.target.value)}
                  placeholder="Deep pothole near Pine and 8th"
                />
              </div>

              <div className="grid gap-2">
                <label className="form-label" htmlFor="description">
                  Short description
                </label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={form.description}
                  onChange={(event) => setField("description", event.target.value)}
                  placeholder="Cars are swerving around a deep pothole in the eastbound lane."
                />
              </div>

              <div className="grid gap-2">
                <span className="form-label">Issue category</span>
                <CategorySelector
                  value={form.category}
                  onChange={(value) => setField("category", value as ReportInputValues["category"])}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locating}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-70"
                  >
                    {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                    Use GPS location
                  </button>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    GPS is optional. If used, verify the reverse-geocoded address before generating.
                  </p>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="form-label" htmlFor="address">
                    Address or location
                  </label>
                  <input
                    id="address"
                    className="form-input"
                    value={form.address}
                    onChange={(event) => setField("address", event.target.value)}
                    placeholder="801 Pine Street or near Pine and 8th"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="form-label" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    className="form-input"
                    value={form.city}
                    onChange={(event) => setField("city", event.target.value)}
                    placeholder="Riverton"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="form-label" htmlFor="state">
                    State
                  </label>
                  <input
                    id="state"
                    className="form-input"
                    value={form.state}
                    onChange={(event) => setField("state", event.target.value.toUpperCase())}
                    placeholder="OH"
                    maxLength={2}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="form-label" htmlFor="county">
                    County
                  </label>
                  <input
                    id="county"
                    className="form-input"
                    value={form.county ?? ""}
                    onChange={(event) => setField("county", event.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="form-label" htmlFor="zip">
                    ZIP code
                  </label>
                  <input
                    id="zip"
                    className="form-input"
                    value={form.zip}
                    onChange={(event) => setField("zip", event.target.value)}
                    placeholder="43001"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="form-label" htmlFor="dateObserved">
                    Date observed
                  </label>
                  <input
                    id="dateObserved"
                    type="date"
                    className="form-input"
                    value={form.dateObserved}
                    onChange={(event) => setField("dateObserved", event.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <span className="form-label">Is this urgent?</span>
                <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
                  {[false, true].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => setField("urgent", value)}
                      className={cn(
                        "focus-ring rounded-lg px-3 py-2 text-sm font-semibold transition",
                        form.urgent === value
                          ? "bg-civic-ink text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      )}
                    >
                      {value ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="form-label" htmlFor="notes">
                  Optional notes
                </label>
                <textarea
                  id="notes"
                  className="form-textarea"
                  value={form.optionalNotes ?? ""}
                  onChange={(event) => setField("optionalNotes", event.target.value)}
                  placeholder="Previous reports, access notes, affected people, or timing details."
                />
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="text-3xl font-bold tracking-normal text-civic-ink">AI analysis</h1>
            <p className="mt-2 text-slate-600">
              The mock provider works without an API key. OpenAI is optional and falls back safely.
            </p>
            <div className="mt-6">
              {analyzing ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-civic-blue" />
                  <h2 className="mt-4 text-lg font-bold text-civic-ink">Generating report</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Analyzing category, urgency, keywords, location, and the photo reference.
                  </p>
                </div>
              ) : ai ? (
                <div className="space-y-5">
                  <AIAnalysisCard analysis={ai.analysis} />
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">
                      Confirm category
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-civic-ink">
                      Confirm or edit the issue category before routing
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      The recipient suggestions use your confirmed category and location. If this
                      category is wrong, choose the best match and generate again.
                    </p>
                    <div className="mt-4">
                      <CategorySelector
                        value={form.category}
                        onChange={(value) => setField("category", value as ReportInputValues["category"])}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                  <p className="text-sm text-slate-600">Generate analysis from the issue details.</p>
                  <button
                    type="button"
                    onClick={runAnalysis}
                    className="focus-ring mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Generate AI analysis
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : null}

        {step === 3 && routingDecision ? (
          <div className="space-y-5">
            <ContactSuggestions contacts={contacts} routingDecision={routingDecision} />
            <RecipientReview
              contacts={contacts}
              routingDecision={routingDecision}
              value={recipientConfirmation}
              onChange={setRecipientConfirmation}
            />
          </div>
        ) : null}

        {step === 4 && ai && recipientReviewComplete ? (
          <GeneratedMessagesTabs
            messages={ai.messages}
            subjectLine={ai.messages.subjectLine}
            mailtoEmail={selectedRecipient?.email}
          />
        ) : null}

        {step === 5 && ai ? (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Review and save</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal text-civic-ink">{form.title}</h1>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Location</p>
                <p className="mt-1 font-semibold text-civic-ink">{location}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Date observed</p>
                <p className="mt-1 font-semibold text-civic-ink">{formatDate(form.dateObserved)}</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <div className="flex gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                <p>
                  This is not legal advice. AI-generated content and contact suggestions can be
                  inaccurate. Review all text and verify contacts before sending. For emergencies,
                  call emergency services.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:max-w-xs">
              <label className="form-label" htmlFor="initialStatus">
                Initial status
              </label>
              <select
                id="initialStatus"
                className="form-input"
                value={initialStatus}
                onChange={(event) => setInitialStatus(event.target.value)}
              >
                {reportStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveReport}
                disabled={saving}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save report
              </button>
              <CopyButton value={ai.messages.formalEmail} label="Copy email" />
              <CopyButton value={ai.messages.smsMessage} label="Copy SMS" />
              {pdfData ? <PDFDownloadButton data={pdfData} /> : null}
            </div>
          </section>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0 || analyzing || saving}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step === 1 ? (
            <button
              type="button"
              onClick={runAnalysis}
              disabled={analyzing}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Generate AI report
            </button>
          ) : step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 0 && !canGoForward) {
                  toast.error("Upload a photo before continuing.");
                  return;
                }
                if ((step === 2 || step === 3 || step === 4) && !ai) {
                  toast.error("Generate the AI report first.");
                  return;
                }
                if (
                  step === 3 &&
                  routingDecision &&
                  !recipientReviewComplete
                ) {
                  toast.error("Verify the recipient before continuing.");
                  return;
                }
                setStep((current) => Math.min(5, current + 1));
              }}
              disabled={analyzing || (step === 3 && !recipientReviewComplete)}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
