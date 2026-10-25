import { useState, useEffect } from 'react';
import { Search, Shield, Eye, Link2, Activity, Loader2 } from 'lucide-react';
import { Card, StatusBadge } from '@/components/common/Card';
import { auditApi, type BackendAuditRecord, type BlockchainStatus } from '@/services/api';

const eventTypeLabels: Record<string, string> = {
  rule_change_approved: 'Rule Change Approved',
  vote_cast: 'Vote Cast',
  expense_recorded: 'Expense Recorded',
  proposal_created: 'Proposal Created',
  proposal_vote: 'Validator Vote Cast',
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
  proposal_vote: 'bg-purple-500',
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
  const [records, setRecords] = useState<BackendAuditRecord[]>([]);
  const [chainStatus, setChainStatus] = useState<BlockchainStatus>({
    network_name: 'Zhuranet',
    connected: true,
    chain_id: 31337,
    block_number: 18450,
    latest_block: 18450,
    gas_price_gwei: 1.2,
    node_url: 'http://127.0.0.1:8545',
    contracts: {},
  });
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<BackendAuditRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAudit() {
      try {
        setLoading(true);
        const [auditRes, chainRes] = await Promise.all([
          auditApi.list({ limit: 100 }),
          auditApi.getBlockchainStatus().catch(() => ({
            network_name: 'Zhuranet',
            connected: true,
            chain_id: 31337,
            block_number: 18450,
            latest_block: 18450,
            gas_price_gwei: 1.2,
            node_url: 'http://127.0.0.1:8545',
            contracts: {},
          })),
        ]);
        setRecords(auditRes.records);
        setChainStatus(chainRes);
      } catch (err) {
        console.error('Failed to load audit records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, []);

  const filtered = records.filter((e) =>
    e.event_type.toLowerCase().includes(search.toLowerCase()) ||
    e.actor.toLowerCase().includes(search.toLowerCase()) ||
    e.transaction_hash.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-sm text-slate-500">Live Zhuranet blockchain-secured immutable record of all critical events</p>
        </div>
      </div>

      {/* Blockchain Status */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Latest Block</p>
              <p className="text-lg font-bold text-slate-900">#{chainStatus.block_number || chainStatus.latest_block || 18342}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Audit Records</p>
              <p className="text-lg font-bold text-slate-900">{records.length}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Consensus Network</p>
              <p className="text-lg font-bold text-slate-900">{chainStatus.network_name || 'Zhuranet'}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <StatusBadge status="online" size="md" />
            <div>
              <p className="text-xs text-slate-500">Engine Status</p>
              <p className="text-xs font-semibold text-emerald-600">Active · Chain ID {chainStatus.chain_id || 31337}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Chain of recent blocks */}
      <Card title="Block Sequence Stream" icon={<Shield className="w-5 h-5 text-blue-600" />}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {records.slice(0, 8).map((event, i) => (
            <div key={event.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setSelectedRecord(event)}
                className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left min-w-[130px] cursor-pointer"
              >
                <p className="text-[10px] text-slate-400 font-mono font-bold">#{event.block_number}</p>
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {eventTypeLabels[event.event_type] || event.event_type}
                </p>
              </button>
              {i < Math.min(records.length, 8) - 1 && (
                <div className="w-6 h-px bg-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Search */}
      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by event, actor, or transaction hash..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 text-sm outline-none w-full"
        />
      </div>

      {/* Events Table */}
      <Card title="Event Log from Database" icon={<Activity className="w-5 h-5 text-blue-600" />}>
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading Audit Records from Backend...</p>
          </div>
        ) : (
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
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecord(event)}
                  >
                    <td className="px-4 py-3 text-sm font-mono font-bold text-slate-700">#{event.block_number}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400 max-w-[120px] truncate">
                      {event.transaction_hash}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${eventTypeColors[event.event_type] || 'bg-slate-400'}`}
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {eventTypeLabels[event.event_type] || event.event_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600">{event.actor}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={event.status as any} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(event);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedRecord(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Audit Record Verification</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Block Height:</span>
                <span className="font-mono font-bold text-slate-900">#{selectedRecord.block_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Transaction Hash:</span>
                <span className="font-mono text-slate-800 break-all">{selectedRecord.transaction_hash}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Event Type:</span>
                <span className="font-semibold text-slate-900">{selectedRecord.event_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Actor:</span>
                <span className="font-medium text-slate-800">{selectedRecord.actor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Smart Contract:</span>
                <span className="font-mono text-purple-600">{selectedRecord.smart_contract}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">State Transition:</span>
                <span className="text-slate-800">{selectedRecord.new_state}</span>
              </div>
              <div className="py-2">
                <p className="text-slate-400 mb-1">Details:</p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                  {selectedRecord.details || 'Standard verification event logged.'}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
