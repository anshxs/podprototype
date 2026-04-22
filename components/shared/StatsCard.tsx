'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
}

export function StatsCard({ label, value, icon, trend, subtext }: StatsCardProps) {
  return (
    <Card className="p-6 bg-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-muted-foreground'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
    </Card>
  );
}
