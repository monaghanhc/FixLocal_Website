import type { IssueCategory } from "@/lib/ai/types";

export type RoutingConfidence = "HIGH" | "MEDIUM" | "LOW";

export type ContactRoutingInput = {
  imageClassificationResult?: {
    category?: string | null;
    confidenceScore?: number | null;
  } | null;
  userSelectedCategory?: IssueCategory | string | null;
  userNotes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  city?: string | null;
  county?: string | null;
  state?: string | null;
  zipCode?: string | null;
  urgent?: boolean | null;
};

export type RoutedContact = {
  name: string;
  organization: string;
  department: string;
  type: string;
  email: string | null;
  phone: string | null;
  website: string;
  lookupUrl?: string | null;
  source: string;
  sourceLastVerifiedAt: string | null;
  confidence: RoutingConfidence;
  reasonForRecommendation: string;
  reason: string;
  verificationNote?: string | null;
};

export type ContactRoutingResult = {
  suggestedContacts: RoutedContact[];
  confidenceScore: number;
  explanation: string;
  fallbackWarnings: string[];
  manualReviewRequired: boolean;
  emergencyWarningRequired: boolean;
};

export type VerifiedContactRecord = {
  id: string;
  category: string;
  city: string;
  county?: string | null;
  state: string;
  zipCode?: string | null;
  contact: Omit<RoutedContact, "confidence" | "reasonForRecommendation">;
};
