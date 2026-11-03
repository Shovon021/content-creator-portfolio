import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { portraitLooks } from '../data/portfolioData';

// Words for the scroll-driven kinetic reveal
const WORDS = [
  "“Years", "of", "Tasting,", 
  "Travelling", "&", "Styling,", 
  "So", "You", "Don’t", "Have", "To", "Guess.”"
];

function ScrollWord({ word, index, total, progress, shouldReduceMotion }) {
  // Stagger illumination across scroll progress
  // Word 0 starts at 0.05, last word finishes at 0.85
  const start = 0.05 + (index / total) * 0.75;
  const end = start + (1 / total) * 0.75;

  const opacity = useTransform(
    progress,
    [start, end],
    shouldReduceMotion ? [1, 1] : [0.22, 1]
  );

  const scale = useTransform(
    progress,
    [start, end],
    shouldReduceMotion ? [1, 1] : [0.94, 1]
  );

  const y = useTransform(
    progress,
    [start, end],
    shouldReduceMotion ? [0, 0] : [6, 0]
  );

  return (
    <motion.span
      style={{ opacity, scale, y }}
      className="inline-block mx-1 sm:mx-2 md:mx-2.5 my-1 transition-all"
    >
      {word}
    </motion.span>
  );
}

/**
 * ScrollStatement
 * Scroll-driven Statement Section with tactile word-by-word kinetic illumination.
 * 
 * Features:
 * - Half-height proportion (min-h-[48vh], py-16 sm:py-24), perfectly sized as showcase header.
 * - ZERO extra text — purely the bold italic quote headline.
 * - High-visibility Scroll-Driven UX: each word sequentially illuminates from dim to radiant white
 *   as the user scrolls past.
 * - Solid vibrant color background synced with the active homepage look.
 * - 100% native scroll performance with zero scroll-jacking or lag.
 */
export default function ScrollStatement({ activeLookIndex = 0 }) {
  const activeLook = portraitLooks[activeLookIndex] || portraitLooks[0];
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Map scroll progress across viewport entry
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 92%', 'end 35%']
  });

  // Overall container subtle zoom/focus
  const containerScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [1, 1, 1] : [0.97, 1, 0.98]
  );

  // Subtle bottom progress bar indicator
  const progressLineWidth = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    ['0%', '100%']
  );

  return (
    <section 
      ref={containerRef}
      aria-label="Showcase Manifesto"
      className="w-full relative overflow-hidden py-5 sm:py-7 md:py-8 text-center select-none"
      style={{
        backgroundColor: activeLook.accentColor || '#BE185D',
        transition: 'background-color 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Subtle luxury ambient depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />

      {/* Main Content Area */}
      <motion.div 
        style={{ scale: containerScale }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center"
      >
        {/* Core Bold Italic Headline with Word-by-Word Scroll Illumination */}
        <h2 className="font-serif italic font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight sm:leading-snug tracking-tight drop-shadow-sm flex flex-wrap items-center justify-center">
          {WORDS.map((word, idx) => (
            <ScrollWord 
              key={idx}
              word={word}
              index={idx}
              total={WORDS.length}
              progress={scrollYProgress}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </h2>

        {/* Minimal Scroll Progress Accent Line */}
        <div className="w-20 sm:w-28 h-[2px] bg-white/20 rounded-full mx-auto mt-3.5 sm:mt-4 overflow-hidden">
          <motion.div 
            style={{ width: progressLineWidth }}
            className="h-full bg-white/75 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
