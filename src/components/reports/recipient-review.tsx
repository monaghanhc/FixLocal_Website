"use client";

import { AlertTriangle, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import type { SuggestedContactDTO } from "@/lib/contacts/directory";
import type { ContactRoutingResult } from "@/lib/contact-routing/types";
import { legalDisclaimers } from "@/lib/legal/disclaimers";
import { recipientConfirmationComplete } from "@/lib/recipient-confirmation";
import { cn } from "@/lib/utils";

export type RecipientConfirmationState = {
  selectedContactIndex: number | null;
  manualMode: boolean;
  manualContact: SuggestedContactDTO | null;
  verified: boolean;
  emergencyAcknowledged: boolean;
};

type RecipientReviewProps = {
  contacts: SuggestedContactDTO[];
  routingDecision: ContactRoutingResult;
  value: RecipientConfirmationState;
  onChange: (value: RecipientConfirmationState) => void;
};

function emptyManualContact(): SuggestedContactDTO {
  return {
    name: "",
    organization: "Manually entered",
    department: "Manual recipient",
    type: "Other",
    email: null,
    phone: null,
    website: "https://www.google.com/search?q=official+contact",
    lookupUrl: "https://www.google.com/search?q=official+contact",
    source: "User verified manual entry",
    sourceLastVerifiedAt: new Date().toISOString().slice(0, 10),
    confidence: "LOW",
    reasonForRecommendation: "The user manually entered and verified this recipient.",
    reason: "Manual recipient override.",
    verificationNote: "User is responsible for verifying this manually entered recipient."
  };
}

export function RecipientReview({ contacts, routingDecision, value, onChange }: RecipientReviewProps) {
  const manualContact = value.manualContact ?? emptyManualContact();

  function update(next: Partial<RecipientConfirmationState>) {
    onChange({ ...value, ...next });
  }

  function updateManual(field: keyof SuggestedContactDTO, fieldValue: string) {
    update({
      manualMode: true,
      manualContact: {
        ...manualContact,
        [field]: fieldValue || null
      }
    });
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Recipient review</p>
      <h2 className="mt-1 text-2xl font-bold text-civic-ink">Confirm who should receive this report</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        ReportRight AI suggests recipients based on your issue type and location. Please verify the
        contact before sending.
      </p>

      {routingDecision.manualReviewRequired ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          We could not confidently verify the correct recipient. Please review the suggested
          contacts or manually enter the recipient before continuing.
        </div>
      ) : null}

      {routingDecision.emergencyWarningRequired ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
          <div className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <p>
              If this is an emergency or there is immediate danger, call emergency services. Do not
              rely on this app for emergencies.
            </p>
          </div>
          <label className="mt-3 flex items-start gap-2 font-semibold">
            <input
              type="checkbox"
              checked={value.emergencyAcknowledged}
              onChange={(event) => update({ emergencyAcknowledged: event.target.checked })}
              className="mt-1 h-4 w-4"
            />
            I understand emergency issues should be handled by emergency services first.
          </label>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-civic-ink">
          Routing confidence: {routingDecision.confidenceLabel} ({Math.round(routingDecision.confidenceScore * 100)}%)
        </p>
        <p className="mt-1">{routingDecision.explanation}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {legalDisclaimers.map((disclaimer) => (
            <li key={disclaimer}>{disclaimer}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {contacts.map((contact, index) => (
          <button
            key={`${contact.name}-${contact.department}-${index}`}
            type="button"
            onClick={() =>
              update({
                selectedContactIndex: index,
                manualMode: false,
                verified: false
              })
            }
            className={cn(
              "focus-ring rounded-lg border p-4 text-left transition",
              value.selectedContactIndex === index && !value.manualMode
                ? "border-civic-blue bg-blue-50"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-civic-ink">{contact.name}</h3>
                <p className="mt-1 text-sm font-semibold text-civic-blue">{contact.department}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {contact.organization}
                </p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                {contact.confidence}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{contact.reasonForRecommendation}</p>
            <dl className="mt-3 grid gap-2 text-xs text-slate-600">
              <div>
                <dt className="font-bold text-slate-700">Contact source</dt>
                <dd>{contact.source}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Last verified</dt>
                <dd>{contact.sourceLastVerifiedAt || "Not verified"}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Email / phone</dt>
                <dd>
                  {contact.email || "Verify email"} / {contact.phone || "Verify phone"}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Website</dt>
                <dd className="break-all">{contact.website}</dd>
              </div>
            </dl>
            <a
              href={contact.lookupUrl || contact.website}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-civic-blue hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4" />
              Open source
            </a>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ manualMode: false, verified: false })}
            className="focus-ring rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Change recipient
          </button>
          <button
            type="button"
            onClick={() =>
              update({
                manualMode: true,
                selectedContactIndex: null,
                manualContact,
                verified: false
              })
            }
            className="focus-ring rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Manually enter contact
          </button>
        </div>

        {value.manualMode ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="form-input"
              placeholder="Recipient name"
              value={manualContact.name}
              onChange={(event) => updateManual("name", event.target.value)}
            />
            <input
              className="form-input"
              placeholder="Organization"
              value={manualContact.organization}
              onChange={(event) => updateManual("organization", event.target.value)}
            />
            <input
              className="form-input"
              placeholder="Department"
              value={manualContact.department}
              onChange={(event) => updateManual("department", event.target.value)}
            />
            <input
              className="form-input"
              placeholder="Email"
              value={manualContact.email ?? ""}
              onChange={(event) => updateManual("email", event.target.value)}
            />
            <input
              className="form-input"
              placeholder="Phone"
              value={manualContact.phone ?? ""}
              onChange={(event) => updateManual("phone", event.target.value)}
            />
            <input
              className="form-input"
              placeholder="Website/source URL"
              value={manualContact.website}
              onChange={(event) => updateManual("website", event.target.value)}
            />
          </div>
        ) : null}

        <label className="mt-5 flex items-start gap-3 rounded-lg bg-white p-3 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-slate-200">
          <input
            type="checkbox"
            checked={value.verified}
            onChange={(event) => update({ verified: event.target.checked })}
            className="mt-1 h-4 w-4"
          />
          <span>
            <span className="flex items-center gap-2 text-civic-ink">
              <ShieldCheck className="h-4 w-4 text-civic-teal" />
              I verified this contact
            </span>
            <span className="mt-1 block font-normal text-slate-600">
              I checked the source, recipient, and report details before continuing.
            </span>
          </span>
        </label>

        {recipientConfirmationComplete(value, routingDecision) ? (
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Recipient confirmed.
          </p>
        ) : null}
      </div>
    </section>
  );
}
