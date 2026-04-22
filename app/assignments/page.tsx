'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssignments } from '@/hooks/useAssignments';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';
import { AssignmentFilters } from '@/components/assignments/AssignmentFilters';
import { Assignment } from '@/lib/types';
import { formatDateShort, getDaysUntil } from '@/lib/dateHelpers';
import { STATUS_LABELS } from '@/lib/constants';
import { Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function AssignmentsPage() {
  const assignments = useAssignments();
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filters, setFilters] = useState({});

  const filteredAssignments = useMemo(() => {
    const result = assignments.filterAssignments(filters);
    return assignments.sortByDueDate(result);
  }, [filters, assignments.assignments]);

  const stats = assignments.getAssignmentStats(filteredAssignments);

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      assignments.deleteAssignment(id);
    }
  };

  const handleToggleComplete = (assignment: Assignment) => {
    const newStatus = assignment.status === 'completed' ? 'in-progress' : 'completed';
    const completionPercentage = newStatus === 'completed' ? 100 : assignment.completionPercentage;
    assignments.updateAssignment(assignment.id, {
      status: newStatus,
      completionPercentage,
    });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-orange-500';
      default:
        return 'border-l-green-500';
    }
  };

  const getSubjectColor = (subjectId: string) => {
    const subject = assignments.subjects.find((s) => s.id === subjectId);
    return subject?.color || '#94a3b8';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Assignments</h1>
            <p className="text-muted-foreground mt-2">Manage and track all your assignments</p>
          </div>
          <Button
            onClick={() => {
              setEditingAssignment(null);
              setShowForm(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.notStarted}</p>
            <p className="text-sm text-muted-foreground">Not Started</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Filters</h3>
          <AssignmentFilters filters={filters} onFilterChange={setFilters} />
        </Card>

        {/* Assignments List */}
        <Card>
          {filteredAssignments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No assignments found</p>
              <Button
                onClick={() => {
                  setEditingAssignment(null);
                  setShowForm(true);
                }}
                variant="outline"
              >
                Create your first assignment
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredAssignments.map((assignment) => {
                const daysLeft = getDaysUntil(assignment.dueDate);
                const isOverdue = daysLeft < 0;

                return (
                  <div
                    key={assignment.id}
                    className={`p-6 border-l-4 transition-colors hover:bg-secondary ${getPriorityColor(assignment.priority)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => handleToggleComplete(assignment)}
                            className={`flex-shrink-0 transition-colors ${
                              assignment.status === 'completed'
                                ? 'text-green-600'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </button>
                          <h3
                            className={`text-lg font-semibold ${
                              assignment.status === 'completed'
                                ? 'line-through text-muted-foreground'
                                : ''
                            }`}
                          >
                            {assignment.title}
                          </h3>
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: getSubjectColor(assignment.subject) }}
                          />
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {assignment.description}
                          </p>
                        )}

                        {/* Progress Bar */}
                        {assignment.completionPercentage < 100 && (
                          <div className="mb-3 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {assignment.completionPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{
                                  width: `${assignment.completionPercentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(assignment.status)}`}>
                            {STATUS_LABELS[assignment.status as keyof typeof STATUS_LABELS]}
                          </span>
                          <span className="text-muted-foreground">
                            {assignment.estimatedHours}h estimated
                          </span>
                          <span className={`font-medium ${
                            isOverdue
                              ? 'text-red-600'
                              : daysLeft < 3
                                ? 'text-orange-600'
                                : 'text-green-600'
                          }`}>
                            {isOverdue
                              ? `${Math.abs(daysLeft)} days overdue`
                              : daysLeft === 0
                                ? 'Due today'
                                : `${daysLeft} days left`}
                          </span>
                          <span className="text-muted-foreground">
                            {formatDateShort(assignment.dueDate)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-secondary transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Forms */}
      {showForm && (
        <AssignmentForm
          assignment={editingAssignment || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}
