import { useState } from 'react';
import { Plus, Search, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { expenses } from '@/data/mockData';

const categoryLabels: Record<string, string> = {
  polling_workers: 'Polling Workers',
  observers: 'Observers',
  logistics: 'Logistics',
  equipment: 'Equipment',
  training: 'Training',
  administration: 'Administration',
  transportation: 'Transportation',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  polling_workers: '#3b82f6',
  observers: '#10b981',
  logistics: '#f59e0b',
  equipment: '#8b5cf6',
  training: '#06b6d4',
  administration: '#ef4444',
  transportation: '#ec4899',
  other: '#64748b',
};

export default function ExpensesPage() {
  const [search, setSearch] = useState('');

  const totalBudget = 10000000;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;

  // Aggregate by category
  const categoryData = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([key, value]) => ({
    name: categoryLabels[key] || key,
    value,
    color: categoryColors[key] || '#64748b',
  }));

  // Monthly data for bar chart
  const monthlyData = [
    { month: 'Jul', amount: 4200000 },
    { month: 'Aug', amount: 3640000 },
  ];

  const filtered = expenses.filter((e) =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    categoryLabels[e.category].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-sm text-slate-500">Track and manage election expenditure</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Record Expense</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><DollarSign className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-slate-500">Total Budget</p>
              <p className="text-xl font-bold text-slate-900">{(totalBudget / 1000000).toFixed(1)}M <span className="text-sm font-normal text-slate-500">ETB</span></p>
            </div>
          </div>
        </Card>
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-xs text-slate-500">Total Spent</p>
              <p className="text-xl font-bold text-slate-900">{(totalSpent / 1000000).toFixed(2)}M <span className="text-sm font-normal text-slate-500">ETB</span></p>
            </div>
          </div>
        </Card>
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-amber-600" /></div>
            <div>
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="text-xl font-bold text-slate-900">{(remaining / 1000000).toFixed(2)}M <span className="text-sm font-normal text-slate-500">ETB</span></p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Spending by Category" icon={<DollarSign className="w-5 h-5" />}>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} strokeWidth={0}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-slate-600 flex-1">{cat.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{(cat.value / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Spending Over Time" icon={<TrendingUp className="w-5 h-5" />}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => `${((v || 0) / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: any) => `${((v || 0) / 1000000).toFixed(2)}M ETB`} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Expense Records */}
      <Card title="Expense Records" icon={<DollarSign className="w-5 h-5" />}>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md mb-4">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="ml-2 text-sm outline-none w-full" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Category</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2 hidden md:table-cell">Description</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2 hidden lg:table-cell">Authorized</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2 hidden lg:table-cell">Doc Hash</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{expense.id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[expense.category] }} />
                      <span className="text-xs text-slate-700">{categoryLabels[expense.category]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{(expense.amount / 1000000).toFixed(2)}M ETB</td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600 max-w-[200px] truncate">{expense.description}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-600">{expense.authorizedBy}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs font-mono text-slate-400">{expense.documentHash}</td>
                  <td className="px-4 py-3"><StatusBadge status={expense.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
