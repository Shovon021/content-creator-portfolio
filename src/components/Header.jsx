import React, { useState, useEffect, useRef } from 'react';
import { Home, Heart, Phone, ChevronRight, PhoneCall, X, ArrowRight, Menu, Check, Copy, Sparkles } from 'lucide-react';
import { portraitLooks } from '../data/portfolioData';

/**
 * Interactive LoveHeartButton:
 * Delivers an ambient living heartbeat animation and an interactive love burst
 * (floating micro-hearts, sparkles, and gentle haptic feedback) on click/hover.
 */
function LoveHeartButton() {
  const [particles, setParticles] = useState([]);
  const [isLoved, setIsLoved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

  const handleLoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoved(true);
    setShowToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2200);

    // Spawn 6 joyful micro particles (sparkles, hearts, blossom)
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 44,
      y: -(26 + Math.random() * 26),
      size: 11 + Math.random() * 6,
      rotation: (Math.random() - 0.5) * 50,
      symbol: ['💖', '✨', '🌸', '💕', '♡', '⭐'][i % 6]
    }));

    setParticles(prev => [...prev.slice(-12), ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {particles.map(p => (
          <span
            key={p.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none animate-float-fade"
            style={{
              '--target-x': `${p.x}px`,
              '--target-y': `${p.y}px`,
              fontSize: `${p.size}px`,
              transform: `rotate(${p.rotation}deg)`
            }}
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* Heart Icon Button with Heartbeat */}
      <button
        type="button"
        onClick={handleLoveClick}
        onMouseEnter={() => setIsLoved(true)}
        className="group relative p-1 -m-1 rounded-full focus:outline-none cursor-pointer transition-transform duration-200 active:scale-125"
        title="Send love to Dear Ekra ♡"
        aria-label="Send love to Dear Ekra"
      >
        <Heart 
          className={`w-4 h-4 transition-all duration-300 ${
            isLoved 
              ? 'text-pink-500 fill-pink-500 scale-115 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' 
              : 'text-pink-500 fill-none stroke-[2.2] animate-heartbeat'
          } group-hover:scale-125 group-hover:fill-pink-500`}
        />
      </button>

      {/* Floating Micro Toast */}
      {showToast && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-0.5 rounded-full bg-slate-900/95 text-white text-[10px] font-bold tracking-tight whitespace-nowrap shadow-lg shadow-pink-500/20 backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-90 slide-in-from-bottom-1 duration-200 z-50 flex items-center space-x-1">
          <span className="text-pink-400">♡</span>
          <span>Love sent!</span>
        </div>
      )}
    </div>
  );
}

export default function Header({ 
  onOpenCollab, 
  activeLookIndex = 0
}) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const activeLook = portraitLooks[activeLookIndex] || portraitLooks[0];

  const handleCopyNumber = (e) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText('+8801911133259');
    } catch {
      // Fallback
    }
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  // Smart Sticky / Headroom: Hide on scroll down, show on scroll up
  useEffect(() => {
    let ticking = false;
    const THRESHOLD = 8; // Ignore micro-jitters

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastY.current;

        // 1. Always keep header visible at the very top of page
        if (y <= 20) {
          setHidden(false);
        } 
        // 2. Keep header visible while mobile drawer or contact modal is open
        else if (mobileMenuOpen || isContactOpen) {
          setHidden(false);
        } 
        // 3. Check scroll direction with threshold
        else if (Math.abs(diff) > THRESHOLD) {
          // diff > 0 means user is scrolling down -> slide up to hide
          // diff < 0 means user is scrolling up -> slide down to show
          setHidden(diff > 0);
          lastY.current = y;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileMenuOpen, isContactOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsContactOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Campaigns & Reels', href: '#gallery' },
    { label: 'What I Do', href: '#services' }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/3kraneha',
      bg: 'bg-[#1877F2]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Messenger',
      href: 'https://m.me/3kraneha',
      bg: 'bg-gradient-to-tr from-[#0084FF] via-[#7B3FE4] to-[#FF5C87]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652v4.237l4.086-2.242c1.093.303 2.254.464 3.445.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.196 14.931l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/3kraneha',
      bg: 'bg-gradient-to-tr from-[#FFB900] via-[#D62976] to-[#4F5BD5]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/8801911133259',
      bg: 'bg-[#25D366]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.122-.524-1.747-.73-2.883-2.508-2.969-2.624-.087-.116-.713-.949-.713-1.808 0-.859.45-1.282.609-1.455.159-.174.348-.217.464-.217.116 0 .232.001.333.006.106.005.249-.04.389.297.144.348.491 1.2.535 1.287.043.087.072.19.014.305-.058.116-.087.189-.173.289-.087.102-.183.228-.261.306-.087.087-.178.182-.077.355.101.174.45 0.742.966 1.202.665.592 1.226.776 1.4.863.174.087.276.073.377-.044.102-.116.434-.506.55-.68.116-.174.232-.145.39-.087s1.011.477 1.185.564c.174.087.29.13.333.203.044.072.044.419-.1 0.824z"/>
        </svg>
      )
    },
    {
      name: 'Gmail',
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=rukaiyabintahossain@gmail.com',
      bg: 'bg-white text-[#EA4335] border border-zinc-200',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 49.4 512 399.42">
          <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
          <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
          <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
          <path fill="#ea4335" d="M116.364 99.727L256 204.455 395.636 99.727V251L256 355.727z" />
          <path fill="#c5221f" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      bg: 'bg-[#0A66C2]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-40 select-none py-2 px-3 sm:px-6 transition-all duration-350 ease-out will-change-transform ${
          hidden 
            ? '-translate-y-[130%] opacity-0 sm:opacity-100 pointer-events-none' 
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        
        {/* Soft pastel ambient background corner gradients (matching Image 2) */}
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-br from-pink-300/35 via-rose-200/20 to-transparent pointer-events-none -z-10 blur-2xl" />
        <div className="absolute top-0 right-0 w-64 h-24 bg-gradient-to-bl from-indigo-200/30 via-purple-100/20 to-transparent pointer-events-none -z-10 blur-2xl" />

        {/* Floating Rounded Bar Container (White Capsule with Luxury Shadow) */}
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-full border border-pink-100/90 shadow-[0_8px_30px_rgb(244,63,94,0.08)] px-4 sm:px-6 h-16 sm:h-[68px] flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300">
          
          {/* Left: Brand Identity (Avatar with playful radiant marks + Name + Heart + Subtitle) */}
          <div className="flex items-center space-x-3 shrink-0">
            <a href="#" className="flex items-center space-x-3 group">
              
              {/* Avatar with radiant accent lines */}
              <div className="relative">
                {/* 3 radiant spark marks at top-left corner */}
                <div className="absolute -top-1.5 -left-1.5 text-pink-500 font-bold select-none pointer-events-none">
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5] text-pink-500" viewBox="0 0 24 24">
                    <line x1="4" y1="12" x2="1" y2="12" />
                    <line x1="6" y1="6" x2="3" y2="3" />
                    <line x1="12" y1="4" x2="12" y2="1" />
                  </svg>
                </div>

                <div 
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 p-0.5 shadow-xs transition-transform duration-300 group-hover:scale-105"
                  style={{ 
                    borderColor: '#F43F5E',
                    backgroundColor: '#FFF1F3'
                  }}
                >
                  <img 
                    src={activeLook.image} 
                    alt="Dear Ekra" 
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                    Dear Ekra
                  </span>
                  {/* Interactive Love Heart with ambient heartbeat and particle burst */}
                  <LoveHeartButton />
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                  Travel • Lifestyle • Storytelling
                </span>
              </div>
            </a>
          </div>

          {/* Center: Desktop Navigation Links (With Pink Home Pill) */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2">
            
            {/* Active Home Pill (Pink Capsule) */}
            <a 
              href="#" 
              className="px-3.5 xl:px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs shadow-pink-500/30 hover:opacity-95 transition-all"
            >
              <Home className="w-3.5 h-3.5 fill-current" />
              <span>Home</span>
            </a>

            {/* Other Navigation Links */}
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                className="px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50/70 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Social Media Icons Cluster + Divider + Midnight Navy Contact Button */}
          <div className="flex items-center space-x-2 xl:space-x-3 shrink-0">
            
            {/* 5 Clean Mini Social Icons */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-6 h-6 rounded-full ${soc.bg} text-white flex items-center justify-center shadow-2xs hover:scale-115 active:scale-95 transition-transform duration-200 cursor-pointer`}
                  title={soc.name}
                >
                  {soc.icon}
                </a>
              ))}
            </div>

            {/* Subtle Vertical Divider */}
            <div className="hidden lg:block h-5 w-px bg-slate-200/80 mx-0.5 xl:mx-1" />

            {/* Simple, understated Contact button */}
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-4 py-2 rounded-full bg-[#111827] hover:bg-[#1f2937] text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-current opacity-80" />
              <span>Contact</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-zinc-700 hover:bg-zinc-100 border border-zinc-200/80 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden mt-2 mx-auto max-w-7xl bg-white/98 rounded-3xl border border-pink-100 shadow-xl px-5 pt-4 pb-6 space-y-4 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1.5">
              <a 
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm flex items-center space-x-2 shadow-xs"
              >
                <Home className="w-4 h-4 fill-current" />
                <span>Home</span>
              </a>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-700 hover:text-slate-950 flex items-center justify-between transition-colors hover:bg-pink-50/50"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </a>
              ))}
            </div>

            {/* Mobile Social Cluster */}
            <div className="flex items-center justify-center space-x-3 pt-2 border-t border-slate-100">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full ${soc.bg} text-white flex items-center justify-center shadow-xs`}
                >
                  {soc.icon}
                </a>
              ))}
            </div>

            {/* Quick Contact Trigger on Mobile */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsContactOpen(true);
              }}
              className="w-full py-3 rounded-2xl bg-[#111827] text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-xs active:scale-98 transition-transform cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 fill-current opacity-80" />
              <span>Contact Ekra</span>
            </button>
          </div>
        )}

      </header>

      {/* Professional Centered Contact Modal (Only Clean Icons) */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blur with click-outside to close */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsContactOpen(false)}
          />

          {/* Centered Modal Card */}
          <div 
            className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-2xl p-6 sm:p-8 z-10 text-center animate-in fade-in zoom-in-95 duration-200 select-none"
            style={{
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px ${activeLook.archColor}20`
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Ekra Avatar + Title */}
            <div className="flex flex-col items-center mb-5">
              <div 
                className="w-16 h-16 rounded-full overflow-hidden border-2 p-0.5 mb-3 shadow-xs"
                style={{ 
                  borderColor: activeLook.archColor,
                  transition: 'border-color 1500ms ease'
                }}
              >
                <img 
                  src={activeLook.image} 
                  alt="Dear Ekra" 
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>

              <h3 className="font-display font-bold text-xl text-zinc-950 tracking-tight">
                Contact Dear Ekra
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Direct channels for brand partnerships & PR
              </p>
            </div>

            {/* ONLY CLEAN ICONS: WhatsApp, Messenger, Direct Call */}
            <div className="flex items-center justify-center gap-6 sm:gap-7 py-3">
              
              {/* 1. WhatsApp Clean Icon */}
              <a
                href="https://wa.me/8801911133259?text=Hi%20Ekra%2C%20I%20would%20like%20to%20collaborate%20with%20you!"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsContactOpen(false)}
                className="group flex flex-col items-center space-y-2 cursor-pointer"
                title="Chat on WhatsApp"
              >
                <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/50 active:scale-95">
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.122-.524-1.747-.73-2.883-2.508-2.969-2.624-.087-.116-.713-.949-.713-1.808 0-.859.45-1.282.609-1.455.159-.174.348-.217.464-.217.116 0 .232.001.333.006.106.005.249-.04.389.297.144.348.491 1.2.535 1.287.043.087.072.19.014.305-.058.116-.087.189-.173.289-.087.102-.183.228-.261.306-.087.087-.178.182-.077.355.101.174.45 0.742.966 1.202.665.592 1.226.776 1.4.863.174.087.276.073.377-.044.102-.116.434-.506.55-.68.116-.174.232-.145.39-.087s1.011.477 1.185.564c.174.087.29.13.333.203.044.072.044.419-.1 0.824z"/>
                  </svg>
                </div>
                <span className="text-xs font-bold text-zinc-700 group-hover:text-emerald-600 transition-colors">
                  WhatsApp
                </span>
              </a>

              {/* 2. Messenger Clean Icon */}
              <a
                href="https://m.me/3kraneha"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsContactOpen(false)}
                className="group flex flex-col items-center space-y-2 cursor-pointer"
                title="Send Messenger Message"
              >
                <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-2xl bg-gradient-to-tr from-[#0084FF] via-[#8535E8] to-[#FF5C87] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/50 active:scale-95">
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652v4.237l4.086-2.242c1.093.303 2.254.464 3.445.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.196 14.931l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
                  </svg>
                </div>
                <span className="text-xs font-bold text-zinc-700 group-hover:text-blue-600 transition-colors">
                  Messenger
                </span>
              </a>

              {/* 3. Direct Phone Call Clean Icon */}
              <a
                href="tel:+8801911133259"
                onClick={() => setIsContactOpen(false)}
                className="group flex flex-col items-center space-y-2 cursor-pointer"
                title="Call Directly"
              >
                <div 
                  className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-2xl text-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: activeLook.accentColor,
                    boxShadow: `0 8px 24px ${activeLook.accentColor}35`,
                    transition: 'background-color 1500ms ease, box-shadow 1500ms ease'
                  }}
                >
                  <PhoneCall className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                </div>
                <span className="text-xs font-bold text-zinc-700 group-hover:text-zinc-950 transition-colors">
                  Direct Call
                </span>
              </a>

            </div>

            {/* Quick Copy Phone Number Bar */}
            <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between px-3.5 py-2 rounded-2xl bg-zinc-50 border border-zinc-200/60">
              <div className="flex items-center space-x-2 text-left">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-mono text-xs font-semibold text-zinc-700 tracking-tight">+880 1911-133259</span>
              </div>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Copy phone number"
              >
                {copiedNumber ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Subtle Collab Link */}
            <div className="mt-4 pt-2 border-t border-zinc-100/80 flex items-center justify-center text-xs">
              <button
                onClick={() => {
                  setIsContactOpen(false);
                  if (onOpenCollab) onOpenCollab();
                }}
                className="text-[11px] sm:text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors underline underline-offset-2 cursor-pointer"
              >
                Need invoice or proposal? Open Collab Form →
              </button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
