'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hoverable?: boolean;
}

export function AnimatedCard({
  children,
  delay = 0,
  className = '',
  hoverable = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverable ? { y: -4, boxShadow: '0 20px 40px rgba(0, 217, 255, 0.15)' } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
