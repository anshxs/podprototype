'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/context/StorageContext';
import { Trash2, Plus, Users, UserPlus, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudyGroupsPage() {
  const storage = useStorage();
  const [showForm, setShowForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [memberData, setMemberData] = useState({
    name: '',
    email: '',
  });

  const handleAddGroup = () => {
    if (!formData.name) return;

    storage.addGroup({
      name: formData.name,
      description: formData.description,
      members: [],
      sharedAssignments: [],
      createdAt: new Date().toISOString(),
    });

    setFormData({
      name: '',
      description: '',
    });
    setShowForm(false);
  };

  const handleAddMember = (groupId: string) => {
    if (!memberData.name || !memberData.email) return;

    const group = storage.groups.find((g) => g.id === groupId);
    if (group) {
      storage.updateGroup(groupId, {
        members: [
          ...group.members,
          {
            id: Math.random().toString(36).substring(2, 11),
            name: memberData.name,
            email: memberData.email,
            joinedAt: new Date().toISOString(),
          },
        ],
      });

      setMemberData({
        name: '',
        email: '',
      });
    }
  };

  const handleRemoveMember = (groupId: string, memberId: string) => {
    const group = storage.groups.find((g) => g.id === groupId);
    if (group) {
      storage.updateGroup(groupId, {
        members: group.members.filter((m) => m.id !== memberId),
      });
    }
  };

  const selectedGroup = selectedGroupId
    ? storage.groups.find((g) => g.id === selectedGroupId)
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Study Groups</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage collaborative study groups
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Group
          </Button>
        </div>

        {/* Create Group Form */}
        {showForm && (
          <AnimatedCard className="p-6 border border-cyan-400/30 bg-secondary/30">
            <h2 className="text-lg font-bold mb-4">Create Study Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Group Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Biology Study Circle"
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
                  placeholder="Describe the group purpose..."
                  className="w-full bg-card border border-border rounded-lg p-2 text-foreground resize-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddGroup}
                  className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90"
                >
                  Create Group
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups List */}
          <div>
            <GlassCard variant="primary">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Your Groups
              </h2>

              {storage.groups.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No groups yet. Create one to get started!
                </p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {storage.groups.map((group, idx) => (
                    <motion.button
                      key={group.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedGroupId(group.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedGroupId === group.id
                          ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,217,255,0.3)]'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <p className="font-medium truncate">{group.name}</p>
                      <p className="text-xs opacity-75">{group.members.length} members</p>
                    </motion.button>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Group Details */}
          {selectedGroup ? (
            <div className="lg:col-span-2">
              <AnimatedCard className="space-y-6">
                {/* Group Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedGroup.name}</h3>
                    <p className="text-muted-foreground mt-1">
                      {selectedGroup.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      storage.deleteGroup(selectedGroup.id);
                      setSelectedGroupId(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                {/* Add Member */}
                <div className="p-4 rounded-lg border border-cyan-400/30 bg-secondary/30">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Member
                  </h4>
                  <div className="space-y-2">
                    <Input
                      value={memberData.name}
                      onChange={(e) =>
                        setMemberData({ ...memberData, name: e.target.value })
                      }
                      placeholder="Member name"
                      className="bg-card border-border"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={memberData.email}
                        onChange={(e) =>
                          setMemberData({ ...memberData, email: e.target.value })
                        }
                        placeholder="Email"
                        type="email"
                        className="bg-card border-border flex-1"
                      />
                      <Button
                        onClick={() => handleAddMember(selectedGroup.id)}
                        className="bg-gradient-to-r from-cyan-400 to-blue-500"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div>
                  <h4 className="font-semibold mb-3">Members ({selectedGroup.members.length})</h4>
                  {selectedGroup.members.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      No members yet. Invite someone to start!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedGroup.members.map((member, idx) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveMember(selectedGroup.id, member.id)
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedCard>
            </div>
          ) : (
            <GlassCard variant="secondary" className="lg:col-span-2">
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  Select a group to view details and manage members
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
