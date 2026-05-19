import { ExternalLink, Mail, Phone, Search, ShieldCheck } from "lucide-react";
import type { SuggestedContactDTO } from "@/lib/contacts/directory";
import type { ContactRoutingResult } from "@/lib/contact-routing/types";

type ContactSuggestionsProps = {
  contacts: SuggestedContactDTO[];
  routingDecision?: ContactRoutingResult | null;
};

export function ContactSuggestions({ contacts, routingDecision }: ContactSuggestionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Contact suggestions</p>
      <h3 className="mt-1 text-xl font-bold text-civic-ink">Estimated places to send the report</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        ReportRight AI does not show unverified phone numbers or email addresses. Open the official
        lookup link, confirm the contact from a government, utility, landlord, or HOA source, then
        paste verified details into your message.
      </p>
      {routingDecision ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-civic-ink">
            Routing confidence: {routingDecision.confidenceLabel} ({Math.round(routingDecision.confidenceScore * 100)}%)
          </p>
          <p className="mt-1 font-medium">Likely jurisdiction: {routingDecision.likelyJurisdiction}</p>
          <p className="mt-1">{routingDecision.explanation}</p>
          {routingDecision.fallbackWarnings.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {routingDecision.fallbackWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {contacts.map((contact) => (
          <div key={`${contact.name}-${contact.type}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-civic-ink">{contact.name}</h4>
                <p className="mt-1 text-sm font-semibold text-civic-blue">{contact.type}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {contact.reasonForRecommendation || contact.reason}
            </p>
            {contact.verificationNote ? (
              <p className="mt-3 flex gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-slate-600 ring-1 ring-slate-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-civic-teal" />
                {contact.verificationNote}
              </p>
            ) : null}
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              {contact.email ? (
                <a className="flex items-center gap-2 hover:text-civic-blue" href={`mailto:${contact.email}`}>
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </a>
              ) : (
                <span className="flex items-center gap-2 text-slate-500">
                  <Mail className="h-4 w-4" />
                  Email: verify from official source
                </span>
              )}
              {contact.phone ? (
                <a className="flex items-center gap-2 hover:text-civic-blue" href={`tel:${contact.phone}`}>
                  <Phone className="h-4 w-4" />
                  {contact.phone}
                </a>
              ) : (
                <span className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-4 w-4" />
                  Phone: verify from official source
                </span>
              )}
              <a
                className="flex items-center gap-2 hover:text-civic-blue"
                href={contact.lookupUrl || contact.website}
                target="_blank"
                rel="noreferrer"
              >
                <Search className="h-4 w-4" />
                {contact.source || "Official lookup"}
              </a>
              <a
                className="flex items-center gap-2 hover:text-civic-blue"
                href={contact.website}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Search source
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
