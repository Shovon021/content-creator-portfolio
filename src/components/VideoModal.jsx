import React, { useState, useRef, useEffect } from 'react';
import { X, ExternalLink, Play, Film, CheckCircle, Volume2, Sparkles } from 'lucide-react';
import { videoStore } from '../store/videoStore';

export default function VideoModal({ isOpen, onClose, video, initialTime = 0 }) {
  if (!isOpen || !video) return null;

  const [tryEmbed, setTryEmbed] = useState(false);
  const [forceLocal, setForceLocal] = useState(false);
  const videoRef = useRef(null);
  const videoSrc = video.videoSrc || video.localVideoUrl;
  const hasLocalVideo = Boolean(videoSrc);

  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      try {
        videoRef.current.currentTime = initialTime;
      } catch (e) { }
    }
  }, [initialTime, videoSrc]);

  const handleClose = () => {
    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;
    videoStore.closeTheater(currentTime);
    onClose();
  };

  const embedUrl = `https://www.facebook.com/plugins/video.php?height=580&href=${encodeURIComponent(
    video.videoUrl
  )}&show_text=false&width=320`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal Dialog Frame */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-[2rem] border border-pink-200 shadow-2xl overflow-hidden flex flex-col items-center">

        {/* Top Header Bar */}
        <div className="w-full px-4 py-3 flex items-center justify-between border-b border-pink-100 bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-white border border-pink-200 p-0.5 shadow-2xs flex items-center justify-center overflow-hidden shrink-0">
              {video.brandLogo ? (
                <img src={video.brandLogo} alt={video.brand} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs font-bold text-pink-600">{video.brand?.charAt(0) || 'E'}</span>
              )}
            </div>
            <span className="text-xs font-bold text-zinc-900 truncate max-w-[200px]">
              {video.brand}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {hasLocalVideo && video.videoUrl && (
              <button
                onClick={() => setForceLocal(!forceLocal)}
                className="px-2.5 py-0.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-[10px] font-medium border border-pink-200 transition-colors cursor-pointer"
                title="Switch between Facebook embed and local clean video"
              >
                {forceLocal ? 'FB Embed' : 'Direct Video'}
              </button>
            )}
            <button
              onClick={handleClose}
              aria-label="Close player"
              className="p-1 rounded-full hover:bg-pink-50 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Display Area (9:16 Aspect) */}
        <div className="w-full aspect-[9/16] bg-zinc-950 relative flex items-center justify-center overflow-hidden">

          {!forceLocal && video.videoUrl ? (
            /* 1. Real Facebook Reel directly from Facebook servers */
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoUrl)}&show_text=false&autoplay=true`}
              title={video.title || video.brand}
              className="w-full h-full border-0 absolute inset-0 z-20"
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen={true}
            />
          ) : hasLocalVideo ? (
            /* 2. Fallback Native HTML5 Video */
            <video
              ref={videoRef}
              src={videoSrc}
              poster={video.videoThumbnail}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            /* 3. High-Quality Bespoke Reels Player Card */
            <div className="w-full h-full relative flex flex-col justify-between p-4 text-left">
              {/* Cover Image */}
              <img
                src={video.videoThumbnail}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

              {/* Top Tag & Verified Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-pink-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {video.metricBadge}
                </span>

                <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-pink-200">
                  <Volume2 className="w-3 h-3 text-pink-400 animate-pulse" />
                  <span>Audio Sync</span>
                </div>
              </div>

              {/* Center Big Play Button that launches Reel cleanly */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-2.5 py-8">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all group"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5 group-hover:scale-110 transition-transform" />
                </a>
                <span className="text-[11px] font-bold text-white tracking-wide bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                  Tap to Watch on Facebook Reel
                </span>
              </div>

              {/* Bottom Creator Info & Title */}
              <div className="relative z-10 space-y-2">
                <div>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-xs font-bold text-white">@3kraneha</span>
                    <span className="text-[10px] text-pink-300 font-medium bg-pink-900/60 px-1.5 py-0.2 rounded">
                      Verified Collab
                    </span>
                  </div>
                  <p className="text-xs text-zinc-100 font-medium line-clamp-2 leading-tight">
                    {video.title}
                  </p>
                </div>

                {/* Direct Action Link */}
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-98 transition-all"
                >
                  <span>Open Video in Facebook App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Embedded option toggle */}
                <button
                  onClick={() => setTryEmbed(true)}
                  className="w-full text-center text-[10px] text-zinc-300 hover:text-white underline pt-0.5"
                >
                  Try playing inside this browser window
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
