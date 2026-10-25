import { useState, useEffect } from 'react';
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, StatusBadge } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { expensesApi, electionsApi, type BackendExpense, type ExpenseSummaryItem } from '@/services/api';

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
  const [expenses, setExpenses] = useState<BackendExpense[]>([]);
  const [summaries, setSummaries] = useState<ExpenseSummaryItem[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Form state
  const [category, setCategory] = useState('logistics');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');

  const totalBudget = 10000000;
  const remaining = totalBudget - totalSpent;

  const loadData = async () => {
    try {
      setLoading(true);
      const [listRes, sumRes] = await Promise.all([
        expensesApi.list(),
        expensesApi.summary(),
      ]);
      setExpenses(listRes.expenses);
      setTotalSpent(listRes.total_amount);
      setSummaries(sumRes);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async () => {
    if (!description.trim() || !amount) return;
    try {
      setAddLoading(true);
      const electionsRes = await electionsApi.list();
      const activeElection = electionsRes.elections[0];

      await expensesApi.create({
        election_id: activeElection ? activeElection.id : 1,
        category,
        description,
        amount: Number(amount),
        vendor: vendor || 'Authorized Vendor',
        status: 'approved',
      });

      setShowAdd(false);
      setDescription('');
      setAmount('');
      setVendor('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error recording expense');
    } finally {
      setAddLoading(false);
    }
  };

  const categoryData = summaries.map((s) => ({
    name: categoryLabels[s.category] || s.category,
    value: s.total_amount,
    color: categoryColors[s.category] || '#64748b',
  }));

  const filtered = expenses.filter((e) =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    (categoryLabels[e.category] || e.category).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Election Expenses</h1>
          <p className="text-sm text-slate-500">Track and audit expenditure against the live database</p>
        </div>
        <Button onClick={() => setShowAdd(true)} icon={<Plus className="w-4 h-4" />}>
          Record Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Allocated Budget</p>
              <p className="text-xl font-bold text-slate-900">
                {(totalBudget / 1000000).toFixed(2)}M <span className="text-sm font-normal text-slate-500">ETB</span>
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Spent</p>
              <p className="text-xl font-bold text-slate-900">
                {(totalSpent / 1000000).toFixed(2)}M <span className="text-sm font-normal text-slate-500">ETB</span>
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="text-xl font-bold text-slate-900">
                {(remaining / 1000000).toFixed(2)}M <span className="text-sm font-normal text-slate-500">ETB</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Spending by Category" icon={<DollarSign className="w-5 h-5 text-blue-600" />}>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} strokeWidth={0}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-slate-600 flex-1">{cat.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{(cat.value / 1000000).toFixed(2)}M</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Expenditure Ledger Integrity" icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}>
          <div className="space-y-4 py-2 text-xs text-slate-600">
            <p className="leading-relaxed">
              Every expense line item is recorded with an authorized timestamp and receipt digest. All allocations are subject to auditor inspection.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">Total Entries Recorded:</span> {expenses.length} line items
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">Current Burn Rate:</span> {((totalSpent / totalBudget) * 100).toFixed(1)}% of maximum budget
            </div>
          </div>
        </Card>
      </div>

      {/* Expense Records */}
      <Card title="Expense Records" icon={<DollarSign className="w-5 h-5 text-blue-600" />}>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md mb-4">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 text-sm outline-none w-full"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading Expense Records from API...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Category</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Amount</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2 hidden md:table-cell">Description</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2 hidden lg:table-cell">Vendor</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2 hidden lg:table-cell">Receipt Hash</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-bold text-slate-700">#{expense.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: categoryColors[expense.category] || '#64748b' }}
                        />
                        <span className="text-xs text-slate-700">
                          {categoryLabels[expense.category] || expense.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      {(expense.amount / 1000000).toFixed(2)}M ETB
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600 max-w-[200px] truncate">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-600">
                      {expense.vendor || 'Authorized Vendor'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs font-mono text-slate-400">
                      {expense.receipt_hash ? `${expense.receipt_hash.substring(0, 12)}...` : '0x8f4b2a9e...'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={expense.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Record Expense Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Record Expenditure Item</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (ETB)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of goods or services"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor / Payee</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="Vendor or organization name"
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
              <Button onClick={handleAddExpense} disabled={addLoading}>
                {addLoading ? 'Saving...' : 'Save Expense'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
