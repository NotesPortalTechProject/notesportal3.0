'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingDots({ text = 'Loading' }) {
  const bounceTransition = {
    repeat: Infinity,
    repeatType: 'mirror',
    duration: 0.6,
    ease: 'easeInOut',
  };

  return (
    <div className="flex items-center justify-center h-12 px-4 space-x-3 text-neutral-300 text-base font-medium">
      <span>{text}</span>
      <div className="flex space-x-2">
        <motion.span
          className="w-2.5 h-2.5 bg-neutral-300 rounded-full opacity-70"
          animate={{ y: [0, -6, 0] }}
          transition={{ ...bounceTransition, delay: 0 }}
        />
        <motion.span
          className="w-2.5 h-2.5 bg-neutral-300 rounded-full opacity-70"
          animate={{ y: [0, -6, 0] }}
          transition={{ ...bounceTransition, delay: 0.15 }}
        />
        <motion.span
          className="w-2.5 h-2.5 bg-neutral-300 rounded-full opacity-70"
          animate={{ y: [0, -6, 0] }}
          transition={{ ...bounceTransition, delay: 0.3 }}
        />
      </div>
    </div>
  );
}
