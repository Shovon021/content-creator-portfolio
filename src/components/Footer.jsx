import React from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Footer Component:
 * - Displays the custom cinematic Dear Ekra footer artwork featuring Ekra's diverse looks,
 *   lush rolling hills, and the integrated "DearEkra" watermark.
 * - Floating Back to Top action button.
 */
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="cv-auto relative w-full bg-white overflow-hidden select-none">
      
      {/* Cinematic Full-Width Footer Artwork */}
      <div className="relative w-full max-w-[1920px] mx-auto flex flex-col items-center justify-end">
        <picture>
          <source srcSet="/portraits/dear-ekra-footer-art-money.webp" type="image/webp" />
          <img
            src="/portraits/dear-ekra-footer-art-money.jpg"
            alt="Dear Ekra - Dhaka's Leading Lifestyle & Food Creator"
            className="w-full h-auto object-cover object-bottom block select-none pointer-events-none"
            loading="lazy"
            decoding="async"
            width={1024}
            height={572}
          />
        </picture>
      </div>

      {/* Floating Back to Top Button */}
      <div className="absolute right-4 sm:right-8 bottom-6 sm:bottom-8 z-30">
        <button
          onClick={scrollToTop}
          className="p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-pink-600 shadow-lg border border-pink-100/80 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
          title="Back to Top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

    </footer>
  );
}
