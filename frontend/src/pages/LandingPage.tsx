import { Link } from 'react-router-dom';
import {
  Shield, Eye, Vote, Scale, FileText, Users,
  Building2, GraduationCap, Landmark, Globe, Lock,
  ArrowRight, Star, Zap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">ዝሁራ</span>
              <span className="text-xs text-slate-400 ml-1 hidden sm:inline">Zihura</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">How It Works</a>
              <a href="#use-cases" className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Use Cases</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Log In</Link>
              <Link to="/portal" className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
                Explore Platform <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 mb-6">
              <Zap className="w-3.5 h-3.5" />
              Governance-as-a-Service Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
              Trust in Every Vote.
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Secure, transparent, independently auditable elections and governance infrastructure.
              Transform elections from processes participants are <em>expected</em> to trust into processes whose records can be <em>independently verified</em>.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 text-base w-full sm:w-auto justify-center active:scale-[0.98]">
                Request a Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/portal" className="inline-flex items-center gap-2 bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all text-base w-full sm:w-auto justify-center shadow-sm active:scale-[0.98]">
                Explore Platform
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              { value: '500', label: 'Registered Voters' },
              { value: '372', label: 'Votes Cast' },
              { value: '74.4%', label: 'Turnout' },
              { value: '5', label: 'Validators' },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">The Problem</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Elections require trust. Governance requires accountability.</h2>
            <p className="mt-4 text-slate-600">
              Traditional elections depend on centralized institutions. Concerns around transparency, administrative errors, insider manipulation, and poor auditability erode public confidence.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'Lack of Transparency', desc: 'Critical decisions and records remain opaque to stakeholders and the public.' },
              { title: 'Poor Auditability', desc: 'Difficulty independently verifying rule changes, expenditures, and election records.' },
              { title: 'Public Distrust', desc: 'Even fair elections face skepticism when participants cannot independently verify outcomes.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">How It Works</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Verifiable Governance in 5 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Step 1 - Create */}
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-slate-200" />
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-blue-50 text-blue-600">
                <Building2 className="w-7 h-7" />
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Step 01</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Create</h3>
              <p className="mt-1 text-sm text-slate-600">Set up your election with candidates, voters, and rules.</p>
            </div>
            {/* Step 2 - Verify */}
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-slate-200" />
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-emerald-50 text-emerald-600">
                <Eye className="w-7 h-7" />
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Step 02</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Verify</h3>
              <p className="mt-1 text-sm text-slate-600">Independent validators review and approve governance proposals.</p>
            </div>
            {/* Step 3 - Vote */}
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-slate-200" />
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-violet-50 text-violet-600">
                <Vote className="w-7 h-7" />
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Step 03</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Vote</h3>
              <p className="mt-1 text-sm text-slate-600">Voters cast ballots with privacy-preserving identity verification.</p>
            </div>
            {/* Step 4 - Validate */}
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-slate-200" />
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-amber-50 text-amber-600">
                <Lock className="w-7 h-7" />
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Step 04</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Validate</h3>
              <p className="mt-1 text-sm text-slate-600">Smart contracts enforce rules and prevent unauthorized changes.</p>
            </div>
            {/* Step 5 - Audit */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-rose-50 text-rose-600">
                <FileText className="w-7 h-7" />
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Step 05</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Audit</h3>
              <p className="mt-1 text-sm text-slate-600">Every critical action is recorded on an immutable audit trail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Features</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Built for Trust, Transparency & Security</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Secure Voting */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Secure Voting</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">Privacy-preserving identity verification with double-vote prevention.</p>
            </div>
            {/* Independent Validation */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Independent Validation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">Authorized validator organizations independently verify governance actions.</p>
            </div>
            {/* Governance Automation */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-50 text-violet-600 mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Governance Automation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">Smart contract-enforced quorum requirements prevent unauthorized rule changes.</p>
            </div>
            {/* Transparent Expenditure */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Transparent Expenditure</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">All election spending is publicly tracked with cryptographic document hashes.</p>
            </div>
            {/* Immutable Audit Trail */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Immutable Audit Trail</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">Every critical event is recorded on a tamper-evident blockchain ledger.</p>
            </div>
            {/* Privacy-Preserving Identity */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-50 text-cyan-600 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Privacy-Preserving Identity</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">Voter identities are never publicly linked to ballot choices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Use Cases</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Governance for Every Organization</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Governments', Icon: Landmark },
              { name: 'Banks', Icon: Building2 },
              { name: 'Corporations', Icon: Star },
              { name: 'Universities', Icon: GraduationCap },
              { name: 'Cooperatives', Icon: Users },
              { name: 'Associations', Icon: Globe },
            ].map((uc) => (
              <div key={uc.name} className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                <uc.Icon className="w-8 h-8 text-blue-600 mx-auto" />
                <p className="mt-3 text-sm font-medium text-slate-900">{uc.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Build elections people can verify.</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            ዝሁራ does not sell blockchain. ዝሁራ sells verifiable governance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 w-full sm:w-auto justify-center active:scale-[0.98]">
              Request a Demo <ArrowRight className="w-5 h-5" />
            </Link>              <Link to="/portal" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl border-2 border-white/30 hover:border-white/60 hover:bg-white/20 transition-all w-full sm:w-auto justify-center active:scale-[0.98]">
              Explore Live Election
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-white font-semibold">ዝሁራ</span>
              <span className="text-xs text-slate-500">© 2026 Zihura</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a>
              <a href="#use-cases" className="hover:text-white transition-colors cursor-pointer">Use Cases</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
