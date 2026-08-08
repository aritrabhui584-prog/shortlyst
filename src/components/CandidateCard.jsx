import React from 'react';
import { FileText, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CandidateCard({ candidate, rank }) {
  if (!candidate) {
    return null;
  }

  const {
    name = 'Candidate Name',
    filename = 'resume.pdf',
    experienceYears = candidate.years_experience ?? candidate.experienceYears ?? 3,
    score = 7.5,
    skills = candidate.key_skills || candidate.skills || [],
    reasoning = 'Strong candidate with relevant background and skill alignment.'
  } = candidate;

  // Determine score color
  let scoreColor = '#10b981'; // Green
  let scoreBg = 'rgba(16, 185, 129, 0.12)';
  let scoreBorder = '#10b981';

  if (score < 5) {
    scoreColor = '#ffb4ab'; // Red
    scoreBg = 'rgba(147, 0, 10, 0.3)';
    scoreBorder = '#ffb4ab';
  } else if (score < 8) {
    scoreColor = '#f59e0b'; // Amber
    scoreBg = 'rgba(245, 158, 11, 0.12)';
    scoreBorder = '#f59e0b';
  }

  // Initials for avatar
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isTopRank = rank === 1;

  return (
    <div
      className="candidate-card group"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-20)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 200ms ease, box-shadow 200ms ease'
      }}
    >
      {/* Rank Badge Header Pill */}
      {rank !== undefined && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: isTopRank ? 'var(--tertiary-container)' : 'var(--bg-elevated)',
            color: isTopRank ? '#000703' : 'var(--text-muted)',
            padding: 'var(--space-4) var(--space-12)',
            borderBottomRightRadius: 'var(--radius-md)',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase'
          }}
        >
          {isTopRank && <Trophy size={12} style={{ color: '#000703' }} />}
          Rank {rank}
        </div>
      )}

      {/* Top Section: Candidate Details & Match Score */}
      <div
        style={{
          marginTop: rank !== undefined ? 'var(--space-8)' : 0,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-16)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
          {/* Circular Avatar / Initials */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isTopRank ? 'var(--color-primary-muted)' : 'var(--bg-elevated)',
              border: `2px solid ${isTopRank ? 'var(--tertiary)' : 'var(--border-color)'}`,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontWeight: 700,
              fontSize: '16px',
              color: isTopRank ? 'var(--tertiary)' : 'var(--text-primary)',
              flexShrink: 0
            }}
          >
            {initials || 'CD'}
          </div>

          <div>
            <h3
              style={{
                margin: '0 0 2px 0',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)'
              }}
            >
              {name}
              {isTopRank && (
                <CheckCircle2
                  size={16}
                  style={{ color: 'var(--tertiary)' }}
                  title="Verified Top Match"
                />
              )}
            </h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-8)',
                fontSize: '13px',
                color: 'var(--text-muted)'
              }}
            >
              <span>{experienceYears} {experienceYears === 1 ? 'year' : 'years'} exp</span>
              <span>•</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  color: 'var(--color-primary)',
                  fontWeight: 500
                }}
              >
                <FileText size={13} />
                {filename}
              </span>
            </div>
          </div>
        </div>

        {/* Score Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: scoreBg,
              border: `3px solid ${scoreBorder}`,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: scoreColor,
              fontWeight: 700,
              fontSize: '18px',
              boxShadow: `0 0 16px ${scoreBg}`,
              flexShrink: 0
            }}
          >
            {Number(score).toFixed(1)}
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginTop: 'var(--space-4)'
            }}
          >
            AI Match Score
          </span>
        </div>
      </div>

      {/* Skills Chips */}
      {skills && skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
          {skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: 'var(--space-4) var(--space-12)',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Reasoning Box */}
      <div
        style={{
          backgroundColor: 'var(--bg-base)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-12) var(--space-16)',
          display: 'flex',
          gap: 'var(--space-10)',
          alignItems: 'flex-start'
        }}
      >
        <Sparkles size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}
        >
          "{reasoning}"
        </p>
      </div>
    </div>
  );
}

