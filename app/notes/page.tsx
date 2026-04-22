'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { GlassCard } from '@/components/shared/GlassCard';
import { RichTextEditor } from '@/components/notes/RichTextEditor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/context/StorageContext';
import { Trash2, Plus, Edit2, BookOpen, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotesPage() {
  const storage = useStorage();
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  const selectedAssignmentData = storage.assignments.find(
    (a) => a.id === selectedAssignment
  );
  const notes = selectedAssignment
    ? storage.getNotesByAssignment(selectedAssignment)
    : [];

  const handleSaveNote = () => {
    if (!selectedAssignment || !noteTitle.trim()) return;

    if (editingNoteId) {
      storage.updateNote(editingNoteId, {
        title: noteTitle,
        content: noteContent,
        tags: noteTags.split(',').map((t) => t.trim()),
      });
      setEditingNoteId(null);
    } else {
      storage.addNote({
        assignmentId: selectedAssignment,
        title: noteTitle,
        content: noteContent,
        tags: noteTags.split(',').map((t) => t.trim()),
      });
    }

    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setNoteTags(note.tags.join(', '));
    }
  };

  const handleDeleteNote = (noteId: string) => {
    storage.deleteNote(noteId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold gradient-text">Study Notes</h1>
          <p className="text-muted-foreground mt-2">
            Take rich, organized notes for your assignments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment Selection */}
          <div>
            <GlassCard variant="primary">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Assignments
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {storage.assignments.map((assignment, idx) => (
                  <motion.button
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedAssignment(assignment.id);
                      setEditingNoteId(null);
                      setNoteTitle('');
                      setNoteContent('');
                      setNoteTags('');
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedAssignment === assignment.id
                        ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,217,255,0.3)]'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <p className="font-medium truncate">{assignment.title}</p>
                    <p className="text-xs opacity-75">{assignment.subject}</p>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Note Editor */}
          <div className="lg:col-span-2">
            {selectedAssignmentData ? (
              <AnimatedCard className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Note Title</label>
                    <Input
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Enter note title..."
                      className="bg-card border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags</label>
                    <Input
                      value={noteTags}
                      onChange={(e) => setNoteTags(e.target.value)}
                      placeholder="Separate tags with commas..."
                      className="bg-card border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <RichTextEditor
                      value={noteContent}
                      onChange={setNoteContent}
                      placeholder="Start taking notes..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveNote}
                      className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {editingNoteId ? 'Update Note' : 'Save Note'}
                    </Button>
                    {editingNoteId && (
                      <Button
                        onClick={() => {
                          setEditingNoteId(null);
                          setNoteTitle('');
                          setNoteContent('');
                          setNoteTags('');
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {/* Saved Notes */}
                {notes.length > 0 && (
                  <div className="border-t border-border pt-6">
                    <h3 className="font-bold mb-4">Saved Notes</h3>
                    <div className="space-y-3">
                      {notes.map((note, idx) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold">{note.title}</h4>
                              {note.tags.length > 0 && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {note.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {note.content.replace(/<[^>]*>/g, '')}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditNote(note.id)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </AnimatedCard>
            ) : (
              <GlassCard variant="secondary">
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    Select an assignment to start taking notes
                  </p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
