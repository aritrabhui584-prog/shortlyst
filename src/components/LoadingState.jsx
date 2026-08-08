import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const STATUS_MESSAGES = [
  'Extracting resume text & structure...',
  'Analyzing candidate experience & qualifications...',
  'Scoring skills match against job description...',
  'Identifying key strengths & potential skill gaps...',
  'Ranking candidates by overall fit score...'
];

export default function LoadingState() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-24)',
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-24)'
      }}
    >
      {/* Header Loading Status */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)', padding: 'var(--space-8) 0' }}>
        <Loader2
          size={36}
          className="animate-spin"
          style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}
        />
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Scoring candidates...
        </h2>
        <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-muted)' }}>
          AI is analyzing profiles against your criteria.
        </p>
      </div>

      {/* Rotating Status Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-primary-muted)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-12) var(--space-16)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
          <Sparkles
            size={16}
            style={{ color: 'var(--color-primary)', flexShrink: 0 }}
          />
          <span
            key={statusIndex}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              transition: 'opacity 200ms ease'
            }}
          >
            {STATUS_MESSAGES[statusIndex]}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600 }}>
          <span>AI Screening</span>
        </div>
      </div>

      {/* 3 Skeleton Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
        {[1, 2, 3].map((cardIndex) => (
          <div
            key={cardIndex}
            style={{
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-16)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-12)'
            }}
          >
            {/* Header: Name line & score badge circle skeleton */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', flex: 1 }}>
                <div
                  className="shimmer"
                  style={{
                    height: '18px',
                    width: cardIndex === 1 ? '60%' : cardIndex === 2 ? '45%' : '55%',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
                <div
                  className="shimmer"
                  style={{
                    height: '12px',
                    width: '30%',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
              </div>

              {/* Score circle skeleton */}
              <div
                className="shimmer"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  flexShrink: 0
                }}
              />
            </div>

            {/* Tag row skeleton */}
            <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
              <div
                className="shimmer"
                style={{
                  height: '22px',
                  width: '70px',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              <div
                className="shimmer"
                style={{
                  height: '22px',
                  width: '90px',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              <div
                className="shimmer"
                style={{
                  height: '22px',
                  width: '60px',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
            </div>

            {/* Text lines skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', marginTop: 'var(--space-4)' }}>
              <div
                className="shimmer"
                style={{
                  height: '14px',
                  width: '95%',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              <div
                className="shimmer"
                style={{
                  height: '14px',
                  width: '80%',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
