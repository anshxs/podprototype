'use client';

import { useStorage } from '@/context/StorageContext';
import { GlassCard } from './GlassCard';
import { Button } from '@/components/ui/button';
import { Moon, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeSettings() {
  const { theme, updateTheme } = useStorage();

  const accentColors = [
    { name: 'cyan', color: '#00d9ff' },
    { name: 'pink', color: '#ff006e' },
    { name: 'green', color: '#00ff88' },
    { name: 'purple', color: '#d946ef' },
  ];

  return (
    <GlassCard variant="primary" className="max-w-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        Appearance
      </h3>

      <div className="space-y-4">
        {/* Mode Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Theme Mode</label>
          <div className="flex gap-2">
            {['dark', 'light'].map((mode) => (
              <Button
                key={mode}
                onClick={() => updateTheme({ mode: mode as 'dark' | 'light' })}
                variant={theme.mode === mode ? 'default' : 'outline'}
                className="flex-1 capitalize"
              >
                {mode === 'dark' && <Moon className="w-4 h-4 mr-2" />}
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Accent Color Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Accent Color</label>
          <div className="grid grid-cols-4 gap-2">
            {accentColors.map((accent) => (
              <motion.button
                key={accent.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTheme({ accentColor: accent.name as any })}
                className={`w-full h-10 rounded-lg border-2 transition-all ${
                  theme.accentColor === accent.name
                    ? 'border-white shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                    : 'border-transparent hover:border-white/30'
                }`}
                style={{
                  backgroundColor: accent.color,
                  opacity: theme.accentColor === accent.name ? 1 : 0.6,
                }}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Preferences are saved automatically
        </p>
      </div>
    </GlassCard>
  );
}
