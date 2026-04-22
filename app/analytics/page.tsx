'use client';

import { useMemo } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/shared/StatsCard';
import { useStorage } from '@/context/StorageContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, CheckCircle, BookOpen, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const storage = useStorage();

  // Data calculations
  const completionByStatus = useMemo(() => {
    const statusCounts = {
      'Not Started': 0,
      'In Progress': 0,
      'Completed': 0,
    };

    storage.assignments.forEach((a) => {
      if (a.status === 'not-started') statusCounts['Not Started']++;
      else if (a.status === 'in-progress') statusCounts['In Progress']++;
      else if (a.status === 'completed') statusCounts['Completed']++;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [storage.assignments]);

  const completionBySubject = useMemo(() => {
    return storage.subjects.map((subject) => {
      const subjectAssignments = storage.getAssignmentsBySubject(subject.id);
      const completed = subjectAssignments.filter(
        (a) => a.status === 'completed'
      ).length;

      return {
        name: subject.name,
        completed,
        total: subjectAssignments.length,
        percentage:
          subjectAssignments.length === 0
            ? 0
            : Math.round((completed / subjectAssignments.length) * 100),
        color: subject.color,
      };
    });
  }, [storage.assignments, storage.subjects]);

  const priorityDistribution = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    storage.assignments.forEach((a) => {
      if (a.priority === 'low') counts.Low++;
      else if (a.priority === 'medium') counts.Medium++;
      else if (a.priority === 'high') counts.High++;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [storage.assignments]);

  const averageCompletionTime = useMemo(() => {
    const completedAssignments = storage.assignments.filter(
      (a) => a.status === 'completed'
    );
    if (completedAssignments.length === 0) return 0;

    const totalHours = completedAssignments.reduce(
      (sum, a) => sum + a.estimatedHours,
      0
    );
    return (totalHours / completedAssignments.length).toFixed(1);
  }, [storage.assignments]);

  const totalHoursEstimated = useMemo(() => {
    return storage.assignments
      .reduce((sum, a) => sum + a.estimatedHours, 0)
      .toFixed(1);
  }, [storage.assignments]);

  const overdueCount = useMemo(() => {
    const now = new Date();
    return storage.assignments.filter((a) => {
      const dueDate = new Date(a.dueDate);
      return dueDate < now && a.status !== 'completed';
    }).length;
  }, [storage.assignments]);

  const completionRate = storage.getCompletionRate();

  // Color palettes
  const COLORS = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    secondary: '#8b5cf6',
  };

  const STATUS_COLORS = ['#ef4444', '#f59e0b', '#10b981'];
  const PRIORITY_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your progress and study insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            label="Completion Rate"
            value={`${completionRate}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            trend={completionRate > 50 ? 'up' : 'neutral'}
          />
          <StatsCard
            label="Total Hours"
            value={totalHoursEstimated}
            icon={<Clock className="w-5 h-5" />}
            subtext="Estimated study time"
          />
          <StatsCard
            label="Avg per Assignment"
            value={averageCompletionTime}
            icon={<TrendingUp className="w-5 h-5" />}
            subtext="Hours"
          />
          <StatsCard
            label="Overdue"
            value={overdueCount}
            icon={<BookOpen className="w-5 h-5" />}
            trend={overdueCount === 0 ? 'up' : 'down'}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion by Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Assignment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Priority Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Completion by Subject */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Progress by Subject</h3>
            <div className="space-y-4">
              {completionBySubject.map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {subject.completed}/{subject.total}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${subject.percentage}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subject.percentage}% complete
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Study Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Study Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Assignments This Week</p>
              <p className="text-2xl font-bold">
                {storage.getUpcomingAssignments(7).length}
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Hours Studied This Week</p>
              <p className="text-2xl font-bold">
                {storage.getTotalHoursThisWeek().toFixed(1)}h
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Most Busy Subject</p>
              <p className="text-2xl font-bold">
                {completionBySubject.reduce((max, s) =>
                  s.total > max.total ? s : max
                )?.name || 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
