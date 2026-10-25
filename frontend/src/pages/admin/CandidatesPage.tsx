import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { candidatesApi, electionsApi, type BackendCandidate } from '@/services/api';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<BackendCandidate[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // New candidate form state
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Board Director');
  const [bio, setBio] = useState('');
  const [organization, setOrganization] = useState('ABC Bank');
  const [qualifications, setQualifications] = useState('');

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const electionsRes = await electionsApi.list();
      const activeElection = electionsRes.elections[0];
      const res = await candidatesApi.list(activeElection?.id);
      setCandidates(res.candidates);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleAddCandidate = async () => {
    if (!name.trim()) return;
    try {
      setAddLoading(true);
      const electionsRes = await electionsApi.list();
      const activeElection = electionsRes.elections[0];

      await candidatesApi.create({
        election_id: activeElection ? activeElection.id : 1,
        name,
        position,
        biography: bio || 'Professional Candidate',
        organization,
        qualifications: qualifications || 'Certified Professional',
        status: 'active',
      });

      setShowAdd(false);
      setName('');
      setBio('');
      setQualifications('');
      loadCandidates();
    } catch (err: any) {
      alert(err.message || 'Error adding candidate');
    } finally {
      setAddLoading(false);
    }
  };

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="text-sm text-slate-500">Live candidate roster from database</p>
        </div>
        <Button onClick={() => setShowAdd(true)} icon={<Plus className="w-4 h-4" />}>
          Add Candidate
        </Button>
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

      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading Candidates from API...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{candidate.name}</h3>
                      <p className="text-xs text-slate-500">{candidate.position}</p>
                    </div>
                  </div>
                  <StatusBadge status={candidate.status as any} />
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{candidate.biography}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-400 w-20 flex-shrink-0">Qualifications</span>
                    <span className="text-xs text-slate-600 truncate">{candidate.qualifications}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-400 w-20 flex-shrink-0">Organization</span>
                    <span className="text-xs text-slate-600">{candidate.organization}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-slate-400 w-20 flex-shrink-0">Tally</span>
                    <span className="text-xs font-bold text-blue-600">
                      {candidate.votes_received} votes ({candidate.vote_percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Add New Candidate</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Candidate Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position / Office"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Organization"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. MBA, CPA"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Biography</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief background..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <Button onClick={handleAddCandidate} disabled={addLoading}>
                {addLoading ? 'Adding...' : 'Save Candidate'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
