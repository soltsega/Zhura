import { useState } from 'react';
import { FileText, BarChart3, Download, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { electionsApi, candidatesApi, votersApi, expensesApi } from '@/services/api';

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const downloadCsv = (filename: string, rows: string[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      setGenerating(reportType);
      setSuccessMsg('');
      setErrorMsg('');

      if (reportType === 'summary') {
        const electionsRes = await electionsApi.list();
        const primaryElection = electionsRes.elections[0];
        const candidatesRes = primaryElection
          ? await candidatesApi.list(primaryElection.id)
          : { candidates: [] };

        const rows = [
          ['Zhuranet Election Summary Report'],
          ['Generated At', new Date().toISOString()],
          ['Election Name', primaryElection?.name || 'N/A'],
          ['Election Type', primaryElection?.election_type || 'N/A'],
          ['Status', primaryElection?.status || 'N/A'],
          ['Total Registered Voters', String(primaryElection?.total_voters || 0)],
          ['Total Votes Cast', String(primaryElection?.votes_cast || 0)],
          ['Turnout Percentage', `${primaryElection?.total_voters ? ((primaryElection.votes_cast / primaryElection.total_voters) * 100).toFixed(1) : 0}%`],
          [],
          ['Candidate Standings'],
          ['Candidate Name', 'Position', 'Organization', 'Votes Received', 'Vote Percentage'],
        ];

        candidatesRes.candidates.forEach((cand) => {
          rows.push([cand.name, cand.position, cand.organization || 'N/A', String(cand.votes_received), `${cand.vote_percentage}%`]);
        });

        downloadCsv(`zhuranet_election_summary_${Date.now()}.csv`, rows);
        setSuccessMsg('Election Summary Report generated and downloaded.');
      } else if (reportType === 'turnout') {
        const votersRes = await votersApi.list({ limit: 1000 });
        const rows = [
          ['Zhuranet Voter Turnout Audit Report'],
          ['Generated At', new Date().toISOString()],
          ['Total Voters Audited', String(votersRes.total)],
          ['Voted Count', String(votersRes.voted_count)],
          ['Pending Count', String(votersRes.not_voted_count)],
          [],
          ['Voter ID', 'Name', 'Email', 'Region', 'Polling Center', 'Has Voted', 'Voted At'],
        ];

        votersRes.voters.forEach((v) => {
          rows.push([
            v.voter_id,
            v.name,
            v.email,
            (v as any).region || 'N/A',
            (v as any).polling_center || 'N/A',
            v.has_voted ? 'YES' : 'NO',
            v.voted_at || 'N/A',
          ]);
        });

        downloadCsv(`zhuranet_voter_turnout_${Date.now()}.csv`, rows);
        setSuccessMsg('Voter Turnout Report generated and downloaded.');
      } else if (reportType === 'expenses') {
        const expensesRes = await expensesApi.list({ limit: 200 });
        const rows = [
          ['Zhuranet Expenditure Audit Ledger Report'],
          ['Generated At', new Date().toISOString()],
          ['Total Expense Records', String(expensesRes.total)],
          ['Total Amount Spent (ETB)', String(expensesRes.total_amount)],
          [],
          ['Expense ID', 'Category', 'Description', 'Amount (ETB)', 'Authorized By', 'Status', 'Date'],
        ];

        expensesRes.expenses.forEach((e) => {
          rows.push([
            e.expense_id || `EXP-${e.id}`,
            e.category,
            e.description,
            String(e.amount),
            e.authorized_by || e.vendor || 'Election Authority',
            e.status,
            e.created_at,
          ]);
        });

        downloadCsv(`zhuranet_expenditure_audit_${Date.now()}.csv`, rows);
        setSuccessMsg('Expenditure Report generated and downloaded.');
      }
    } catch (err: any) {
      console.error('Failed to generate report:', err);
      setErrorMsg(err.message || 'Failed to generate report from backend.');
    } finally {
      setGenerating(null);
    }
  };

  const reports = [
    { id: 'summary', title: 'Election Summary Report', desc: 'Complete overview of election status, participation, and candidate results.', icon: BarChart3 },
    { id: 'turnout', title: 'Voter Turnout Report', desc: 'Detailed breakdown of voter participation by polling center and timestamp.', icon: FileText },
    { id: 'expenses', title: 'Expenditure Report', desc: 'Complete financial report with all recorded expenses and authorization hashes.', icon: Download },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">Generate and export official governance and audit reports from live database</p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => {
          const isBusy = generating === report.id;
          return (
            <Card key={report.id} hover>
              <div className="text-center flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                    <report.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">{report.desc}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isBusy}
                  className="w-full justify-center"
                  icon={isBusy ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Download className="w-4 h-4" />}
                >
                  {isBusy ? 'Generating...' : 'Export CSV Report'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
