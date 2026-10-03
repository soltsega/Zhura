import type {
  Election,
  Candidate,
  Voter,
  Proposal,
  Validator,
  Expense,
  AuditEvent,
  DashboardStats,
} from '@/types';

// ─── Validators ──────────────────────────────────────────────────────────────
export const validators: Validator[] = [
  { id: 'val-1', name: 'Addis Transparency Organization', shortName: 'ATO', status: 'online', description: 'Independent transparency watchdog focused on civic accountability.', joinedDate: '2024-06-15', totalVotes: 1247, participationRate: 98.2 },
  { id: 'val-2', name: 'Ethio Civic Network', shortName: 'ECN', status: 'online', description: 'Network of civic organizations promoting democratic governance.', joinedDate: '2024-06-15', totalVotes: 1189, participationRate: 95.6 },
  { id: 'val-3', name: 'Good Governance Organization', shortName: 'GGO', status: 'online', description: 'Research and advocacy organization for transparent governance.', joinedDate: '2024-07-01', totalVotes: 1156, participationRate: 93.8 },
  { id: 'val-4', name: 'Justice & Fairness Organization', shortName: 'JFO', status: 'online', description: 'Legal advocacy group ensuring fairness in electoral processes.', joinedDate: '2024-07-01', totalVotes: 1134, participationRate: 92.1 },
  { id: 'val-5', name: 'Peace & Democracy Organization', shortName: 'PDO', status: 'online', description: 'NGO promoting peaceful democratic transitions.', joinedDate: '2024-07-15', totalVotes: 1098, participationRate: 89.3 },
];

// ─── Demo Election ───────────────────────────────────────────────────────────
export const demoElection: Election = {
  id: 'el-001',
  name: 'ABC Bank Board Election 2026',
  type: 'Board Election',
  description: 'Annual board of directors election for ABC Bank shareholders. Five seats available.',
  status: 'live',
  startDate: '2026-08-28T08:00:00Z',
  endDate: '2026-09-05T18:00:00Z',
  registeredVoters: 500,
  votesCast: 372,
  seats: 5,
  votingMethod: 'Single Transferable Vote',
  eligibilityRules: 'Must be a registered shareholder of ABC Bank as of July 31, 2026.',
};

// ─── Candidates ──────────────────────────────────────────────────────────────
export const candidates: Candidate[] = [
  { id: 'cand-1', name: 'Candidate A', position: 'Board Director', biography: 'Experienced financial professional with 15 years in banking.', qualifications: 'MBA Finance, CPA, Former VP at XYZ Bank', organization: 'ABC Bank', status: 'active', electionId: 'el-001', votesReceived: 132, percentage: 35.5 },
  { id: 'cand-2', name: 'Candidate B', position: 'Board Director', biography: 'Corporate governance expert and former regulator.', qualifications: 'JD Law, Former Banking Commission Member', organization: 'ABC Bank', status: 'active', electionId: 'el-001', votesReceived: 119, percentage: 32.0 },
  { id: 'cand-3', name: 'Candidate C', position: 'Board Director', biography: 'Technology leader specializing in fintech innovation.', qualifications: 'PhD Computer Science, CTO Experience', organization: 'ABC Bank', status: 'active', electionId: 'el-001', votesReceived: 83, percentage: 22.3 },
  { id: 'cand-4', name: 'Candidate D', position: 'Board Director', biography: 'Community banking advocate with deep local connections.', qualifications: 'MBA, 20 Years Community Banking', organization: 'ABC Bank', status: 'active', electionId: 'el-001', votesReceived: 25, percentage: 6.7 },
  { id: 'cand-5', name: 'Candidate E', position: 'Board Director', biography: 'Audit and compliance specialist.', qualifications: 'CIA, CISA, Big Four Background', organization: 'ABC Bank', status: 'active', electionId: 'el-001', votesReceived: 13, percentage: 3.5 },
];

// ─── Voters ──────────────────────────────────────────────────────────────────
export const voters: Voter[] = Array.from({ length: 50 }, (_, i) => ({
  id: `vtr-${String(i + 1).padStart(4, '0')}`,
  voterId: `VTR-${String(i + 1).padStart(4, '0')}`,
  name: `Voter ${String(i + 1).padStart(4, '0')}`,
  email: `voter${i + 1}@abc-bank.demo`,
  registrationStatus: 'eligible' as const,
  eligibility: 'Registered Shareholder',
  votingStatus: i < 37 ? 'voted' as const : 'not_voted' as const,
  registrationDate: '2026-07-15',
  electionId: 'el-001',
}));

// ─── Proposals ───────────────────────────────────────────────────────────────
export const proposals: Proposal[] = [
  {
    id: 'prop-001', proposalNumber: '#0042', title: 'Extend Election Closing Time',
    description: 'Extend the election closing time from 18:00 to 20:00 due to technical disruptions reported at multiple polling centers.',
    type: 'extend_voting_period', proposedBy: 'Administrator', createdAt: '2026-09-01T10:30:00Z',
    status: 'approved', requiredQuorum: 4, totalValidators: 5, approvals: 4, rejections: 1,
    validatorVotes: [
      { validatorId: 'val-1', validatorName: 'Addis Transparency Organization', decision: 'approve', timestamp: '2026-09-01T11:00:00Z' },
      { validatorId: 'val-2', validatorName: 'Ethio Civic Network', decision: 'approve', timestamp: '2026-09-01T11:15:00Z' },
      { validatorId: 'val-3', validatorName: 'Good Governance Organization', decision: 'approve', timestamp: '2026-09-01T11:30:00Z' },
      { validatorId: 'val-4', validatorName: 'Justice & Fairness Organization', decision: 'approve', timestamp: '2026-09-01T11:45:00Z' },
      { validatorId: 'val-5', validatorName: 'Peace & Democracy Organization', decision: 'reject', timestamp: '2026-09-01T12:00:00Z' },
    ],
  },
  {
    id: 'prop-002', proposalNumber: '#0043', title: 'Suspend Polling Center 007',
    description: 'Suspend Polling Center 007 due to reported irregularities and security concerns.',
    type: 'suspend_polling_center', proposedBy: 'Administrator', createdAt: '2026-08-30T09:00:00Z',
    status: 'approved', requiredQuorum: 4, totalValidators: 5, approvals: 5, rejections: 0,
    validatorVotes: [
      { validatorId: 'val-1', validatorName: 'Addis Transparency Organization', decision: 'approve', timestamp: '2026-08-30T09:30:00Z' },
      { validatorId: 'val-2', validatorName: 'Ethio Civic Network', decision: 'approve', timestamp: '2026-08-30T09:45:00Z' },
      { validatorId: 'val-3', validatorName: 'Good Governance Organization', decision: 'approve', timestamp: '2026-08-30T10:00:00Z' },
      { validatorId: 'val-4', validatorName: 'Justice & Fairness Organization', decision: 'approve', timestamp: '2026-08-30T10:15:00Z' },
      { validatorId: 'val-5', validatorName: 'Peace & Democracy Organization', decision: 'approve', timestamp: '2026-08-30T10:30:00Z' },
    ],
  },
  {
    id: 'prop-003', proposalNumber: '#0044', title: 'Add Emergency Polling Center',
    description: 'Add an emergency polling center in response to high demand at existing centers.',
    type: 'add_polling_center', proposedBy: 'Administrator', createdAt: '2026-08-29T14:00:00Z',
    status: 'approved', requiredQuorum: 4, totalValidators: 5, approvals: 4, rejections: 0,
    validatorVotes: [
      { validatorId: 'val-1', validatorName: 'Addis Transparency Organization', decision: 'approve', timestamp: '2026-08-29T14:30:00Z' },
      { validatorId: 'val-2', validatorName: 'Ethio Civic Network', decision: 'approve', timestamp: '2026-08-29T14:45:00Z' },
      { validatorId: 'val-3', validatorName: 'Good Governance Organization', decision: 'approve', timestamp: '2026-08-29T15:00:00Z' },
      { validatorId: 'val-4', validatorName: 'Justice & Fairness Organization', decision: 'approve', timestamp: '2026-08-29T15:15:00Z' },
      { validatorId: 'val-5', validatorName: 'Peace & Democracy Organization', decision: 'abstain' },
    ],
  },
  {
    id: 'prop-004', proposalNumber: '#0045', title: 'Update Voter Verification Protocol',
    description: 'Update the voter verification protocol to include biometric cross-check.',
    type: 'update_protocol', proposedBy: 'Administrator', createdAt: '2026-08-28T08:00:00Z',
    status: 'approved', requiredQuorum: 4, totalValidators: 5, approvals: 5, rejections: 0,
    validatorVotes: [
      { validatorId: 'val-1', validatorName: 'Addis Transparency Organization', decision: 'approve', timestamp: '2026-08-28T08:30:00Z' },
      { validatorId: 'val-2', validatorName: 'Ethio Civic Network', decision: 'approve', timestamp: '2026-08-28T08:45:00Z' },
      { validatorId: 'val-3', validatorName: 'Good Governance Organization', decision: 'approve', timestamp: '2026-08-28T09:00:00Z' },
      { validatorId: 'val-4', validatorName: 'Justice & Fairness Organization', decision: 'approve', timestamp: '2026-08-28T09:15:00Z' },
      { validatorId: 'val-5', validatorName: 'Peace & Democracy Organization', decision: 'approve', timestamp: '2026-08-28T09:30:00Z' },
    ],
  },
  {
    id: 'prop-005', proposalNumber: '#0046', title: 'Change Quorum Requirement',
    description: 'Proposed change to reduce quorum requirement from 4/5 to 3/5 validators.',
    type: 'change_election_config', proposedBy: 'Administrator', createdAt: '2026-08-29T16:00:00Z',
    status: 'rejected', requiredQuorum: 4, totalValidators: 5, approvals: 2, rejections: 3,
    validatorVotes: [
      { validatorId: 'val-1', validatorName: 'Addis Transparency Organization', decision: 'reject', timestamp: '2026-08-29T16:30:00Z' },
      { validatorId: 'val-2', validatorName: 'Ethio Civic Network', decision: 'approve', timestamp: '2026-08-29T16:45:00Z' },
      { validatorId: 'val-3', validatorName: 'Good Governance Organization', decision: 'reject', timestamp: '2026-08-29T17:00:00Z' },
      { validatorId: 'val-4', validatorName: 'Justice & Fairness Organization', decision: 'approve', timestamp: '2026-08-29T17:15:00Z' },
      { validatorId: 'val-5', validatorName: 'Peace & Democracy Organization', decision: 'reject', timestamp: '2026-08-29T17:30:00Z' },
    ],
  },
  {
    id: 'prop-006', proposalNumber: '#0047', title: 'Activate Emergency Protocol',
    description: 'Activate emergency protocol due to reported power outages at 3 polling centers.',
    type: 'activate_emergency', proposedBy: 'Administrator', createdAt: '2026-08-30T06:00:00Z',
    status: 'approved', requiredQuorum: 4, totalValidators: 5, approvals: 5, rejections: 0,
    validatorVotes: [
      { validatorId: 'val-1', validatorName: 'Addis Transparency Organization', decision: 'approve', timestamp: '2026-08-30T06:15:00Z' },
      { validatorId: 'val-2', validatorName: 'Ethio Civic Network', decision: 'approve', timestamp: '2026-08-30T06:30:00Z' },
      { validatorId: 'val-3', validatorName: 'Good Governance Organization', decision: 'approve', timestamp: '2026-08-30T06:45:00Z' },
      { validatorId: 'val-4', validatorName: 'Justice & Fairness Organization', decision: 'approve', timestamp: '2026-08-30T07:00:00Z' },
      { validatorId: 'val-5', validatorName: 'Peace & Democracy Organization', decision: 'approve', timestamp: '2026-08-30T07:15:00Z' },
    ],
  },
  {
    id: 'prop-007', proposalNumber: '#0048', title: 'Extend Early Voting Period',
    description: 'Extend early voting by 2 days to accommodate more voters.',
    type: 'extend_voting_period', proposedBy: 'Administrator', createdAt: '2026-08-31T12:00:00Z',
    status: 'approved', requiredQuorum: 4, totalValidators: 5, approvals: 4, rejections: 0,
    validatorVotes: [
      { validatorId: 'val-1', validatorName: 'Addis Transparency Organization', decision: 'approve', timestamp: '2026-08-31T12:30:00Z' },
      { validatorId: 'val-2', validatorName: 'Ethio Civic Network', decision: 'approve', timestamp: '2026-08-31T12:45:00Z' },
      { validatorId: 'val-3', validatorName: 'Good Governance Organization', decision: 'approve', timestamp: '2026-08-31T13:00:00Z' },
      { validatorId: 'val-4', validatorName: 'Justice & Fairness Organization', decision: 'approve', timestamp: '2026-08-31T13:15:00Z' },
      { validatorId: 'val-5', validatorName: 'Peace & Democracy Organization', decision: 'abstain' },
    ],
  },
];

// ─── Expenses ────────────────────────────────────────────────────────────────
export const expenses: Expense[] = [
  { id: 'exp-001', category: 'polling_workers', amount: 2500000, description: 'Payment for 250 polling workers across 50 centers', authorizedBy: 'Administrator', timestamp: '2026-08-25T09:00:00Z', documentHash: '0x8a3f...b21c', status: 'approved' },
  { id: 'exp-002', category: 'observers', amount: 850000, description: 'International and local observer organizations', authorizedBy: 'Administrator', timestamp: '2026-08-25T09:30:00Z', documentHash: '0x4d2e...f89a', status: 'approved' },
  { id: 'exp-003', category: 'logistics', amount: 1200000, description: 'Ballot materials, seals, and security equipment', authorizedBy: 'Administrator', timestamp: '2026-08-24T14:00:00Z', documentHash: '0x7c1b...e45d', status: 'approved' },
  { id: 'exp-004', category: 'equipment', amount: 3400000, description: 'Voting machines, biometric scanners, and IT infrastructure', authorizedBy: 'Administrator', timestamp: '2026-08-20T10:00:00Z', documentHash: '0x9f4a...c73b', status: 'approved' },
  { id: 'exp-005', category: 'administration', amount: 450000, description: 'Administrative overhead and office expenses', authorizedBy: 'Administrator', timestamp: '2026-08-22T11:00:00Z', documentHash: '0x2e8d...a16f', status: 'approved' },
  { id: 'exp-006', category: 'training', amount: 600000, description: 'Training programs for polling staff and observers', authorizedBy: 'Administrator', timestamp: '2026-08-18T08:00:00Z', documentHash: '0x5b3c...d92e', status: 'approved' },
  { id: 'exp-007', category: 'transportation', amount: 540000, description: 'Vehicle rental and fuel for election logistics', authorizedBy: 'Administrator', timestamp: '2026-08-23T15:00:00Z', documentHash: '0x1a7f...b84c', status: 'approved' },
];

// ─── Audit Events ────────────────────────────────────────────────────────────
export const auditEvents: AuditEvent[] = [
  { id: 'evt-001', blockNumber: 18342, transactionHash: '0x8f3a...a21c', eventType: 'rule_change_approved', actor: 'CSO Validator', timestamp: '2026-09-01T12:00:00Z', status: 'verified', details: { proposalId: 'prop-001', title: 'Extend Election Closing Time' } },
  { id: 'evt-002', blockNumber: 18341, transactionHash: '0x4c2b...d56e', eventType: 'vote_cast', actor: 'Voter VTR-0372', timestamp: '2026-09-01T11:45:00Z', status: 'verified', details: { ballotRef: 'VR-8F29A1E4' } },
  { id: 'evt-003', blockNumber: 18340, transactionHash: '0x7d1e...f89a', eventType: 'vote_cast', actor: 'Voter VTR-0371', timestamp: '2026-09-01T11:42:00Z', status: 'verified' },
  { id: 'evt-004', blockNumber: 18339, transactionHash: '0x2a8c...b43d', eventType: 'expense_recorded', actor: 'Administrator', timestamp: '2026-09-01T10:30:00Z', status: 'verified', details: { amount: '540,000 ETB', category: 'Transportation' } },
  { id: 'evt-005', blockNumber: 18338, transactionHash: '0x9f5b...c72e', eventType: 'proposal_created', actor: 'Administrator', timestamp: '2026-09-01T10:30:00Z', status: 'verified', details: { proposalNumber: '#0042' } },
  { id: 'evt-006', blockNumber: 18337, transactionHash: '0x3e7d...a16f', eventType: 'vote_cast', actor: 'Voter VTR-0370', timestamp: '2026-09-01T10:28:00Z', status: 'verified' },
  { id: 'evt-007', blockNumber: 18336, transactionHash: '0x6c4a...d92b', eventType: 'voter_registered', actor: 'System', timestamp: '2026-08-28T08:00:00Z', status: 'verified' },
  { id: 'evt-008', blockNumber: 18335, transactionHash: '0x1b8e...f45c', eventType: 'election_opened', actor: 'Administrator', timestamp: '2026-08-28T08:00:00Z', status: 'verified', details: { electionName: 'ABC Bank Board Election 2026' } },
];

// ─── Recent Activity ─────────────────────────────────────────────────────────
export const recentActivity = [
  { message: 'Rule change proposal #0042 approved', timestamp: '2 mins ago', type: 'governance' },
  { message: 'Voting center 012 reported results', timestamp: '5 mins ago', type: 'voting' },
  { message: 'Expense recorded: Transportation', timestamp: '18 mins ago', type: 'expense' },
  { message: 'New voter registered', timestamp: '22 mins ago', type: 'voter' },
  { message: 'Validator ATO approved proposal #0042', timestamp: '30 mins ago', type: 'governance' },
  { message: 'Vote cast by VTR-0371', timestamp: '35 mins ago', type: 'voting' },
];

// ─── Blockchain Status ───────────────────────────────────────────────────────
export const blockchainStatus = {
  latestBlock: 18342,
  totalTransactions: 18342,
  networkStatus: 'healthy' as const,
  lastSync: '2026-09-01T12:00:00Z',
  chainId: 31337,
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export const dashboardStats: DashboardStats = {
  election: demoElection,
  votingProgress: {
    totalVoters: 500,
    votesCast: 372,
    turnout: 74.4,
    daysRemaining: 4,
  },
  resultsSummary: candidates,
  governanceSummary: {
    totalProposals: 7,
    approved: 6,
    rejected: 1,
    pending: 0,
    latestProposal: proposals[0],
  },
  expenditureSummary: {
    totalBudget: 10000000,
    totalSpent: 7840000,
    remaining: 2160000,
    categories: [
      { name: 'Polling Workers', amount: 2500000, color: '#3b82f6' },
      { name: 'Observers', amount: 850000, color: '#10b981' },
      { name: 'Logistics', amount: 1200000, color: '#f59e0b' },
      { name: 'Equipment', amount: 3400000, color: '#8b5cf6' },
      { name: 'Administration', amount: 450000, color: '#ef4444' },
      { name: 'Training', amount: 600000, color: '#06b6d4' },
      { name: 'Transportation', amount: 540000, color: '#ec4899' },
    ],
  },
  validatorNetwork: {
    activeValidators: 5,
    totalValidators: 5,
    requiredQuorum: 4,
    networkStatus: 'healthy',
    validators,
  },
  auditTrail: {
    totalRecords: 18342,
    latestBlock: 18342,
  },
  recentActivity,
};

// ─── Demo Accounts ───────────────────────────────────────────────────────────
export const demoAccounts = {
  admin: { email: 'admin@zihura.demo', password: 'demo123', name: 'Admin User', role: 'admin' as const },
  validator: { email: 'validator@zihura.demo', password: 'demo123', name: 'Validator User', role: 'validator' as const },
  voter: { email: 'voter@zihura.demo', password: 'demo123', name: 'Voter User', role: 'voter' as const },
};
