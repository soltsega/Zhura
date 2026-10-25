import { Link, useLocation } from 'react-router-dom';
import { Shield, Vote, UserCheck, Eye, Home } from 'lucide-react';

type RoleNavSwitcherProps = {
  variant?: 'light' | 'dark';
  showHome?: boolean;
  className?: string;
};

const roles = [
  {
    label: 'Admin',
    path: '/admin',
    matchPrefix: '/admin',
    icon: Shield,
    activeColor: {
      light: 'bg-blue-600 text-white shadow-sm shadow-blue-500/30',
      dark: 'bg-blue-600 text-white shadow-sm shadow-blue-600/30',
    },
    hoverColor: {
      light: 'hover:text-blue-600 hover:bg-slate-200/70',
      dark: 'hover:text-white hover:bg-slate-800',
    },
  },
  {
    label: 'Validator',
    path: '/validator',
    matchPrefix: '/validator',
    icon: UserCheck,
    activeColor: {
      light: 'bg-purple-600 text-white shadow-sm shadow-purple-500/30',
      dark: 'bg-purple-600 text-white shadow-sm shadow-purple-600/30',
    },
    hoverColor: {
      light: 'hover:text-purple-600 hover:bg-slate-200/70',
      dark: 'hover:text-white hover:bg-slate-800',
    },
  },
  {
    label: 'Voter',
    path: '/voting',
    matchPrefix: '/voting',
    icon: Vote,
    activeColor: {
      light: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30',
      dark: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30',
    },
    hoverColor: {
      light: 'hover:text-emerald-600 hover:bg-slate-200/70',
      dark: 'hover:text-white hover:bg-slate-800',
    },
  },
  {
    label: 'Public',
    path: '/portal',
    matchPrefix: '/portal',
    icon: Eye,
    activeColor: {
      light: 'bg-amber-600 text-white shadow-sm shadow-amber-500/30',
      dark: 'bg-amber-600 text-white shadow-sm shadow-amber-600/30',
    },
    hoverColor: {
      light: 'hover:text-amber-600 hover:bg-slate-200/70',
      dark: 'hover:text-white hover:bg-slate-800',
    },
  },
];

export default function RoleNavSwitcher({
  variant = 'light',
  showHome = false,
  className = '',
}: RoleNavSwitcherProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isDark = variant === 'dark';

  return (
    <nav
      aria-label="Demo role navigation"
      className={`inline-flex items-center gap-1 p-1 rounded-xl text-xs font-semibold transition-colors ${
        isDark
          ? 'bg-slate-900/90 border border-slate-800 text-slate-400'
          : 'bg-slate-100 border border-slate-200/80 text-slate-600'
      } ${className}`}
    >
      {showHome && (
        <Link
          to="/"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
            currentPath === '/'
              ? isDark
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-900 shadow-xs'
              : isDark
                ? 'hover:text-slate-200 hover:bg-slate-800/60'
                : 'hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title="Back to Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      )}

      {roles.map((role) => {
        const isActive =
          role.matchPrefix === '/admin'
            ? currentPath.startsWith('/admin')
            : currentPath.startsWith(role.matchPrefix);

        const Icon = role.icon;

        return (
          <Link
            key={role.path}
            to={role.path}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-150 ${
              isActive
                ? role.activeColor[variant]
                : `${isDark ? 'text-slate-400' : 'text-slate-600'} ${role.hoverColor[variant]}`
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{role.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
