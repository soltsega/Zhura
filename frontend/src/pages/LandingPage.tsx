import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '@/components/common/BrandMark';
import SiteFooter from '@/components/common/SiteFooter';
import {
  Eye, Vote, Scale, FileText, Users,
  Building2, Lock, ArrowRight, Zap, CheckCircle2,
  ChevronRight, Activity, ShieldCheck, Cpu
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'validator' | 'voter' | 'public'>('admin');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10 rounded-full shadow-lg shadow-blue-500/20" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-white tracking-tight">Zhura</span>
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">ዝሁራ</span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Digital Governance Infrastructure</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Architecture</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Governance Flow</a>
              <a href="#use-cases" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Enterprise Support</a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
              >
                Launch Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full border border-blue-500/20 mb-8 backdrop-blur-md">
              <Zap className="w-4 h-4 text-blue-400" />
              Governance-as-a-Service (GaaS) Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Trust in Every Vote. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Independently Auditable.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Zhura transforms elections from processes participants are expected to trust into processes whose critical records and decisions can be <em>independently verified</em>.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/admin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-blue-600/30 cursor-pointer active:scale-95"
              >
                Explore Admin Console <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/portal"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-md cursor-pointer"
              >
                Public Transparency Portal
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Registered Voters', value: '500', sub: 'Verified Credentials' },
              { label: 'Votes Cast', value: '372', sub: 'On-Chain Ledger' },
              { label: 'Live Turnout', value: '74.4%', sub: 'Real-Time Telemetry' },
              { label: 'Independent CSO Nodes', value: '5/5', sub: 'Active Quorum' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center backdrop-blur-md">
                <p className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs font-bold text-blue-400 mt-1">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Role Preview Interactive Container */}
          <div className="mt-20 max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Platform Role Architecture</h3>
                <p className="text-xs text-slate-400 mt-0.5">Click any role to test its workspace interface</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(['admin', 'validator', 'voter', 'public'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === role
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {role === 'admin' ? 'Administrator' : role === 'validator' ? 'Validator CSO' : role === 'voter' ? 'Voter' : 'Public Guest'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Role Card */}
            <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800/80">
              {activeTab === 'admin' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Election Administrator Console</h4>
                        <p className="text-xs text-slate-400">Conduct elections, manage voters, candidates, and financial ledgers</p>
                      </div>
                    </div>
                    <Link to="/admin" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                      Launch Admin <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Create & Configure</p>
                      <p className="text-slate-400 text-[11px] mt-1">Set election rules, seats, candidate rosters, and schedules</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Governance Proposals</p>
                      <p className="text-slate-400 text-[11px] mt-1">Submit rule changes requiring 4/5 validator approvals</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Budget & Expenditure</p>
                      <p className="text-slate-400 text-[11px] mt-1">Record and publish line-item expense audits</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'validator' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Independent Validator / CSO Dashboard</h4>
                        <p className="text-xs text-slate-400">5 Civil Society Organizations validating election integrity</p>
                      </div>
                    </div>
                    <Link to="/validator" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer">
                      Launch Validator <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Addis Transparency Org</p>
                      <p className="text-slate-400 text-[11px] mt-1">Active Validator Node #1</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Ethio Civic Network</p>
                      <p className="text-slate-400 text-[11px] mt-1">Active Validator Node #2</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Quorum Protection</p>
                      <p className="text-slate-400 text-[11px] mt-1">Smart contract blocks unauthorized edits without 4/5 votes</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'voter' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Vote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Privacy-Preserving Voting Booth</h4>
                        <p className="text-xs text-slate-400">3-Step Ballot Submission with Cryptographic Proof</p>
                      </div>
                    </div>
                    <Link to="/voting" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer">
                      Launch Voting Booth <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">1. Verify Identity</p>
                      <p className="text-slate-400 text-[11px] mt-1">Credential authentication (e.g. VTR-0001)</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">2. Select & Confirm</p>
                      <p className="text-slate-400 text-[11px] mt-1">Double verification step prior to casting</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">3. Cryptographic Receipt</p>
                      <p className="text-slate-400 text-[11px] mt-1">Generates reference ID (e.g. VR-8F29A1B4)</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'public' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Public Transparency & Audit Portal</h4>
                        <p className="text-xs text-slate-400">Open-access election telemetry and audit lookup</p>
                      </div>
                    </div>
                    <Link to="/portal" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer">
                      Launch Portal <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">No Login Required</p>
                      <p className="text-slate-400 text-[11px] mt-1">Open to citizens, observers, and press</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Ballot Hash Lookup</p>
                      <p className="text-slate-400 text-[11px] mt-1">Verify ballot inclusion on block ledger</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="font-semibold text-white">Expenditure Audits</p>
                      <p className="text-slate-400 text-[11px] mt-1">Full budget breakdown transparency</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
