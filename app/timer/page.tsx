'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/useTimer';
import { useStorage } from '@/context/StorageContext';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { formatDate } from '@/lib/dateHelpers';

export default function TimerPage() {
  const timer = useTimer();
  const storage = useStorage();
  const [selectedSubject, setSelectedSubject] = useState(storage.subjects[0]?.id || '');

  const handleSaveSession = () => {
    if (selectedSubject && timer.sessionsCompleted > 0) {
      storage.addSession({
        subjectId: selectedSubject,
        date: new Date().toISOString(),
        duration: timer.sessionsCompleted * 25 * 60,
        type: 'session',
      });
      timer.resetTimer();
      alert('Study session saved!');
    }
  };

  const getSubjectName = (id: string) => {
    return storage.subjects.find((s) => s.id === id)?.name || 'Unknown';
  };

  const getModeColor = () => {
    if (timer.mode === 'work') return 'text-blue-600';
    return 'text-green-600';
  };

  const getModeBackground = () => {
    if (timer.mode === 'work') return 'bg-blue-50';
    return 'bg-green-50';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Study Timer</h1>
          <p className="text-muted-foreground mt-2">
            Use the Pomodoro technique to stay focused
          </p>
        </div>

        {/* Main Timer */}
        <Card className={`p-12 text-center ${getModeBackground()}`}>
          <p className={`text-lg font-semibold mb-2 ${getModeColor()}`}>
            {timer.getDurationLabel()}
          </p>
          <div className={`text-8xl font-bold mb-6 font-mono ${getModeColor()}`}>
            {timer.formatTime()}
          </div>
          <p className="text-muted-foreground mb-6">
            Sessions completed: <span className="font-bold text-foreground">{timer.sessionsCompleted}</span>
          </p>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!timer.isRunning ? (
              <Button size="lg" onClick={timer.startTimer} className="gap-2">
                <Play className="w-5 h-5" />
                Start
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                onClick={timer.pauseTimer}
                className="gap-2"
              >
                <Pause className="w-5 h-5" />
                Pause
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              onClick={timer.resetTimer}
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={timer.skipSession}
              className="gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Skip
            </Button>
          </div>

          {/* Subject Selector */}
          <div className="mt-8 max-w-xs mx-auto">
            <label className="block text-sm font-medium mb-2">Subject/Course</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {storage.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Save Session Button */}
          {timer.sessionsCompleted > 0 && (
            <Button
              onClick={handleSaveSession}
              className="mt-6"
              variant="default"
            >
              Save {timer.sessionsCompleted} Session{timer.sessionsCompleted !== 1 ? 's' : ''} to {getSubjectName(selectedSubject)}
            </Button>
          )}
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How It Works */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">How Pomodoro Works</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="font-bold text-primary min-w-8">1</div>
                <div>
                  <p className="font-semibold">Work for 25 minutes</p>
                  <p className="text-muted-foreground">Focus on your task without distractions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold text-primary min-w-8">2</div>
                <div>
                  <p className="font-semibold">Take a 5-minute break</p>
                  <p className="text-muted-foreground">Rest and recharge</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold text-primary min-w-8">3</div>
                <div>
                  <p className="font-semibold">After 4 cycles</p>
                  <p className="text-muted-foreground">Take a longer 15-minute break</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold text-primary min-w-8">4</div>
                <div>
                  <p className="font-semibold">Repeat</p>
                  <p className="text-muted-foreground">Continue the cycle for better productivity</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Study Tips</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-lg">✓</span>
                <span>Eliminate distractions before starting a session</span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg">✓</span>
                <span>Use breaks to stretch and hydrate</span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg">✓</span>
                <span>Track your sessions to build consistency</span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg">✓</span>
                <span>Adjust timer durations if needed</span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg">✓</span>
                <span>Review your progress regularly</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
          {storage.sessions.length === 0 ? (
            <p className="text-muted-foreground">No sessions recorded yet. Start studying!</p>
          ) : (
            <div className="space-y-2">
              {storage.sessions.slice(-5).reverse().map((session, idx) => {
                const subject = storage.subjects.find((s) => s.id === session.subjectId);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      {subject && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                      )}
                      <div>
                        <p className="font-medium">{subject?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.date)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {Math.round(session.duration / 60)} min
                    </p>
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
