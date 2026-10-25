import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { electionsApi, type BackendElection } from '@/services/api';

export default function ElectionsPage() {
  const [elections, setElections] = useState<BackendElection[]>([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  // New election form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Board Election');
  const [newSeats, setNewSeats] = useState(5);
  const [newDesc, setNewDesc] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newMethod, setNewMethod] = useState('Single Transferable Vote');
  const [newRules, setNewRules] = useState('');

  const loadElections = async () => {
    try {
      setLoading(true);
      const res = await electionsApi.list();
      setElections(res.elections);
    } catch (err) {
      console.error('Failed to load elections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      setCreateLoading(true);
      const now = new Date();
      const oneWeekLater = new Date(Date.now() + 7 * 86400000);

      await electionsApi.create({
        name: newName,
        election_type: newType,
        seats: Number(newSeats) || 1,
        description: newDesc || 'Standard Election',
        start_date: newStartDate ? new Date(newStartDate).toISOString() : now.toISOString(),
        end_date: newEndDate ? new Date(newEndDate).toISOString() : oneWeekLater.toISOString(),
        voting_method: newMethod,
        eligibility_rules: newRules || 'All registered voters',
        status: 'draft',
      });

      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      loadElections();
    } catch (err: any) {
      alert(err.message || 'Error creating election');
    } finally {
      setCreateLoading(false);
    }
  };

  const filtered = elections.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.election_type && e.election_type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Elections</h1>
          <p className="text-sm text-slate-500">Live election management powered by the backend API</p>
        </div>
        <Button onClick={() => setShowCreate(true)} icon={<Plus className="w-4 h-4" />}>
          Create Election
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search elections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 text-sm outline-none w-full"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading elections from API...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Election</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Dates</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Voters</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Turnout</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((election) => {
                  const voters = election.total_voters || 0;
                  const votes = election.votes_cast || 0;
                  const turnout = voters > 0 ? ((votes / voters) * 100).toFixed(1) : '0';

                  return (
                    <tr key={election.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm text-slate-900">{election.name}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{election.description}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {election.election_type}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={election.status as any} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 hidden md:table-cell">
                        <div>{new Date(election.start_date).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400">to {new Date(election.end_date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium hidden lg:table-cell">
                        {voters.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, Number(turnout))}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{turnout}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Election Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Create New Election via API</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Election Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Commercial Bank Board 2026"
                  className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Election Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                  >
                    <option>Board Election</option>
                    <option>National Election</option>
                    <option>Local Election</option>
                    <option>University Election</option>
                    <option>Cooperative Election</option>
                    <option>Referendum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Seats</label>
                  <input
                    type="number"
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none resize-none transition-all"
                  placeholder="Describe the election purpose..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Voting Method</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option>Single Transferable Vote</option>
                  <option>First Past the Post</option>
                  <option>Ranked Choice</option>
                  <option>Simple Majority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Eligibility Rules</label>
                <textarea
                  rows={2}
                  value={newRules}
                  onChange={(e) => setNewRules(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none resize-none transition-all"
                  placeholder="Who is eligible to participate..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button onClick={handleCreate} disabled={createLoading}>
                {createLoading ? 'Creating on Backend...' : 'Create Election'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
