import { FileText, BarChart3, Download } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">Generate and download election reports</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Election Summary Report', desc: 'Complete overview of election status, participation, and results.', icon: BarChart3 },
          { title: 'Voter Turnout Report', desc: 'Detailed breakdown of voter participation by center and time.', icon: FileText },
          { title: 'Expenditure Report', desc: 'Complete financial report with all recorded expenses.', icon: Download },
        ].map((report) => (
          <Card key={report.title} hover>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <report.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">{report.title}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">{report.desc}</p>
              <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Generate Report</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
