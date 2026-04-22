'use client';

import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/context/StorageContext';
import { ThemeSettings } from '@/components/shared/ThemeSettings';
import { Bell, Moon, Zap, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { notifications, updateNotifications, theme } = useStorage();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize your study planner experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appearance Settings */}
            <AnimatedCard delay={0.1}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Appearance
              </h2>

              <div className="p-6 rounded-lg border border-cyan-400/30 bg-secondary/30">
                <h3 className="font-semibold mb-4">Theme Customization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred dark mode accent color for a personalized experience
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Theme</label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                      <Moon className="w-5 h-5 text-primary" />
                      <span className="font-medium capitalize">{theme.mode} Mode</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        with {theme.accentColor} accents
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Notification Settings */}
            <AnimatedCard delay={0.2}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-primary" />
                Notifications
              </h2>

              <div className="p-6 rounded-lg border border-cyan-400/30 bg-secondary/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Enable Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get alerts for upcoming deadlines
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateNotifications({ enabled: !notifications.enabled })
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      notifications.enabled ? 'bg-primary' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        notifications.enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {notifications.enabled && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Alert Days Before Due Date
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={notifications.upcomingDays}
                      onChange={(e) =>
                        updateNotifications({
                          upcomingDays: parseInt(e.target.value),
                        })
                      }
                      className="bg-card border-border"
                    />
                  </div>
                )}
              </div>
            </AnimatedCard>

            {/* Danger Zone */}
            <AnimatedCard delay={0.3}>
              <h2 className="text-2xl font-bold mb-6 text-red-400">Danger Zone</h2>

              <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/5">
                <h3 className="font-semibold mb-2">Reset All Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete all your study planner data. This action cannot be
                  undone.
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All Data
                </Button>
              </div>
            </AnimatedCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AnimatedCard delay={0.4}>
              <ThemeSettings />
            </AnimatedCard>

            {/* Quick Info */}
            <GlassCard variant="secondary">
              <h3 className="font-bold mb-4">About</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-semibold">2.0 (Enhanced)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data Storage</p>
                  <p className="font-semibold">Browser LocalStorage</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
