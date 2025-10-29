'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export default function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0
}: SlideInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const getInitialPosition = () => {
    switch(direction) {
      case 'left':
        return { x: -100, y: 0 };
      case 'right':
        return { x: 100, y: 0 };
      case 'up':
        return { x: 0, y: 100 };
      case 'down':
        return { x: 0, y: -100 };
      default:
        return { x: -100, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...getInitialPosition(),
      }}
      animate={isInView ? {
        opacity: 1,
        x: 0,
        y: 0,
      } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}