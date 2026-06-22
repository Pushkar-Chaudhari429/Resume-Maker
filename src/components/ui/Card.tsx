'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = true }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glow) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setCoords({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative glass-panel rounded-2xl p-6 overflow-hidden transition-shadow duration-300 ${
        isHovered ? 'shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]' : ''
      } ${className}`}
    >
      {/* Dynamic Cursor Spotlight Border/Glow */}
      {glow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-100 transition-opacity duration-500 bg-[radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.15),transparent_80%)] dark:bg-[radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.25),transparent_80%)]"
          style={
            {
              '--x': `${coords.x}px`,
              '--y': `${coords.y}px`,
            } as React.CSSProperties
          }
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
