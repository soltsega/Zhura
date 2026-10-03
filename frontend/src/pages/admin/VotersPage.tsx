import { useState } from 'react';
import { Plus, Search, Filter, Upload, Download } from 'lucide-react';
import { StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { voters } from '@/data/mockData';

export default function VotersPage() {
  const [search, setSearch] = useState('');
  const [filterVoted, setFilterVoted] = useState<'all' | 'voted' | 'not_voted'>('all');

  const filtered = voters.filter((v) => {
    const matchesSearch = v.voterId.toLowerCase().includes(search.toLowerCase()) || v.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterVoted === 'all' || v.votingStatus === filterVoted;
    return matchesSearch && matchesFilter;
  });

  const votedCount = voters.filter((v) => v.votingStatus === 'voted').length;
  const notVotedCount = voters.filter((v) => v.votingStatus === 'not_voted').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voters</h1>
          <p className="text-sm text-slate-500">
            {voters.length} registered voters · {votedCount} voted · {notVotedCount} pending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<Upload className="w-4 h-4" />}>Import</Button>
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button icon={<Plus className="w-4 h-4" />}>Add Voter</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{voters.length}</p>
          <p className="text-xs text-slate-500">Total Registered</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{votedCount}</p>
          <p className="text-xs text-slate-500">Voted</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-600">{notVotedCount}</p>
          <p className="text-xs text-slate-500">Not Voted</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{((votedCount / voters.length) * 100).toFixed(1)}%</p>
          <p className="text-xs text-slate-500">Turnout</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Voter ID or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 text-sm outline-none w-full"
          />
        </div>
        <div className="flex bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
          {(['all', 'voted', 'not_voted'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterVoted(f)}
              className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                filterVoted === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'All' : f === 'voted' ? 'Voted' : 'Not Voted'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Voter ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Registration</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Eligibility</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Voting Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((voter) => (
                <tr key={voter.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-sm font-medium text-slate-900">{voter.voterId}</span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-700">{voter.name}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={voter.registrationStatus} /></td>
                  <td className="px-6 py-3.5 hidden md:table-cell text-sm text-slate-600">{voter.eligibility}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={voter.votingStatus === 'voted' ? 'voted' : 'not_voted'} />
                  </td>
                  <td className="px-6 py-3.5 hidden lg:table-cell text-sm text-slate-600">{voter.registrationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {voters.length} voters</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">Previous</button>
            <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg cursor-pointer">1</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
