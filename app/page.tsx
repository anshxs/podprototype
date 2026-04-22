'use client';

import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { GlassCard } from '@/components/shared/GlassCard';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeSettings } from '@/components/shared/ThemeSettings';
import { useStorage } from '@/context/StorageContext';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDateShort, getDaysUntil } from '@/lib/dateHelpers';
import { PRIORITY_COLORS, STATUS_LABELS } from '@/lib/constants';
import { BookOpen, Plus, CheckCircle, AlertCircle, Clock, Sparkles, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const storage = useStorage();
  const { upcomingDeadlines, overdueCount } = useNotifications();

  const completionRate = storage.getCompletionRate();
  const hoursThisWeek = storage.getTotalHoursThisWeek();
  const upcomingCount = storage.getUpcomingAssignments(7).length;

  const getSubjectColor = (subjectId: string) => {
    const subject = storage.subjects.find((s) => s.id === subjectId);
    return subject?.color || '#94a3b8';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-900';
      case 'in-progress':
        return 'bg-blue-100 text-blue-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Master your studies with intelligent planning
                </p>
              </div>
            </div>
          </motion.div>

          <Link href="/assignments">
            <Button className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
              <Plus className="w-4 h-4" />
              New Assignment
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <StatsCard
            label="Completion Rate"
            value={`${completionRate}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            trend={completionRate > 50 ? 'up' : 'neutral'}
            subtext={`${storage.getCompletedAssignments().length} of ${storage.assignments.length} done`}
          />
          <StatsCard
            label="Hours Studied"
            value={hoursThisWeek.toFixed(1)}
            icon={<Clock className="w-5 h-5" />}
            subtext="This week"
          />
          <StatsCard
            label="Upcoming"
            value={upcomingCount}
            icon={<BookOpen className="w-5 h-5" />}
            subtext="Next 7 days"
          />
          {overdueCount > 0 && (
            <StatsCard
              label="Overdue"
              value={overdueCount}
              icon={<AlertCircle className="w-5 h-5" />}
              trend="down"
              subtext="Need attention"
            />
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
          {/* Upcoming Assignments */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Upcoming Assignments</h2>
                <Link href="/assignments">
                  <button className="text-sm text-primary hover:underline">
                    View all
                  </button>
                </Link>
              </div>

              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    No upcoming assignments. Great work!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.slice(0, 5).map((assignment) => {
                    const daysLeft = getDaysUntil(assignment.dueDate);
                    const subjectColor = getSubjectColor(assignment.subject);

                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
                      >
                        <div
                          className="w-3 h-12 rounded-full flex-shrink-0"
                          style={{ backgroundColor: subjectColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {storage.subjects.find((s) => s.id === assignment.subject)?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatDateShort(assignment.dueDate)}
                            </p>
                            <p className={`text-xs ${
                              daysLeft < 1
                                ? 'text-red-600'
                                : daysLeft < 3
                                  ? 'text-orange-600'
                                  : 'text-green-600'
                            }`}>
                              {daysLeft < 0
                                ? 'Overdue'
                                : daysLeft === 0
                                  ? 'Today'
                                  : `${daysLeft}d left`}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {STATUS_LABELS[assignment.status as keyof typeof STATUS_LABELS]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Settings */}
          <div className="space-y-4">
            <GlassCard variant="accent">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link href="/timer">
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-2 hover:bg-secondary/80"
                  >
                    <Clock className="w-4 h-4" />
                    Start Study Timer
                  </Button>
                </Link>
                <Link href="/goals">
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-2 hover:bg-secondary/80"
                  >
                    <Target className="w-4 h-4" />
                    View Goals
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-2 hover:bg-secondary/80"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Analytics
                  </Button>
                </Link>
              </div>
            </GlassCard>

            {/* Subjects Summary */}
            <GlassCard variant="primary">
              <h3 className="font-bold mb-4">Subjects ({storage.subjects.length})</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {storage.subjects.map((subject, idx) => {
                  const count = storage.getAssignmentsBySubject(subject.id).length;
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="text-sm font-medium truncate">{subject.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded flex-shrink-0">
                        {count}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Theme Settings */}
            <ThemeSettings />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
