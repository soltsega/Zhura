import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
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
      setError('Invalid credentials. Try a demo account below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/10" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">ዝሁራ</span>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Zihura</p>
            </div>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-snug">
            Secure, transparent,<br />independently auditable<br />elections.
          </h2>
          <p className="mt-4 text-slate-400 max-w-md leading-relaxed">
            Governance-as-a-Service platform enabling organizations to conduct elections whose critical records and decisions can be independently verified.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-xs text-slate-500">© 2026 ዝሁrå — Zihura. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ዝሁራ</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">Sign in to your account to continue</p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 text-center">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 text-center">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-600/25 active:scale-[0.98] cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-50 text-slate-500 px-3">Demo Accounts</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {[
                { label: 'Administrator', email: demoAccounts.admin.email, role: 'admin' },
                { label: 'Validator', email: demoAccounts.validator.email, role: 'validator' },
                { label: 'Voter', email: demoAccounts.voter.email, role: 'voter' },
              ].map((account) => (
                <button
                  key={account.email}
                  onClick={() => { setEmail(account.email); setPassword('demo123'); }}
                  className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{account.label}</p>
                    <p className="text-xs text-slate-500">{account.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-blue-600 transition-colors">Auto-fill →</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Password for all demo accounts: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">demo123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
