/**
 * CandidateCard.jsx — Premium Candidate Result Card with Review Actions, Profile Viewer, & Contact Integration
 *
 * Features:
 * - Approved: Border glows green with CheckCircle overlay banner. Enables "Contact Candidate" action.
 * - Rejected: Card dims to 55% opacity and grayscale.
 * - Contact Candidate Drawer: Reveals an input panel to draft and dispatch live messages directly to the Candidate portal notifications.
 * - Profile Viewer: Connects to recruiter profile modal drawer via onViewProfile prop callback.
 */

import React, { useState } from 'react';
import { FileText, Trophy, Sparkles, CheckCircle2, Check, X, Ban, Mail, Send, Eye } from 'lucide-react';

export default function CandidateCard({ candidate, rank, decision = 'pending', onApprove, onReject, onViewProfile }) {
  if (!candidate) {
    return null;
  }

  const {
    id = candidate.filename || '',
    name = 'Candidate Name',
    filename = 'resume.pdf',
    experienceYears = candidate.years_experience ?? candidate.experienceYears ?? 3,
    score = 7.5,
    skills = candidate.key_skills || candidate.skills || [],
    reasoning = 'Strong candidate with relevant background and skill alignment.'
  } = candidate;

  // Contact States
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [messageText, setMessageText] = useState(`Hi ${name},\n\nWe reviewed your Shortlyst AI match report (${score}/10) for our opening and would love to schedule a technical chat. Let us know your availability next week!\n\nBest,\nRecruiter Team`);
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Determine score color — uses design tokens from tokens.css
  let scoreColor = 'var(--color-success)';
  let scoreBg = 'var(--color-success-muted)';
  let scoreBorder = 'var(--color-success)';

  if (score < 5) {
    scoreColor = 'var(--color-danger)';
    scoreBg = 'var(--color-danger-muted)';
    scoreBorder = 'var(--color-danger)';
  } else if (score < 8) {
    scoreColor = 'var(--color-warning)';
    scoreBg = 'var(--color-warning-muted)';
    scoreBorder = 'var(--color-warning)';
  }

  // Initials for avatar
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isTopRank = rank === 1;

  // Determine card styles based on decision status
  const isApproved = decision === 'approved';
  const isRejected = decision === 'rejected';

  let cardBorderColor = 'var(--border-color)';
  let cardOpacity = 1;
  let cardFilter = 'none';

  if (isApproved) {
    cardBorderColor = 'var(--color-success)';
  } else if (isRejected) {
    cardBorderColor = 'var(--outline-variant)';
    cardOpacity = 0.55;
    cardFilter = 'grayscale(35%)';
  }

  // Dispatch message to candidate notifications in local storage
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newNotification = {
      id: `msg-${Date.now()}`,
      candidateName: name, // Matches the candidate username
      senderName: 'Recruiter Admin',
      jobTitle: 'Selected Candidate Interview',
      messageText: messageText.trim(),
      timestamp: new Date().toLocaleTimeString(),
      status: 'approved'
    };

    try {
      const stored = localStorage.getItem('shortlyst_notifications') || '[]';
      const parsed = JSON.parse(stored);
      localStorage.setItem('shortlyst_notifications', JSON.stringify([newNotification, ...parsed]));
      
      // Dispatch storage event to notify other open browser contexts/tabs instantly
      window.dispatchEvent(new Event('storage'));
      
      setIsMessageSent(true);
      setTimeout(() => {
        setShowContactDrawer(false);
        setIsMessageSent(false);
      }, 2500);
    } catch (err) {
      console.error('Error dispatching message:', err);
    }
  };

  return (
    <div
      className="candidate-card interactive-card glass-panel group"
      style={{
        border: `1px solid ${cardBorderColor}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-20)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
        position: 'relative',
        overflow: 'hidden',
        opacity: cardOpacity,
        filter: cardFilter,
        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, border-color 300ms ease, opacity 300ms ease, filter 300ms ease'
      }}
    >
      {/* Top Banner Status Indicator */}
      {isApproved && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'var(--color-success-muted)',
            color: 'var(--color-success)',
            padding: 'var(--space-4) var(--space-12)',
            borderBottomLeftRadius: 'var(--radius-md)',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            zIndex: 3
          }}
        >
          <Check size={12} strokeWidth={3} />
          Approved
        </div>
      )}

      {isRejected && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'var(--color-danger-muted)',
            color: 'var(--color-danger)',
            padding: 'var(--space-4) var(--space-12)',
            borderBottomLeftRadius: 'var(--radius-md)',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            zIndex: 3
          }}
        >
          <Ban size={12} />
          Rejected
        </div>
      )}

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
          justifyContent: 'space-between',
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
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: `2px solid ${isTopRank ? 'var(--tertiary)' : 'var(--border-color)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '16px',
              color: '#ffffff',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
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
                gap: 'var(--space-4)'
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
              
              {/* Profile Viewer Trigger Button */}
              <button
                type="button"
                onClick={() => onViewProfile && onViewProfile(candidate)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  marginLeft: 'var(--space-8)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary-muted)',
                  transition: 'all 150ms ease'
                }}
                title="View full resume profile details"
              >
                <Eye size={12} />
                <span>Profile</span>
              </button>
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
              justifyContent: 'center',
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

      {/* Review Actions Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: 'var(--space-12)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--space-12)',
          marginTop: 'var(--space-4)'
        }}
      >
        {/* Reject Action Button */}
        <button
          type="button"
          onClick={() => onReject(id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            backgroundColor: isRejected ? 'var(--color-danger-muted)' : 'var(--bg-elevated)',
            color: isRejected ? 'var(--color-danger)' : 'var(--text-primary)',
            border: `1px solid ${isRejected ? 'var(--color-danger)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-8) var(--space-16)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          aria-label={`Reject candidate ${name}`}
        >
          <X size={14} />
          {isRejected ? 'Rejected' : 'Reject'}
        </button>

        {/* Approve Action Button */}
        <button
          type="button"
          onClick={() => onApprove(id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            backgroundColor: isApproved ? 'var(--color-success-muted)' : 'var(--bg-elevated)',
            color: isApproved ? 'var(--color-success)' : 'var(--text-primary)',
            border: `1px solid ${isApproved ? 'var(--color-success)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-8) var(--space-16)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          aria-label={`Approve candidate ${name}`}
        >
          <Check size={14} strokeWidth={3} />
          {isApproved ? 'Approved' : 'Approve'}
        </button>

        {/* Contact Candidate Action (Only visible when candidate is Approved) */}
        {isApproved && (
          <button
            type="button"
            onClick={() => setShowContactDrawer((prev) => !prev)}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-6)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-8) var(--space-16)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Mail size={14} />
            <span>Contact Candidate</span>
          </button>
        )}
      </div>

      {/* Recruiter Messaging Drawer */}
      {showContactDrawer && (
        <div
          className="stagger-card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-16)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-12)',
            marginTop: 'var(--space-12)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={13} /> Direct Message to {name}
            </span>
            <button
              type="button"
              onClick={() => setShowContactDrawer(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>

          {isMessageSent ? (
            <div
              style={{
                backgroundColor: 'var(--color-success-muted)',
                color: 'var(--color-success)',
                border: '1px solid var(--color-success)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-12)',
                fontSize: '13px',
                textAlign: 'center',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Invitation Sent! Candidate has been notified.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-10)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={handleSendMessage}
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-6) var(--space-16)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Send size={11} />
                <span>Send Message</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
