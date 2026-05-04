export type EntityType =
  | 'natural_person'
  | 'vessel'
  | 'organization'
  | 'aircraft';

export interface Entity {
  id: string;
  fullName: string;
  givenNames: string[];
  familyName: string;
  arabicName?: string;
  dob?: string;
  country: string;
  entityType: EntityType;
  passportNumber?: string;
  nationality?: string;
  counterparties?: string[];
  employer?: string;
  geography?: string[];
}

/** Fields that map to what a bank/PSP analyst sees on their dashboard. */
export interface CustomerProfile {
  occupation?: string;
  city?: string;
  accountAge?: string;
  kycVerification?: string;
}

export interface WatchlistEntry extends Entity {
  listSource: 'OFAC_SDN' | 'UN' | 'EU' | 'HMT';
  sanctionsProgram?: string;
  listingDate: string;
  isSynthetic: false;
}

export interface Customer extends Entity, CustomerProfile {
  isSynthetic: true;
  transactionDescription: string;
  transactionAmount?: number;
}

export interface MatchField {
  fieldName: string;
  customerValue: string | undefined;
  watchlistValue: string | undefined;
  matched: boolean;
  uProbability?: number;
  weight: number;
  explanation: string;
}

export interface LegacyResult {
  similarity: number;
  verdict: 'FLAG' | 'CLEAR';
  explanation: string;
}

export interface GraphResult {
  customerNeighbors: string[];
  watchlistNeighbors: string[];
  sharedNeighbors: string[];
  contextScore: number;
}

export interface EntityResolutionResultData {
  fields: MatchField[];
  totalLogOdds: number;
  matchProbability: number;
  verdict: 'FLAG' | 'CLEAR';
  explanation: string;
  graphContext?: GraphResult;
}

export interface MatchResult {
  customer: Customer;
  watchlistEntry: WatchlistEntry;
  legacy: LegacyResult;
  entityResolution: EntityResolutionResultData;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  customerId: string;
  watchlistEntryId: string;
  teachingPoint: string;
  showGraph: boolean;
}

export interface GraphData {
  nodes: { id: string; label: string; group?: string }[];
  edges: { source: string; target: string }[];
}
