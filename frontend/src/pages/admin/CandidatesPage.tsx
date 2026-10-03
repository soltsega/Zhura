import { useState } from 'react';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import { StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { candidates } from '@/data/mockData';

export default function CandidatesPage() {
  const [search, setSearch] = useState('');

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="text-sm text-slate-500">{candidates.length} candidates for ABC Bank Board Election 2026</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Add Candidate</Button>
      </div>

      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 text-sm outline-none w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                    {candidate.name.charAt(candidate.name.length - 1)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{candidate.name}</h3>
                    <p className="text-xs text-slate-500">{candidate.position}</p>
                  </div>
                </div>
                <StatusBadge status={candidate.status} />
              </div>
              <p className="text-sm text-slate-600 mb-3">{candidate.biography}</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-slate-400 w-20 flex-shrink-0">Qualifications</span>
                  <span className="text-xs text-slate-600">{candidate.qualifications}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-slate-400 w-20 flex-shrink-0">Organization</span>
                  <span className="text-xs text-slate-600">{candidate.organization}</span>
                </div>
              </div>
              {candidate.votesReceived !== undefined && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Votes Received</span>
                    <span className="text-sm font-bold text-slate-900">{candidate.votesReceived} ({candidate.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${candidate.percentage}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-1">
              <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
              <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
