'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export function GlassCard({
  children,
  className = '',
  variant = 'primary',
}: GlassCardProps) {
  const variants = {
    primary: 'glass glow-primary',
    secondary: 'glass glow-secondary',
    accent: 'glass glow-accent',
  };

  return (
    <div className={cn(variants[variant], 'rounded-lg p-6', className)}>
      {children}
    </div>
  );
}
