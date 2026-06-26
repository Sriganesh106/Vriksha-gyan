'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false);
  const [elements, setElements] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random positions only on client side
    const generatedElements = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    
    setElements(generatedElements);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Don't render on server
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {elements.map((element, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyber-green rounded-full opacity-30"
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
          }}
        />
      ))}
    </div>
  );
}
