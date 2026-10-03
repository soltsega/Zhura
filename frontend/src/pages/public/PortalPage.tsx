import { useState } from 'react';
import { Shield, Vote, Users, TrendingUp, Eye, Scale, DollarSign, FileText, Activity, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { StatusBadge, Card } from '@/components/common/Card';
import { demoElection, candidates, proposals, expenses, validators, auditEvents, blockchainStatus } from '@/data/mockData';

type Tab = 'results' | 'governance' | 'expenses' | 'audit' | 'info';

const categoryLabels: Record<string, string> = {
  polling_workers: 'Polling Workers', observers: 'Observers', logistics: 'Logistics',
  equipment: 'Equipment', training: 'Training', administration: 'Administration', transportation: 'Transportation',
};

const eventTypeLabels: Record<string, string> = {
  rule_change_approved: 'Rule Change Approved', vote_cast: 'Vote Cast', expense_recorded: 'Expense Recorded',
  proposal_created: 'Proposal Created', election_opened: 'Election Opened', voter_registered: 'Voter Registered',
};

export default function PublicPortal() {
  const [activeTab, setActiveTab] = useState<Tab>('results');
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = Object.entries(
    expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>)
  ).map(([key, value]) => ({ name: categoryLabels[key] || key, value, color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#ec4899'][Object.keys(categoryLabels).indexOf(key)] || '#64748b' }));

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'results', label: 'Results', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'governance', label: 'Governance', icon: <Scale className="w-4 h-4" /> },
    { key: 'expenses', label: 'Expenses', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'audit', label: 'Audit Trail', icon: <FileText className="w-4 h-4" /> },
    { key: 'info', label: 'Election Info', icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">ዝሁራ</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Zihura — Public Transparency Portal</p>
            </div>
          </div>            <a href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">Admin Login</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-5 sm:p-8 text-white mb-8">
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={demoElection.status} size="md" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{demoElection.name}</h2>
          <p className="text-blue-200 mt-1">Transparent. Verifiable. Trusted by All.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Registered Voters', value: '500', icon: Users },
              { label: 'Votes Cast', value: '372', icon: Vote },
              { label: 'Turnout', value: '74.4%', icon: TrendingUp },
              { label: 'Validators', value: '5', icon: Shield },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm min-w-0">
                <stat.icon className="w-5 h-5 text-blue-300 mb-2" />
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-blue-200 truncate">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <Card title="Election Results" icon={<TrendingUp className="w-5 h-5" />}>
              <div className="space-y-3">
                {candidates.map((cand) => (
                  <div key={cand.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{cand.name}</span>
                      <span className="text-sm text-slate-600">{cand.votesReceived} votes ({cand.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${cand.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                <div><p className="text-lg font-bold text-slate-900">372</p><p className="text-xs text-slate-500">Total Votes</p></div>
                <div><p className="text-lg font-bold text-slate-900">74.4%</p><p className="text-xs text-slate-500">Turnout</p></div>
                <div><p className="text-lg font-bold text-slate-900">0</p><p className="text-xs text-slate-500">Invalid Ballots</p></div>
              </div>
            </Card>
          </div>
        )}

        {/* Governance Tab */}
        {activeTab === 'governance' && (
          <div className="space-y-4">
            <Card title="Governance Proposals" subtitle={`${proposals.length} total proposals`} icon={<Scale className="w-5 h-5" />}>
              <div className="space-y-4">
                {proposals.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">{p.proposalNumber}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1">{p.title}</h4>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{p.approvals}/{p.totalValidators}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{p.description}</p>
                    <div className="flex items-center gap-1">
                      {p.validatorVotes.map((v) => (
                        <span key={v.validatorId} className={`w-6 h-6 rounded-full text-[8px] font-bold flex items-center justify-center ${
                          v.decision === 'approve' ? 'bg-emerald-100 text-emerald-700' :
                          v.decision === 'reject' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'
                        }`} title={`${v.validatorName}: ${v.decision || 'pending'}`}>
                          {v.validatorName.split(' ')[0][0]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <Card title="Expenditure Summary" icon={<DollarSign className="w-5 h-5" />}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={80} strokeWidth={0}>
                        {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-slate-900">7.84M <span className="text-lg font-normal text-slate-500">ETB</span></p>
                  <p className="text-sm text-slate-500 mb-4">Total Spent</p>
                  <div className="space-y-2">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-slate-600 flex-1">{cat.name}</span>
                        <span className="text-sm font-semibold text-slate-900">{(cat.value / 1000000).toFixed(1)}M ETB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="!p-4">
                <p className="text-xs text-slate-500">Latest Block</p>
                <p className="text-xl font-bold text-slate-900">#{blockchainStatus.latestBlock}</p>
              </Card>
              <Card className="!p-4">
                <p className="text-xs text-slate-500">Total Records</p>
                <p className="text-xl font-bold text-slate-900">{blockchainStatus.totalTransactions.toLocaleString()}</p>
              </Card>
            </div>
            <Card title="Audit Trail" icon={<FileText className="w-5 h-5" />}>
              <div className="space-y-3">
                {auditEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-mono text-slate-400 w-16">#{event.blockNumber}</span>
                    <span className="text-xs font-medium text-slate-700 flex-1">{eventTypeLabels[event.eventType] || event.eventType}</span>
                    <span className="text-xs text-slate-500">{event.actor}</span>
                    <StatusBadge status={event.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <Card title="Election Information" icon={<Eye className="w-5 h-5" />}>
              <div className="space-y-3">
                {[
                  { label: 'Election Name', value: demoElection.name },
                  { label: 'Type', value: demoElection.type },
                  { label: 'Status', value: demoElection.status },
                  { label: 'Start Date', value: new Date(demoElection.startDate).toLocaleString() },
                  { label: 'End Date', value: new Date(demoElection.endDate).toLocaleString() },
                  { label: 'Seats', value: String(demoElection.seats) },
                  { label: 'Voting Method', value: demoElection.votingMethod },
                  { label: 'Eligibility', value: demoElection.eligibilityRules },
                  { label: 'Total Voters', value: String(demoElection.registeredVoters) },
                  { label: 'Votes Cast', value: String(demoElection.votesCast) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-medium text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Independent Validators" icon={<Shield className="w-5 h-5" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {validators.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">{v.shortName}</span>
                    <div>
                      <p className="text-xs font-medium text-slate-900">{v.name}</p>
                      <StatusBadge status={v.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-white font-semibold text-sm">ዝሁራ</span>
          </div>
          <p className="text-xs">ዝሁራ does not sell blockchain. ዝሁrå sells verifiable governance.</p>
          <p className="text-xs text-slate-600 mt-1">© 2026 ዝሁrå — Zihura. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
