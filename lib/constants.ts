export const DEFAULT_SUBJECTS = [
  { id: 'math', name: 'Mathematics', color: '#3b82f6', icon: 'calculator' },
  { id: 'english', name: 'English', color: '#ef4444', icon: 'book-open' },
  { id: 'science', name: 'Science', color: '#10b981', icon: 'flask' },
  { id: 'history', name: 'History', color: '#f59e0b', icon: 'clock' },
  { id: 'cs', name: 'Computer Science', color: '#8b5cf6', icon: 'code' },
];

export const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
};

export const STATUS_LABELS = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

export const TIMER_DURATIONS = {
  work: 25,
  break: 5,
  longBreak: 15,
};

export const DEMO_ASSIGNMENTS = [
  {
    title: 'Calculus Homework - Chapter 5',
    subject: 'math',
    description: 'Solve problems 1-20 on page 127',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress' as const,
    priority: 'high' as const,
    estimatedHours: 2,
    completionPercentage: 60,
  },
  {
    title: 'Essay on Shakespeare',
    subject: 'english',
    description: 'Write 3000-word essay on Hamlet',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'not-started' as const,
    priority: 'high' as const,
    estimatedHours: 4,
    completionPercentage: 0,
  },
  {
    title: 'Biology Lab Report',
    subject: 'science',
    description: 'Complete lab report on cell biology',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress' as const,
    priority: 'medium' as const,
    estimatedHours: 1.5,
    completionPercentage: 40,
  },
  {
    title: 'History Research Project',
    subject: 'history',
    description: 'Research WWI events and prepare presentation',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'not-started' as const,
    priority: 'medium' as const,
    estimatedHours: 3,
    completionPercentage: 0,
  },
  {
    title: 'Data Structures Assignment',
    subject: 'cs',
    description: 'Implement binary search tree and hash table',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress' as const,
    priority: 'high' as const,
    estimatedHours: 3.5,
    completionPercentage: 25,
  },
];
