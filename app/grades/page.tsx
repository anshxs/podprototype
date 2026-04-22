'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { GlassCard } from '@/components/shared/GlassCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/context/StorageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Trash2, Plus, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GradesPage() {
  const storage = useStorage();
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [comments, setComments] = useState('');

  const grades = storage.grades;
  const gradesBySubject = storage.subjects.map((subject) => {
    const subjectGrades = storage.getGradesBySubject(subject.id);
    const avg =
      subjectGrades.length > 0
        ? (subjectGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
            subjectGrades.length)
        : 0;
    return {
      subject: subject.name,
      average: Math.round(avg),
      grades: subjectGrades.length,
    };
  });

  const handleAddGrade = () => {
    if (!selectedAssignment || !score) return;

    storage.addGrade({
      assignmentId: selectedAssignment,
      score: parseFloat(score),
      maxScore: parseFloat(maxScore),
      comments: comments || undefined,
      recordedAt: new Date().toISOString(),
    });

    setScore('');
    setMaxScore('100');
    setComments('');
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-cyan-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const overallGPA = grades.length > 0
    ? (grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 4, 0) / grades.length).toFixed(2)
    : '0.00';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold gradient-text">Grade Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your grades and monitor your academic performance
          </p>
        </div>

        {/* GPA Overview */}
        {grades.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard variant="primary">
              <div className="text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Cumulative GPA</p>
                <p className="text-3xl font-bold gradient-text mt-1">{overallGPA}</p>
              </div>
            </GlassCard>
            <GlassCard variant="accent">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Total Grades</p>
                <p className="text-3xl font-bold">{grades.length}</p>
              </div>
            </GlassCard>
            <GlassCard variant="secondary">
              <div className="text-center">
                <Award className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Average Score</p>
                <p className="text-3xl font-bold">
                  {Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)}%
                </p>
              </div>
            </GlassCard>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Grade Form */}
          <div>
            <GlassCard variant="accent">
              <h2 className="text-lg font-bold mb-4">Add Grade</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Assignment</label>
                  <select
                    value={selectedAssignment}
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg p-2 text-foreground"
                  >
                    <option value="">Select assignment...</option>
                    {storage.assignments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Score</label>
                    <Input
                      type="number"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="0"
                      className="bg-card border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Out of</label>
                    <Input
                      type="number"
                      value={maxScore}
                      onChange={(e) => setMaxScore(e.target.value)}
                      placeholder="100"
                      className="bg-card border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add comments..."
                    className="w-full bg-card border border-border rounded-lg p-2 text-foreground text-sm resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleAddGrade}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record Grade
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Grades Chart */}
          <div className="lg:col-span-2">
            {gradesBySubject.some((s) => s.grades > 0) && (
              <AnimatedCard className="space-y-4">
                <h2 className="text-lg font-bold">Average by Subject</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradesBySubject.filter((s) => s.grades > 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="subject" stroke="currentColor" />
                    <YAxis stroke="currentColor" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.9)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                      }}
                    />
                    <Bar dataKey="average" fill="#00d9ff" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AnimatedCard>
            )}
          </div>
        </div>

        {/* Grades List */}
        {grades.length > 0 && (
          <AnimatedCard delay={0.2}>
            <h2 className="text-lg font-bold mb-4">All Grades</h2>
            <div className="space-y-3">
              {grades.map((grade, idx) => {
                const assignment = storage.assignments.find(
                  (a) => a.id === grade.assignmentId
                );
                const percentage = Math.round((grade.score / grade.maxScore) * 100);

                return (
                  <motion.div
                    key={grade.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold">{assignment?.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {grade.score} / {grade.maxScore}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getGradeColor(percentage)}`}>
                          {getGradeLetter(percentage)}
                        </p>
                        <p className="text-sm text-muted-foreground">{percentage}%</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          storage.deleteGrade(grade.id)
                        }
                        className="ml-3"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    {grade.comments && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {grade.comments}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </AnimatedCard>
        )}
      </div>
    </DashboardLayout>
  );
}
