/**
 * ResultsList.jsx — Interactive Candidate Results Dashboard & Profile Viewer
 *
 * Implements:
 * - Active candidate keyword search & score threshold filters
 * - Dynamic quick-skill chip suggestions
 * - Real-time Recruiter Review Workflow: Synced with parent storage state approvals
 * - Real-time statistics bar (Screened, Approved, Rejected, Pending Review)
 * - Filtering tab controls (All, Approved, Rejected, Pending Review)
 * - Candidate Profile Drawer Modal: Renders detailed profile info, contact details, AI fit metrics, and direct messaging logs.
 * - CSV and JSON structured list exports
 */

import React, { useState } from 'react';
import { Trophy, Sparkles, Download, FileJson, FileSpreadsheet, Search, Filter, X, Check, Eye, Mail, Phone, MapPin, Award, User, Star, Send } from 'lucide-react';
import CandidateCard from './CandidateCard';

// Sample fallback candidates if none passed
const SAMPLE_CANDIDATES = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    filename: 'Alex_Rivera_Resume.pdf',
    years_experience: 6,
    score: 9.2,
    key_skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Redux', 'System Architecture'],
    reasoning: 'Exceptional match. Demonstrates 6+ years of full-stack React experience, solid architecture leadership, and direct expertise in performance optimization.',
    status: 'pending'
  },
  {
    id: 'c2',
    name: 'Elena Rostova',
    filename: 'Elena_R_Resume.pdf',
    years_experience: 4,
    score: 7.8,
    key_skills: ['React', 'JavaScript', 'Redux', 'REST APIs', 'Jest'],
    reasoning: 'Strong match. Proficient in modern frontend engineering and UI design patterns. Slight gap in backend server-side Node integration.',
    status: 'pending'
  },
  {
    id: 'c3',
    name: 'Marcus Chen',
    filename: 'Marcus_Chen_Dev.pdf',
    years_experience: 2,
    score: 5.4,
    key_skills: ['Vue.js', 'HTML/CSS', 'Python', 'Git'],
    reasoning: 'Moderate match. Solid junior/mid-level background, but primary framework experience is Vue rather than React and limited senior leadership.',
    status: 'pending'
  }
];

export default function ResultsList({ candidates = SAMPLE_CANDIDATES, onReset, onApprove, onReject, customTitle }) {
  const candidateList = candidates && candidates.length > 0 ? candidates : SAMPLE_CANDIDATES;
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  // Filter Tab state
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('all'); // 'all' | 'approved' | 'rejected' | 'pending'

  // Profile Detail Modal State
  const [activeCandidateProfile, setActiveCandidateProfile] = useState(null);
  
  // Profile Message state
  const [profileMessageText, setProfileMessageText] = useState('');
  const [profileMessageSent, setProfileMessageSent] = useState(false);

  // Helper to resolve candidate ID uniquely
  const getCandidateId = (c) => c.id || c.filename || '';

  // Sort best-to-worst by score
  const sortedCandidates = [...candidateList].sort((a, b) => (b.score || 0) - (a.score || 0));

  // Compute stats across ALL candidates in the current session
  const totalCount = sortedCandidates.length;
  const approvedCount = sortedCandidates.filter((c) => c.status === 'approved').length;
  const rejectedCount = sortedCandidates.filter((c) => c.status === 'rejected').length;
  const pendingCount = totalCount - approvedCount - rejectedCount;

  // Extract unique skills across candidates for quick filter suggestion chips
  const allSkills = Array.from(
    new Set(
      sortedCandidates.flatMap((c) => c.key_skills || c.skills || [])
    )
  ).slice(0, 8);

  // Apply filters (Score, Search Query, and Review Decision Tab)
  const filteredCandidates = sortedCandidates.filter((c) => {
    // 1. Score Filter
    const scoreMatch = (c.score || 0) >= minScoreFilter;
    if (!scoreMatch) return false;

    // 2. Review Workflow Tab Filter
    const decision = c.status || 'pending';
    if (activeWorkflowTab === 'approved' && decision !== 'approved') return false;
    if (activeWorkflowTab === 'rejected' && decision !== 'rejected') return false;
    if (activeWorkflowTab === 'pending' && decision !== 'pending') return false;

    // 3. Text Search Filter
    if (!searchQuery.trim()) return true;
    const queryLower = searchQuery.toLowerCase().trim();
    const nameMatch = (c.name || '').toLowerCase().includes(queryLower);
    const reasoningMatch = (c.reasoning || '').toLowerCase().includes(queryLower);
    const skillsList = c.key_skills || c.skills || [];
    const skillMatch = skillsList.some((s) => s.toLowerCase().includes(queryLower));

    return nameMatch || reasoningMatch || skillMatch;
  });

  const avgScore = sortedCandidates.length > 0
    ? (sortedCandidates.reduce((acc, curr) => acc + (curr.score || 0), 0) / sortedCandidates.length).toFixed(1)
    : '0.0';

  const handleExportJSON = () => {
    const exportData = filteredCandidates.map((c, index) => ({
      rank: index + 1,
      name: c.name || 'Candidate',
      filename: c.filename || '',
      score: c.score,
      yearsExperience: c.years_experience ?? c.experienceYears ?? 0,
      skills: c.key_skills || c.skills || [],
      reasoning: c.reasoning || '',
      reviewStatus: c.status || 'pending'
    }));

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shortlyst_candidates_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportOptions(false);
  };

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'Filename', 'Score (out of 10)', 'Years Experience', 'Key Skills', 'Reasoning', 'Review Status'];
    const rows = filteredCandidates.map((c, index) => {
      const skillsStr = (c.key_skills || c.skills || []).join('; ');
      const exp = c.years_experience ?? c.experienceYears ?? 0;
      const status = c.status || 'pending';
      return [
        index + 1,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.filename || '').replace(/"/g, '""')}"`,
        c.score,
        exp,
        `"${skillsStr.replace(/"/g, '""')}"`,
        `"${(c.reasoning || '').replace(/"/g, '""')}"`,
        `"${status}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shortlyst_candidates_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportOptions(false);
  };

  // Profile message sender
  const handleSendProfileMessage = () => {
    if (!profileMessageText.trim() || !activeCandidateProfile) return;

    const newNotification = {
      id: `msg-${Date.now()}`,
      candidateName: activeCandidateProfile.name,
      senderName: 'Recruiter Admin',
      jobTitle: 'Interview Outreach Offer',
      messageText: profileMessageText.trim(),
      timestamp: new Date().toLocaleTimeString(),
      status: 'approved'
    };

    try {
      const stored = localStorage.getItem('shortlyst_notifications') || '[]';
      const parsed = JSON.parse(stored);
      localStorage.setItem('shortlyst_notifications', JSON.stringify([newNotification, ...parsed]));
      window.dispatchEvent(new Event('storage'));
      
      setProfileMessageSent(true);
      setTimeout(() => {
        setProfileMessageSent(false);
        setProfileMessageText('');
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Close profile modal
  const handleCloseProfileModal = () => {
    setActiveCandidateProfile(null);
    setProfileMessageText('');
    setProfileMessageSent(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-20)'
      }}
    >
      {/* Results Header Summary Bar */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-20)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
          <div
            style={{
              padding: 'var(--space-10)',
              backgroundColor: 'var(--color-primary-muted)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trophy size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {customTitle || 'Screening Results'}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              {sortedCandidates.length} {sortedCandidates.length === 1 ? 'candidate' : 'candidates'} ranked by job alignment
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center', flexWrap: 'wrap' }}>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="btn-gemini-pill-outline"
              style={{ padding: 'var(--space-8) var(--space-16)' }}
            >
              Clear Applicants
            </button>
          )}

          {/* Export Dropdown Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowExportOptions((prev) => !prev)}
              className="btn-gemini-gradient"
              style={{
                padding: 'var(--space-8) var(--space-16)',
                fontSize: '13px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Download size={14} />
              <span>Export</span>
            </button>

            {showExportOptions && (
              <div
                className="glass-panel fade-in-panel"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 'var(--space-8)',
                  borderRadius: 'var(--radius-md)',
                  width: '180px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 'var(--space-6)'
                }}
              >
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-10) var(--space-12)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <FileSpreadsheet size={14} style={{ color: 'var(--color-success)' }} />
                  Export to CSV
                </button>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-10) var(--space-12)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <FileJson size={14} style={{ color: 'var(--color-primary)' }} />
                  Export to JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Metrics Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 'var(--space-12)'
        }}
      >
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-14)', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Screened</span>
          <strong style={{ display: 'block', fontSize: '20px', color: 'var(--text-primary)', marginTop: '4px' }}>{totalCount}</strong>
        </div>
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-14)', textAlign: 'center', borderLeft: '3px solid var(--color-success)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Approved</span>
          <strong style={{ display: 'block', fontSize: '20px', color: 'var(--color-success)', marginTop: '4px' }}>{approvedCount}</strong>
        </div>
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-14)', textAlign: 'center', borderLeft: '3px solid var(--color-danger)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Rejected</span>
          <strong style={{ display: 'block', fontSize: '20px', color: 'var(--color-danger)', marginTop: '4px' }}>{rejectedCount}</strong>
        </div>
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-14)', textAlign: 'center', borderLeft: '3px solid var(--color-warning)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Pending</span>
          <strong style={{ display: 'block', fontSize: '20px', color: 'var(--color-warning)', marginTop: '4px' }}>{pendingCount}</strong>
        </div>
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-14)', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Average Fit</span>
          <strong style={{ display: 'block', fontSize: '20px', color: 'var(--color-primary)', marginTop: '4px' }}>{avgScore}/10</strong>
        </div>
      </div>

      {/* Leaderboard Actions, Filter Inputs, and tabs */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-16) var(--space-20)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-14)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-14)'
          }}
        >
          {/* Workflow Status Filter Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              gap: '2px'
            }}
          >
            <button
              onClick={() => setActiveWorkflowTab('all')}
              style={{
                backgroundColor: activeWorkflowTab === 'all' ? 'var(--bg-elevated)' : 'transparent',
                color: activeWorkflowTab === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-6) var(--space-14)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveWorkflowTab('pending')}
              style={{
                backgroundColor: activeWorkflowTab === 'pending' ? 'var(--bg-elevated)' : 'transparent',
                color: activeWorkflowTab === 'pending' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-6) var(--space-14)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveWorkflowTab('approved')}
              style={{
                backgroundColor: activeWorkflowTab === 'approved' ? 'var(--bg-elevated)' : 'transparent',
                color: activeWorkflowTab === 'approved' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-6) var(--space-14)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveWorkflowTab('rejected')}
              style={{
                backgroundColor: activeWorkflowTab === 'rejected' ? 'var(--bg-elevated)' : 'transparent',
                color: activeWorkflowTab === 'rejected' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-6) var(--space-14)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Score Threshold Filter Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', fontSize: '13px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Min Score:</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(parseFloat(e.target.value))}
              style={{ cursor: 'pointer', accentColor: 'var(--color-primary)', width: '100px' }}
            />
            <span style={{ fontWeight: 700, color: 'var(--color-primary)', minWidth: '24px' }}>
              {minScoreFilter.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Live Search Box Inputs */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 'var(--space-12)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search applicants by name, skills or AI feedback comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-base)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-10) var(--space-12) var(--space-10) var(--space-36)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              transition: 'border-color 150ms ease'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 'var(--space-12)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Skill Filter Suggestion Chips */}
        {allSkills.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Skills:
            </span>
            {allSkills.map((skill) => {
              const isSelected = searchQuery.toLowerCase() === skill.toLowerCase();
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSearchQuery(isSelected ? '' : skill)}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-elevated)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sorted Candidate Cards with Staggered Entrance or Filter Empty State */}
      {filteredCandidates.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {filteredCandidates.map((candidate, index) => {
            const id = getCandidateId(candidate);
            return (
              <div
                key={id || index}
                className="stagger-card"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <CandidateCard
                  candidate={candidate}
                  rank={sortedCandidates.findIndex((c) => getCandidateId(c) === id) + 1}
                  decision={candidate.status || 'pending'}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewProfile={setActiveCandidateProfile}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-32) var(--space-20)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-12)'
          }}
        >
          <Filter size={28} style={{ color: 'var(--text-muted)' }} />
          <div>
            <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '15px', color: 'var(--text-primary)' }}>
              No candidates match current filters
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Try adjusting your workflow tabs, skill keywords or score threshold
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setMinScoreFilter(0);
              setActiveWorkflowTab('all');
            }}
            style={{
              backgroundColor: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-6) var(--space-12)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 'var(--space-4)'
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ── Candidate Detailed Profile Modal Overlay ─────────────────────── */}
      {activeCandidateProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-16)'
          }}
        >
          <div
            className="glass-panel login-card-animated"
            style={{
              width: '100%',
              maxWidth: '680px',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-32)',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-24)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}
          >
            {/* Close Trigger Button */}
            <button
              onClick={handleCloseProfileModal}
              style={{
                position: 'absolute',
                top: 'var(--space-20)',
                right: 'var(--space-20)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
              title="Close Profile Viewer"
            >
              <X size={18} />
            </button>

            {/* Profile Header Block */}
            <div style={{ display: 'flex', gap: 'var(--space-20)', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Profile Avatar Frame */}
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: '3px solid var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 700,
                  boxShadow: '0 6px 18px rgba(59, 130, 246, 0.3)'
                }}
              >
                {activeCandidateProfile.name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
              </div>

              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activeCandidateProfile.name}
                  {activeCandidateProfile.score >= 8.5 && <Award size={20} style={{ color: 'var(--tertiary)' }} title="Top Tier Fit" />}
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-12)', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>{activeCandidateProfile.years_experience ?? activeCandidateProfile.experienceYears} Years Estimated Experience</span>
                  <span>•</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{activeCandidateProfile.filename}</span>
                </div>
              </div>

              {/* Match Score circular badge */}
              <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-muted)',
                    border: '3px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 800
                  }}
                >
                  {Number(activeCandidateProfile.score).toFixed(1)}
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>AI FIT SCORE</span>
              </div>
            </div>

            {/* Profile Contact info section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-12)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-16)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: '13px', color: 'var(--text-primary)' }}>
                <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                <span>{activeCandidateProfile.name.toLowerCase().replace(/ /g, '_')}@example.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: '13px', color: 'var(--text-primary)' }}>
                <Phone size={14} style={{ color: 'var(--color-primary)' }} />
                <span>+1 (555) 382-9012</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: '13px', color: 'var(--text-primary)' }}>
                <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                <span>San Francisco, CA / Remote</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: '13px', color: 'var(--text-primary)' }}>
                <User size={14} style={{ color: 'var(--color-primary)' }} />
                <span>linkedin.com/in/{activeCandidateProfile.name.toLowerCase().replace(/ /g, '')}</span>
              </div>
            </div>

            {/* Skills & Experience details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} style={{ color: 'var(--color-primary)' }} /> Identified Skills Tags
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
                {(activeCandidateProfile.key_skills || activeCandidateProfile.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Automated justification report */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} style={{ color: 'var(--color-primary)' }} /> AI Evaluation Report & Feedback
              </h4>
              <div
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-16)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic'
                }}
              >
                "{activeCandidateProfile.reasoning}"
              </div>
            </div>

            {/* Outreach Drawer Section */}
            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: 'var(--space-20)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-12)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Send Interview invitation</span>
                
                {/* Decision toggles inside profile viewer */}
                <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                  <button
                    onClick={() => onReject(getCandidateId(activeCandidateProfile))}
                    style={{
                      backgroundColor: activeCandidateProfile.status === 'rejected' ? 'var(--color-danger-muted)' : 'transparent',
                      color: activeCandidateProfile.status === 'rejected' ? 'var(--color-danger)' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove(getCandidateId(activeCandidateProfile))}
                    style={{
                      backgroundColor: activeCandidateProfile.status === 'approved' ? 'var(--color-success-muted)' : 'transparent',
                      color: activeCandidateProfile.status === 'approved' ? 'var(--color-success)' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                </div>
              </div>

              {profileMessageSent ? (
                <div style={{ backgroundColor: 'var(--color-success-muted)', color: 'var(--color-success)', padding: 'var(--space-12)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                  Outreach message sent! Candidate notified.
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                  <input
                    type="text"
                    placeholder="Draft custom outreach invite message (e.g. Schedule call)..."
                    value={profileMessageText}
                    onChange={(e) => setProfileMessageText(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'var(--bg-base)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 12px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSendProfileMessage}
                    disabled={!profileMessageText.trim()}
                    className="btn-gemini-gradient"
                    style={{
                      padding: '6px 16px',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <Send size={11} /> Send
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
