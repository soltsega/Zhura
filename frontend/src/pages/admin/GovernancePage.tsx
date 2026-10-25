import { useState, useEffect } from 'react';
import { Plus, Search, Scale, CheckCircle, Loader2 } from 'lucide-react';
import { StatusBadge, Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { proposalsApi, electionsApi, type BackendProposal } from '@/services/api';

const validatorNodes = [
  { id: 1, name: 'Addis Transparency Organization', shortName: 'ATO' },
  { id: 2, name: 'Ethio Civic Network', shortName: 'ECN' },
  { id: 3, name: 'Good Governance Organization', shortName: 'GGO' },
  { id: 4, name: 'Justice & Fairness Organization', shortName: 'JFO' },
  { id: 5, name: 'Peace & Democracy Organization', shortName: 'PDO' },
];

function ProposalCard({ proposal }: { proposal: BackendProposal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow font-sans">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">{proposal.proposal_number}</span>
              <StatusBadge status={proposal.status as any} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1">{proposal.title}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600">
                {proposal.approve_count}/5
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Quorum: {proposal.required_quorum}/5</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4">{proposal.description}</p>

        {/* Validator Votes */}
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {expanded ? 'Hide' : 'Show'} Validator Votes
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5 bg-slate-50 rounded-lg p-3">
              {validatorNodes.map((val) => {
                const vote = proposal.votes?.find((v) => v.validator_id === val.id);
                return (
                  <div key={val.id} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 truncate max-w-[200px]">{val.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vote?.vote === 'approve'
                          ? 'bg-emerald-100 text-emerald-700'
                          : vote?.vote === 'reject'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {vote?.vote ? vote.vote.toUpperCase() : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
          <span>Proposed by {proposal.proposed_by}</span>
          <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function GovernancePage() {
  const [proposals, setProposals] = useState<BackendProposal[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposalType, setProposalType] = useState('extend_voting_period');

  const loadProposals = async () => {
    try {
      setLoading(true);
      setActionError('');
      const res = await proposalsApi.list({
        status_filter: filterStatus !== 'all' ? filterStatus : undefined,
      });
      setProposals(res.proposals);
    } catch (err: any) {
      console.error('Failed to load proposals:', err);
      setActionError(err.message || 'Failed to load governance proposals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [filterStatus]);

  const handleCreateProposal = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      setCreateLoading(true);
      setActionError('');
      const electionsRes = await electionsApi.list();
      const activeElection = electionsRes.elections[0];

      await proposalsApi.create({
        election_id: activeElection ? activeElection.id : 1,
        title,
        description,
        proposal_type: proposalType,
        proposed_by: 'Election Administrator',
        required_quorum: 4,
      });

      setShowCreate(false);
      setTitle('');
      setDescription('');
      loadProposals();
    } catch (err: any) {
      setActionError(err.message || 'Error submitting proposal');
    } finally {
      setCreateLoading(false);
    }
  };

  const filtered = proposals.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.proposal_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Governance</h1>
          <p className="text-sm text-slate-500">Manage rule proposals and validator quorum approvals via API</p>
        </div>
        <Button onClick={() => setShowCreate(true)} icon={<Plus className="w-4 h-4" />}>
          New Proposal
        </Button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {actionError}
        </div>
      )}

      {/* Validator Network Status */}
      <Card title="Independent Validator Quorum" icon={<Scale className="w-5 h-5" />}>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {validatorNodes.map((v) => (
            <div key={v.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                {v.shortName}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate">{v.name}</p>
                <StatusBadge status="online" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 text-sm outline-none w-full"
          />
        </div>
        <div className="flex bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm text-xs font-semibold">
          {(['all', 'approved', 'rejected', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-2 transition-colors cursor-pointer ${
                filterStatus === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading Proposals from API...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}

      {/* New Proposal Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Submit Governance Proposal</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Extend voting window by 48 hours"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Type</label>
              <select
                value={proposalType}
                onChange={(e) => setProposalType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="extend_voting_period">Extend Voting Period</option>
                <option value="change_election_config">Change Election Configuration</option>
                <option value="add_polling_center">Add Polling Center</option>
                <option value="suspend_polling_center">Suspend Polling Center</option>
                <option value="activate_emergency">Activate Emergency Mode</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Justification &amp; Details</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why this rule change is requested..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              Note: This action will be submitted on-chain and requires 4/5 validator approvals before taking effect.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <Button onClick={handleCreateProposal} disabled={createLoading}>
                {createLoading ? 'Submitting...' : 'Submit to Quorum'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
