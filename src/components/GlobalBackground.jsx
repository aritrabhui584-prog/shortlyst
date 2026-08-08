/**
 * GlobalBackground.jsx — Universal Loop Video Background Component
 *
 * Implements a global, unified loop video background:
 * - Plays hero-bg.mp4 with poster fallback (hero-poster.svg)
 * - Automatically dims and blurs slightly on Screener (/app) and Candidate (/candidate)
 *   dashboards to ensure maximum text readability and form input focus
 * - Brightens on Landing (/) and Login (/login) for visual engagement
 * - Uses a React ref and play trigger effect to ensure playback never stops
 *   due to browser autoplay policies or DOM styles changes.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import heroBgVideo from '../assets/hero-bg.mp4';
import heroPoster from '../assets/hero-poster.svg';

export default function GlobalBackground() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const location = useLocation();
  const videoRef = useRef(null);

  // Path context and parameters
  const path = location.pathname;
  const isDashboard = path === '/app' || path === '/candidate';
  const overlayOpacity = isDashboard ? 0.72 : 0.48; // Opacities optimized to keep background alive
  const videoOpacity = isDashboard ? 0.50 : 0.65;
  const blurAmount = isDashboard ? '1.5px' : 'none'; // Subtle blur to keep aesthetic active

  useEffect(() => {
    const isSmallScreen = window.matchMedia('(max-width: 480px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isSmallScreen && !prefersReducedMotion) {
      const timer = setTimeout(() => setShouldLoadVideo(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Force play background video on path changes or load states
  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was interrupted or requires interaction:", err);
      });
    }
  }, [path, shouldLoadVideo]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-base)'
      }}
    >
      {/* Poster image fallback (instant load) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroPoster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isDashboard ? 0.2 : 0.35
        }}
      />

      {/* Looping video element */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: videoOpacity,
            transition: 'opacity 800ms ease, filter 800ms ease',
            filter: blurAmount
          }}
        >
          <source src={heroBgVideo} type="video/mp4" />
        </video>
      )}

      {/* Dynamic Overlay Gradient */}
      <div
        className="global-background-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            180deg,
            rgba(11, 19, 38, ${overlayOpacity - 0.1}) 0%,
            rgba(11, 19, 38, ${overlayOpacity}) 70%,
            var(--bg-base) 100%
          )`,
          transition: 'background 400ms ease'
        }}
      />

      {/* Subtle grid line overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: isDashboard ? 0.4 : 0.6
        }}
      />
    </div>
  );
}
