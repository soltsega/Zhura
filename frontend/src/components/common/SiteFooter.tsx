import { Link } from 'react-router-dom';
import BrandMark from '@/components/common/BrandMark';

type SiteFooterProps = {
  variant?: 'dark' | 'light';
};

export default function SiteFooter({ variant = 'dark' }: SiteFooterProps) {
  const isDark = variant === 'dark';

  return (
    <footer className={`border-t ${isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div className="flex items-center gap-3">
          <BrandMark className="h-10 w-10 rounded-full" />
          <div>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Zhura <span className="font-medium">· ዝሁራ</span></p>
            <p className="mt-0.5 text-xs">Trust in Every Vote · Governance &amp; Elections</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium" aria-label="Footer">
          <Link className="hover:text-blue-500" to="/">Home</Link>
          <Link className="hover:text-blue-500" to="/portal">Public portal</Link>
          <Link className="hover:text-blue-500" to="/login">Sign in</Link>
        </nav>
        <div className={`text-[11px] md:col-span-2 md:flex md:items-center md:justify-between ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <p>© {new Date().getFullYear()} Zhura. All rights reserved.</p>
          <p className="mt-1 md:mt-0">Prototype experience · Demo data only</p>
        </div>
      </div>
    </footer>
  );
}
