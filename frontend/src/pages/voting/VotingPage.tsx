import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, AlertTriangle, Copy, Check, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import BrandMark from '@/components/common/BrandMark';
import SiteFooter from '@/components/common/SiteFooter';
import RoleNavSwitcher from '@/components/common/RoleNavSwitcher';
import {
  electionsApi,
  candidatesApi,
  votesApi,
  type BackendElection,
  type BackendCandidate,
} from '@/services/api';

type Step = 'verify' | 'select' | 'confirm' | 'success' | 'duplicate';

export default function VotingPage() {
  const [step, setStep] = useState<Step>('verify');
  const [election, setElection] = useState<BackendElection | null>(null);
  const [candidates, setCandidates] = useState<BackendCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [voterId, setVoterId] = useState('VTR-0001');
  const [ballotRef, setBallotRef] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Load election and candidates from live API
  useEffect(() => {
    async function loadData() {
      try {
        setPageLoading(true);
        const electionsRes = await electionsApi.list();
        const active = electionsRes.elections[0];
        if (active) {
          setElection(active);
          const candRes = await candidatesApi.list(active.id);
          setCandidates(candRes.candidates);
        }
      } catch (err: any) {
        console.error('Failed to load election data:', err);
        setErrorMsg('Failed to connect to voting service API.');
      } finally {
        setPageLoading(false);
      }
    }
    loadData();
  }, []);

  const handleVerify = async () => {
    if (!voterId.trim() || !election) return;
    setErrorMsg('');
    setLoading(true);

    try {
      // Check status with backend
      const statusRes = await votesApi.getStatus(voterId.trim().toUpperCase(), election.id);
      if (statusRes.has_voted) {
        if (statusRes.ballot_reference) setBallotRef(statusRes.ballot_reference);
        setStep('duplicate');
      } else {
        setStep('select');
      }
    } catch (err: any) {
      // If 404 (voter not registered), inform user
      setErrorMsg(err.message || 'Verification failed. Please check voter ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedCandidate || !election) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await votesApi.cast({
        election_id: election.id,
        candidate_id: selectedCandidate,
        voter_id: voterId.trim().toUpperCase(),
      });

      if (res.success) {
        setBallotRef(res.ballot_reference);
        setTxHash(res.transaction_hash);
        setStep('success');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('already been used')) {
        setStep('duplicate');
      } else {
        setErrorMsg(err.message || 'Error casting ballot to blockchain.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(ballotRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Connecting to Live Voting Contract...</p>
        </div>
      </div>
    );
  }

  const selectedCandObj = candidates.find((c) => c.id === selectedCandidate);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10 rounded-full shadow-lg shadow-blue-600/30" />
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">ዝሁራ — Zhura Voting Booth</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">End-to-End Verifiable Digital Election</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RoleNavSwitcher variant="dark" showHome />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: 'verify', label: '1. Verify Credential' },
            { id: 'select', label: '2. Select Candidate' },
            { id: 'confirm', label: '3. Review & Submit' },
          ].map((item, idx) => {
            const isCurrent = step === item.id;
            const isPassed = ['select', 'confirm', 'success'].indexOf(step) > idx;
            return (
              <div key={item.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-600/30'
                      : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    isCurrent ? 'text-white' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
                {idx < 2 && <div className={`w-8 sm:w-12 h-0.5 ${isPassed ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
              </div>
            );
          })}
        </div>

        {/* Card Box */}
        <div className="bg-slate-950/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: VERIFY */}
          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Voter Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">Enter your assigned voter credential ID to start</p>
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                    Voter Identification Credential
                  </label>
                  <input
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder="e.g., VTR-0001"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-lg font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                  />
                  <p className="text-[11px] text-slate-500 text-center mt-1.5">
                    Live voter ID from database: <code className="text-blue-400">VTR-0001</code>
                  </p>
                </div>

                <Button
                  onClick={handleVerify}
                  disabled={loading || !voterId.trim()}
                  className="w-full justify-center !py-3.5"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Verify & Proceed <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT CANDIDATE */}
          {step === 'select' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Credential Verified: {voterId}
                </div>
                <h2 className="text-xl font-bold text-white">{election?.name || 'Election Roster'}</h2>
                <p className="text-xs text-slate-400 mt-1">Select one candidate to cast your vote</p>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {candidates.map((cand) => {
                  const isSelected = selectedCandidate === cand.id;
                  return (
                    <button
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {cand.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{cand.name}</p>
                        <p className="text-xs text-slate-400">
                          {cand.position} · {cand.organization || 'Candidate'}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <Button variant="ghost" onClick={() => setStep('verify')} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  onClick={() => selectedCandidate && setStep('confirm')}
                  disabled={!selectedCandidate}
                  className="!px-6"
                >
                  Review Selection <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">Review & Submit Ballot</h2>
                <p className="text-xs text-slate-400 mt-1">Please confirm your final vote selection</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto text-center space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Selected Candidate</p>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto shadow-lg shadow-blue-600/30">
                  {selectedCandObj?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <h3 className="text-lg font-extrabold text-white">{selectedCandObj?.name}</h3>
                <p className="text-xs text-slate-400">{selectedCandObj?.position}</p>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                  Ballot payload will be encrypted with Zero-Knowledge verification
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between max-w-md mx-auto">
                <Button variant="ghost" onClick={() => setStep('select')} icon={<ArrowLeft className="w-4 h-4" />}>
                  Change Selection
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant="success"
                  size="lg"
                  disabled={loading}
                  className="!px-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Casting to Blockchain...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Confirm &amp; Cast Vote
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* SUCCESS RECEIPT */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Vote Successfully Cast</h2>
                <p className="text-xs text-slate-400 mt-1">Your ballot has been written to the immutable block ledger</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Verifiable Ballot Receipt
                </p>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <code className="text-sm font-mono font-bold text-blue-400">{ballotRef}</code>
                  <button
                    onClick={handleCopyRef}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Ballot Reference"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {txHash && (
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    Tx: {txHash}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 text-left leading-relaxed">
                  Save this reference code to independently audit your ballot inclusion on the Public Portal without
                  exposing your identity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button onClick={() => setStep('verify')} variant="secondary">
                  Vote with Another Account
                </Button>
                <Button onClick={() => navigate('/portal')}>
                  Verify on Public Portal
                </Button>
              </div>
            </div>
          )}

          {/* DUPLICATE VOTE ERROR */}
          {step === 'duplicate' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-9 h-9" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-red-400">TRANSACTION REJECTED</h2>
                <p className="text-sm text-slate-200 mt-1 font-semibold">Vote Already Recorded</p>
              </div>

              <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-4 max-w-md mx-auto text-xs text-red-300 space-y-2">
                <p>
                  This voting credential (<code className="font-mono font-bold text-white">{voterId}</code>) has already
                  submitted a ballot for this election.
                </p>
                {ballotRef && (
                  <p className="font-mono text-slate-300 text-[11px]">
                    Existing Ballot Reference: <span className="text-white font-bold">{ballotRef}</span>
                  </p>
                )}
                <p className="font-semibold text-red-400">The smart contract rejected your secondary submission.</p>
              </div>

              <div className="pt-2">
                <Button onClick={() => setStep('verify')} variant="secondary">
                  Return to Verification
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
