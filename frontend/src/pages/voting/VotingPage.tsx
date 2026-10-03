import { useState } from 'react';
import { Shield, CheckCircle, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { demoElection, candidates } from '@/data/mockData';

type Step = 'verify' | 'select' | 'confirm' | 'success' | 'duplicate';

export default function VotingPage() {
  const [step, setStep] = useState<Step>('verify');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voterId, setVoterId] = useState('');
  const [ballotRef, setBallotRef] = useState('');

  const handleVerify = () => {
    if (voterId.trim()) setStep('select');
  };

  const handleConfirm = () => {
    if (selectedCandidate) {
      setBallotRef(`VR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      setStep('success');
    }
  };

  const handleDuplicateVote = () => {
    setStep('duplicate');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">ዝሁራ</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Zihura — Secure Voting</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['verify', 'select', 'confirm'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s ? 'bg-blue-600 text-white' :
                (['select', 'confirm', 'success'].indexOf(step) > i) ? 'bg-emerald-500 text-white' :
                'bg-slate-200 text-slate-500'
              }`}>
                {(['select', 'confirm', 'success'].indexOf(step) > i) ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${
                step === s ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {s === 'verify' ? 'Verify Identity' : s === 'select' ? 'Select Candidate' : 'Review & Confirm'}
              </span>
              {i < 2 && <div className={`w-12 h-px ${['select', 'confirm', 'success'].indexOf(step) > i ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Step 1: Verify Identity */}
          {step === 'verify' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Verify Your Identity</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your voter ID to begin the voting process</p>
              </div>
              <div className="max-w-sm mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Voter ID</label>
                  <input
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder="e.g., VTR-0001"
                    className="w-full px-4 py-3 border border-slate-300 bg-slate-50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-center font-mono text-lg transition-all"
                  />
                </div>
                <Button onClick={handleVerify} className="w-full" size="lg">
                  Verify Identity <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Candidate */}
          {step === 'select' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
                  <CheckCircle className="w-3.5 h-3.5" /> Identity Verified
                </div>
                <h2 className="text-xl font-bold text-slate-900">{demoElection.name}</h2>
                <p className="text-sm text-slate-500 mt-1">Select your candidate</p>
              </div>
              <div className="space-y-3">
                {candidates.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                      selectedCandidate === cand.id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedCandidate === cand.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {cand.name.charAt(cand.name.length - 1)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{cand.name}</p>
                      <p className="text-xs text-slate-500">{cand.qualifications}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedCandidate === cand.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`}>
                      {selectedCandidate === cand.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep('verify')} icon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button onClick={() => selectedCandidate && setStep('confirm')} disabled={!selectedCandidate}>
                  Review Vote <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4">
                <button onClick={handleDuplicateVote} className="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer">
                  Test: Attempt duplicate vote
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Review Your Vote</h2>
                <p className="text-sm text-slate-500 mt-1">Please confirm your selection before submitting</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 max-w-sm mx-auto">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Your Selection</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {candidates.find((c) => c.id === selectedCandidate)?.name.charAt(1)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{candidates.find((c) => c.id === selectedCandidate)?.name}</p>
                    <p className="text-xs text-slate-500">{candidates.find((c) => c.id === selectedCandidate)?.position}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between max-w-sm mx-auto">
                <Button variant="ghost" onClick={() => setStep('select')} icon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button onClick={handleConfirm} variant="success" size="lg">
                  <CheckCircle className="w-4 h-4" /> Confirm Vote
                </Button>
              </div>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Vote Successfully Recorded</h2>
              <p className="text-sm text-slate-500 mt-2">Your ballot has been securely recorded.</p>
              <div className="mt-6 bg-slate-50 rounded-xl p-4 max-w-sm mx-auto">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ballot Reference</p>
                <p className="text-lg font-mono font-bold text-slate-900">{ballotRef}</p>
              </div>
              <p className="mt-4 text-xs text-slate-400">Your identity is not publicly linked to your ballot.</p>
              <Button onClick={() => { setStep('verify'); setVoterId(''); setSelectedCandidate(null); }} className="mt-6">
                Return to Dashboard
              </Button>
            </div>
          )}

          {/* Duplicate Vote */}
          {step === 'duplicate' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Vote Already Recorded</h2>
              <p className="text-sm text-slate-500 mt-2">This voting credential has already been used for this election.</p>
              <p className="text-sm text-red-600 mt-1 font-medium">Your second ballot was not accepted.</p>
              <Button onClick={() => setStep('verify')} className="mt-6" variant="secondary">
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
