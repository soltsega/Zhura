import { Link } from 'react-router-dom';
import {
  Vote, Users, UserCheck, Scale, DollarSign, Shield,
  TrendingUp, Clock, ChevronRight, Activity, Plus,
  FileText, Zap,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, StatusBadge } from '@/components/common/Card';
import { dashboardStats } from '@/data/mockData';

export default function DashboardPage() {
  const stats = dashboardStats;
  const { election, votingProgress, resultsSummary, governanceSummary, expenditureSummary, validatorNetwork, auditTrail, recentActivity } = stats;

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin User</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with {election.name}.</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={election.status} size="md" />
        </div>
      </div>

      {/* Row 1: Election Overview + Voting Progress + Results Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Election Overview */}
        <Card
          title="Election Overview"
          subtitle={election.name}
          icon={<Vote className="w-5 h-5" />}
          action={<Link to="/admin/elections" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">View Full Overview <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="space-y-3">
            {[
              { label: 'Registered Voters', value: votingProgress.totalVoters },
              { label: 'Votes Cast', value: votingProgress.votesCast },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Turnout</span>
              <span className="font-semibold text-emerald-600">{votingProgress.turnout}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Days Remaining</span>
              <span className="font-semibold text-blue-600">{votingProgress.daysRemaining}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Validators Online</span>
              <span className="font-semibold text-emerald-600">{validatorNetwork.activeValidators}/{validatorNetwork.totalValidators}</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Voting Progress */}
        <Card
          title="Voting Progress"
          icon={<TrendingUp className="w-5 h-5" />}
          action={<Link to="/admin/voters" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">View Voting Details <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-36 h-36" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="#3b82f6" strokeWidth="12"
                  strokeDasharray={`${(votingProgress.turnout / 100) * 326.7} 326.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{votingProgress.turnout}%</span>
                <span className="text-xs text-slate-500">Turnout</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-slate-900">{votingProgress.votesCast}</p>
              <p className="text-xs text-slate-500">Votes Cast</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <p className="text-lg font-bold text-slate-900">{votingProgress.totalVoters}</p>
              <p className="text-xs text-slate-500">Total Voters</p>
            </div>
          </div>
        </Card>

        {/* Card 3: Results Summary */}
        <Card
          title="Results Summary"
          icon={<FileText className="w-5 h-5" />}
          action={<Link to="/admin/elections" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">View Full Results <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="space-y-2.5">
            {resultsSummary.map((cand) => (
              <div key={cand.id} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-700 w-20 truncate">{cand.name}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cand.percentage}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-900 w-10 text-right">{cand.votesReceived}</span>
                <span className="text-xs text-slate-500 w-10 text-right">{cand.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Governance + Expenditure + Validator Network */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 4: Governance & Proposals */}
        <Card
          title="Governance & Proposals"
          icon={<Scale className="w-5 h-5" />}
          action={<Link to="/admin/governance" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">View All Proposals <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-lg font-bold text-slate-900">{governanceSummary.totalProposals}</p>
              <p className="text-[10px] text-slate-500">Total</p>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-lg">
              <p className="text-lg font-bold text-emerald-600">{governanceSummary.approved}</p>
              <p className="text-[10px] text-emerald-600">Approved</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <p className="text-lg font-bold text-red-600">{governanceSummary.rejected}</p>
              <p className="text-[10px] text-red-600">Rejected</p>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-lg">
              <p className="text-lg font-bold text-amber-600">{governanceSummary.pending}</p>
              <p className="text-[10px] text-amber-600">Pending</p>
            </div>
          </div>
          {governanceSummary.latestProposal && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-900 min-w-0 truncate">{governanceSummary.latestProposal.proposalNumber} {governanceSummary.latestProposal.title}</span>
                <span className="flex-shrink-0"><StatusBadge status={governanceSummary.latestProposal.status} /></span>
              </div>
              <p className="text-[11px] text-slate-500">
                Quorum: {governanceSummary.latestProposal.requiredQuorum}/{governanceSummary.latestProposal.totalValidators}
                · Approved: {governanceSummary.latestProposal.approvals}/{governanceSummary.latestProposal.totalValidators}
              </p>
            </div>
          )}
        </Card>

        {/* Card 5: Expenditure Summary */}
        <Card
          title="Expenditure Summary"
          icon={<DollarSign className="w-5 h-5" />}
          action={<Link to="/admin/expenses" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">View Expense Details <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenditureSummary.categories} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={28} outerRadius={48} strokeWidth={0}>
                    {expenditureSummary.categories.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">7.84M <span className="text-sm font-normal text-slate-500">ETB</span></p>
              <p className="text-xs text-slate-500 mt-1">Total Spent</p>
              <div className="mt-3 space-y-1">
                {expenditureSummary.categories.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600 truncate">{cat.name}</span>
                    <span className="text-slate-400 ml-auto">{(cat.amount / 1000000).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Card 6: Validator Network */}
        <Card
          title="Validator Network"
          icon={<Shield className="w-5 h-5" />}
          action={<Link to="/admin/governance" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">View Network Details <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900">{validatorNetwork.activeValidators}/{validatorNetwork.totalValidators}</p>
              <p className="text-[10px] text-slate-500">Active Validators</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900">{validatorNetwork.requiredQuorum}</p>
              <p className="text-[10px] text-slate-500">Quorum Required</p>
            </div>
            <div className="text-center">
              <StatusBadge status={validatorNetwork.networkStatus} />
              <p className="text-[10px] text-slate-500 mt-1">Network Status</p>
            </div>
          </div>
          <div className="space-y-2">
            {validatorNetwork.validators.map((v) => (
              <div key={v.id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">{v.shortName}</span>
                  <span className="text-xs text-slate-700 truncate max-w-[140px]">{v.name}</span>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Audit Trail + Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 7: Audit Trail */}
        <Card
          title="Audit Trail"
          icon={<Shield className="w-5 h-5" />}
          action={<Link to="/admin/audit" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer">View Audit Trail <ChevronRight className="w-3.5 h-3.5" /></Link>}
        >
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-slate-900">{auditTrail.totalRecords.toLocaleString()}</p>
            <p className="text-sm text-slate-500 mt-1">Total Records on Chain</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-600">Latest Block</span>
              <span className="text-xs font-bold text-slate-900">#{auditTrail.latestBlock}</span>
            </div>
          </div>
        </Card>

        {/* Card 8: Recent Activity */}
        <Card title="Recent Activity" icon={<Clock className="w-5 h-5" />}>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  activity.type === 'governance' ? 'bg-violet-500' :
                  activity.type === 'voting' ? 'bg-blue-500' :
                  activity.type === 'expense' ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{activity.message}</p>
                  <p className="text-xs text-slate-400">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card 9: Quick Actions */}
        <Card title="Quick Actions" icon={<Zap className="w-5 h-5" />}>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/elections" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group cursor-pointer">
              <Plus className="w-6 h-6 text-blue-500 group-hover:text-blue-600" />
              <span className="text-xs font-medium text-slate-700">Create Election</span>
            </Link>
            <Link to="/admin/voters" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group cursor-pointer">
              <Users className="w-6 h-6 text-emerald-500 group-hover:text-emerald-600" />
              <span className="text-xs font-medium text-slate-700">Add Voter</span>
            </Link>
            <Link to="/admin/governance" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all group cursor-pointer">
              <FileText className="w-6 h-6 text-violet-500 group-hover:text-violet-600" />
              <span className="text-xs font-medium text-slate-700">New Proposal</span>
            </Link>
            <Link to="/admin/expenses" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all group cursor-pointer">
              <DollarSign className="w-6 h-6 text-amber-500 group-hover:text-amber-600" />
              <span className="text-xs font-medium text-slate-700">Record Expense</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
