import { Settings, Shield, User, Bell } from 'lucide-react';
import { Card } from '@/components/common/Card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and application settings</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Profile Settings" icon={<User className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" defaultValue="Admin User" className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" defaultValue="admin@zihura.demo" className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all" />
            </div>
          </div>
        </Card>
        <Card title="Security" icon={<Shield className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">Two-Factor Auth</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">Last Password Change</span>
              <span className="text-xs text-slate-500">30 days ago</span>
            </div>
          </div>
        </Card>
        <Card title="Notifications" icon={<Bell className="w-5 h-5" />}>
          <div className="space-y-3">
            {['Email Notifications', 'Proposal Alerts', 'Voting Updates', 'System Alerts'].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-700">{item}</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
