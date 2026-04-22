'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/context/StorageContext';
import { Goal, Milestone } from '@/lib/types';
import { PRIORITY_COLORS } from '@/lib/constants';
import { Trash2, Plus, CheckCircle2, Circle, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDaysUntil } from '@/lib/dateHelpers';

export default function GoalsPage() {
  const storage = useStorage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    unit: 'hours' as const,
    priority: 'high' as const,
    dueDate: '',
  });

  const handleAddGoal = () => {
    if (!formData.title || !formData.targetValue || !formData.dueDate) return;

    storage.addGoal({
      title: formData.title,
      description: formData.description,
      targetValue: parseInt(formData.targetValue),
      currentValue: 0,
      unit: formData.unit,
      dueDate: formData.dueDate,
      priority: formData.priority,
      milestones: [],
    });

    setFormData({
      title: '',
      description: '',
      targetValue: '',
      unit: 'hours',
      priority: 'high',
      dueDate: '',
    });
    setShowForm(false);
  };

  const handleAddMilestone = (goalId: string) => {
    const title = prompt('Milestone title:');
    const target = prompt('Target value:');

    if (title && target) {
      const goal = storage.goals.find((g) => g.id === goalId);
      if (goal) {
        storage.updateGoal(goalId, {
          milestones: [
            ...goal.milestones,
            {
              id: Math.random().toString(36).substring(2, 11),
              goalId,
              title,
              targetValue: parseInt(target),
              completed: false,
            },
          ],
        });
      }
    }
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = storage.goals.find((g) => g.id === goalId);
    if (goal) {
      storage.updateGoal(goalId, {
        milestones: goal.milestones.map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                completed: !m.completed,
                completedAt: !m.completed ? new Date().toISOString() : undefined,
              }
            : m
        ),
      });
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return goal.targetValue > 0
      ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
      : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Study Goals</h1>
            <p className="text-muted-foreground mt-2">
              Set and track your learning objectives
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <AnimatedCard className="p-6 border border-cyan-400/30 bg-secondary/30">
            <h2 className="text-lg font-bold mb-4">Create New Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Complete 20 hours of study"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your goal..."
                  className="w-full bg-card border border-border rounded-lg p-2 text-foreground resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Value</label>
                  <Input
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) =>
                      setFormData({ ...formData, targetValue: e.target.value })
                    }
                    placeholder="10"
                    className="bg-card border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unit: e.target.value as 'hours' | 'percentage' | 'count',
                      })
                    }
                    className="w-full bg-card border border-border rounded-lg p-2 text-foreground"
                  >
                    <option value="hours">Hours</option>
                    <option value="percentage">Percentage</option>
                    <option value="count">Count</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="bg-card border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as 'low' | 'medium' | 'high',
                    })
                  }
                  className="w-full bg-card border border-border rounded-lg p-2 text-foreground"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddGoal}
                  className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90"
                >
                  Create Goal
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

        {/* Goals Grid */}
        {storage.goals.length === 0 ? (
          <GlassCard variant="secondary">
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No goals yet. Create your first goal to get started!
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storage.goals.map((goal, idx) => {
              const progress = getProgressPercentage(goal);
              const daysLeft = getDaysUntil(goal.dueDate);
              const priorityColor = PRIORITY_COLORS[goal.priority];
              const completedMilestones = goal.milestones.filter(
                (m) => m.completed
              ).length;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-lg border border-cyan-400/30 bg-secondary/30 hover:bg-secondary/50 transition-all smooth-transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Zap
                        className="w-5 h-5"
                        style={{ color: priorityColor }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => storage.deleteGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {daysLeft} days left
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
                  </div>

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <div className="mb-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-xs font-semibold mb-2 text-cyan-300">
                        Milestones ({completedMilestones}/{goal.milestones.length})
                      </p>
                      <div className="space-y-2">
                        {goal.milestones.map((milestone) => (
                          <button
                            key={milestone.id}
                            onClick={() =>
                              handleToggleMilestone(goal.id, milestone.id)
                            }
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/30 transition-colors text-sm"
                          >
                            {milestone.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                              {milestone.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddMilestone(goal.id)}
                    className="w-full text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Milestone
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
