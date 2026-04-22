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
    <nav className="w-64 bg-sidebar/95 border-r border-sidebar-border min-h-screen p-6 sticky top-0 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Study Planner</h1>
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
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-all smooth-transition group border border-transparent',
                isActive
                  ? 'bg-secondary text-foreground border-border shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-border'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-foreground')} />
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
