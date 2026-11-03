import React, { useState, useEffect, useRef } from 'react';

/**
 * TypewriterSpecialty:
 * - Types the specialty title once when a photo arrives.
 * - Cursor is inline (sits directly next to the last letter, never disconnected).
 * - Light, subtle cursor color (halka color) that does not distract.
 * - Cursor disappears completely once typing finishes.
 * - Text stays stationary and clearly visible for the entire duration of the photo.
 * - When the photo is ending, the text is erased (with the light cursor active).
 * - Zero Cumulative Layout Shift (CLS).
 */
export default function TypewriterSpecialty({ 
  role = "Trusted Brand Promoter & Content Creator", 
  accentColor = "#2563EB",
  totalDuration = 11000 // Total time per look in milliseconds (matches App.jsx timer)
}) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const activeRoleRef = useRef(role);
  const cycleTimeoutRef = useRef(null);
  const stepTimeoutRef = useRef(null);

  useEffect(() => {
    // If the role changed (user clicked arrows, dots, or photo transitioned)
    activeRoleRef.current = role;
    clearTimeout(cycleTimeoutRef.current);
    clearTimeout(stepTimeoutRef.current);

    // Reset and start typing immediately
    setDisplayText('');
    setShowCursor(true);

    let charIndex = 0;
    const targetText = role;
    const typingSpeed = 42; // ms per character (~1.6s for full role)

    const typeNextChar = () => {
      if (charIndex < targetText.length) {
        charIndex++;
        setDisplayText(targetText.slice(0, charIndex));
        stepTimeoutRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        // 1. Typing complete: cursor disappears immediately
        setShowCursor(false);

        // 2. Text remains stationary for the entire life of this photo!
        // Calculate remaining time before the photo ends (erase starts ~900ms before photo change)
        const typedDuration = targetText.length * typingSpeed;
        const deleteDuration = targetText.length * 18;
        const holdDuration = Math.max(3000, totalDuration - typedDuration - deleteDuration - 300);

        cycleTimeoutRef.current = setTimeout(() => {
          // 3. Photo is about to end: start erasing with cursor visible
          setShowCursor(true);
          let currentLen = targetText.length;

          const deleteNextChar = () => {
            if (currentLen > 0) {
              currentLen = Math.max(0, currentLen - 1);
              setDisplayText(targetText.slice(0, currentLen));
              stepTimeoutRef.current = setTimeout(deleteNextChar, 18);
            } else {
              // Deletion complete, wait for next photo to arrive
              setShowCursor(false);
            }
          };

          deleteNextChar();
        }, holdDuration);
      }
    };

    // Small initial delay so photo transition begins smoothly before typing starts
    stepTimeoutRef.current = setTimeout(typeNextChar, 180);

    return () => {
      clearTimeout(cycleTimeoutRef.current);
      clearTimeout(stepTimeoutRef.current);
    };
  }, [role, totalDuration]);

  return (
    <div className="relative w-full h-[62px] sm:h-[70px] lg:h-[78px] flex items-center justify-center lg:justify-start">
      {/* Invisible anchor text reserves exact height to guarantee ZERO layout shift */}
      <h2 
        aria-hidden="true"
        className="invisible pointer-events-none select-none font-serif italic font-bold text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] tracking-tight leading-snug text-center lg:text-left"
      >
        {role}
      </h2>

      {/* Live Animated Headline with Inline Subtle Cursor */}
      <h2
        className="absolute inset-0 flex items-center justify-center lg:justify-start font-serif italic font-bold text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] tracking-tight leading-snug text-center lg:text-left select-none pointer-events-none"
      >
        <span 
          style={{ 
            color: accentColor,
            transition: 'color 700ms ease'
          }}
          className="inline"
        >
          {displayText}

          {/* Subtle, light-colored inline cursor: only visible while typing or deleting */}
          {showCursor && (
            <span 
              className="inline-block w-[2px] h-[0.85em] ml-1 bg-zinc-400/80 rounded-full align-baseline animate-pulse"
              style={{
                boxShadow: '0 0 4px rgba(161, 161, 170, 0.4)'
              }}
              aria-hidden="true"
            />
          )}
        </span>
      </h2>
    </div>
  );
}
