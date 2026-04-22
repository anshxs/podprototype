'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStorage } from '@/context/StorageContext';
import { getMonthStart, getMonthEnd, getMonthName, getMonthYear, isSameDay, formatDateShort } from '@/lib/dateHelpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const storage = useStorage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = useMemo(() => getMonthStart(currentDate), [currentDate]);
  const monthEnd = useMemo(() => getMonthEnd(currentDate), [currentDate]);

  // Get all days to display (including padding from prev/next month)
  const calendarDays = useMemo(() => {
    const days = [];
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());

    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return days;
  }, [monthStart]);

  const getAssignmentsForDate = (date: Date) => {
    return storage.assignments.filter((a) => isSameDay(a.dueDate, date));
  };

  const getPreviousMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const getNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
  };

  const getSubjectColor = (subjectId: string) => {
    const subject = storage.subjects.find((s) => s.id === subjectId);
    return subject?.color || '#94a3b8';
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-2">View your assignments on a calendar</p>
        </div>

        {/* Calendar Card */}
        <Card className="p-6">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{getMonthYear(currentDate)}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={getPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="min-w-20"
              >
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={getNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-px mb-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="p-3 text-center font-semibold text-sm text-muted-foreground bg-secondary"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-border">
            {calendarDays.map((date, idx) => {
              const assignments = getAssignmentsForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={idx}
                  className={`min-h-32 p-2 ${
                    isCurrentMonthDay ? 'bg-background' : 'bg-muted/30'
                  } ${isTodayDate ? 'ring-2 ring-primary ring-inset' : ''}`}
                >
                  <p className={`text-sm font-semibold mb-1 ${
                    isTodayDate ? 'text-primary' : isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {date.getDate()}
                  </p>

                  {/* Assignments for this date */}
                  <div className="space-y-1">
                    {assignments.slice(0, 2).map((assignment) => (
                      <div
                        key={assignment.id}
                        className="text-xs p-1 rounded text-white truncate"
                        style={{
                          backgroundColor: getSubjectColor(assignment.subject),
                        }}
                        title={assignment.title}
                      >
                        {assignment.title}
                      </div>
                    ))}
                    {assignments.length > 2 && (
                      <p className="text-xs text-muted-foreground px-1">
                        +{assignments.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming This Month */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Assignments This Month</h3>

          {storage.assignments.filter((a) => {
            const dueDate = new Date(a.dueDate);
            return isCurrentMonth(dueDate);
          }).length === 0 ? (
            <p className="text-muted-foreground">No assignments this month</p>
          ) : (
            <div className="space-y-3">
              {storage.assignments
                .filter((a) => isCurrentMonth(new Date(a.dueDate)))
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                )
                .map((assignment) => {
                  const dueDate = new Date(assignment.dueDate);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      <div
                        className="w-3 h-10 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: getSubjectColor(assignment.subject),
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {storage.subjects.find((s) => s.id === assignment.subject)?.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium">
                          {formatDateShort(dueDate)}
                        </p>
                        <p className={`text-xs font-medium ${
                          isToday(dueDate)
                            ? 'text-orange-600'
                            : 'text-muted-foreground'
                        }`}>
                          {isToday(dueDate) ? 'Today' : dueDate.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
