import React, { useState, useEffect } from 'react';

export default function ScoreBadge({ score, maxScore = 10, size = 'md' }) {
  // Fallback for header usage when score is not passed
  const isHeaderMode = score === undefined || score === null;
  const targetScore = isHeaderMode ? 10 : Math.min(Math.max(Number(score), 0), maxScore);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame = null;
    const duration = 600; // ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(easedProgress * targetScore);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [targetScore]);

  if (isHeaderMode) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-8)',
          backgroundColor: 'var(--color-primary-muted)',
          color: 'var(--color-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-12)',
          fontSize: '12px',
          fontWeight: 600
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success)'
          }}
        />
        Shortlyst v1.0
      </div>
    );
  }

  // Determine color scheme based on score out of 10
  let color = 'var(--color-success)';
  let bgMuted = 'var(--color-success-muted)';

  if (targetScore < 4) {
    color = 'var(--color-danger)';
    bgMuted = 'var(--color-danger-muted)';
  } else if (targetScore < 7) {
    color = 'var(--color-warning)';
    bgMuted = 'var(--color-warning-muted)';
  }

  const dimensions = size === 'sm' ? { width: '38px', height: '38px', fontSize: '13px' } : { width: '48px', height: '48px', fontSize: '16px' };

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: '50%',
        backgroundColor: bgMuted,
        border: `2px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        color: color,
        fontWeight: 700,
        fontSize: dimensions.fontSize,
        lineHeight: 1,
        flexShrink: 0,
        boxShadow: `0 0 12px ${bgMuted}`
      }}
      title={`Match Score: ${targetScore.toFixed(1)} / ${maxScore}`}
    >
      <span>{animatedScore.toFixed(1)}</span>
      <span
        style={{
          fontSize: '9px',
          opacity: 0.8,
          marginTop: '1px',
          fontWeight: 500
        }}
      >
        /10
      </span>
    </div>
  );
}
