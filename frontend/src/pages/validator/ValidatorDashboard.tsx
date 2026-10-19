import { useState } from 'react';
import { CheckCircle2, XCircle, Scale, Building2, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { StatusBadge, Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { proposals as initialProposals, validators, demoElection } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import BrandMark from '@/components/common/BrandMark';
import SiteFooter from '@/components/common/SiteFooter';

export default function ValidatorDashboard() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'network' | 'rules'>('proposals');
  const [proposals, setProposals] = useState(initialProposals);
  const [selectedValidator, setSelectedValidator] = useState('val-1'); // Addis Transparency Org
  const navigate = useNavigate();

  const handleVoteProposal = (proposalId: string, decision: 'approve' | 'reject') => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== proposalId) return p;
        const currentVotes = p.validatorVotes || [];
        const existingIdx = currentVotes.findIndex((v) => v.validatorId === selectedValidator);
        let updatedVotes = [...currentVotes];
        if (existingIdx >= 0) {
          updatedVotes[existingIdx] = { ...updatedVotes[existingIdx], decision };
        } else {
          updatedVotes.push({
            validatorId: selectedValidator,
            validatorName: validators.find((v) => v.id === selectedValidator)?.name || 'Validator',
            decision,
          });
        }
        const approvals = updatedVotes.filter((v) => v.decision === 'approve').length;
        const status = approvals >= p.requiredQuorum ? 'approved' : p.status;
        return {
          ...p,
          validatorVotes: updatedVotes,
          approvals,
          status,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10 rounded-full shadow-lg shadow-purple-600/30" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-tight">Validator Network Console</h1>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                    CSO Node Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">Independent Civil Society Election Oversight</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Validator Node Selector */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
                <span className="text-slate-400 font-medium pl-1">Active Node:</span>
                <select
                  value={selectedValidator}
                  onChange={(e) => setSelectedValidator(e.target.value)}
                  className="bg-slate-800 text-white font-semibold rounded-lg px-2 py-1 outline-none border border-slate-700 cursor-pointer"
                >
                  {validators.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigate('/admin')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer transition-colors"
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Network Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Target Election</p>
            <p className="text-sm font-bold text-white mt-1 truncate">{demoElection.name}</p>
            <StatusBadge status={demoElection.status} />
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Validator Quorum Threshold</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">4 of 5 Nodes</p>
            <p className="text-[10px] text-slate-500">80% Supermajority Required</p>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Total Proposals</p>
            <p className="text-2xl font-bold text-white mt-1">{proposals.length}</p>
            <p className="text-[10px] text-emerald-400">{proposals.filter(p => p.status === 'approved').length} Approved</p>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">Network Consensus Health</p>
            <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 100% Operational
            </p>
            <p className="text-[10px] text-slate-500">Zero Latency Sync</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl max-w-md">
          {(['proposals', 'network', 'rules'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'proposals' ? 'Proposals' : tab === 'network' ? 'Validator Nodes' : 'Election Rules'}
            </button>
          ))}
        </div>

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Rule Change Proposals Requiring Quorum</h2>
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-400">{proposal.proposalNumber}</span>
                      <StatusBadge status={proposal.status} />
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{proposal.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-purple-400">{proposal.approvals}/{proposal.totalValidators} Approvals</span>
                      <p className="text-[10px] text-slate-500">Quorum Target: {proposal.requiredQuorum}/5</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{proposal.description}</p>

                {/* Validator Votes Grid */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">CSO Consensus Ledger</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {validators.map((val) => {
                      const vote = proposal.validatorVotes?.find((v) => v.validatorId === val.id);
                      const isMe = val.id === selectedValidator;
                      return (
                        <div key={val.id} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                          isMe ? 'bg-purple-950/30 border-purple-500/40' : 'bg-slate-950 border-slate-800'
                        }`}>
                          <span className="font-semibold text-slate-300 truncate max-w-[130px]">
                            {val.shortName} {isMe && '(You)'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            vote?.decision === 'approve' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            vote?.decision === 'reject' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {vote?.decision || 'PENDING'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleVoteProposal(proposal.id, 'approve')}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Cast Approval
                  </button>
                  <button
                    onClick={() => handleVoteProposal(proposal.id, 'reject')}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <XCircle className="w-4 h-4" /> Reject Proposal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {validators.map((v) => (
              <div key={v.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
                    {v.shortName}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{v.name}</h4>
                    <StatusBadge status={v.status} />
                  </div>
                </div>
                <p className="text-xs text-slate-400">{v.description}</p>
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <p className="font-bold text-white">{v.totalVotes}</p>
                    <p className="text-[10px] text-slate-500">Votes Cast</p>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <p className="font-bold text-emerald-400">{v.participationRate}%</p>
                    <p className="text-[10px] text-slate-500">Participation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Immutable Election Governance Protocol</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Total Validator Nodes</span>
                <span className="font-bold text-white">5 Organizations</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Required Approval Quorum</span>
                <span className="font-bold text-purple-400">4 of 5 (80%)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Direct Admin Modifications</span>
                <span className="font-bold text-red-400">Blocked by Smart Contract</span>
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
