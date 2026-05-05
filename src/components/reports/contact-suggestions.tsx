import { ExternalLink, Mail, Phone } from "lucide-react";
import type { SuggestedContactDTO } from "@/lib/contacts/directory";

type ContactSuggestionsProps = {
  contacts: SuggestedContactDTO[];
};

export function ContactSuggestions({ contacts }: ContactSuggestionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Contact suggestions</p>
      <h3 className="mt-1 text-xl font-bold text-civic-ink">Estimated places to send the report</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {contacts.map((contact) => (
          <div key={`${contact.name}-${contact.email}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-civic-ink">{contact.name}</h4>
                <p className="mt-1 text-sm font-semibold text-civic-blue">{contact.type}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{contact.reason}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <a className="flex items-center gap-2 hover:text-civic-blue" href={`mailto:${contact.email}`}>
                <Mail className="h-4 w-4" />
                {contact.email}
              </a>
              <a className="flex items-center gap-2 hover:text-civic-blue" href={`tel:${contact.phone}`}>
                <Phone className="h-4 w-4" />
                {contact.phone}
              </a>
              <a
                className="flex items-center gap-2 hover:text-civic-blue"
                href={contact.website}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
