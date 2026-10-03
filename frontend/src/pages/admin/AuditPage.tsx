import { useState } from 'react';
import { Search, Shield, ExternalLink, Eye, Link2, Activity } from 'lucide-react';
import { Card, StatusBadge } from '@/components/common/Card';
import { auditEvents, blockchainStatus } from '@/data/mockData';
import type { AuditEvent } from '@/types';

const eventTypeLabels: Record<string, string> = {
  rule_change_approved: 'Rule Change Approved',
  vote_cast: 'Vote Cast',
  expense_recorded: 'Expense Recorded',
  proposal_created: 'Proposal Created',
  proposal_approved: 'Proposal Approved',
  proposal_rejected: 'Proposal Rejected',
  election_created: 'Election Created',
  election_opened: 'Election Opened',
  election_closed: 'Election Closed',
  candidate_registered: 'Candidate Registered',
  voter_registered: 'Voter Registered',
  results_finalized: 'Results Finalized',
};

const eventTypeColors: Record<string, string> = {
  rule_change_approved: 'bg-emerald-500',
  vote_cast: 'bg-blue-500',
  expense_recorded: 'bg-amber-500',
  proposal_created: 'bg-violet-500',
  proposal_approved: 'bg-emerald-500',
  proposal_rejected: 'bg-red-500',
  election_created: 'bg-blue-500',
  election_opened: 'bg-emerald-500',
  election_closed: 'bg-slate-500',
  candidate_registered: 'bg-cyan-500',
  voter_registered: 'bg-teal-500',
  results_finalized: 'bg-indigo-500',
};

export default function AuditPage() {
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const filtered = auditEvents.filter((e) =>
    e.eventType.toLowerCase().includes(search.toLowerCase()) ||
    e.actor.toLowerCase().includes(search.toLowerCase()) ||
    e.transactionHash.toLowerCase().includes(search.toLowerCase())
  );

  const timeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-sm text-slate-500">Blockchain-secured immutable record of all critical events</p>
        </div>
      </div>

      {/* Blockchain Status */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><Activity className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-xs text-slate-500">Latest Block</p>
              <p className="text-lg font-bold text-slate-900">#{blockchainStatus.latestBlock}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Link2 className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-slate-500">Total Transactions</p>
              <p className="text-lg font-bold text-slate-900">{blockchainStatus.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center"><Shield className="w-5 h-5 text-violet-600" /></div>
            <div>
              <p className="text-xs text-slate-500">Chain ID</p>
              <p className="text-lg font-bold text-slate-900">{blockchainStatus.chainId}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={blockchainStatus.networkStatus} size="md" />
            <div>
              <p className="text-xs text-slate-500">Network Status</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Chain */}
      <Card title="Blockchain History" icon={<Shield className="w-5 h-5" />}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {auditEvents.slice(0, 8).reverse().map((event, i) => (
            <div key={event.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setSelectedEvent(event)}
                className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left min-w-[120px]"
              >
                <p className="text-[10px] text-slate-400 font-mono">#{event.blockNumber}</p>
                <p className="text-xs font-medium text-slate-700 truncate">{eventTypeLabels[event.eventType]}</p>
              </button>
              {i < auditEvents.length - 1 && (
                <div className="w-6 h-px bg-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Search */}
      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search events, actors, transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="ml-2 text-sm outline-none w-full" />
      </div>

      {/* Events Table */}
      <Card title="Event Log" icon={<Activity className="w-5 h-5" />}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Block</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Transaction</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Event</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2 hidden md:table-cell">Actor</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Timestamp</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">#{event.blockNumber}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400 max-w-[100px] truncate">{event.transactionHash}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${eventTypeColors[event.eventType] || 'bg-slate-400'}`} />
                      <span className="text-xs font-medium text-slate-700">{eventTypeLabels[event.eventType]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600">{event.actor}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(event.timestamp)}</td>
                  <td className="px-4 py-3"><StatusBadge status={event.status} /></td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedEvent(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Transaction Details</h2>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Transaction Hash</p>
                  <p className="text-sm font-mono text-slate-900 mt-1">{selectedEvent.transactionHash}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Block Number</p>
                  <p className="text-sm font-mono text-slate-900 mt-1">#{selectedEvent.blockNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Timestamp</p>
                  <p className="text-sm text-slate-900 mt-1">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Event Type</p>
                  <p className="text-sm text-slate-900 mt-1">{eventTypeLabels[selectedEvent.eventType]}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Actor</p>
                  <p className="text-sm text-slate-900 mt-1">{selectedEvent.actor}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <div className="mt-1"><StatusBadge status={selectedEvent.status} size="md" /></div>
                </div>
              </div>
              {selectedEvent.details && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Event Details</p>
                  <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedEvent.details, null, 2)}</pre>
                  </div>
                </div>
              )}
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Smart Contract</p>
                <p className="text-xs font-mono text-slate-600 mt-1">0x742d35Cc6634C0532925a3b844Bc9e7595f2bD78</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
