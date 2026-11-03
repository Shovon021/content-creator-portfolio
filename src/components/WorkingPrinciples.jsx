import React from 'react';
import { clientLogos } from '../data/portfolioData';

/**
 * WorkingPrinciples Component:
 * - 3 Honest Principles in clean English (No fake claims, calm editorial typography).
 * - Infinite smooth auto-scrolling brand logo marquee (left-to-right loop, zero scrollbars).
 */
export default function WorkingPrinciples() {
  const principles = [
    {
      num: "01",
      title: "Personally Tested",
      desc: "I only promote spots, food, and products I genuinely visit, test, and believe in."
    },
    {
      num: "02",
      title: "Clear Expectations",
      desc: "Concepts, deliverables, and package timelines are agreed upon upfront with full transparency."
    },
    {
      num: "03",
      title: "Authentic Delivery",
      desc: "No exaggerated claims or scripted hype — honest presentation that viewers actually trust."
    }
  ];

  // Duplicate logos for seamless infinite looping
  const marqueeLogos = [...clientLogos, ...clientLogos];

  return (
    <section id="principles" className="cv-auto bg-[#FAF9F6] text-zinc-900 py-16 sm:py-24 border-b border-zinc-200/70 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        
        {/* 1. How I Work - 3 Principles */}
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-400">
              MY WORKING PRINCIPLES
            </p>
            <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-zinc-900 font-bold tracking-tight">
              3 Working Principles
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans max-w-lg mx-auto">
              Standards I follow on every campaign to protect brand trust and drive real engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto pt-2">
            {principles.map((item) => (
              <div key={item.num} className="space-y-2.5 text-center">
                <span className="font-serif italic text-3xl sm:text-4xl text-pink-400/80 font-bold select-none block">
                  {item.num}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xs mx-auto font-normal font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Genuine Brands Worked With - Infinite Smooth Marquee Loop (Left-to-Right) */}
        <div className="pt-10 border-t border-zinc-200/60 space-y-6">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-400">
            BRANDS I’VE WORKED WITH
          </p>

          <div className="relative w-full overflow-hidden py-3">
            {/* Left and Right Subtle Fade Masks for Premium Editorial Feel */}
            <div className="pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10" />

            {/* Seamless Infinite Looping Marquee Moving Left to Right */}
            <div className="animate-marquee-reverse items-center gap-8 sm:gap-12 md:gap-14">
              {marqueeLogos.map((brand, idx) => (
                <div 
                  key={`${brand.id}-${idx}`} 
                  className="shrink-0 flex items-center justify-center h-10 sm:h-12 px-2 transition-transform duration-300 hover:scale-110 cursor-pointer" 
                  title={brand.name}
                >
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-h-7 sm:max-h-9 max-w-[110px] w-auto object-contain filter grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                    width={110}
                    height={36}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
