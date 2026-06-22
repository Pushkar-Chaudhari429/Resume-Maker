'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  magnetic?: boolean;
  ripple?: boolean;
  stars?: boolean;
  glowTrail?: boolean;
  shineSweep?: boolean;
  children?: React.ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function Button({
  variant = 'primary',
  magnetic = false,
  ripple = true,
  stars = false,
  glowTrail = false,
  shineSweep = false,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Motion values for magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for magnetic move
  const springConfig = { damping: 15, elasticity: 0.1, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    if (magnetic) {
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const moveX = (clientX - centerX) * 0.35; // Magnet strength
      const moveY = (clientY - centerY) * 0.35;
      x.set(moveX);
      y.set(moveY);
    }

    if (glowTrail) {
      setCoords({
        x: clientX - left,
        y: clientY - top
      });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && ref.current) {
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const xPos = clientX - left;
      const yPos = clientY - top;
      const size = Math.max(width, height) * 2.5;

      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x: xPos,
        y: yPos,
        size
      };

      setRipples((prev) => [...prev, newRipple]);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles = "relative inline-flex items-center justify-center font-medium px-5 py-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none overflow-hidden cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-white shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.4)] border border-primary/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
    glass: "glass-panel hover:bg-slate-50/10 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-100 shadow-glass border-white/20 dark:border-slate-800",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.25)] border border-red-500/20"
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      className={classes}
      {...props}
    >
      {/* Glow Trail Spotlight */}
      {glowTrail && hovered && (
        <span
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(70px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.12), transparent 80%)`
          }}
        />
      )}

      {/* Shine Sweep Overlay */}
      {shineSweep && hovered && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: '-150%' }}
          animate={{ x: '150%' }}
          transition={{ repeat: Infinity, repeatDelay: 1.2, duration: 1.2, ease: 'linear' }}
        />
      )}

      {/* Twinkling Animated Stars */}
      {stars && hovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Star 1 */}
          <motion.svg
            className="absolute top-1.5 left-3 w-2.5 h-2.5 text-yellow-100 fill-current opacity-80"
            viewBox="0 0 24 24"
            animate={{ scale: [0, 1.2, 0], y: [0, -6, 0], rotate: [0, 90, 180] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M12 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
          </motion.svg>
          {/* Star 2 */}
          <motion.svg
            className="absolute bottom-2 right-4 w-2 h-2 text-white fill-current opacity-70"
            viewBox="0 0 24 24"
            animate={{ scale: [0, 1.3, 0], y: [0, -5, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <path d="M12 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
          </motion.svg>
          {/* Star 3 */}
          <motion.svg
            className="absolute top-3 right-8 w-1.5 h-1.5 text-blue-200 fill-current opacity-80"
            viewBox="0 0 24 24"
            animate={{ scale: [0, 1, 0], y: [0, -4, 0], rotate: [0, -90, -180] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <path d="M12 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
          </motion.svg>
        </div>
      )}

      {/* Ripple Click Elements */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            x: '-50%',
            y: '-50%',
          }}
          onAnimationComplete={() => {
            setRipples((prev) => prev.filter((item) => item.id !== r.id));
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
