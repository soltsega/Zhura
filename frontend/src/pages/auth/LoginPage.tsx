import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight, UserCheck, Scale, Vote, Lock } from 'lucide-react';
import { demoAccounts } from '@/data/mockData';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === demoAccounts.admin.email && password === demoAccounts.admin.password) {
      navigate('/admin');
    } else if (email === demoAccounts.validator.email && password === demoAccounts.validator.password) {
      navigate('/validator');
    } else if (email === demoAccounts.voter.email && password === demoAccounts.voter.password) {
      navigate('/voting');
    } else {
      setError('Invalid credentials. Select one of the demo role cards below.');
    }
  };

  const autofillRole = (role: 'admin' | 'validator' | 'voter') => {
    if (role === 'admin') {
      setEmail(demoAccounts.admin.email);
      setPassword(demoAccounts.admin.password);
    } else if (role === 'validator') {
      setEmail(demoAccounts.validator.email);
      setPassword(demoAccounts.validator.password);
    } else if (role === 'voter') {
      setEmail(demoAccounts.voter.email);
      setPassword(demoAccounts.voter.password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Left Brand Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">ዝሁራ</span>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">VeriVote Enterprise</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 py-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20 mb-6">
            Governance-as-a-Service (GaaS)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Verifiable Digital Elections & Governance.
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-md">
            Enter your credentials or select a pre-configured role profile to explore the administrator console, validator network, or voter booth.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 ዝሁራ Trust Infrastructure.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Sign in to VeriVote</h1>
            <p className="text-xs text-slate-400 mt-1">Select a demo role or enter your credentials</p>
          </div>

          {/* 1-Click Demo Accounts Quick Cards */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-1">1-Click Demo Profiles</p>
            <button
              onClick={() => { autofillRole('admin'); navigate('/admin'); }}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-600/10 rounded-2xl transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-blue-300">Election Administrator</p>
                  <p className="text-[10px] text-slate-400">{demoAccounts.admin.email}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">Launch →</span>
            </button>

            <button
              onClick={() => { autofillRole('validator'); navigate('/validator'); }}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 hover:border-purple-500 hover:bg-purple-600/10 rounded-2xl transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-purple-300">CSO Validator Node</p>
                  <p className="text-[10px] text-slate-400">{demoAccounts.validator.email}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">Launch →</span>
            </button>

            <button
              onClick={() => { autofillRole('voter'); navigate('/voting'); }}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-600/10 rounded-2xl transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <Vote className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300">Voter Voting Booth</p>
                  <p className="text-[10px] text-slate-400">{demoAccounts.voter.email}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">Launch →</span>
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <span className="bg-slate-950 px-3">Or Standard Sign In</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@verivote.et"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
