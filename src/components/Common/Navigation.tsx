import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { CEFRBadge } from './CEFRBadge';

export function Navigation() {
  const { pathname } = useLocation();
  const { user } = useUser();

  const isActive = (path: string): boolean => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const navLinks = [
    { to: '/reader', label: 'Read' },
    { to: '/srs', label: 'Review' },
    { to: '/tutor', label: 'Speak' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex-shrink-0 font-bold text-xl text-teal-600 hover:text-teal-700 transition-colors"
          >
            StorySteps
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'text-teal-600 border-b-2 border-teal-600 pb-4'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex-shrink-0">
            <CEFRBadge level={user.currentLevel} size="md" />
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between pb-4 border-t border-slate-200 pt-4">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
