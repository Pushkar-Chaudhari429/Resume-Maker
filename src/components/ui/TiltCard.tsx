'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className = '',
  glow = true,
  maxTilt = 8 // Maximum rotation in degrees
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth springs to avoid instant snaps
  const springConfig = { damping: 20, stiffness: 120, mass: 0.8 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Track coordinates for glow gradient
    setCoords({ x, y });

    // Calculate rotation percentage
    const xPct = x / width;
    const yPct = y / height;

    // Calculate actual rotation degrees
    const rotX = (0.5 - yPct) * maxTilt;
    const rotY = (xPct - 0.5) * maxTilt;

    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative glass-panel rounded-2xl p-6 overflow-hidden transition-all duration-300 ${
        isHovered
          ? 'shadow-[0_16px_48px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.6)] border-slate-300/40 dark:border-slate-700/40'
          : 'border-slate-200/50 dark:border-slate-800/50'
      } ${className}`}
    >
      {/* Spotlight cursor glow overlay */}
      {glow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-100 transition-opacity duration-500 bg-[radial-gradient(350px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.12),transparent_85%)] dark:bg-[radial-gradient(350px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.2),transparent_85%)] z-0"
          style={
            {
              '--x': `${coords.x}px`,
              '--y': `${coords.y}px`,
            } as React.CSSProperties
          }
        />
      )}
      
      {/* 3D depth container for inner contents */}
      <div style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
