import React from 'react';
import { testimonials } from '../data/testimonialsData';

/**
 * BrandFeedback Component
 * Renders real client testimonials only.
 * If there are no verified testimonials in testimonialsData.js, this component cleanly renders null.
 */
export default function BrandFeedback() {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="feedback" className="bg-[#FAFAF9] text-zinc-900 py-16 border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif italic text-3xl font-bold text-zinc-900 mb-8">
          পার্টনারদের মতামত
        </h2>
        <div className="space-y-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="max-w-2xl mx-auto">
              <blockquote className="text-lg text-zinc-800 leading-relaxed font-normal">
                "{t.quote}"
              </blockquote>
              <div className="mt-2 text-sm font-bold text-zinc-900">
                {t.author} • <span className="text-zinc-500 font-normal">{t.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
