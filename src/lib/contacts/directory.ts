import type { AIReportInput } from "@/lib/ai/types";
import { contactRoutingService } from "@/lib/contact-routing/service";
import type { RoutedContact } from "@/lib/contact-routing/types";

export type SuggestedContactDTO = RoutedContact;

export function suggestContacts(input: AIReportInput): SuggestedContactDTO[] {
  return contactRoutingService.route({
    imageClassificationResult: null,
    userSelectedCategory: input.category,
    userNotes: `${input.description} ${input.optionalNotes ?? ""}`,
    latitude: input.latitude,
    longitude: input.longitude,
    address: input.address,
    city: input.city,
    county: input.county,
    state: input.state,
    zipCode: input.zip,
    urgent: input.urgent
  }).suggestedContacts;
}
