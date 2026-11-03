import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, 
  Maximize2, Tv, AlertCircle, Loader2, Sparkles, MapPin, X, Eye, TrendingUp 
} from 'lucide-react';
import { useReelMachine, REEL_STATES } from '../hooks/useReelMachine';
import { videoStore, useVideoStore } from '../store/videoStore';

export default function InlineReelPlayer({ item, aspect = '4/5', onOpenTheater }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const intentTimer = useRef(null);
  const autoHideTimer = useRef(null);
  const rAFRef = useRef(null);
  const requestToken = useRef(0);

  // Machine state
  const {
    status,
    errorMessage,
    triggerHoverIntent,
    triggerInView,
    triggerCanPlay,
    triggerLeave,
    triggerStartPlay,
    triggerPlaying,
    triggerPause,
    triggerResume,
    triggerEnded,
    triggerRestart,
    triggerReset,
    triggerError
  } = useReelMachine();

  // Video Store state (granular selectors prevent full-grid re-renders)
  const isGlobalActive = useVideoStore(useCallback(s => s.activeReelId === item.id, [item.id]));
  const isGlobalPreview = useVideoStore(useCallback(s => s.activePreviewId === item.id, [item.id]));
  const userMutedPreference = useVideoStore(useCallback(s => s.userMutedPreference, []));
  const effectiveMuted = useVideoStore(useCallback(s => s.effectiveMuted, []));

  // Local UI states
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(item.duration || 30);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [useLocalPlayer, setUseLocalPlayer] = useState(false);

  // Synchronize with global active reel state
  useEffect(() => {
    if (!isGlobalActive && (status === REEL_STATES.PLAYING || status === REEL_STATES.PAUSED || status === REEL_STATES.PLAYER_LOADING)) {
      triggerReset();
      setUseLocalPlayer(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    }
  }, [isGlobalActive, status, triggerReset]);

  // RequestAnimationFrame Scrubber Loop
  const startProgressLoop = useCallback(() => {
    const update = () => {
      if (videoRef.current && !isScrubbing) {
        const ct = videoRef.current.currentTime;
        setCurrentTime(ct);

        // Update segment index for dots during preview or play
        if (item.segments && item.segments.length > 0) {
          const segIdx = item.segments.findIndex((seg, i) => {
            const nextSeg = item.segments[i + 1];
            return ct >= seg.start && (!nextSeg || ct < nextSeg.start);
          });
          if (segIdx !== -1) setActiveSegmentIndex(segIdx);
        }
      }
      rAFRef.current = requestAnimationFrame(update);
    };
    rAFRef.current = requestAnimationFrame(update);
  }, [isScrubbing, item.segments]);

  const stopProgressLoop = useCallback(() => {
    if (rAFRef.current) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }
  }, []);

  // Controls auto-hide timer (2.5s)
  const resetAutoHide = useCallback(() => {
    setShowControls(true);
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    if (status === REEL_STATES.PLAYING) {
      autoHideTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [status]);

  // Teardown video src and flush RAM/decoders
  const flushVideoBuffer = useCallback(() => {
    stopProgressLoop();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  }, [stopProgressLoop]);

  // Check Data-Saver & Reduced Motion
  const isDataSaver = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  // --- 1. Hover-Intent Entry (Desktop) ---
  const handleMouseEnter = () => {
    if (isTouchDevice || isDataSaver || isReducedMotion) return;
    if (status === REEL_STATES.PLAYING || status === REEL_STATES.PAUSED || isGlobalActive) return;

    if (intentTimer.current) clearTimeout(intentTimer.current);

    intentTimer.current = setTimeout(() => {
      const token = ++requestToken.current;
      triggerHoverIntent();
      videoStore.setPreview(item.id);

      if (videoRef.current && item.previewSrc) {
        videoRef.current.src = item.previewSrc;
        videoRef.current.muted = true;
        videoRef.current.currentTime = 0;
        
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (token === requestToken.current) {
                triggerCanPlay();
                startProgressLoop();
              }
            })
            .catch((err) => {
              if (err.name !== 'AbortError') {
                triggerError('Preview playback error');
              }
            });
        }
      }
    }, 180); // 180ms hover-intent dwell threshold
  };

  // --- 2. Hover Leave ---
  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    if (intentTimer.current) clearTimeout(intentTimer.current);

    if (status === REEL_STATES.PREVIEW_LOADING || status === REEL_STATES.PREVIEWING) {
      videoStore.clearPreview(item.id);
      flushVideoBuffer();
      triggerLeave();
      setCurrentTime(0);
      setActiveSegmentIndex(0);
    }
  };

  // --- 3. Mobile In-View Observer (≥60% Visible) ---
  useEffect(() => {
    if (!isTouchDevice || isDataSaver || isReducedMotion) return;
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // Only preview if no reel is currently playing inline
            if (!videoStore.getState().activeReelId && !isGlobalActive) {
              const token = ++requestToken.current;
              triggerInView();
              videoStore.setPreview(item.id);

              if (videoRef.current && item.previewSrc) {
                videoRef.current.src = item.previewSrc;
                videoRef.current.muted = true;
                videoRef.current.play()
                  .then(() => {
                    if (token === requestToken.current) {
                      triggerCanPlay();
                      startProgressLoop();
                    }
                  })
                  .catch(() => {});
              }
            }
          } else if (entry.intersectionRatio < 0.2) {
            if (status === REEL_STATES.PREVIEWING || status === REEL_STATES.PREVIEW_LOADING) {
              videoStore.clearPreview(item.id);
              flushVideoBuffer();
              triggerLeave();
            } else if (status === REEL_STATES.PLAYING) {
              // Pause active player if scrolled off screen
              if (videoRef.current) videoRef.current.pause();
              triggerPause();
            }
          }
        });
      },
      { threshold: [0.2, 0.6] }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isTouchDevice, isDataSaver, isReducedMotion, isGlobalActive, status, item.previewSrc, triggerInView, triggerCanPlay, triggerLeave, triggerPause, flushVideoBuffer, startProgressLoop, item.id]);

  // --- 4. Page Visibility Change (Tab Hidden) ---
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (status === REEL_STATES.PLAYING && videoRef.current) {
          videoRef.current.pause();
          triggerPause();
        } else if (status === REEL_STATES.PREVIEWING) {
          flushVideoBuffer();
          triggerLeave();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [status, triggerPause, triggerLeave, flushVideoBuffer]);

  // --- 5. Click to Play (Inline Player at 0:00) ---
  const handleStartInlinePlay = useCallback((startTime = 0) => {
    if (intentTimer.current) clearTimeout(intentTimer.current);
    stopProgressLoop();

    // If card has a real Facebook Reel video URL, pause preview and switch directly to Facebook Reel
    if (item.videoUrl) {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) {}
      }
      triggerPlaying();
      videoStore.playReel(item.id, startTime);
      setShowControls(true);
      return;
    }

    triggerStartPlay();
    videoStore.playReel(item.id, startTime);

    if (videoRef.current) {
      const targetSrc = item.videoSrc || item.localVideoUrl || item.previewSrc;
      videoRef.current.src = targetSrc;
      videoRef.current.currentTime = startTime;
      videoRef.current.muted = userMutedPreference;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            triggerPlaying();
            setAudioBlocked(false);
            startProgressLoop();
            resetAutoHide();
          })
          .catch((err) => {
            if (err.name === 'NotAllowedError') {
              // Browser policy restricted audio: fallback to muted playback + banner
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoStore.setInvoluntaryMuted(true);
                videoRef.current.play().then(() => {
                  triggerPlaying();
                  setAudioBlocked(true);
                  startProgressLoop();
                }).catch(() => triggerError('Autoplay blocked'));
              }
            } else if (err.name !== 'AbortError') {
              triggerError(err.message || 'Error starting reel');
            }
          });
      }
    }
  }, [item.id, item.videoUrl, item.videoSrc, item.localVideoUrl, item.previewSrc, userMutedPreference, triggerStartPlay, triggerPlaying, triggerError, startProgressLoop, stopProgressLoop, resetAutoHide]);

  // Play/Pause Toggle
  const togglePlayPause = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;

    if (status === REEL_STATES.PLAYING) {
      videoRef.current.pause();
      triggerPause();
      stopProgressLoop();
      setShowControls(true);
    } else if (status === REEL_STATES.PAUSED) {
      videoRef.current.play().then(() => {
        triggerResume();
        startProgressLoop();
        resetAutoHide();
      }).catch(() => {});
    } else {
      handleStartInlinePlay(0);
    }
  };

  // Sound Toggle
  const handleToggleSound = (e) => {
    e?.stopPropagation();
    videoStore.toggleMute();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
    setAudioBlocked(false);
  };

  // Unmute Chip Click
  const handleUnmuteChip = (e) => {
    e?.stopPropagation();
    videoStore.unmuteWithUserGesture();
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
    setAudioBlocked(false);
  };

  // Restart from 0:00
  const handleRestart = (e) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        triggerRestart();
        triggerPlaying();
        startProgressLoop();
        resetAutoHide();
      }).catch(() => {});
    }
  };

  // Fullscreen (Native API with iOS webkit fallback)
  const handleNativeFullscreen = (e) => {
    e?.stopPropagation();
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (videoRef.current && videoRef.current.webkitEnterFullscreen) {
      videoRef.current.webkitEnterFullscreen();
    }
  };

  // Theater Mode Modal Handoff
  const handleOpenTheater = (e) => {
    e?.stopPropagation();
    const ct = videoRef.current ? videoRef.current.currentTime : 0;
    if (videoRef.current) videoRef.current.pause();
    triggerPause();
    videoStore.openTheater(item, ct);
    if (onOpenTheater) onOpenTheater(item, ct);
  };

  // Scrubber Pointer Dragging
  const handleScrubberPointerDown = (e) => {
    e.stopPropagation();
    setIsScrubbing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * duration;
    setCurrentTime(targetTime);
    if (videoRef.current) videoRef.current.currentTime = targetTime;

    const handlePointerMove = (moveEvent) => {
      const movePos = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const moveTime = movePos * duration;
      setCurrentTime(moveTime);
      if (videoRef.current) videoRef.current.currentTime = moveTime;
    };

    const handlePointerUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Keyboard navigation on focused card
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePlayPause(e);
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      handleToggleSound(e);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (videoRef.current) videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      handleNativeFullscreen(e);
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      handleOpenTheater(e);
    } else if (e.key === 'Escape') {
      if (!document.fullscreenElement && (status === REEL_STATES.PLAYING || status === REEL_STATES.PAUSED)) {
        e.preventDefault();
        flushVideoBuffer();
        triggerReset();
        videoStore.pauseReel(item.id);
      }
    }
  };

  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isPlayerActive = status === REEL_STATES.PLAYING || status === REEL_STATES.PAUSED || status === REEL_STATES.PLAYER_LOADING || status === REEL_STATES.ENDED;
  const isPreviewActive = status === REEL_STATES.PREVIEWING || status === REEL_STATES.PREVIEW_LOADING;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="button"
      aria-label={item.ariaLabel || `${item.brand} reel`}
      data-testid={`reel-card-${item.id}`}
      data-state={status}
      data-audio={effectiveMuted ? 'muted' : 'unmuted'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleStartInlinePlay(0)}
      onKeyDown={handleKeyDown}
      onMouseMove={resetAutoHide}
      className={`relative w-full rounded-[6px] overflow-hidden bg-zinc-900 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 transition-all duration-300 ${
        aspect === '9/16' ? 'aspect-[9/16]' : 'aspect-[9/16]'
      }`}
    >
      {/* 1. Underlying Native Video Element for Silent Preview */}
      <video
        ref={videoRef}
        playsInline
        webkit-playsinline="true"
        loop={!isPlayerActive}
        preload="none"
        onLoadedMetadata={(e) => setDuration(e.target.duration || item.duration || 30)}
        onEnded={() => {
          if (isPlayerActive) triggerEnded();
        }}
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 pointer-events-none ${
          isPreviewActive || isPlayerActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. Poster Image (Cover photo when idle) */}
      <img
        src={item.videoThumbnail || item.poster}
        alt={item.posterAlt || item.title}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
          isPlayerActive ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Active Video Playback: Facebook Iframe or Fallback Local MP4 */}
      {isPlayerActive ? (
        useLocalPlayer || !item.videoUrl ? (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-40 w-full h-full bg-black select-auto pointer-events-auto flex items-center justify-center"
          >
            <video
              src={item.localVideoUrl || item.videoSrc}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
            {/* Top-right floating controls */}
            <div className="absolute top-2.5 right-2.5 z-50 flex items-center space-x-1.5">
              {item.videoUrl && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full bg-black/80 hover:bg-black text-white/90 hover:text-white transition-colors border border-white/20 shadow-md text-[10px] font-sans"
                  title="Open Reel on Facebook"
                >
                  Facebook ↗
                </a>
              )}
              {item.videoUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUseLocalPlayer(false);
                  }}
                  className="px-2 py-1 rounded-full bg-black/80 hover:bg-black text-white/80 hover:text-white transition-colors border border-white/20 shadow-md text-[10px] cursor-pointer"
                  title="Switch back to Facebook embed"
                >
                  FB Embed
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUseLocalPlayer(false);
                  triggerReset();
                  videoStore.stopAll();
                }}
                className="p-1.5 rounded-full bg-black/80 hover:bg-black text-white/80 hover:text-white transition-colors border border-white/20 shadow-md cursor-pointer"
                title="Close Video"
                aria-label="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-40 w-full h-full bg-black select-auto pointer-events-auto"
          >
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(item.videoUrl)}&show_text=false&autoplay=true`}
              title={item.title || item.brand}
              className="w-full h-full border-0 absolute inset-0 z-10"
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen={true}
            />
            
            {/* Top-right floating controls: Direct Video fallback button + Theater Mode + Close Button */}
            <div className="absolute top-2.5 right-2.5 z-30 flex items-center space-x-1.5">
              {item.localVideoUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUseLocalPlayer(true);
                  }}
                  className="px-2.5 py-1 rounded-full bg-black/80 hover:bg-black text-white text-[10px] font-medium transition-colors border border-white/20 shadow-md cursor-pointer"
                  title="Play clean MP4 video if Facebook embed shows copyright warning"
                >
                  Direct Video
                </button>
              )}
              {item.videoUrl && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-full bg-black/80 hover:bg-black text-white/90 hover:text-white transition-colors border border-white/20 shadow-md text-[10px]"
                  title="Open Reel directly on Facebook"
                >
                  FB ↗
                </a>
              )}
              {onOpenTheater && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTheater(item);
                  }}
                  className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white transition-colors border border-white/20 shadow-md cursor-pointer"
                  title="Theater Mode"
                  aria-label="Theater Mode"
                >
                  <Tv className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUseLocalPlayer(false);
                  triggerReset();
                  videoStore.stopAll();
                }}
                className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white transition-colors border border-white/20 shadow-md cursor-pointer"
                title="Close Video & Return to Preview"
                aria-label="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      ) : (
        <>
          {/* Top Subtle Gradient Scrim for Badges Legibility */}
          <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-black/50 via-black/15 to-transparent z-20 pointer-events-none" />

          {/* Top Row: Left (Only Brand Icon) & Right (Only Views Number with Premium Minimalist UI) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex items-center justify-between pointer-events-none">
            {/* Left: ONLY Brand Icon (Clean circular badge, defaults to Dear Ekra signature flower image) */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-white/70 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
              {(() => {
                const isPlaceholder = !item.brandLogo || (typeof item.brandLogo === 'string' && item.brandLogo.endsWith('.svg')) || item.brandLogo === '/logos/dear_ekra_default.jpg';
                const logoSrc = isPlaceholder ? '/logos/dear_ekra_default.jpg' : item.brandLogo;
                return (
                  <img 
                    src={logoSrc} 
                    alt={item.brand || 'Dear Ekra'} 
                    className={`w-full h-full rounded-full ${
                      isPlaceholder ? 'object-cover' : 'object-contain p-0.5'
                    }`} 
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/logos/dear_ekra_default.jpg';
                      e.currentTarget.className = 'w-full h-full rounded-full object-cover';
                    }}
                  />
                );
              })()}
            </div>

            {/* Right: ONLY Views Number (Premium micro-pill matching UI) */}
            {item.viewCount && (
              <div className="bg-black/40 backdrop-blur-md text-white/95 text-[10px] sm:text-[11px] font-sans font-medium px-2 py-0.5 rounded-full border border-white/10 flex items-center space-x-1 shadow-xs tracking-tight">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/75 shrink-0" />
                <span>{item.viewCount}</span>
              </div>
            )}
          </div>

          {/* 3. Center Subtle Translucent Black Play Button (No pink, clean frosted glass) */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            {status === REEL_STATES.IDLE && (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-[2px] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-black/60 shadow-sm">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
            )}

            {/* Loading Spinner */}
            {status === REEL_STATES.PREVIEW_LOADING && (
              <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg border border-white/20 animate-spin">
                <Loader2 className="w-5 h-5 text-white/80" />
              </div>
            )}

            {/* Error Fallback with Retry */}
            {status === REEL_STATES.ERROR && (
              <div className="bg-black/90 backdrop-blur-xs p-3.5 rounded-lg flex flex-col items-center space-y-1.5 border border-white/10 pointer-events-auto max-w-[200px] text-center">
                <AlertCircle className="w-5 h-5 text-white/70" />
                <span className="text-[11px] text-zinc-300">{errorMessage || 'Unable to play reel'}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartInlinePlay(0); }}
                  className="text-[10px] bg-white text-black px-2.5 py-0.5 rounded font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

