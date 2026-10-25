import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { votersApi, electionsApi, type BackendVoter, type VoterListResponse } from '@/services/api';

export default function VotersPage() {
  const [data, setData] = useState<VoterListResponse>({
    voters: [],
    total: 0,
    voted_count: 0,
    not_voted_count: 0,
  });
  const [search, setSearch] = useState('');
  const [filterVoted, setFilterVoted] = useState<'all' | 'voted' | 'not_voted'>('all');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [voterId, setVoterId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eligibility, setEligibility] = useState('Registered Shareholder');

  const loadVoters = async () => {
    try {
      setLoading(true);
      const hasVotedParam = filterVoted === 'voted' ? true : filterVoted === 'not_voted' ? false : undefined;
      const res = await votersApi.list({
        search: search || undefined,
        has_voted: hasVotedParam,
        limit: 100,
      });
      setData(res);
    } catch (err) {
      console.error('Failed to load voters from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoters();
  }, [filterVoted]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadVoters();
  };

  const handleAddVoter = async () => {
    if (!voterId.trim() || !name.trim()) return;
    try {
      setAddLoading(true);
      const electionsRes = await electionsApi.list();
      const activeElection = electionsRes.elections[0];

      await votersApi.create({
        election_id: activeElection ? activeElection.id : 1,
        voter_id: voterId.trim().toUpperCase(),
        name,
        email: email || `${voterId.toLowerCase()}@zhuranet.org`,
        eligibility,
        status: 'eligible',
        has_voted: false,
      });

      setShowAdd(false);
      setVoterId('');
      setName('');
      setEmail('');
      loadVoters();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating voter');
    } finally {
      setAddLoading(false);
    }
  };

  const { voters, total, voted_count, not_voted_count } = data;
  const turnout = total > 0 ? ((voted_count / total) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voters</h1>
          <p className="text-sm text-slate-500">
            {total} registered voters · {voted_count} voted · {not_voted_count} pending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAdd(true)} icon={<Plus className="w-4 h-4" />}>
            Add Voter
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Total Registered</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{voted_count.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Voted</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-600">{not_voted_count.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Not Voted</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{turnout}%</p>
          <p className="text-xs text-slate-500">Turnout</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Voter ID or Name (Press Enter)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 text-sm outline-none w-full"
          />
        </form>

        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs font-semibold">
          <button
            onClick={() => setFilterVoted('all')}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              filterVoted === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterVoted('voted')}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              filterVoted === 'voted' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Voted
          </button>
          <button
            onClick={() => setFilterVoted('not_voted')}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              filterVoted === 'not_voted' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading voters from API...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Voter ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Eligibility</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Voting Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {voters.map((voter) => (
                  <tr key={voter.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-xs text-blue-600">
                      {voter.voter_id}
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold text-slate-800">
                      {voter.name}
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-500">
                      {voter.email}
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-600">
                      {voter.eligibility}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={voter.status as any} />
                    </td>
                    <td className="px-6 py-3">
                      {voter.has_voted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Voted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Voter Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Register New Voter</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Voter ID (Credential)</label>
              <input
                type="text"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                placeholder="e.g. VTR-0501"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Legal Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voter@zhuranet.org"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility</label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <Button onClick={handleAddVoter} disabled={addLoading}>
                {addLoading ? 'Saving...' : 'Add Voter'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
