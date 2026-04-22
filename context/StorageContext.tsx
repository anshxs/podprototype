'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Assignment,
  Subject,
  StudySession,
  GlobalNotifications,
  StorageContextType,
  StudyNote,
  Grade,
  Goal,
  StudySchedule,
  StudyGroup,
  ThemeSettings,
} from '@/lib/types';
import { DEFAULT_SUBJECTS, DEMO_ASSIGNMENTS } from '@/lib/constants';
import { getDaysUntil } from '@/lib/dateHelpers';

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ASSIGNMENTS: 'study-planner-assignments',
  SUBJECTS: 'study-planner-subjects',
  SESSIONS: 'study-planner-sessions',
  NOTIFICATIONS: 'study-planner-notifications',
  INITIALIZED: 'study-planner-initialized',
  NOTES: 'study-planner-notes',
  GRADES: 'study-planner-grades',
  GOALS: 'study-planner-goals',
  SCHEDULES: 'study-planner-schedules',
  GROUPS: 'study-planner-groups',
  THEME: 'study-planner-theme',
};

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>({
    mode: 'dark',
    accentColor: 'cyan',
  });
  const [notifications, setNotifications] = useState<GlobalNotifications>({
    enabled: true,
    upcomingDays: 3,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

    if (!isInit) {
      // First time - load defaults
      const defaultSubjects: Subject[] = DEFAULT_SUBJECTS.map((s) => ({
        ...s,
        createdAt: new Date().toISOString(),
      }));

      const now = new Date().toISOString();
      const defaultAssignments: Assignment[] = DEMO_ASSIGNMENTS.map((a) => ({
        ...a,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: now,
      }));

      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(defaultSubjects));
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(defaultAssignments));
      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify({ enabled: true, upcomingDays: 3 })
      );
      localStorage.setItem(
        STORAGE_KEYS.THEME,
        JSON.stringify({ mode: 'dark', accentColor: 'cyan' })
      );
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

      setSubjects(defaultSubjects);
      setAssignments(defaultAssignments);
    } else {
      // Load from localStorage
      const storedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      const storedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      const storedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      const storedGrades = localStorage.getItem(STORAGE_KEYS.GRADES);
      const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      const storedSchedules = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      const storedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

      if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
      if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
      if (storedSessions) setSessions(JSON.parse(storedSessions));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedNotes) setNotes(JSON.parse(storedNotes));
      if (storedGrades) setGrades(JSON.parse(storedGrades));
      if (storedGoals) setGoals(JSON.parse(storedGoals));
      if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
      if (storedGroups) setGroups(JSON.parse(storedGroups));
      if (storedTheme) setTheme(JSON.parse(storedTheme));
    }

    setIsInitialized(true);
  }, []);

  // Persist assignments to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    }
  }, [assignments, isInitialized]);

  // Persist subjects to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    }
  }, [subjects, isInitialized]);

  // Persist sessions to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    }
  }, [sessions, isInitialized]);

  // Persist notifications to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  // Persist notes to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }
  }, [notes, isInitialized]);

  // Persist grades to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    }
  }, [grades, isInitialized]);

  // Persist goals to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
  }, [goals, isInitialized]);

  // Persist schedules to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    }
  }, [schedules, isInitialized]);

  // Persist groups to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    }
  }, [groups, isInitialized]);

  // Persist theme to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    }
  }, [theme, isInitialized]);

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
    };
    setAssignments([...assignments, newAssignment]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(
      assignments.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const addSubject = (subject: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
    };
    setSubjects([...subjects, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    // Also delete assignments for this subject
    setAssignments(assignments.filter((a) => a.subject !== id));
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: Math.random().toString(36).substring(2, 11),
    };
    setSessions([...sessions, newSession]);
  };

  const updateNotifications = (updates: Partial<GlobalNotifications>) => {
    setNotifications({ ...notifications, ...updates });
  };

  // Utility functions
  const getAssignmentsBySubject = (subjectId: string): Assignment[] => {
    return assignments.filter((a) => a.subject === subjectId);
  };

  const getUpcomingAssignments = (days: number): Assignment[] => {
    return assignments.filter((a) => {
      const daysUntil = getDaysUntil(a.dueDate);
      return daysUntil <= days && daysUntil >= 0 && a.status !== 'completed';
    });
  };

  const getCompletedAssignments = (): Assignment[] => {
    return assignments.filter((a) => a.status === 'completed');
  };

  const getTotalHoursThisWeek = (): number => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return sessions.reduce((total, session) => {
      const sessionDate = new Date(session.date);
      if (sessionDate >= weekAgo) {
        return total + session.duration / 60;
      }
      return total;
    }, 0);
  };

  const getCompletionRate = (): number => {
    if (assignments.length === 0) return 0;
    const completed = assignments.filter((a) => a.status === 'completed').length;
    return Math.round((completed / assignments.length) * 100);
  };

  // Notes operations
  const addNote = (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: StudyNote = {
      ...note,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, updates: Partial<StudyNote>) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const getNotesByAssignment = (assignmentId: string): StudyNote[] => {
    return notes.filter((n) => n.assignmentId === assignmentId);
  };

  // Grades operations
  const addGrade = (grade: Omit<Grade, 'id'>) => {
    const newGrade: Grade = {
      ...grade,
      id: Math.random().toString(36).substring(2, 11),
    };
    setGrades([...grades, newGrade]);
    updateAssignment(grade.assignmentId, { grade: grade.score });
  };

  const updateGrade = (id: string, updates: Partial<Grade>) => {
    setGrades(grades.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGrade = (id: string) => {
    setGrades(grades.filter((g) => g.id !== id));
  };

  const getGradesBySubject = (subjectId: string): Grade[] => {
    const subjectAssignments = getAssignmentsBySubject(subjectId);
    const assignmentIds = subjectAssignments.map((a) => a.id);
    return grades.filter((g) => assignmentIds.includes(g.assignmentId));
  };

  // Goals operations
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 11),
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  // Schedules operations
  const addSchedule = (schedule: Omit<StudySchedule, 'id'>) => {
    const newSchedule: StudySchedule = {
      ...schedule,
      id: Math.random().toString(36).substring(2, 11),
    };
    setSchedules([...schedules, newSchedule]);
  };

  const updateSchedule = (id: string, updates: Partial<StudySchedule>) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const getSchedulesByDay = (dayOfWeek: number): StudySchedule[] => {
    return schedules.filter((s) => s.dayOfWeek === dayOfWeek);
  };

  // Groups operations
  const addGroup = (group: Omit<StudyGroup, 'id'>) => {
    const newGroup: StudyGroup = {
      ...group,
      id: Math.random().toString(36).substring(2, 11),
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroup = (id: string, updates: Partial<StudyGroup>) => {
    setGroups(groups.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGroup = (id: string) => {
    setGroups(groups.filter((g) => g.id !== id));
  };

  // Theme operations
  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme({ ...theme, ...updates });
  };

  const value: StorageContextType = {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    sessions,
    addSession,
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByAssignment,
    grades,
    addGrade,
    updateGrade,
    deleteGrade,
    getGradesBySubject,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByDay,
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    theme,
    updateTheme,
    notifications,
    updateNotifications,
    getAssignmentsBySubject,
    getUpcomingAssignments,
    getCompletedAssignments,
    getTotalHoursThisWeek,
    getCompletionRate,
  };

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
}
