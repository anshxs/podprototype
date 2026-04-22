export type AssignmentStatus = 'not-started' | 'in-progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';
export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'cyan' | 'pink' | 'green' | 'purple';

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description?: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: Priority;
  estimatedHours: number;
  completionPercentage: number;
  grade?: number;
  createdAt: string;
}

export interface StudyNote {
  id: string;
  assignmentId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  assignmentId: string;
  score: number;
  maxScore: number;
  comments?: string;
  recordedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: 'hours' | 'percentage' | 'count';
  dueDate: string;
  priority: Priority;
  milestones: Milestone[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetValue: number;
  completed: boolean;
  completedAt?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: number;
  type: 'session' | 'assignment-work';
}

export interface StudySchedule {
  id: string;
  subjectId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  recurring: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  sharedAssignments: string[];
  createdAt: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

export interface PerformanceInsight {
  subjectId: string;
  avgGrade: number;
  trend: 'improving' | 'stable' | 'declining';
  recommendation: string;
}

export interface GlobalNotifications {
  enabled: boolean;
  upcomingDays: number;
}

export interface ThemeSettings {
  mode: ThemeMode;
  accentColor: AccentColor;
}

export interface UserPreferences {
  theme: ThemeSettings;
  notificationsEnabled: boolean;
  defaultStudySessionDuration: number;
}

export interface StorageContextType {
  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Study Sessions
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id'>) => void;

  // Study Notes
  notes: StudyNote[];
  addNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<StudyNote>) => void;
  deleteNote: (id: string) => void;
  getNotesByAssignment: (assignmentId: string) => StudyNote[];

  // Grades
  grades: Grade[];
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, updates: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
  getGradesBySubject: (subjectId: string) => Grade[];

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Study Schedules
  schedules: StudySchedule[];
  addSchedule: (schedule: Omit<StudySchedule, 'id'>) => void;
  updateSchedule: (id: string, updates: Partial<StudySchedule>) => void;
  deleteSchedule: (id: string) => void;
  getSchedulesByDay: (dayOfWeek: number) => StudySchedule[];

  // Study Groups
  groups: StudyGroup[];
  addGroup: (group: Omit<StudyGroup, 'id'>) => void;
  updateGroup: (id: string, updates: Partial<StudyGroup>) => void;
  deleteGroup: (id: string) => void;

  // Theme
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;

  // Notifications
  notifications: GlobalNotifications;
  updateNotifications: (updates: Partial<GlobalNotifications>) => void;

  // Utility
  getAssignmentsBySubject: (subjectId: string) => Assignment[];
  getUpcomingAssignments: (days: number) => Assignment[];
  getCompletedAssignments: () => Assignment[];
  getTotalHoursThisWeek: () => number;
  getCompletionRate: () => number;
}
