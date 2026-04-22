'use client';

import { useState } from 'react';
import { useStorage } from '@/context/StorageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Assignment, AssignmentStatus, Priority } from '@/lib/types';
import { X } from 'lucide-react';

interface AssignmentFormProps {
  assignment?: Assignment;
  onClose: () => void;
  onSubmit?: () => void;
}

export function AssignmentForm({ assignment, onClose, onSubmit }: AssignmentFormProps) {
  const storage = useStorage();
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    subject: assignment?.subject || storage.subjects[0]?.id || '',
    description: assignment?.description || '',
    dueDate: assignment?.dueDate?.split('T')[0] || '',
    status: (assignment?.status || 'not-started') as AssignmentStatus,
    priority: (assignment?.priority || 'medium') as Priority,
    estimatedHours: assignment?.estimatedHours || 1,
    completionPercentage: assignment?.completionPercentage || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estimatedHours' || name === 'completionPercentage'
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (assignment) {
      storage.updateAssignment(assignment.id, {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      });
    } else {
      storage.addAssignment({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      });
    }

    onSubmit?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {assignment ? 'Edit Assignment' : 'New Assignment'}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Assignment Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Biology Lab Report"
                required
              />
            </div>

            {/* Subject & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {storage.subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date *</label>
                <Input
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Estimated Hours & Completion */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Estimated Hours
                </label>
                <Input
                  name="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Completion % ({formData.completionPercentage}%)
                </label>
                <Input
                  name="completionPercentage"
                  type="range"
                  value={formData.completionPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any notes or details about this assignment..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {assignment ? 'Update' : 'Create'} Assignment
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
