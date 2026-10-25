import { Link } from 'react-router-dom';
import BrandMark from '@/components/common/BrandMark';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Activity,
  ExternalLink,
  Building2,
  FileText,
  Vote,
  CheckCircle2,
} from 'lucide-react';

type SiteFooterProps = {
  variant?: 'dark' | 'light';
  className?: string;
};

export default function SiteFooter({ variant = 'dark', className = '' }: SiteFooterProps) {
  const isDark = variant === 'dark';

  return (
    <footer
      className={`border-t transition-colors font-sans ${
        isDark
          ? 'border-slate-800/80 bg-slate-950 text-slate-400'
          : 'border-slate-200/90 bg-white text-slate-500 shadow-xs'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Section with Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/50">
          {/* Brand & Mission Statement (Span 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <BrandMark className="h-10 w-10 rounded-full shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Zhuranet
                  </span>
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    Enterprise
                  </span>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-slate-400 font-medium">
                  Digital Governance &amp; Elections
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed max-w-sm text-slate-400">
              Zhuranet is a high-assurance Governance-as-a-Service (GaaS) platform providing tamper-evident,
              independently auditable election infrastructure for financial institutions, universities, cooperatives,
              and public referendums.
            </p>

            {/* Live Infrastructure Telemetry Badge */}
            <div
              className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Consensus Engine:</span>
              <span className="font-semibold text-emerald-400">Zhuranet (100% Operational)</span>
            </div>
          </div>

          {/* Col 2: Platform Consoles */}
          <div className="space-y-3">
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Platform Workspaces
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/admin"
                  className={`hover:text-blue-500 transition-colors flex items-center gap-1.5 ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Election Admin Console</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/validator"
                  className={`hover:text-purple-500 transition-colors flex items-center gap-1.5 ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                  <span>Validator CSO Network</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/voting"
                  className={`hover:text-emerald-500 transition-colors flex items-center gap-1.5 ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Vote className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verifiable Voting Booth</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/portal"
                  className={`hover:text-amber-500 transition-colors flex items-center gap-1.5 ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  <span>Public Transparency Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Solutions */}
          <div className="space-y-3">
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Enterprise Solutions
            </p>
            <ul className="space-y-2 text-xs">
              <li className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Commercial Banks &amp; AGMs
              </li>
              <li className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Universities &amp; Academic Senates
              </li>
              <li className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Agricultural &amp; Credit Unions
              </li>
              <li className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Municipal &amp; Civic Referendums
              </li>
              <li className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Single Transferable Vote (STV)
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verification */}
          <div className="space-y-3">
            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Trust Architecture
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>4/5 Validator Quorum Gate</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                <span>Cryptographic Ballot Privacy</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                <span>Smart Contract Enforcement</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Audited Expenditure Ledgers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Zero-Knowledge Proof Audit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-500">
            <p>© {new Date().getFullYear()} Zhuranet Technologies Inc. All rights reserved.</p>
            <span className="hidden md:inline">·</span>
            <p>Trust in Every Vote · Governance-as-a-Service</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-400 font-medium">
            <Link to="/portal" className="hover:text-blue-500 transition-colors">
              Public Ledger
            </Link>
            <Link to="/admin" className="hover:text-blue-500 transition-colors">
              Administration
            </Link>
            <Link to="/login" className="hover:text-blue-500 transition-colors">
              Secure Sign In
            </Link>
            <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[11px]">
              Zhuranet EVM Enforced
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
