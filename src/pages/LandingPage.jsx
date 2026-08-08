import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Award, Download, ArrowRight } from 'lucide-react';
import PipelineSection from '../components/PipelineSection';
import FAQ from '../components/FAQ';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Scroll Reveal Observer Effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'var(--space-32)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-64)',
        boxSizing: 'border-box'
      }}
    >
      {/* ── 1. Hero Section with Full-Bleed Video Background ──────────────── */}
      <div className="hero-container glass-panel fade-in-panel">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-6)',
              backgroundColor: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-4) var(--space-12)',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: 'var(--space-20)'
            }}
          >
            <Sparkles size={13} />
            <span>AI Resume Screener • Gemini 2.5 Flash</span>
          </div>

          <img
            src="/logo.png"
            alt="Shortlyst Logo"
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              margin: '0 auto var(--space-20)',
              display: 'block',
              objectFit: 'cover',
              boxShadow: '0px 4px 24px rgba(192, 193, 255, 0.25)',
              border: '1px solid var(--surface-variant)',
              backdropFilter: 'blur(4px)'
            }}
          />

          <h1
            className="text-gradient-gemini"
            style={{
              fontSize: '44px',
              lineHeight: '54px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 var(--space-16) 0',
              maxWidth: '720px'
            }}
          >
            Screen 50+ Resumes in Seconds with AI Precision
          </h1>

          <p
            style={{
              fontSize: '18px',
              lineHeight: '28px',
              color: 'var(--text-muted)',
              margin: '0 0 var(--space-32) 0',
              maxWidth: '600px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
            }}
          >
            Instantly extract candidate experience, key skills, and fit scores powered by Google Gemini. Privacy-first, in-browser PDF parsing.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-16)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-gemini-gradient"
            >
              {isAuthenticated ? 'Go to Candidate Screener' : 'Start Screening Candidates'}
              <ArrowRight size={15} />
            </button>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn-gemini-pill-outline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Feature Breakdown Grid ────────────────────────────────────── */}
      <div
        className="fade-in-panel"
        style={{
          animationDelay: '100ms',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-24)'
        }}
      >
        {/* Card 1 */}
        <div
          className="interactive-card glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-12)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Cpu size={22} />
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Gemini 2.5 Scoring
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Every resume is evaluated against your job description for estimated experience, key skills, and a 1–10 match score with written reasoning.
          </p>
        </div>

        {/* Card 2 */}
        <div
          className="interactive-card glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-12)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield size={22} />
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            100% In-Browser PDF.js
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Resumes stay private. PDF text extraction happens entirely on the client side using Mozilla PDF.js — raw files never hit a server storage bucket.
          </p>
        </div>

        {/* Card 3 */}
        <div
          className="interactive-card glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-12)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Award size={22} />
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Ranked Candidate Cards
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Candidates automatically order best-to-worst with color-coded score circles, skill chips, search filtering, and score threshold toggles.
          </p>
        </div>

        {/* Card 4 */}
        <div
          className="interactive-card glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-12)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Download size={22} />
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            One-Click Export
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Export candidate leaderboards instantly to JSON or formatted CSV spreadsheets for seamless sharing across hiring team members.
          </p>
        </div>
      </div>

      {/* ── 3. Visual Pipeline Section (How It Works) ────────────────────── */}
      <PipelineSection />

      {/* ── 4. Frequently Asked Questions (FAQ Accordion) ─────────────────── */}
      <FAQ />

      {/* ── 5. Final Bottom CTA ────────────────────────────────────────── */}
      <div
        className="scroll-reveal glass-panel interactive-card"
        style={{
          width: '100%',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-40) var(--space-32)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-20)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '10%',
            width: '240px',
            height: '240px',
            background: 'var(--color-primary)',
            opacity: 0.04,
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}
        />

        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          Ready to streamline your hiring pipeline?
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0, maxWidth: '540px' }}>
          Screen and score your candidate backlog today. Secure, privacy-first, and fully customizable.
        </p>

        <button
          type="button"
          onClick={handleCtaClick}
          style={{
            padding: 'var(--space-12) var(--space-24)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
            transition: 'all 180ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          }}
        >
          Screen Candidates Now
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
