import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clientLogos, portraitLooks } from '../data/portfolioData';
import TypewriterSpecialty from './TypewriterSpecialty';

export default function Hero({ onOpenCollab, activeLookIndex = 0, onSelectLookIndex }) {
  const currentIndex = activeLookIndex;
  const activeLook = portraitLooks[currentIndex] || portraitLooks[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    const prev = (currentIndex - 1 + portraitLooks.length) % portraitLooks.length;
    if (onSelectLookIndex) onSelectLookIndex(prev);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const next = (currentIndex + 1) % portraitLooks.length;
    if (onSelectLookIndex) onSelectLookIndex(next);
  };

  return (
    <section 
      id="hero" 
      className="relative text-zinc-900 border-b overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: `${activeLook.archColor}25`,
        transition: 'border-color 1500ms ease'
      }}
    >
      {/* Dynamic solid soft background tint that smoothly cross-fades */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          backgroundColor: activeLook.bgSoft,
          transition: 'background-color 1500ms ease'
        }}
      />

      {/* Dynamic ambient color glows adapting to active look's theme color */}
      <div 
        className="absolute top-0 right-1/4 w-[460px] h-[460px] rounded-full opacity-20 blur-3xl pointer-events-none -z-10"
        style={{ 
          backgroundColor: activeLook.archColor,
          transition: 'background-color 1500ms ease'
        }}
      />
      <div 
        className="absolute bottom-0 left-6 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none -z-10"
        style={{ 
          backgroundColor: activeLook.accentColor,
          transition: 'background-color 1500ms ease'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-4 sm:pb-6 lg:pb-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center">
          
          {/* Left Column: Introductions, Focus on Dear Ekra, Zero-Shift Specialty & Socials (7 cols) - Ordered 2nd on Mobile, 1st on Desktop */}
          <div className="order-2 lg:order-1 lg:col-span-7 text-center lg:text-left space-y-3.5 sm:space-y-4 lg:space-y-5">

            {/* 1. Introduction Lead-in & Main Focused Persona */}
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-500">
                Hi, I’m <span className="font-bold text-zinc-800">Rukaiya Binta Hossain Ekra</span>
              </p>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] font-black tracking-tight text-zinc-950 leading-[0.98]">
                Dear Ekra
              </h1>
            </div>

            {/* 2. DYNAMIC SPECIALTY HEADLINE (Zero-Shake Fixed Height Cross-Fade) */}
            <div className="pt-0.5">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                <span 
                  className="w-2.5 h-2.5 rounded-full animate-pulse" 
                  style={{ 
                    backgroundColor: activeLook.archColor,
                    transition: 'background-color 1500ms ease'
                  }}
                />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">
                  Specialty & Focus
                </span>
              </div>

              {/* Dynamic Typewriter Specialty Headline (Zero-Shake Fixed Height) */}
              <TypewriterSpecialty
                role={activeLook.role}
                accentColor={activeLook.accentColor}
                archColor={activeLook.archColor}
              />
            </div>

            {/* 3. LARGE SOCIAL ICONS ONLY (Nothing Else) */}
            <div className="pt-1">
              <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                
                {/* Facebook Large Icon Only */}
                <a
                  href="https://www.facebook.com/rukaiya.binta.hossain.ekra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-2xl bg-white hover:bg-blue-50/50 border border-zinc-200/90 hover:border-[#1877F2]/40 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                  aria-label="Facebook Profile"
                  title="Facebook"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Messenger Large Icon Only */}
                <a
                  href="https://www.facebook.com/messages/e2ee/t/7773717706040969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-2xl bg-white hover:bg-blue-50/50 border border-zinc-200/90 hover:border-[#0084FF]/40 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                  aria-label="Messenger Chat"
                  title="Messenger"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="heroMsgGradLarge" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0084FF" />
                        <stop offset="50%" stopColor="#A033FF" />
                        <stop offset="100%" stopColor="#FF5C87" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#heroMsgGradLarge)" d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652v4.237l4.086-2.242c1.093.303 2.254.464 3.445.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.196 14.931l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
                  </svg>
                </a>

                {/* Instagram Large Icon Only */}
                <a
                  href="https://www.instagram.com/_rukey._/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-2xl bg-white hover:bg-pink-50/50 border border-zinc-200/90 hover:border-[#E4405F]/40 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                  aria-label="Instagram Profile"
                  title="Instagram"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <defs>
                      <radialGradient id="heroIgGradLarge" cx="30%" cy="107%" r="150%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </radialGradient>
                    </defs>
                    <rect width="24" height="24" rx="6" fill="url(#heroIgGradLarge)"/>
                    <path fill="#ffffff" d="M12 7.03a4.97 4.97 0 100 9.94 4.97 4.97 0 000-9.94zm0 8.21a3.24 3.24 0 110-6.48 3.24 3.24 0 010 6.48zm5.17-8.47a1.16 1.16 0 11-2.32 0 1.16 1.16 0 012.32 0z"/>
                    <path fill="#ffffff" d="M16.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3zm2.7 13.5a2.7 2.7 0 01-2.7 2.7h-9a2.7 2.7 0 01-2.7-2.7v-9a2.7 2.7 0 012.7-2.7h9a2.7 2.7 0 012.7 2.7v9z"/>
                  </svg>
                </a>

                {/* WhatsApp Large Icon Only */}
                <a
                  href="https://wa.me/8801911133259"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-2xl bg-white hover:bg-emerald-50/50 border border-zinc-200/90 hover:border-[#25D366]/40 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                  aria-label="WhatsApp +880 1911-133259"
                  title="WhatsApp"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.835 11.835 0 005.712 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>

                {/* Gmail Large Icon Only */}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=rukaiyabintahossain@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-2xl bg-white hover:bg-rose-50/50 border border-zinc-200/90 hover:border-[#EA4335]/40 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                  aria-label="Gmail rukaiyabintahossain@gmail.com"
                  title="Gmail (rukaiyabintahossain@gmail.com)"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" viewBox="0 49.4 512 399.42">
                    <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
                    <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
                    <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
                    <path fill="#ea4335" d="M116.364 99.727L256 204.455 395.636 99.727V251L256 355.727z" />
                    <path fill="#c5221f" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
                  </svg>
                </a>

                {/* LinkedIn Large Icon Only */}
                <a
                  href="https://www.linkedin.com/in/rukaiya-binta-hossain-aaab7336a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-2xl bg-white hover:bg-sky-50/50 border border-zinc-200/90 hover:border-[#0A66C2]/40 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66s-.74-1.66-1.66-1.66c-.92 0-1.66.74-1.66 1.66s.74 1.66 1.66 1.66m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                  </svg>
                </a>

              </div>
            </div>

            {/* 4. Streamlined Editorial Metrics Strip - Always in One Single Line Across All Screens */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4 pt-3 sm:pt-4 lg:pt-5 border-t border-zinc-200/60 text-center lg:text-left">
              <div className="bg-white/60 sm:bg-transparent rounded-xl sm:rounded-2xl p-1.5 sm:p-0 border border-pink-100/50 sm:border-0 shadow-2xs sm:shadow-none space-y-0.5">
                <div 
                  className="text-base sm:text-2xl lg:text-3xl font-black font-display tracking-tight transition-colors duration-700"
                  style={{ color: activeLook.accentColor }}
                >
                  2.4M+
                </div>
                <div className="text-[9px] sm:text-xs text-zinc-500 font-medium leading-tight">
                  Top Viral Reel
                </div>
              </div>

              <div className="bg-white/60 sm:bg-transparent rounded-xl sm:rounded-2xl p-1.5 sm:p-0 border border-pink-100/50 sm:border-0 shadow-2xs sm:shadow-none space-y-0.5">
                <div className="text-base sm:text-2xl lg:text-3xl font-black font-display tracking-tight text-zinc-900">
                  16K+
                </div>
                <div className="text-[9px] sm:text-xs text-zinc-500 font-medium leading-tight">
                  Active Followers
                </div>
              </div>

              <div className="bg-white/60 sm:bg-transparent rounded-xl sm:rounded-2xl p-1.5 sm:p-0 border border-pink-100/50 sm:border-0 shadow-2xs sm:shadow-none space-y-0.5">
                <div className="text-base sm:text-2xl lg:text-3xl font-black font-display tracking-tight text-zinc-900">
                  593+
                </div>
                <div className="text-[9px] sm:text-xs text-zinc-500 font-medium leading-tight">
                  Published Reels
                </div>
              </div>

              <div className="bg-white/60 sm:bg-transparent rounded-xl sm:rounded-2xl p-1.5 sm:p-0 border border-pink-100/50 sm:border-0 shadow-2xs sm:shadow-none space-y-0.5">
                <div 
                  className="text-base sm:text-2xl lg:text-3xl font-black font-display tracking-tight"
                  style={{ 
                    color: activeLook.archColor,
                    transition: 'color 1500ms ease'
                  }}
                >
                  12.8M+
                </div>
                <div className="text-[9px] sm:text-xs text-zinc-500 font-medium leading-tight">
                  Total Video Views
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Large Cutout with Upside-Down "U" Arch on Backside (5 cols) - Ordered 1st on Mobile, 2nd on Desktop */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center justify-center pt-2 sm:pt-4 lg:pt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] flex flex-col items-center">
              
              {/* Stage: Proportional Height for Balanced Screen Impact across All Monitors & Laptops */}
              <div className="relative w-full h-[330px] sm:h-[420px] lg:h-[490px] xl:h-[530px] flex items-end justify-center overflow-visible select-none">
                
                {/* 1. BACKSIDE: Ambient Colored Glow */}
                <div 
                  className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 w-60 sm:w-80 lg:w-88 h-60 sm:h-80 lg:h-88 rounded-full opacity-35 blur-3xl pointer-events-none -z-10"
                  style={{ 
                    backgroundColor: activeLook.archColor,
                    transition: 'background-color 1500ms ease'
                  }}
                />

                {/* 2. BACKSIDE: Solid Upside-Down "U" Shape Arch (Smooth Color Interpolation) */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[210px] sm:w-[250px] lg:w-[270px] xl:w-[290px] h-[270px] sm:h-[350px] lg:h-[400px] xl:h-[440px] rounded-t-full shadow-xl overflow-hidden z-0"
                  style={{ 
                    backgroundColor: activeLook.archColor,
                    transition: 'background-color 1500ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Subtle inner top light reflection for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/15 rounded-t-full pointer-events-none" />
                </div>

                {/* 3. FOREGROUND: Smooth Layered Cross-Fade Cutouts (Zero Shaking, 100% Silky Fade) */}
                <div className="relative z-10 w-full h-full flex items-end justify-center pointer-events-none">
                  {portraitLooks.map((look, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <div
                        key={look.id}
                        className={`absolute inset-0 flex items-end justify-center transition-opacity duration-1000 ease-in-out ${
                          isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        <picture>
                          <source srcSet={look.image} type="image/webp" />
                          <img
                            src={look.imageFallback || look.image}
                            alt={`Dear Ekra - ${look.title}`}
                            className="max-h-[330px] sm:max-h-[420px] lg:max-h-[490px] xl:max-h-[530px] w-auto max-w-[96%] object-contain object-bottom filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.18)]"
                            loading={idx === 0 ? "eager" : "lazy"}
                            fetchPriority={idx === 0 ? "high" : "low"}
                            decoding={idx === 0 ? "sync" : "async"}
                            width={400}
                            height={530}
                          />
                        </picture>
                      </div>
                    );
                  })}
                </div>

                {/* Left/Right Floating Quick Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md border border-zinc-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-85 hover:opacity-100"
                  aria-label="Previous Look"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md border border-zinc-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-85 hover:opacity-100"
                  aria-label="Next Look"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Static Brand Collage Grid (18 Large Brand Logos, No Movement, Clean & Professional) */}
        <div className="mt-8 pt-6 border-t border-zinc-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 px-1">
            <div className="flex items-center space-x-2">
              <span 
                className="w-2 h-2 rounded-full animate-pulse transition-colors duration-700" 
                style={{ backgroundColor: activeLook.accentColor }}
              />
              <p className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                Verified Brand Campaigns & Partnerships
              </p>
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              18+ Leading Brands & Local Businesses
            </span>
          </div>

          {/* High-Visibility 6-Column Brand Collage Grid (Large Version, 3 Rows × 6 Cols) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {clientLogos.map((brand) => (
              <div
                key={brand.id}
                className="relative rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xl hover:border-pink-400 transition-all duration-300 flex items-center justify-center p-2.5 sm:p-3 h-24 sm:h-28 md:h-32 group cursor-pointer"
                title={`${brand.name} • ${brand.type}`}
              >
                {/* Floating Name Badge on Hover */}
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-top-11 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap bg-zinc-950 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5 border border-zinc-800">
                  <span>{brand.name}</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950" />
                </div>

                {/* Large High-Visibility Original Logo */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-16 sm:max-h-20 md:max-h-24 max-w-[92%] w-auto object-contain filter group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
