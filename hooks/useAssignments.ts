import { useStorage } from '@/context/StorageContext';
import { Assignment, AssignmentStatus, Priority } from '@/lib/types';
import { getDaysUntil, isOverdue } from '@/lib/dateHelpers';

export function useAssignments() {
  const storage = useStorage();

  const filterAssignments = (
    filters: {
      status?: AssignmentStatus;
      subject?: string;
      priority?: Priority;
      search?: string;
    } = {}
  ): Assignment[] => {
    let result = [...storage.assignments];

    if (filters.status) {
      result = result.filter((a) => a.status === filters.status);
    }

    if (filters.subject) {
      result = result.filter((a) => a.subject === filters.subject);
    }

    if (filters.priority) {
      result = result.filter((a) => a.priority === filters.priority);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.description?.toLowerCase().includes(search)
      );
    }

    return result;
  };

  const sortByDueDate = (assignments: Assignment[]): Assignment[] => {
    return [...assignments].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  };

  const getAssignmentsDueToday = (): Assignment[] => {
    const today = new Date().toDateString();
    return storage.assignments.filter(
      (a) => new Date(a.dueDate).toDateString() === today
    );
  };

  const getOverdueAssignments = (): Assignment[] => {
    return storage.assignments.filter(
      (a) => isOverdue(a.dueDate) && a.status !== 'completed'
    );
  };

  const getAssignmentStats = (assignments: Assignment[] = storage.assignments) => {
    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'completed').length;
    const inProgress = assignments.filter((a) => a.status === 'in-progress').length;
    const notStarted = assignments.filter((a) => a.status === 'not-started').length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      completionPercentage:
        total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  };

  return {
    ...storage,
    filterAssignments,
    sortByDueDate,
    getAssignmentsDueToday,
    getOverdueAssignments,
    getAssignmentStats,
  };
}
