'use client';
import { motion } from 'framer-motion';
import { MotionDiv } from './motion-div';

export function WireframeOverlay() {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className="absolute inset-0 overflow-hidden"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
        <defs>
          <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="hsl(var(--secondary) / 0.1)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="url(#smallGrid)" />
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--secondary) / 0.2)" strokeWidth="1" />
          </pattern>
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--secondary) / 0.1)" />
            <stop offset="50%" stopColor="hsl(var(--secondary) / 0.3)" />
            <stop offset="100%" stopColor="hsl(var(--secondary) / 0.1)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <motion.circle
          cx="50%"
          cy="50%"
          r="30%"
          fill="url(#pulseGradient)"
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      <motion.svg width="100%" height="100%" className="absolute inset-0">
        <line
          x1="0%" y1="20%"
          x2="100%" y2="40%"
          stroke="hsl(var(--secondary) / 0.3)"
          strokeWidth="1"
        />
        <line
          x1="100%" y1="80%"
          x2="0%" y2="90%"
          stroke="hsl(var(--secondary) / 0.3)"
          strokeWidth="1"
        />
         <circle
           cx="25%"
           cy="75%"
           r="50"
           stroke="hsl(var(--secondary) / 0.2)"
           strokeWidth="1"
           fill="none"
         />
        <circle
          cx="75%"
          cy="25%"
          r="30"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="1"
          fill="none"
        />
      </motion.svg>
    </MotionDiv>
  );
}
