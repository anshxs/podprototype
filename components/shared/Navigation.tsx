'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Calendar, BarChart3, Clock, Tag, FileText, Award, Target, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/assignments', label: 'Assignments', icon: BookOpen },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/grades', label: 'Grades', icon: Award },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/schedules', label: 'Schedules', icon: Clock },
  { href: '/groups', label: 'Study Groups', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/timer', label: 'Timer', icon: Clock },
  { href: '/subjects', label: 'Subjects', icon: Tag },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-xl border-r border-cyan-400/20 min-h-screen p-6 sticky top-0 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Study Planner</h1>
          </div>
          <NotificationBell />
        </div>
        <p className="text-xs text-muted-foreground">Master your studies</p>
      </div>

      <div className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-all smooth-transition group',
                isActive
                  ? 'bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                  : 'text-foreground hover:bg-slate-800/50 hover:border hover:border-cyan-400/30'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Master your studies with focused planning and tracking.
        </p>
      </div>
    </nav>
  );
}
