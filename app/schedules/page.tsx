'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/context/StorageContext';
import { Trash2, Plus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function SchedulesPage() {
  const storage = useStorage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
  });

  const handleAddSchedule = () => {
    if (!formData.subjectId) return;

    storage.addSchedule({
      subjectId: formData.subjectId,
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      recurring: true,
    });

    setFormData({
      subjectId: '',
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '10:00',
    });
    setShowForm(false);
  };

  const getSubjectName = (subjectId: string) => {
    return storage.subjects.find((s) => s.id === subjectId)?.name || 'Unknown';
  };

  const getSubjectColor = (subjectId: string) => {
    return storage.subjects.find((s) => s.id === subjectId)?.color || '#94a3b8';
  };

  const schedulesByDay = DAYS_OF_WEEK.map((day, idx) => ({
    day,
    dayOfWeek: idx,
    schedules: storage.getSchedulesByDay(idx).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    ),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Study Schedule</h1>
            <p className="text-muted-foreground mt-2">
              Plan your weekly study sessions
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Session
          </Button>
        </div>

        {/* Add Schedule Form */}
        {showForm && (
          <AnimatedCard className="p-6 border border-cyan-400/30 bg-secondary/30">
            <h2 className="text-lg font-bold mb-4">Schedule Study Session</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectId: e.target.value })
                  }
                  className="w-full bg-card border border-border rounded-lg p-2 text-foreground"
                >
                  <option value="">Select a subject...</option>
                  {storage.subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Day</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })
                  }
                  className="w-full bg-card border border-border rounded-lg p-2 text-foreground"
                >
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <option key={idx} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="bg-card border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="bg-card border-border"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddSchedule}
                  className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90"
                >
                  Schedule Session
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </AnimatedCard>
        )}

        {/* Weekly Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {schedulesByDay.map((dayData, dayIdx) => (
            <motion.div
              key={dayData.dayOfWeek}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIdx * 0.1 }}
            >
              <GlassCard variant="primary">
                <h3 className="text-lg font-bold mb-4">{dayData.day}</h3>

                {dayData.schedules.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No sessions scheduled
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dayData.schedules.map((schedule, idx) => (
                      <motion.div
                        key={schedule.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 rounded-lg border-l-4 bg-slate-800/30"
                        style={{
                          borderLeftColor: getSubjectColor(schedule.subjectId),
                        }}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">
                              {getSubjectName(schedule.subjectId)}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => storage.deleteSchedule(schedule.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        {storage.schedules.length > 0 && (
          <AnimatedCard delay={0.3} className="p-6 border border-cyan-400/30 bg-secondary/30 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Schedule Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">
                  {storage.schedules.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">
                  {Math.round(
                    storage.schedules.reduce((sum, s) => {
                      const [startH, startM] = s.startTime.split(':').map(Number);
                      const [endH, endM] = s.endTime.split(':').map(Number);
                      return sum + ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
                    }, 0) * 10
                  ) / 10}
                </p>
                <p className="text-sm text-muted-foreground">Hours/Week</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">
                  {new Set(storage.schedules.map((s) => s.subjectId)).size}
                </p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
            </div>
          </AnimatedCard>
        )}
      </div>
    </DashboardLayout>
  );
}
