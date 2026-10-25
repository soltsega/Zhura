import { useState } from 'react';
import BrandMark from '@/components/common/BrandMark';
import SiteFooter from '@/components/common/SiteFooter';
import RoleNavSwitcher from '@/components/common/RoleNavSwitcher';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Vote, Users, UserCheck, Scale, DollarSign,
  FileText, Shield, Settings, Menu, X,
  Search, ChevronRight, ShieldAlert, Lock
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Elections', path: '/admin/elections', icon: Vote },
  { label: 'Voters', path: '/admin/voters', icon: Users },
  { label: 'Candidates', path: '/admin/candidates', icon: UserCheck },
  { label: 'Governance', path: '/admin/governance', icon: Scale },
  { label: 'Expenses', path: '/admin/expenses', icon: DollarSign },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'Audit Trail', path: '/admin/audit', icon: Shield },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAttackModal, setShowAttackModal] = useState(false);
  const [attackResult, setAttackResult] = useState<'idle' | 'rejected'>('idle');
  const location = useLocation();

  const handleSimulateAttack = () => {
    setAttackResult('idle');
    setShowAttackModal(true);
  };

  const executeUnauthorizedChange = () => {
    setAttackResult('rejected');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 shadow-xl z-20 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <BrandMark className="h-10 w-10 flex-shrink-0 rounded-full shadow-md shadow-blue-500/20" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h1 className="text-white font-bold text-lg tracking-tight">Zhura</h1>
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">v2.0</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Zhura Enterprise</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Security Indicator */}
        {sidebarOpen && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Smart Contract Enforced
            </div>
            <p className="text-[11px] text-slate-400">4/5 Validator Quorum Active</p>
          </div>
        )}

        {/* Sidebar footer */}
        <div className="border-t border-slate-800/80 p-3 bg-slate-950/40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-full py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 z-50 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                    <BrandMark className="h-9 w-9 rounded-full" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">Zhura · ዝሁራ</h1>
                    <p className="text-[10px] text-slate-400 tracking-wider uppercase">Trust in Every Vote</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="py-4 px-3 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = item.path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-1.5 w-72 lg:w-96 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search elections, voters, audit logs..."
                className="ml-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              />
            </div>
          </div>

          {/* Action Header Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Attack Simulation Button */}
            <button
              onClick={handleSimulateAttack}
              className="hidden md:inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-amber-200 transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Simulate Attack
            </button>

            {/* Role Navigation Switcher */}
            <RoleNavSwitcher variant="light" showHome />

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* User Badge */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                A
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Admin User</p>
                <p className="text-[10px] text-slate-500">Election Authority</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50/70">
          <Outlet />
        </main>
        <SiteFooter variant="light" />
      </div>

      {/* Governance Attack Simulation Modal */}
      {showAttackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Governance Security Test</h3>
                  <p className="text-xs text-slate-400">Simulating Unauthorized Administrative Change</p>
                </div>
              </div>
              <button onClick={() => setShowAttackModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                In traditional election software, an administrator can silently alter rules or extend voting windows without oversight.
                In <strong>Zhura / ዝሁራ</strong>, governance rules are enforced by smart contracts on a validator quorum.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between font-medium text-amber-900">
                  <span>Target Action:</span>
                  <span>Directly modify voting end time to 22:00</span>
                </div>
                <div className="flex justify-between font-medium text-amber-900">
                  <span>Bypassing:</span>
                  <span>Validator Quorum Approval Process</span>
                </div>
                <div className="flex justify-between font-medium text-amber-900">
                  <span>Required Quorum:</span>
                  <span className="font-bold">4 of 5 Independent Validators</span>
                </div>
              </div>

              {attackResult === 'rejected' && (
                <div className="bg-red-50 border-2 border-red-500/80 rounded-xl p-4 animate-shake">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500 rounded-lg text-white font-bold flex-shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 text-sm">TRANSACTION REJECTED</h4>
                      <p className="text-xs text-red-700 mt-1 font-mono font-medium">
                        Smart Contract Revert: Unauthorized governance modification.
                      </p>
                      <div className="mt-2 text-[11px] text-red-800 bg-red-100/60 p-2 rounded font-mono">
                        Required: 4/5 validator approvals<br />
                        Current: 0/5 approvals registered
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAttackModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
                {attackResult === 'idle' ? (
                  <button
                    onClick={executeUnauthorizedChange}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer"
                  >
                    Attempt Direct Edit (Bypass Validators)
                  </button>
                ) : (
                  <button
                    onClick={() => setAttackResult('idle')}
                    className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Reset Simulation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
