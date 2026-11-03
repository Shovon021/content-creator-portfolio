import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { initialProjects, portraitLooks } from './data/portfolioData';
import { videoStore, useVideoStore } from './store/videoStore';
import { fetchPortfolioProjects } from './services/sheetService';

// Lazy-load below-the-fold components for faster initial paint
const ScrollStatement = lazy(() => import('./components/ScrollStatement'));
const WorkGallery = lazy(() => import('./components/WorkGallery'));
const WorkingPrinciples = lazy(() => import('./components/WorkingPrinciples'));
const WhatSheDoes = lazy(() => import('./components/WhatSheDoes'));
const BrandFeedback = lazy(() => import('./components/BrandFeedback'));
const CollaborateSection = lazy(() => import('./components/CollaborateSection'));
const Footer = lazy(() => import('./components/Footer'));
const AdminPWA = lazy(() => import('./components/AdminPWA'));
const VideoModal = lazy(() => import('./components/VideoModal'));

export default function App() {
  const [projects, setProjects] = useState(() => {
    try {
      localStorage.removeItem('dear_ekra_projects_v4');
      localStorage.removeItem('dear_ekra_projects_v5');
      localStorage.removeItem('dear_ekra_projects_v6');
      localStorage.removeItem('dear_ekra_projects_v7');
      localStorage.removeItem('dear_ekra_projects_v8');
      localStorage.removeItem('dear_ekra_projects_v9');
      localStorage.removeItem('dear_ekra_projects_v10');
      localStorage.removeItem('dear_ekra_projects_v11');
      localStorage.removeItem('dear_ekra_projects_v12');
      localStorage.removeItem('dear_ekra_projects_v13');
      localStorage.removeItem('dear_ekra_projects_v14');
      const saved = localStorage.getItem('dear_ekra_projects_v15');
      if (saved) {
        const parsed = JSON.parse(saved);
        return initialProjects.map(init => {
          const savedItem = parsed.find(p => p.id === init.id);
          return savedItem ? { ...init, ...savedItem, localVideoUrl: init.localVideoUrl } : init;
        });
      }
    } catch (e) {
      console.warn('Failed to parse saved projects:', e);
    }
    return initialProjects;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true' || window.location.hash === '#admin';
    }
    return false;
  });
  const [selectedLookIndex, setSelectedLookIndex] = useState(0);

  // Auto-change looks one-by-one continuously every 11 seconds (11000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedLookIndex((prev) => (prev + 1) % portraitLooks.length);
    }, 11000);
    return () => clearInterval(timer);
  }, []);

  // Background sync from Google Sheets (no flicker, instant paint from local cache/bundle first)
  useEffect(() => {
    fetchPortfolioProjects()
      .then(fetched => {
        if (fetched && fetched.length > 0) {
          setProjects(fetched);
        }
      })
      .catch(err => {
        console.warn('Google Sheets sync skipped:', err);
      });
  }, []);

  const [activeVideo, setActiveVideo] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('play')) {
        const targetId = params.get('play');
        const found = initialProjects.find(p => p.id === targetId || p.category === targetId);
        return found || initialProjects[0];
      }
    }
    return null;
  });

  const theaterReel = useVideoStore(s => s.theaterReel);

  // Deep linking: support #reel=<slug> navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#reel=')) {
        const slug = hash.replace('#reel=', '');
        const target = projects.find(p => p.shareSlug === slug || p.id === slug);
        if (target) {
          const el = document.getElementById(`reel-card-${target.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          videoStore.playReel(target.id, 0);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [projects]);

  // Tab visibility: pause playback when document is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        videoStore.stopAll();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    localStorage.setItem('dear_ekra_projects_v15', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const scrollToCollab = () => {
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLook = portraitLooks[selectedLookIndex] || portraitLooks[0];

  return (
    <div
      className="min-h-screen text-zinc-900 flex flex-col font-body selection:bg-pink-500 selection:text-white"
      style={{
        backgroundColor: currentLook.bgSoft,
        transition: 'background-color 1500ms ease'
      }}
    >

      {/* 1. Global Navigation Header */}
      <Header
        onOpenCollab={scrollToCollab}
        activeLookIndex={selectedLookIndex}
      />

      <main className="flex-1">
        {/* 2. Hero with Live Metrics, Arched Cutout & in-site video trigger */}
        <Hero
          onOpenCollab={scrollToCollab}
          onPlayVideo={(video) => setActiveVideo(video)}
          activeLookIndex={selectedLookIndex}
          onSelectLookIndex={setSelectedLookIndex}
        />

        {/* All below-the-fold sections: lazy-loaded, zero impact on FCP/LCP */}
        <Suspense fallback={null}>
          {/* Statement Banner: Curated Creator Showcase with Kinetic Illumination */}
          <ScrollStatement activeLookIndex={selectedLookIndex} />

          {/* 3. Full Work Gallery with in-site video trigger */}
          <WorkGallery
            projects={projects}
            onPlayVideo={(video) => setActiveVideo(video)}
          />

          {/* 4. My Working Principles & Real Brand Logos */}
          <WorkingPrinciples />

          {/* 5. What She Does (How We Work 3-Step Process + Studio Video) */}
          <WhatSheDoes activeLookIndex={selectedLookIndex} />

          {/* 6. Words from Business Owners (Renders nothing until real testimonials are added) */}
          <BrandFeedback />

          {/* 7. Collaborate Form & Direct Channels */}
          <CollaborateSection />
        </Suspense>
      </main>

      {/* Modern Luxury Footer */}
      <Suspense fallback={null}>
        <Footer
          onOpenCollab={scrollToCollab}
          onOpenAdmin={() => setIsAdminOpen(true)}
          activeLook={currentLook}
        />

        {/* In-Site Real Video Player Modal (Lightbox / Theater Mode) */}
        <VideoModal
          isOpen={Boolean(theaterReel || activeVideo)}
          onClose={() => {
            setActiveVideo(null);
            videoStore.closeTheater(null);
          }}
          video={theaterReel ? theaterReel.reel : activeVideo}
          initialTime={theaterReel ? theaterReel.currentTime : 0}
        />

        {/* Creator Admin Hub (PWA Drawer) */}
        <AdminPWA
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          projects={projects}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
        />
      </Suspense>

    </div>
  );
}
