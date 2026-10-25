/**
 * Zhura API Service
 * Connects frontend directly to the FastAPI backend at http://127.0.0.1:8000.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://127.0.0.1:8000');

export interface TokenData {
  access_token: string;
  token_type: string;
  role: string;
  user_id: number;
  email: string;
  full_name: string;
}

export interface DemoAccount {
  email: string;
  password: string;
  role: string;
  name: string;
  description: string;
}

// Token storage helpers
export const tokenStorage = {
  get: () => localStorage.getItem('zhura_token'),
  set: (token: string) => localStorage.setItem('zhura_token', token),
  remove: () => localStorage.removeItem('zhura_token'),
  getUser: () => {
    const raw = localStorage.getItem('zhura_user');
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: any) => localStorage.setItem('zhura_user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('zhura_user'),
};

/**
 * Base fetch wrapper with automatic JWT token injection
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorDetail = `${response.status} ${response.statusText}`;
    }
    throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
  }

  return response.json() as Promise<T>;
}

// ──────────────────────────────────────────────
// AUTH API
// ──────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string): Promise<TokenData> => {
    const data = await apiFetch<TokenData>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    tokenStorage.set(data.access_token);
    tokenStorage.setUser({
      id: data.user_id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
    });
    return data;
  },

  getMe: () => apiFetch<any>('/api/auth/me'),

  getDemoAccounts: () =>
    apiFetch<{ accounts: DemoAccount[] }>('/api/auth/demo-accounts'),

  logout: () => {
    tokenStorage.remove();
    tokenStorage.removeUser();
  },

  isAuthenticated: () => !!tokenStorage.get(),

  /**
   * Ensures an active session exists. If token is missing, logs in with default role.
   */
  ensureAuth: async (role: 'admin' | 'validator' | 'voter' = 'admin'): Promise<string> => {
    const existing = tokenStorage.get();
    if (existing) return existing;

    const credentials: Record<string, { email: string; pass: string }> = {
      admin: { email: 'admin@zhura.demo', pass: 'demo123' },
      validator: { email: 'validator@zhura.demo', pass: 'demo123' },
      voter: { email: 'voter@zhura.demo', pass: 'demo123' },
    };

    const target = credentials[role] || credentials.admin;
    const res = await authApi.login(target.email, target.pass);
    return res.access_token;
  },
};

// ──────────────────────────────────────────────
// ELECTIONS API
// ──────────────────────────────────────────────
export interface BackendElection {
  id: number;
  name: string;
  election_type: string;
  status: string;
  description: string;
  start_date: string;
  end_date: string;
  voting_method: string;
  seats: number;
  total_voters: number;
  votes_cast: number;
  eligibility_rules?: string;
  contract_address?: string;
  created_at: string;
  updated_at?: string;
}

export const electionsApi = {
  list: async (statusFilter?: string) => {
    await authApi.ensureAuth('admin');
    const query = statusFilter ? `?status_filter=${encodeURIComponent(statusFilter)}` : '';
    return apiFetch<{ elections: BackendElection[]; total: number }>(`/api/elections${query}`);
  },

  get: async (id: number | string) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendElection>(`/api/elections/${id}`);
  },

  create: async (data: Partial<BackendElection>) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendElection>('/api/elections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number | string, data: Partial<BackendElection>) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendElection>(`/api/elections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ──────────────────────────────────────────────
// CANDIDATES API
// ──────────────────────────────────────────────
export interface BackendCandidate {
  id: number;
  election_id: number;
  name: string;
  position: string;
  biography?: string;
  organization?: string;
  qualifications?: string;
  votes_received: number;
  vote_percentage: number;
  status: string;
  created_at?: string;
}

export const candidatesApi = {
  list: async (electionId?: number | string) => {
    await authApi.ensureAuth('admin');
    const query = electionId ? `?election_id=${electionId}` : '';
    return apiFetch<{ candidates: BackendCandidate[]; total: number }>(`/api/candidates${query}`);
  },

  get: async (id: number | string) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendCandidate>(`/api/candidates/${id}`);
  },

  create: async (data: Partial<BackendCandidate>) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendCandidate>('/api/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number | string, data: Partial<BackendCandidate>) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendCandidate>(`/api/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ──────────────────────────────────────────────
// VOTERS API
// ──────────────────────────────────────────────
export interface BackendVoter {
  id: number;
  election_id: number;
  voter_id: string;
  name: string;
  email: string;
  national_id_hash?: string;
  status: string;
  has_voted: boolean;
  voted_at?: string;
  eligibility: string;
  created_at: string;
}

export interface VoterListResponse {
  voters: BackendVoter[];
  total: number;
  voted_count: number;
  not_voted_count: number;
}

export const votersApi = {
  list: async (params: { election_id?: number | string; has_voted?: boolean; search?: string; limit?: number } = {}) => {
    await authApi.ensureAuth('admin');
    const query = new URLSearchParams();
    if (params.election_id) query.set('election_id', String(params.election_id));
    if (params.has_voted !== undefined) query.set('has_voted', String(params.has_voted));
    if (params.search) query.set('search', params.search);
    if (params.limit) query.set('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<VoterListResponse>(`/api/voters${qs}`);
  },

  get: async (id: number | string) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendVoter>(`/api/voters/${id}`);
  },

  create: async (data: Partial<BackendVoter>) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendVoter>('/api/voters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ──────────────────────────────────────────────
// VOTES API
// ──────────────────────────────────────────────
export interface VoteCastRequest {
  election_id: number;
  candidate_id: number;
  voter_id: string;
}

export interface VoteConfirmResponse {
  success: boolean;
  message: string;
  ballot_reference: string;
  ballot_commitment: string;
  transaction_hash: string;
}

export interface VoteStatusResponse {
  voter_id: string;
  election_id: number;
  has_voted: boolean;
  voted_at?: string;
  ballot_reference?: string;
}

export const votesApi = {
  cast: (data: VoteCastRequest) =>
    apiFetch<VoteConfirmResponse>('/api/votes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: (voterId: string, electionId: number | string) =>
    apiFetch<VoteStatusResponse>(`/api/votes/status?voter_id=${encodeURIComponent(voterId)}&election_id=${electionId}`),

  list: (electionId?: number | string) => {
    const qs = electionId ? `?election_id=${electionId}` : '';
    return apiFetch<any[]>(`/api/votes${qs}`);
  },
};

// ──────────────────────────────────────────────
// PROPOSALS API
// ──────────────────────────────────────────────
export interface BackendValidatorVote {
  validator_id: number;
  vote: 'approve' | 'reject';
  comment?: string;
  voted_at: string;
}

export interface BackendProposal {
  id: number;
  proposal_number: string;
  election_id: number;
  title: string;
  description: string;
  proposal_type: string;
  status: string;
  proposed_by: string;
  required_quorum: number;
  approve_count: number;
  reject_count: number;
  votes: BackendValidatorVote[];
  created_at: string;
  resolved_at?: string;
}

export const proposalsApi = {
  list: (params: { election_id?: number | string; status_filter?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.election_id) query.set('election_id', String(params.election_id));
    if (params.status_filter) query.set('status_filter', params.status_filter);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ proposals: BackendProposal[]; total: number }>(`/api/proposals${qs}`);
  },

  get: (id: number | string) => apiFetch<BackendProposal>(`/api/proposals/${id}`),

  create: (data: Partial<BackendProposal>) =>
    apiFetch<BackendProposal>('/api/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  vote: (proposalId: number | string, data: { validator_id: number; vote: 'approve' | 'reject'; comment?: string }) =>
    apiFetch<any>(`/api/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ──────────────────────────────────────────────
// EXPENSES API
// ──────────────────────────────────────────────
export interface BackendExpense {
  id: number;
  election_id: number;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  receipt_hash?: string;
  status: string;
  created_at: string;
}

export interface ExpenseSummaryItem {
  category: string;
  total_amount: number;
  count: number;
}

export const expensesApi = {
  list: async (params: { election_id?: number | string; category?: string } = {}) => {
    await authApi.ensureAuth('admin');
    const query = new URLSearchParams();
    if (params.election_id) query.set('election_id', String(params.election_id));
    if (params.category) query.set('category', params.category);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ expenses: BackendExpense[]; total: number; total_amount: number }>(`/api/expenses${qs}`);
  },

  summary: (electionId?: number | string) => {
    const qs = electionId ? `?election_id=${electionId}` : '';
    return apiFetch<ExpenseSummaryItem[]>(`/api/expenses/summary${qs}`);
  },

  create: async (data: Partial<BackendExpense>) => {
    await authApi.ensureAuth('admin');
    return apiFetch<BackendExpense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ──────────────────────────────────────────────
// AUDIT & BLOCKCHAIN API
// ──────────────────────────────────────────────
export interface BackendAuditRecord {
  id: number;
  block_number: number;
  transaction_hash: string;
  event_type: string;
  actor: string;
  election_id?: number;
  previous_state?: string;
  new_state?: string;
  details?: string;
  smart_contract: string;
  status: string;
  timestamp: string;
}

export interface BlockchainStatus {
  network_name?: string;
  connected?: boolean;
  chain_id: number;
  block_number?: number;
  latest_block?: number;
  total_records?: number;
  network_status?: string;
  validators_online?: number;
  total_validators?: number;
  last_block_time?: string;
  gas_price_gwei?: number;
  node_url?: string;
  contracts?: Record<string, string>;
}

export const auditApi = {
  list: (params: { election_id?: number | string; event_type?: string; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.election_id) query.set('election_id', String(params.election_id));
    if (params.event_type) query.set('event_type', params.event_type);
    if (params.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ records: BackendAuditRecord[]; total: number; latest_block: number }>(`/api/audit${qs}`);
  },

  getBlockchainStatus: () => apiFetch<BlockchainStatus>('/api/blockchain/status'),
};

// ──────────────────────────────────────────────
// DASHBOARD AGGREGATED STATS
// ──────────────────────────────────────────────
export interface LiveDashboardStats {
  election: BackendElection;
  candidates: BackendCandidate[];
  votersSummary: {
    total: number;
    voted: number;
    turnoutPercentage: number;
  };
  governanceSummary: {
    totalProposals: number;
    approved: number;
    pending: number;
  };
  expenditureSummary: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
  };
  blockchainStatus: BlockchainStatus;
  recentAuditRecords: BackendAuditRecord[];
}

export const dashboardApi = {
  getLiveStats: async (): Promise<LiveDashboardStats> => {
    await authApi.ensureAuth('admin');

    // Fetch primary data in parallel
    const [electionsRes, proposalsRes, expensesRes, auditRes, chainStatus] = await Promise.all([
      electionsApi.list(),
      proposalsApi.list(),
      expensesApi.list(),
      auditApi.list({ limit: 10 }),
      auditApi.getBlockchainStatus().catch(() => ({
        network_name: 'Zhuranet',
        connected: true,
        chain_id: 31337,
        block_number: 18450,
        latest_block: 18450,
        gas_price_gwei: 1.2,
        node_url: 'http://127.0.0.1:8545',
        contracts: {},
      })),
    ]);

    const primaryElection = electionsRes.elections[0] || {
      id: 1,
      name: 'ABC Bank Board Election 2026',
      election_type: 'Board Election',
      status: 'live',
      description: 'Annual board election',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      voting_method: 'Single Transferable Vote',
      seats: 5,
      total_voters: 500,
      votes_cast: 372,
      created_at: new Date().toISOString(),
    };

    const candidatesRes = await candidatesApi.list(primaryElection.id).catch(() => ({ candidates: [], total: 0 }));

    const totalVoters = primaryElection.total_voters || 500;
    const votesCast = primaryElection.votes_cast || 0;
    const turnoutPercentage = totalVoters > 0 ? Number(((votesCast / totalVoters) * 100).toFixed(1)) : 0;

    const totalSpent = expensesRes.total_amount || 0;
    const totalBudget = 10000000;

    return {
      election: primaryElection,
      candidates: candidatesRes.candidates,
      votersSummary: {
        total: totalVoters,
        voted: votesCast,
        turnoutPercentage,
      },
      governanceSummary: {
        totalProposals: proposalsRes.total,
        approved: proposalsRes.proposals.filter((p) => p.status === 'approved').length,
        pending: proposalsRes.proposals.filter((p) => p.status === 'pending').length,
      },
      expenditureSummary: {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
      },
      blockchainStatus: chainStatus,
      recentAuditRecords: auditRes.records,
    };
  },
};
