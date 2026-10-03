import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Eye, Scale, Clock } from 'lucide-react';
import { StatusBadge, Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { proposals, validators, demoElection } from '@/data/mockData';

export default function ValidatorDashboard() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'network' | 'rules'>('proposals');

  const pendingProposals = proposals.filter((p) => p.status === 'pending');
  const recentProposals = proposals.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Validator Dashboard</h1>
                <p className="text-xs text-slate-500">Addis Transparency Organization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status="online" size="md" />
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-medium">A</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="!p-4">
            <p className="text-xs text-slate-500">Active Election</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{demoElection.name}</p>
            <StatusBadge status={demoElection.status} />
          </Card>
          <Card className="!p-4">
            <p className="text-xs text-slate-500">Pending Proposals</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingProposals.length}</p>
          </Card>
          <Card className="!p-4">
            <p className="text-xs text-slate-500">Approved This Session</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">3</p>
          </Card>
          <Card className="!p-4">
            <p className="text-xs text-slate-500">Network Status</p>
            <p className="text-sm font-bold text-emerald-600 mt-1">Healthy</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-6 max-w-md">
          {(['proposals', 'network', 'rules'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'proposals' ? 'Proposals' : tab === 'network' ? 'Validator Network' : 'Election Rules'}
            </button>
          ))}
        </div>

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Governance Proposals</h2>
            {recentProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
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
                <div className="space-y-1.5 bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Validator Votes</p>
                  {proposal.validatorVotes.map((vote) => (
                    <div key={vote.validatorId} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                          {validators.find((v) => v.id === vote.validatorId)?.shortName}
                        </span>
                        <span className="text-xs text-slate-700">{vote.validatorName}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        vote.decision === 'approve' ? 'bg-emerald-100 text-emerald-700' :
                        vote.decision === 'reject' ? 'bg-red-100 text-red-700' :
                        vote.decision === 'abstain' ? 'bg-slate-100 text-slate-500' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {vote.decision ? vote.decision.toUpperCase() : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {proposal.status === 'pending' && (
                  <div className="mt-4 flex items-center gap-3">
                    <Button variant="success" size="sm" icon={<CheckCircle className="w-4 h-4" />}>Approve</Button>
                    <Button variant="danger" size="sm" icon={<XCircle className="w-4 h-4" />}>Reject</Button>
                    <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>Details</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Validator Network</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validators.map((v) => (
                <div key={v.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-700">{v.shortName}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                      <StatusBadge status={v.status} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{v.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-sm font-bold text-slate-900">{v.totalVotes}</p>
                      <p className="text-[10px] text-slate-500">Total Votes</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-sm font-bold text-slate-900">{v.participationRate}%</p>
                      <p className="text-[10px] text-slate-500">Participation</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Election Rules</h2>
            <Card title="Election Configuration" icon={<Scale className="w-5 h-5" />}>
              <div className="space-y-3">
                {[
                  { label: 'Election Name', value: demoElection.name },
                  { label: 'Status', value: demoElection.status },
                  { label: 'Start Date', value: new Date(demoElection.startDate).toLocaleString() },
                  { label: 'End Date', value: new Date(demoElection.endDate).toLocaleString() },
                  { label: 'Voting Method', value: demoElection.votingMethod },
                  { label: 'Seats', value: String(demoElection.seats) },
                  { label: 'Eligibility', value: demoElection.eligibilityRules },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-500">{rule.label}</span>
                    <span className="text-sm font-medium text-slate-900">{rule.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Governance Rules" icon={<Scale className="w-5 h-5" />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Total Validators</span>
                  <span className="text-sm font-medium text-slate-900">5</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Required Quorum</span>
                  <span className="text-sm font-medium text-slate-900">4 of 5</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Protected Changes</span>
                  <span className="text-sm font-medium text-slate-900">Requires quorum approval</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">Unauthorized Changes</span>
                  <span className="text-sm font-medium text-red-600">Rejected by smart contract</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
