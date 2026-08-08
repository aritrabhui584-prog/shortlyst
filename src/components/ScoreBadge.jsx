/**
 * ScoreBadge.jsx — Circular AI match score indicator
 *
 * Renders an animated circular badge that fills from 0 to the target score
 * with color-coded theming: green (≥7), amber (4–6), red (<4).
 */
import React, { useState, useEffect } from 'react';

export default function ScoreBadge({ score, maxScore = 10, size = 'md' }) {
  const targetScore = Math.min(Math.max(Number(score) || 0, 0), maxScore);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame = null;
    const duration = 600;

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

  // Color scheme based on score
  let color = 'var(--color-success)';
  let bgMuted = 'var(--color-success-muted)';

  if (targetScore < 4) {
    color = 'var(--color-danger)';
    bgMuted = 'var(--color-danger-muted)';
  } else if (targetScore < 7) {
    color = 'var(--color-warning)';
    bgMuted = 'var(--color-warning-muted)';
  }

  const dimensions = size === 'sm'
    ? { width: '38px', height: '38px', fontSize: '13px' }
    : { width: '48px', height: '48px', fontSize: '16px' };

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
        justifyContent: 'center',
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
