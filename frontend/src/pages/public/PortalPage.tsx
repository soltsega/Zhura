import { useState } from 'react';
import { Shield, Search, CheckCircle2, Eye, DollarSign, Vote, Scale, Activity, ArrowRight } from 'lucide-react';
import { Card, StatusBadge } from '@/components/common/Card';
import { dashboardStats, demoElection, candidates, proposals } from '@/data/mockData';
import { Link } from 'react-router-dom';

export default function PortalPage() {
  const [ballotRef, setBallotRef] = useState('');
  const [lookupResult, setLookupResult] = useState<{ found: boolean; block?: number; timestamp?: string; ref?: string } | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ballotRef.trim()) return;
    setLookupResult({
      found: true,
      ref: ballotRef.trim().toUpperCase(),
      block: Math.floor(18000 + Math.random() * 500),
      timestamp: new Date().toLocaleString(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Navbar */}
      <header className="bg-slate-950/80 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">Public Transparency Portal</h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Open Audit Access
                </span>
              </div>
              <p className="text-xs text-slate-400">VeriVote — Public Governance Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs text-slate-400 hover:text-white font-semibold">
              Sign In
            </Link>
            <Link
              to="/admin"
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-xl transition-all shadow-md"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20 mb-3">
              <Activity className="w-3.5 h-3.5" /> Public Verifiable Ledger Stream
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {demoElection.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              All voters, journalists, and civic observers can track election progress, verify cryptographic ballot references, inspect validator quorum decisions, and review line-item financial expenditures in real time.
            </p>
          </div>
        </div>

        {/* Ballot Reference Verification Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Cryptographic Ballot Lookup Tool</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your ballot reference ID (e.g., VR-8F29A1B4) to verify block inclusion</p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2 max-w-lg mx-auto">
              <input
                type="text"
                value={ballotRef}
                onChange={(e) => setBallotRef(e.target.value)}
                placeholder="Enter Reference (e.g. VR-8F29A1B4)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> Verify
              </button>
            </form>

            {lookupResult && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 max-w-lg mx-auto space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Ballot Verified on Block Ledger
                </div>
                <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                  <p><span className="text-slate-500">Reference:</span> {lookupResult.ref}</p>
                  <p><span className="text-slate-500">Block Height:</span> #{lookupResult.block}</p>
                  <p><span className="text-slate-500">Recorded At:</span> {lookupResult.timestamp}</p>
                  <p><span className="text-slate-500">Privacy Status:</span> Anonymous Zero-Knowledge Ballot Record</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Total Registered Voters</p>
            <p className="text-2xl font-bold text-white mt-1">{demoElection.registeredVoters.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-1">Verified Digital Roll</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Total Votes Cast</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{demoElection.votesCast.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-1">Tamper-Evident Receipts</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Voter Turnout</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{((demoElection.votesCast / demoElection.registeredVoters) * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-slate-500 mt-1">Active Participation</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-400">CSO Quorum Nodes</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">5 / 5 Online</p>
            <p className="text-[10px] text-slate-500 mt-1">Supermajority Consensus</p>
          </div>
        </div>

        {/* Public Candidate Standings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Candidate Results Tally</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((cand) => (
              <div key={cand.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{cand.name}</h4>
                  <p className="text-xs text-slate-400">{cand.organization}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-blue-400">{cand.votesReceived} Votes</span>
                  <p className="text-[10px] text-slate-500">{cand.percentage}% Tally</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Validator Quorum Decisions Log</h3>
          <div className="space-y-3">
            {proposals.map((prop) => (
              <div key={prop.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{prop.proposalNumber} — {prop.title}</p>
                  <p className="text-slate-400 mt-0.5">{prop.description}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <StatusBadge status={prop.status} />
                  <p className="text-[10px] text-slate-500 mt-1">{prop.approvals}/5 Approvals</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        VeriVote Public Open Audit Platform
      </footer>
    </div>
  );
}
