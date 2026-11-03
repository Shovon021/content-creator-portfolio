import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import InlineReelPlayer from './InlineReelPlayer';

const CATEGORY_SECTIONS = [
  {
    id: 'beauty',
    title: 'Beauty & Skincare',
    subtitle: 'Authentic product testing, real-skin tutorials, and genuine beauty reviews.'
  },
  {
    id: 'food',
    title: 'Launch & Grand Opening Promotion, Food Experience Reviews',
    subtitle: 'Aesthetic student adda spots, grand opening feasts, and beverage tastings.'
  },
  {
    id: 'fashion',
    title: 'Fashion Styling & Collection Showcase, Brand Product Review',
    subtitle: 'Graceful festive wear styling, handloom drapes, and trendy collections.'
  },
  {
    id: 'travel',
    title: 'Destination & Resort Marketing, Travel Review Content',
    subtitle: 'Immersive monsoon travel diaries, scenic tea garden breezes, and resorts.'
  },
  {
    id: 'personal',
    title: 'Campus Life & Vlogs',
    subtitle: 'Relatable student commuter comedy, campus apps, and lifestyle stories.'
  }
];

// Dynamic magazine rhythm for desktop: 3 on row 1, 2 centered on row 2
function chunkCardsForDesktopRhythm(items) {
  const n = items.length;
  if (n <= 1) return [{ type: 'single', items }];
  if (n === 2) return [{ type: 'pair', items }];
  if (n === 3) return [{ type: 'trio', items }];
  if (n === 4) return [{ type: 'quad', items }];
  if (n === 5) {
    return [
      { type: 'trio', items: items.slice(0, 3) },
      { type: 'pair', items: items.slice(3, 5) }
    ];
  }

  // General breakdown for n >= 6
  const chunks = [];
  let remaining = [...items];
  while (remaining.length > 0) {
    const len = remaining.length;
    if (len === 5) {
      chunks.push({ type: 'trio', items: remaining.slice(0, 3) });
      chunks.push({ type: 'pair', items: remaining.slice(3, 5) });
      break;
    }
    if (len === 4) {
      chunks.push({ type: 'quad', items: remaining.slice(0, 4) });
      break;
    }
    if (len === 2) {
      chunks.push({ type: 'pair', items: remaining.slice(0, 2) });
      break;
    }
    if (len === 1) {
      chunks.push({ type: 'single', items: remaining.slice(0, 1) });
      break;
    }
    chunks.push({ type: 'trio', items: remaining.slice(0, 3) });
    remaining = remaining.slice(3);
  }
  return chunks;
}

export default function WorkGallery({ projects = [], onPlayVideo }) {
  const [selectedImpact, setSelectedImpact] = useState(null);

  // Close impact modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImpact(null);
    };
    if (selectedImpact) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImpact]);

  // Dynamic categories: standard known sections + any newly added category from Google Sheets
  const dynamicCategorySections = React.useMemo(() => {
    const knownIds = new Set(CATEGORY_SECTIONS.map(s => s.id));
    const sections = [...CATEGORY_SECTIONS];

    // Collect extra categories present in projects
    const extraCategories = new Set();
    projects.forEach(p => {
      const cat = (p.category || '').toLowerCase().trim();
      if (cat && !knownIds.has(cat)) {
        extraCategories.add(cat);
      }
    });

    extraCategories.forEach(cat => {
      const sample = projects.find(p => (p.category || '').toLowerCase().trim() === cat);
      const title = sample?.categoryLabel || cat.charAt(0).toUpperCase() + cat.slice(1);
      sections.push({
        id: cat,
        title: title,
        subtitle: `Featured campaigns, reviews, and reels in ${title}.`
      });
    });

    return sections;
  }, [projects]);

  return (
    <section 
      id="gallery" 
      className="cv-auto bg-[#FAFAF8] text-[#1C1C1A] py-16 sm:py-24 transition-colors"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 space-y-20 sm:space-y-28">
        
        {/* Category Sections (Frameless, Spacious, Editorial) */}
        {dynamicCategorySections.map((section) => {
          const sectionProjects = projects.filter(p => (p.category || '').toLowerCase().trim() === section.id);
          if (sectionProjects.length === 0) return null;

          const desktopChunks = chunkCardsForDesktopRhythm(sectionProjects);

          return (
            <div key={section.id} className="space-y-8 sm:space-y-12">
              
              {/* 1. Section Header: Pure Italic Serif, Centered, No code-style labels */}
              <div className="text-center max-w-2xl mx-auto space-y-1.5 px-4">
                <h3 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#1C1C1A] font-normal tracking-tight leading-snug">
                  {section.title.split('&').map((chunk, i, arr) => (
                    <React.Fragment key={i}>
                      {chunk}
                      {i < arr.length - 1 && (
                        <span className="not-italic font-sans font-light text-[0.85em] mx-1 text-zinc-500 inline-block align-baseline">
                          &amp;
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="text-xs sm:text-sm text-[#71716E] font-sans font-normal leading-relaxed">
                  {section.subtitle}
                </p>
              </div>

              {/* 2. Mobile Layout: Horizontal Carousel (2 full reels + 3rd peeking) */}
              <div className="md:hidden">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 px-4 pb-3 -mx-4">
                  {sectionProjects.map((item) => (
                    <div 
                      key={item.id} 
                      className="w-[43vw] min-w-[155px] max-w-[210px] shrink-0 snap-start"
                    >
                      <EditorialReelCard 
                        item={item} 
                        onPlayVideo={onPlayVideo} 
                        onOpenImpact={setSelectedImpact}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Desktop Layout: 3-and-2 Magazine Rhythm with Generous 40-56px Gaps */}
              <div className="hidden md:block space-y-10 lg:space-y-14">
                {desktopChunks.map((chunk, chunkIdx) => {
                  let gridCls = "grid grid-cols-3 gap-10 lg:gap-14";
                  if (chunk.type === 'pair') {
                    gridCls = "grid grid-cols-2 max-w-3xl mx-auto gap-10 lg:gap-14";
                  } else if (chunk.type === 'quad') {
                    gridCls = "grid grid-cols-4 gap-8 lg:gap-10";
                  } else if (chunk.type === 'single') {
                    gridCls = "max-w-sm mx-auto";
                  }

                  return (
                    <div key={chunkIdx} className={gridCls}>
                      {chunk.items.map((item) => (
                        <EditorialReelCard 
                          key={item.id} 
                          item={item} 
                          onPlayVideo={onPlayVideo} 
                          onOpenImpact={setSelectedImpact}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}

      </div>

      {/* 4. "See impact" Screen-Centered Floating Modal */}
      <AnimatePresence>
        {selectedImpact && (
          <div 
            onClick={() => setSelectedImpact(null)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 border border-zinc-100"
            >
              {/* Brand Name: Small, uppercase, spaced out */}
              <div className="text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.22em] text-[#71716E]">
                {selectedImpact.brand}
              </div>

              {/* Italic Serif Headline */}
              <h4 className="font-serif italic text-lg sm:text-xl text-[#1C1C1A] leading-snug font-normal px-2">
                “{selectedImpact.headline || selectedImpact.title}”
              </h4>

              {/* Grounded 3-part Impact paragraph in clean Bengali serif */}
              <p className="font-serifBn text-xs sm:text-sm text-[#2C2C28] leading-relaxed text-center px-1">
                {selectedImpact.impact}
              </p>

              {/* Close Action */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedImpact(null)}
                  className="text-xs text-[#71716E] hover:text-[#1C1C1A] underline underline-offset-4 cursor-pointer font-sans transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

// Minimal Frameless Reel Card (Video is the star, no card box, no border, no shadow)
function EditorialReelCard({ item, onPlayVideo, onOpenImpact }) {
  return (
    <article
      data-testid={`reel-card-${item.id}`}
      className="group flex flex-col select-none transition-all duration-300"
    >
      {/* 1. Video Reel Frame (9:16 vertical ratio, 4-6px subtle rounded corner, no border) */}
      <div className="w-full">
        <InlineReelPlayer 
          item={item} 
          aspect="9/16" 
          onOpenTheater={onPlayVideo} 
        />
      </div>

      {/* 2. Brand Name: Small, uppercase, letter-spaced, centered */}
      <div className="text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.22em] text-[#71716E] text-center mt-3 sm:mt-4 truncate px-1">
        {item.brand}
      </div>

      {/* 3. One-line Caption: Italic serif, centered, max 1 line */}
      <p className="font-serif italic text-sm sm:text-base text-[#1C1C1A] text-center leading-snug mt-1 truncate px-1">
        “{item.headline || item.title}”
      </p>

      {/* 4. "See impact": Small underlined text link, centered, no button, no box */}
      <div className="text-center mt-1.5">
        <button
          onClick={() => onOpenImpact(item)}
          className="text-[11px] sm:text-xs text-[#71716E] hover:text-[#1C1C1A] underline underline-offset-4 decoration-[#71716E]/40 hover:decoration-[#1C1C1A] cursor-pointer transition-colors font-sans font-normal"
        >
          See impact
        </button>
      </div>

    </article>
  );
}
