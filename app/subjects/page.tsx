'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/context/StorageContext';
import { Subject } from '@/lib/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface SubjectFormData {
  name: string;
  color: string;
  icon: string;
}

const ICON_OPTIONS = [
  'calculator',
  'book-open',
  'flask',
  'clock',
  'code',
  'palette',
  'music',
  'globe',
  'zap',
  'microscope',
];

const COLOR_OPTIONS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#06b6d4',
];

export default function SubjectsPage() {
  const storage = useStorage();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    color: COLOR_OPTIONS[0],
    icon: ICON_OPTIONS[0],
  });

  const handleOpenForm = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        color: subject.color,
        icon: subject.icon,
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        color: COLOR_OPTIONS[0],
        icon: ICON_OPTIONS[0],
      });
    }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a subject name');
      return;
    }

    if (editingSubject) {
      storage.updateSubject(editingSubject.id, formData);
    } else {
      storage.addSubject(formData);
    }

    setShowForm(false);
    setEditingSubject(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This will delete all assignments for this subject.')) {
      storage.deleteSubject(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Subjects</h1>
            <p className="text-muted-foreground mt-2">Organize your courses and subjects</p>
          </div>
          <Button onClick={() => handleOpenForm()} className="gap-2">
            <Plus className="w-4 h-4" />
            New Subject
          </Button>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storage.subjects.map((subject) => {
            const assignmentCount = storage.getAssignmentsBySubject(subject.id).length;

            return (
              <Card key={subject.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.icon.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenForm(subject)}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{subject.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {assignmentCount} assignment{assignmentCount !== 1 ? 's' : ''}
                </p>

                <div className="pt-4 border-t border-border">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-xs text-muted-foreground ml-2">{subject.color}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {storage.subjects.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No subjects yet</p>
            <Button onClick={() => handleOpenForm()} variant="outline">
              Create your first subject
            </Button>
          </Card>
        )}
      </div>

      {/* Subject Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingSubject ? 'Edit Subject' : 'New Subject'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, color })
                        }
                        className={`w-full h-10 rounded-lg border-2 transition-all ${
                          formData.color === color
                            ? 'border-foreground'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mx-auto mb-2"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium">{formData.name || 'Subject Name'}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSubject ? 'Update' : 'Create'} Subject
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
