// User types
export type UserRole = 'admin' | 'validator' | 'voter' | 'public';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organization?: string;
}

// Election types
export type ElectionStatus = 'draft' | 'scheduled' | 'live' | 'completed' | 'suspended';

export interface Election {
  id: string;
  name: string;
  type: string;
  description: string;
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  registeredVoters: number;
  votesCast: number;
  seats: number;
  votingMethod: string;
  eligibilityRules: string;
}

// Candidate types
export type CandidateStatus = 'active' | 'withdrawn' | 'disqualified';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  biography: string;
  qualifications: string;
  organization: string;
  status: CandidateStatus;
  electionId: string;
  votesReceived?: number;
  percentage?: number;
}

// Voter types
export type VoterStatus = 'pending' | 'eligible' | 'ineligible' | 'suspended';
export type VotingStatus = 'not_voted' | 'voted';

export interface Voter {
  id: string;
  voterId: string;
  name: string;
  email: string;
  registrationStatus: VoterStatus;
  eligibility: string;
  votingStatus: VotingStatus;
  registrationDate: string;
  electionId: string;
}

// Vote types
export interface Vote {
  id: string;
  voterId: string;
  candidateId: string;
  electionId: string;
  timestamp: string;
  ballotReference: string;
  ballotCommitment: string;
}

// Governance types
export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'executed';
export type ProposalType = 
  | 'extend_voting_period'
  | 'suspend_polling_center'
  | 'add_polling_center'
  | 'change_election_config'
  | 'activate_emergency'
  | 'update_protocol';

export interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  description: string;
  type: ProposalType;
  proposedBy: string;
  createdAt: string;
  status: ProposalStatus;
  requiredQuorum: number;
  totalValidators: number;
  approvals: number;
  rejections: number;
  validatorVotes: ValidatorVote[];
}

export interface ValidatorVote {
  validatorId: string;
  validatorName: string;
  decision: 'approve' | 'reject' | 'abstain' | null;
  timestamp?: string;
}

// Validator types
export type ValidatorStatus = 'online' | 'offline' | 'maintenance';

export interface Validator {
  id: string;
  name: string;
  shortName: string;
  status: ValidatorStatus;
  description: string;
  joinedDate: string;
  totalVotes: number;
  participationRate: number;
}

// Expense types
export type ExpenseCategory = 
  | 'polling_workers'
  | 'observers'
  | 'logistics'
  | 'equipment'
  | 'training'
  | 'administration'
  | 'transportation'
  | 'other';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  authorizedBy: string;
  timestamp: string;
  documentHash: string;
  status: ExpenseStatus;
}

// Audit types
export type AuditEventType = 
  | 'election_created'
  | 'election_opened'
  | 'election_closed'
  | 'vote_cast'
  | 'proposal_created'
  | 'proposal_approved'
  | 'proposal_rejected'
  | 'rule_change_approved'
  | 'expense_recorded'
  | 'candidate_registered'
  | 'voter_registered'
  | 'results_finalized';

export interface AuditEvent {
  id: string;
  blockNumber: number;
  transactionHash: string;
  eventType: AuditEventType;
  actor: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'failed';
  details?: Record<string, unknown>;
}

// Blockchain types
export interface BlockchainStatus {
  latestBlock: number;
  totalTransactions: number;
  networkStatus: 'healthy' | 'degraded' | 'offline';
  lastSync: string;
  chainId: number;
}

// Dashboard types
export interface DashboardStats {
  election: Election;
  votingProgress: {
    totalVoters: number;
    votesCast: number;
    turnout: number;
    daysRemaining: number;
  };
  resultsSummary: Candidate[];
  governanceSummary: {
    totalProposals: number;
    approved: number;
    rejected: number;
    pending: number;
    latestProposal: Proposal | null;
  };
  expenditureSummary: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
    categories: { name: string; amount: number; color: string }[];
  };
  validatorNetwork: {
    activeValidators: number;
    totalValidators: number;
    requiredQuorum: number;
    networkStatus: 'healthy' | 'degraded' | 'offline';
    validators: Validator[];
  };
  auditTrail: {
    totalRecords: number;
    latestBlock: number;
  };
  recentActivity: { message: string; timestamp: string; type: string }[];
}
