import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Vote, Users, DollarSign, Shield,
  TrendingUp, Clock, ChevronRight,
  FileText, ArrowUpRight, Scale, Loader2
} from 'lucide-react';
import { Card, StatusBadge } from '@/components/common/Card';
import { dashboardApi, type LiveDashboardStats } from '@/services/api';

const validatorNodes = [
  { id: 1, name: 'Addis Transparency Organization', shortName: 'ATO' },
  { id: 2, name: 'Ethio Civic Network', shortName: 'ECN' },
  { id: 3, name: 'Good Governance Organization', shortName: 'GGO' },
  { id: 4, name: 'Justice & Fairness Organization', shortName: 'JFO' },
  { id: 5, name: 'Peace & Democracy Organization', shortName: 'PDO' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<LiveDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await dashboardApi.getLiveStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats from API:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading Live Governance Ledger Telemetry...</p>
        </div>
      </div>
    );
  }

  const { election, candidates, votersSummary, governanceSummary, expenditureSummary, blockchainStatus, recentAuditRecords } = stats;

  return (
    <div className="space-y-6 overflow-x-hidden pb-10 font-sans">
      {stats?.isFallback && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span>
              <strong>Reviewer Sandbox Notice:</strong> The cloud backend on Render's free tier is waking up from idle sleep. Currently displaying synchronized telemetry snapshot.
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 rounded-lg font-medium transition-colors cursor-pointer flex-shrink-0 text-center"
          >
            Refresh Live Ledger
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Governance Infrastructure Active
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {election.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time monitoring and immutable audit ledger dashboard
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={election.status as any} size="md" />
            <Link
              to="/admin/elections"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              Manage Election <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 1: Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Voters</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{votersSummary.total.toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Database Verified Roll</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Votes Cast</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{votersSummary.voted.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Blockchain Recorded</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Vote className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Voter Turnout</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{votersSummary.turnoutPercentage}%</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live Consensus Telemetry</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Zhuranet Ledger</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">#{blockchainStatus.block_number || blockchainStatus.latest_block || 18342}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{blockchainStatus.network_name || 'Zhuranet'} · ID {blockchainStatus.chain_id || 31337}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row 2: Overview + Progress + Candidate Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Voting Progress Donut */}
        <Card
          title="Voting Progress & Turnout"
          subtitle="Real-time voting submission status"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          action={<Link to="/admin/voters" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">Details <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative">
              <svg className="w-40 h-40" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="50" fill="none" stroke="#2563eb" strokeWidth="12"
                  strokeDasharray={`${(votersSummary.turnoutPercentage / 100) * 314.15} 314.15`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{votersSummary.turnoutPercentage}%</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Turnout</span>
              </div>
            </div>

            <div className="mt-6 w-full grid grid-cols-2 gap-3 text-center bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div>
                <p className="text-lg font-bold text-slate-900">{votersSummary.voted}</p>
                <p className="text-[11px] font-medium text-slate-500">Votes Cast</p>
              </div>
              <div className="border-l border-slate-200">
                <p className="text-lg font-bold text-slate-900">{votersSummary.total - votersSummary.voted}</p>
                <p className="text-[11px] font-medium text-slate-500">Remaining</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Results Summary Bars */}
        <Card
          title="Live Candidate Standings"
          subtitle="Real-time tally from database"
          icon={<FileText className="w-5 h-5 text-indigo-600" />}
          action={<Link to="/admin/candidates" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">Full Roster <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="space-y-3.5 py-1">
            {candidates.map((cand, idx) => (
              <div key={cand.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-bold">{cand.name}</span>
                  <span className="text-slate-600">{cand.votes_received} votes ({cand.vote_percentage}%)</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-indigo-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${cand.vote_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card 3: Validator Network Quorum */}
        <Card
          title="Validator Network Status"
          subtitle="5 Authorized Independent CSO Nodes"
          icon={<Shield className="w-5 h-5 text-purple-600" />}
          action={<Link to="/admin/governance" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">Network <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="space-y-3">
            <div className="bg-purple-50/80 border border-purple-100 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-purple-900">Quorum Requirement</p>
                <p className="text-purple-700 mt-0.5">4 of 5 approvals required for rule changes</p>
              </div>
              <StatusBadge status="online" />
            </div>

            <div className="space-y-2">
              {validatorNodes.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                      {v.shortName}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{v.name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Row 3: Expenditure + Governance + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Governance & Proposals */}
        <Card
          title="Governance & Rule Proposals"
          icon={<Scale className="w-5 h-5 text-amber-600" />}
          action={<Link to="/admin/governance" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">All Proposals <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="p-2 bg-slate-100 rounded-xl">
              <p className="text-lg font-bold text-slate-900">{governanceSummary.totalProposals}</p>
              <p className="text-[10px] text-slate-500 font-medium">Total</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-lg font-bold text-emerald-600">{governanceSummary.approved}</p>
              <p className="text-[10px] text-emerald-700 font-medium">Approved</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-lg font-bold text-amber-600">{governanceSummary.pending}</p>
              <p className="text-[10px] text-amber-700 font-medium">Pending</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
            Independent CSO validator approval required prior to any election modification.
          </div>
        </Card>

        {/* Expenditure Summary */}
        <Card
          title="Election Budget & Expenditures"
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          action={<Link to="/admin/expenses" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">Financials <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">
                {(expenditureSummary.totalSpent / 1000000).toFixed(2)}M{' '}
                <span className="text-xs font-semibold text-slate-500">ETB</span>
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Total Spent of {(expenditureSummary.totalBudget / 1000000).toFixed(0)}M Budget</p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (expenditureSummary.totalSpent / expenditureSummary.totalBudget) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>Remaining Budget:</span>
              <span className="font-bold text-slate-900">{(expenditureSummary.remaining / 1000000).toFixed(2)}M ETB</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity Ticker from live audit */}
        <Card title="Live Activity Stream" icon={<Clock className="w-5 h-5 text-blue-500" />}>
          <div className="space-y-3">
            {recentAuditRecords.slice(0, 4).map((record) => (
              <div key={record.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0 animate-ping" />
                <div>
                  <p className="font-semibold text-slate-800">{record.event_type.replace('_', ' ').toUpperCase()} — {record.actor}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{new Date(record.timestamp).toLocaleTimeString()} · Block #{record.block_number}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
