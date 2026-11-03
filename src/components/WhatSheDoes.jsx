import React, { useState } from 'react';

/**
 * WhatSheDoes Component (How We Work):
 * 1. Full-section background video (video.mp4) with Ekra vlogging on the right.
 * 2. Editorial open list with large italic serif numerals (১, ২, ৩ / 1, 2, 3).
 * 3. Bilingual content (both Bangla & English) - crisp, punchy, fast to read.
 * 4. Home page social icons (WhatsApp, Facebook, Messenger, Instagram, LinkedIn) + Contact button.
 */
export default function WhatSheDoes() {
  const [lang, setLang] = useState('both'); // 'both' | 'bn' | 'en'

  const steps = [
    {
      num: "১",
      numEn: "1",
      titleBn: "কথা বলুন",
      titleEn: "Reach Out",
      descBn: "WhatsApp বা ফোনে জানান আপনি কী ভিডিও চান।",
      descEn: "Call or message via WhatsApp / Facebook to discuss your campaign needs."
    },
    {
      num: "২",
      numEn: "2",
      titleBn: "ঠিক করে নিন",
      titleEn: "Align & Confirm",
      descBn: "আইডিয়া, বাজেট আর পেমেন্টের নিয়ম একসাথে ঠিক হয়।",
      descEn: "Campaign concept, deliverables, and package budget agreed upfront."
    },
    {
      num: "৩",
      numEn: "3",
      titleBn: "শুট ও প্রকাশ",
      titleEn: "Shoot & Publish",
      descBn: "আপনার জায়গায় গিয়ে শুট ও এডিট করি; আপনার বা আমার পেজে প্রকাশ।",
      descEn: "On-location shoot and pro editing; published to our audience or yours."
    }
  ];

  return (
    <section 
      id="services" 
      className="cv-auto relative w-full bg-white text-zinc-900 pt-0 pb-12 sm:pb-16 lg:py-24 border-b border-zinc-200/80 overflow-hidden"
    >
      {/* 1. Desktop Full Section Background Studio Video */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <video
          src="/videos/video.mp4"
          poster="/thumbnails/intro_video.webp"
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-right lg:object-[82%_center]"
        />
        
        {/* Desktop Left-to-Center soft fade: ONLY covers the left 52% where text is, so Ekra on the right stays 100% crisp without any blur! */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent w-[55%] pointer-events-none" />
      </div>

      {/* 2. Mobile Video First: 100% Full Width Edge-to-Edge, NO Border, NO Rounded Corners */}
      <div className="lg:hidden w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-white">
        <video
          src="/videos/video.mp4"
          poster="/thumbnails/intro_video.webp"
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[78%_center]"
        />
      </div>

      {/* 3. Content Layer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-0 z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Direct, Bilingual Open Workflow (7 cols on desktop) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 text-left max-w-xl">
            
            {/* Header & Language Selector */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                  HOW WE WORK • কাজের নিয়ম
                </p>
                
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
                  কাজ শুরু করা সহজ,{' '}
                  <span className="font-serif italic font-normal text-zinc-500">
                    মাত্র ৩ ধাপ।
                  </span>
                </h2>
              </div>

              {/* Language Switch Pills (Both / বাংলা / English) */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 self-start sm:self-auto text-[11px] font-medium text-zinc-600 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setLang('both')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    lang === 'both' ? 'bg-white text-zinc-950 font-bold shadow-2xs' : 'hover:text-zinc-900'
                  }`}
                >
                  Both
                </button>
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    lang === 'bn' ? 'bg-white text-zinc-950 font-bold shadow-2xs' : 'hover:text-zinc-900'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    lang === 'en' ? 'bg-white text-zinc-950 font-bold shadow-2xs' : 'hover:text-zinc-900'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Open List with Large Italic Serif Numerals */}
            <div className="space-y-4 pt-1">
              {steps.map((step) => (
                <div 
                  key={step.num}
                  className="flex items-start space-x-4 sm:space-x-5 pb-4.5 border-b border-zinc-200/60 last:border-b-0 last:pb-0"
                >
                  {/* Large Italic Serif Numeral */}
                  <span className="font-serif italic text-3xl sm:text-4xl text-zinc-300 font-light select-none shrink-0 w-8 text-left leading-none pt-0.5">
                    {lang === 'en' ? step.numEn : step.num}
                  </span>

                  {/* Title & Bilingual Description */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      {(lang === 'both' || lang === 'bn') && (
                        <h3 className="font-display text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                          {step.titleBn}
                        </h3>
                      )}
                      
                      {(lang === 'both' || lang === 'en') && (
                        <span className={`text-xs sm:text-[13px] font-medium text-zinc-500 ${lang === 'en' ? 'font-display font-bold text-base sm:text-lg text-zinc-900' : ''}`}>
                          {lang === 'both' ? `• ${step.titleEn}` : step.titleEn}
                        </span>
                      )}
                    </div>

                    {(lang === 'both' || lang === 'bn') && (
                      <p className="text-xs sm:text-[13.5px] text-zinc-800 leading-snug font-medium">
                        {step.descBn}
                      </p>
                    )}

                    {(lang === 'both' || lang === 'en') && (
                      <p className={`text-[11.5px] sm:text-xs text-zinc-500 leading-snug font-normal ${lang === 'both' ? 'mt-0.5' : ''}`}>
                        {step.descEn}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Home Page Direct Social Channel Icons */}
            <div className="pt-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                
                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801911133259?text=Hi%20Ekra%2C%20I%20would%20like%20to%20collaborate%20with%20you%20on%20a%20campaign!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white hover:bg-emerald-50/50 border border-zinc-200/90 hover:border-[#25D366]/40 shadow-2xs hover:shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer group"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.835 11.835 0 005.712 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/rukaiya.binta.hossain.ekra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50/50 border border-zinc-200/90 hover:border-[#1877F2]/40 shadow-2xs hover:shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer group"
                  aria-label="Facebook Profile"
                  title="Facebook"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Messenger */}
                <a
                  href="https://www.facebook.com/messages/e2ee/t/7773717706040969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50/50 border border-zinc-200/90 hover:border-[#0084FF]/40 shadow-2xs hover:shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer group"
                  aria-label="Messenger Chat"
                  title="Messenger"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="workMsgGradFull" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0084FF" />
                        <stop offset="50%" stopColor="#A033FF" />
                        <stop offset="100%" stopColor="#FF5C87" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#workMsgGradFull)" d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652v4.237l4.086-2.242c1.093.303 2.254.464 3.445.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.196 14.931l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/_rukey._/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white hover:bg-pink-50/50 border border-zinc-200/90 hover:border-[#E4405F]/40 shadow-2xs hover:shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer group"
                  aria-label="Instagram Profile"
                  title="Instagram"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <defs>
                      <radialGradient id="workIgGradFull" cx="30%" cy="107%" r="150%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </radialGradient>
                    </defs>
                    <rect width="24" height="24" rx="6" fill="url(#workIgGradFull)"/>
                    <path fill="#ffffff" d="M12 7.03a4.97 4.97 0 100 9.94 4.97 4.97 0 000-9.94zm0 8.21a3.24 3.24 0 110-6.48 3.24 3.24 0 010 6.48zm5.17-8.47a1.16 1.16 0 11-2.32 0 1.16 1.16 0 012.32 0z"/>
                    <path fill="#ffffff" d="M16.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3zm2.7 13.5a2.7 2.7 0 01-2.7 2.7h-9a2.7 2.7 0 01-2.7-2.7v-9a2.7 2.7 0 012.7-2.7h9a2.7 2.7 0 012.7 2.7v9z"/>
                  </svg>
                </a>

                {/* Gmail */}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=rukaiyabintahossain@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white hover:bg-rose-50/50 border border-zinc-200/90 hover:border-[#EA4335]/40 shadow-2xs hover:shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer group"
                  aria-label="Gmail rukaiyabintahossain@gmail.com"
                  title="Gmail (rukaiyabintahossain@gmail.com)"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 49.4 512 399.42">
                    <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
                    <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
                    <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
                    <path fill="#ea4335" d="M116.364 99.727L256 204.455 395.636 99.727V251L256 355.727z" />
                    <path fill="#c5221f" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/rukaiya-binta-hossain-aaab7336a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white hover:bg-sky-50/50 border border-zinc-200/90 hover:border-[#0A66C2]/40 shadow-2xs hover:shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer group"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66s-.74-1.66-1.66-1.66c-.92 0-1.66.74-1.66 1.66s.74 1.66 1.66 1.66m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                  </svg>
                </a>

              </div>
            </div>

          </div>

          {/* Right Column: Negative Space for Ekra's Live Video (5 cols) */}
          <div className="hidden lg:block lg:col-span-5 h-[480px] pointer-events-none">
            {/* The video naturally shines through this right space with Ekra vlogging live */}
          </div>

        </div>

      </div>
    </section>
  );
}
