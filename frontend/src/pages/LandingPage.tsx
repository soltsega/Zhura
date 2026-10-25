import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '@/components/common/BrandMark';
import SiteFooter from '@/components/common/SiteFooter';
import RoleNavSwitcher from '@/components/common/RoleNavSwitcher';
import {
  Eye, Vote, Users,
  Building2, Lock, ArrowRight, Zap,
  ChevronRight, Activity, ShieldCheck, Cpu,
  Database, Layers, BarChart3, Menu, X, Landmark,
  GraduationCap, Briefcase, FileCheck2, ShieldAlert
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'validator' | 'voter' | 'public'>('admin');
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'how-it-works', 'use-cases'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Hosted Environment Notice */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span className="font-semibold text-amber-200">Hosted Environment Notice:</span>
            <span className="text-amber-300/80 hidden md:inline">
              Live demonstration hosted on Render (Free Tier). The backend is subject to idle container sleep and may take 30-45 seconds to wake up, and some background services may experience limited availability.
            </span>
            <span className="text-amber-300/80 md:hidden">
              Render Free Tier: backend takes 30-45s to wake up, and some services may be unavailable.
            </span>
          </div>
          <Link to="/login" className="text-amber-400 hover:text-amber-200 underline font-medium flex-shrink-0">
            Sign In with Test Accounts
          </Link>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <BrandMark className="h-10 w-10 rounded-full shadow-lg shadow-blue-500/20" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-white tracking-tight">Zhuranet</span>
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">Enterprise</span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Digital Governance Infrastructure</p>
              </div>
            </Link>

            {/* Desktop Navigation Links with Active State */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => scrollToSection('features')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'features'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'how-it-works'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Governance Flow
              </button>
              <button
                onClick={() => scrollToSection('use-cases')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSection === 'use-cases'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Enterprise Support
              </button>
            </div>

            {/* Role Switcher & Action CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              <RoleNavSwitcher variant="dark" />
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3 py-2 rounded-xl transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3">
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => scrollToSection('features')}
                className={`text-left text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
                  activeSection === 'features' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className={`text-left text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
                  activeSection === 'how-it-works' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                Governance Flow
              </button>
              <button
                onClick={() => scrollToSection('use-cases')}
                className={`text-left text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
                  activeSection === 'use-cases' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                Enterprise Support
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform Workspaces</p>
              <RoleNavSwitcher variant="dark" className="w-full justify-between" />
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md"
              >
                Sign In to Platform
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
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
              Zhuranet transforms elections from processes participants are expected to trust into processes whose critical records and decisions can be <em>independently verified</em>.
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

      {/* SECTION 1: ARCHITECTURE */}
      <section id="features" className="py-24 border-t border-slate-800/80 bg-slate-950/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20 mb-4">
              <Cpu className="w-3.5 h-3.5" />
              Core Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Shared, Tamper-Evident Trust Infrastructure
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              Traditional voting software relies on trusted database administrators. Zhuranet enforces critical governance invariants with smart contracts and independent Civil Society nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">4/5 Validator Quorum</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No single administrator can alter dates, add candidates, or modify voter rolls without an on-chain supermajority vote of 5 independent Civil Society Organizations.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-blue-400 font-semibold">
                <span>Smart contract enforced</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cryptographic Ballot Privacy</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Voters receive a unique receipt hash upon submission. Votes are recorded anonymously on the ledger, preventing coercion and vote-buying while maintaining full auditability.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-purple-400 font-semibold">
                <span>Receipt verification</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dual-Layer Architecture</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                High-throughput relational storage (PostgreSQL/SQLite) manages real-time querying, while an EVM smart contract acts as the immutable, tamper-evident audit ledger.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-emerald-400 font-semibold">
                <span>Zero latency + blockchain guarantees</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Public Telemetry &amp; Audits</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Citizens, observers, and media inspect live voter turnout, validator consensus states, and line-item election expenditures without requiring an account.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-amber-400 font-semibold">
                <span>Open public telemetry</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Expenditure Transparency</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track every election expenditure by category (polling staff, logistics, equipment, training) with receipt hashes and approval chains to combat corruption.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-indigo-400 font-semibold">
                <span>Audited public funds</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tamper-Resistant State Security</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Cryptographic validator consensus guarantees that any unauthorized database modifications, tally alterations, or election rule tampering are immediately rejected on-chain.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-blue-400 font-semibold">
                <span>Multi-signature quorum protection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GOVERNANCE FLOW */}
      <section id="how-it-works" className="py-24 border-t border-slate-800/80 bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20 mb-4">
              <Activity className="w-3.5 h-3.5" />
              Governance Flow
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              From Administrative Action to Independent Verification
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              Zhuranet separates administrative responsibility from approval authority. Here is how a verified election cycle executes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Proposal Drafted',
                desc: 'Election administrator submits election rules, candidates, or dates. It enters a pending proposal state.',
                badge: 'Admin Console',
                color: 'text-blue-400',
              },
              {
                step: '02',
                title: 'CSO Supermajority',
                desc: '5 independent Civil Society validator nodes review the proposal. 4 of 5 must cryptographically sign.',
                badge: 'Validator Quorum',
                color: 'text-purple-400',
              },
              {
                step: '03',
                title: 'Verifiable Ballot',
                desc: 'Eligible voters cast anonymous ballots, each receiving an immutable cryptographic reference hash.',
                badge: 'Voting Booth',
                color: 'text-emerald-400',
              },
              {
                step: '04',
                title: 'Open Audit',
                desc: 'Citizens, parties, and international observers query the tamper-evident ledger and verify ledger consistency.',
                badge: 'Public Portal',
                color: 'text-amber-400',
              },
            ].map((card) => (
              <div key={card.step} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative flex flex-col justify-between">
                <div>
                  <span className={`text-4xl font-extrabold ${card.color} opacity-40 font-mono`}>{card.step}</span>
                  <h4 className="text-lg font-bold text-white mt-4 mb-2">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                    {card.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Flow Banner CTA */}
          <div className="mt-14 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Experience the full workflow now</h3>
              <p className="text-sm text-slate-300 mt-1">Review live governance proposals as an independent CSO validator</p>
            </div>
            <Link
              to="/validator"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30"
            >
              Open Validator Console <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: ENTERPRISE SUPPORT / USE CASES */}
      <section id="use-cases" className="py-24 border-t border-slate-800/80 bg-slate-950/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 mb-4">
              <Briefcase className="w-3.5 h-3.5" />
              Institutional Applicability
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Built for High-Stakes Institutional Governance
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              Zhuranet adapts to complex voting rules, multi-seat boards, weighted voting, and strict regulatory audit requirements across sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-5">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Banks &amp; Financial</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Shareholder annual general meetings, board director elections, weighted equity voting, and regulatory compliance records.
              </p>
              <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded">Single Transferable Vote</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Universities</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Academic senate elections, student union voting, department chair appointments, and campus-wide governance referendums.
              </p>
              <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-1 rounded">Multi-Constituency</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cooperatives &amp; Unions</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Agricultural unions, credit cooperatives, bar associations, and medical societies requiring verifiable delegate selection.
              </p>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">Decentralized Delegates</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Civic Referendums</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Municipal policy initiatives, organizational constitutional amendments, and public policy decisions needing total trust.
              </p>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">Independent Observers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
