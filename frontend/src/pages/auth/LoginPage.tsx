import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserCheck, Vote, Building2 } from 'lucide-react';
import BrandMark from '@/components/common/BrandMark';
import { authApi, type DemoAccount } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<DemoAccount[]>([]);
  const navigate = useNavigate();

  // Load available accounts from the backend API
  useEffect(() => {
    authApi
      .getDemoAccounts()
      .then((data) => {
        if (data && data.accounts) {
          setAccounts(data.accounts);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch demo accounts from API:', err);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'validator') {
        navigate('/validator');
      } else if (data.role === 'voter') {
        navigate('/voting');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillAccount = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Left Brand Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <BrandMark className="h-11 w-11 rounded-full shadow-lg shadow-blue-500/20" />
            <div>
              <span className="text-xl font-bold text-white tracking-tight">Zhura · ዝሁራ</span>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Zhura Enterprise</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 py-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20 mb-6">
            Governance-as-a-Service (GaaS)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Trust Infrastructure for <br />
            Digital Governance &amp; Elections
          </h2>
          <p className="mt-4 text-slate-400 text-sm max-w-md leading-relaxed">
            Role-based access control backed by cryptographic verification and independent Civil Society validator nodes.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          Connected to live backend · Token-based authentication
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Sign In to Zhura</h3>
            <p className="text-xs text-slate-400 mt-1">Authenticate via the live backend API</p>
          </div>

          {/* Quick Autofill Cards populated from backend */}
          {accounts.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Available Roles (From API)
              </p>

              {accounts.map((acc) => {
                const Icon =
                  acc.role === 'admin' ? Building2 : acc.role === 'validator' ? UserCheck : Vote;
                const roleBorder =
                  acc.role === 'admin'
                    ? 'hover:border-blue-500 hover:bg-blue-600/10'
                    : acc.role === 'validator'
                      ? 'hover:border-purple-500 hover:bg-purple-600/10'
                      : 'hover:border-emerald-500 hover:bg-emerald-600/10';
                const textColor =
                  acc.role === 'admin'
                    ? 'text-blue-400'
                    : acc.role === 'validator'
                      ? 'text-purple-400'
                      : 'text-emerald-400';

                return (
                  <button
                    key={acc.email}
                    onClick={() => autofillAccount(acc)}
                    className={`w-full flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 ${roleBorder} rounded-2xl transition-all cursor-pointer group text-left`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-slate-800 ${textColor} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-slate-100">{acc.name}</p>
                        <p className="text-[10px] text-slate-400">{acc.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${textColor} group-hover:translate-x-1 transition-transform`}>
                      Autofill →
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <span className="bg-slate-950 px-3">Credentials Form</span>
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
                placeholder="admin@zhura.demo"
                required
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
                  required
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
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            Zhura connects to the live FastAPI backend service on port 8000.
          </p>
        </div>
      </div>
    </div>
  );
}
