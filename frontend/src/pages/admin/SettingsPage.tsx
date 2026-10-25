import { useState } from 'react';
import { Shield, User, Bell, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export default function SettingsPage() {
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@zhuranet.org');
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    'Email Notifications': true,
    'Proposal Alerts': true,
    'Voting Updates': true,
    'System Alerts': false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedMsg('Settings updated successfully.');
      setTimeout(() => setSavedMsg(''), 4000);
    }, 400);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Manage your administrative credentials and security preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Profile Settings" icon={<User className="w-5 h-5 text-blue-600" />}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="pt-2">
              <span className="text-xs text-slate-400">Institutional Role:</span>
              <span className="ml-2 text-xs font-bold text-slate-700">Election Authority Administrator</span>
            </div>
          </div>
        </Card>

        <Card title="Security & Quorum" icon={<Shield className="w-5 h-5 text-purple-600" />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">Two-Factor Auth</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">Smart Contract Multisig</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">4/5 Supermajority</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">Audit Trail Logging</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">Zhuranet EVM</span>
            </div>
          </div>
        </Card>

        <Card title="Notifications" icon={<Bell className="w-5 h-5 text-amber-600" />}>
          <div className="space-y-3">
            {(Object.keys(notifications) as Array<keyof typeof notifications>).map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-700">{item}</span>
                <button
                  onClick={() => toggleNotification(item)}
                  type="button"
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${
                    notifications[item] ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                      notifications[item] ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
