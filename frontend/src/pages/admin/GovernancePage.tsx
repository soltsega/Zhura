import { useState } from 'react';
import { Plus, Search, Scale, CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react';
import { StatusBadge, Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { proposals, validators } from '@/data/mockData';
import type { Proposal } from '@/types';

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">{proposal.proposalNumber}</span>
              <StatusBadge status={proposal.status} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1">{proposal.title}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600">{proposal.approvals}/{proposal.totalValidators}</span>
            </div>
            <p className="text-[10px] text-slate-400">Quorum: {proposal.requiredQuorum}/{proposal.totalValidators}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4">{proposal.description}</p>

        {/* Validator Votes */}
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {expanded ? 'Hide' : 'Show'} Validator Votes
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5 bg-slate-50 rounded-lg p-3">
              {proposal.validatorVotes.map((vote) => (
                <div key={vote.validatorId} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 truncate max-w-[200px]">{vote.validatorName}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    vote.decision === 'approve' ? 'bg-emerald-100 text-emerald-700' :
                    vote.decision === 'reject' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {vote.decision ? vote.decision.toUpperCase() : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Proposed by {proposal.proposedBy}</span>
          <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function GovernancePage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');

  const filtered = proposals.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Governance</h1>
          <p className="text-sm text-slate-500">Manage proposals and validator approvals</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>New Proposal</Button>
      </div>

      {/* Validator Network Status */}
      <Card title="Validator Network" icon={<Scale className="w-5 h-5" />}>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {validators.map((v) => (
            <div key={v.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{v.shortName}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate">{v.shortName}</p>
                <StatusBadge status={v.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search proposals..." value={search} onChange={(e) => setSearch(e.target.value)} className="ml-2 text-sm outline-none w-full" />
        </div>
        <div className="flex bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
          {(['all', 'approved', 'rejected', 'pending'] as const).map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${filterStatus === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
