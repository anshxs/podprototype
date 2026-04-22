import { useStorage } from '@/context/StorageContext';
import { useMemo } from 'react';

export function useNotifications() {
  const storage = useStorage();

  const upcomingDeadlines = useMemo(() => {
    if (!storage.notifications.enabled) return [];

    const upcoming = storage.getUpcomingAssignments(
      storage.notifications.upcomingDays
    );

    return upcoming.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [
    storage.assignments,
    storage.notifications.enabled,
    storage.notifications.upcomingDays,
  ]);

  const overdueCount = useMemo(() => {
    return storage.assignments.filter((a) => {
      const now = new Date();
      const due = new Date(a.dueDate);
      return due < now && a.status !== 'completed';
    }).length;
  }, [storage.assignments]);

  const hasNotifications = upcomingDeadlines.length > 0 || overdueCount > 0;

  const notificationCount = upcomingDeadlines.length + overdueCount;

  return {
    upcomingDeadlines,
    overdueCount,
    hasNotifications,
    notificationCount,
    enableNotifications: () =>
      storage.updateNotifications({ enabled: true }),
    disableNotifications: () =>
      storage.updateNotifications({ enabled: false }),
    setNotificationDays: (days: number) =>
      storage.updateNotifications({ upcomingDays: days }),
  };
}
