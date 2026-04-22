'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useStorage } from '@/context/StorageContext';
import { Bell, X } from 'lucide-react';
import { formatDateShort, getDaysUntil } from '@/lib/dateHelpers';
import { Card } from '@/components/ui/card';

export function NotificationBell() {
  const { upcomingDeadlines, overdueCount, notificationCount } = useNotifications();
  const storage = useStorage();
  const [isOpen, setIsOpen] = useState(false);

  const getSubjectColor = (subjectId: string) => {
    const subject = storage.subjects.find((s) => s.id === subjectId);
    return subject?.color || '#94a3b8';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-bold">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {notificationCount === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>All caught up! No pending assignments.</p>
            </div>
          ) : (
            <div className="divide-y">
              {overdueCount > 0 && (
                <div className="p-4 bg-red-50">
                  <p className="font-semibold text-red-900">
                    {overdueCount} overdue assignment{overdueCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-red-700">Complete these as soon as possible</p>
                </div>
              )}

              {upcomingDeadlines.map((assignment) => {
                const daysLeft = getDaysUntil(assignment.dueDate);
                const subjectColor = getSubjectColor(assignment.subject);

                return (
                  <div key={assignment.id} className="p-4 hover:bg-secondary transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{ backgroundColor: subjectColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {storage.subjects.find((s) => s.id === assignment.subject)?.name}
                        </p>
                        <p className={`text-xs font-medium mt-1 ${
                          daysLeft < 1
                            ? 'text-red-600'
                            : daysLeft < 3
                              ? 'text-orange-600'
                              : 'text-green-600'
                        }`}>
                          {daysLeft < 0
                            ? `${Math.abs(daysLeft)} days overdue`
                            : daysLeft === 0
                              ? 'Due today'
                              : `${daysLeft} days left`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
