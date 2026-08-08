import React, { useState } from 'react';
import { Users, Trophy, Sparkles, Download, FileJson, FileSpreadsheet, Search, Filter, X } from 'lucide-react';
import CandidateCard from './CandidateCard';

// Sample fallback candidates if none passed
const SAMPLE_CANDIDATES = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    filename: 'Alex_Rivera_Resume.pdf',
    experienceYears: 6,
    score: 9.2,
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'System Architecture'],
    reasoning: 'Exceptional match. Demonstrates 6+ years of full-stack React experience, solid architecture leadership, and direct expertise in performance optimization.'
  },
  {
    id: 'c2',
    name: 'Elena Rostova',
    filename: 'Elena_R_Resume.pdf',
    experienceYears: 4,
    score: 7.8,
    skills: ['React', 'JavaScript', 'Redux', 'REST APIs', 'Jest'],
    reasoning: 'Strong match. Proficient in modern frontend engineering and UI design patterns. Slight gap in backend server-side Node integration.'
  },
  {
    id: 'c3',
    name: 'Marcus Chen',
    filename: 'Marcus_Chen_Dev.pdf',
    experienceYears: 2,
    score: 5.4,
    skills: ['Vue.js', 'HTML/CSS', 'Python', 'Git'],
    reasoning: 'Moderate match. Solid junior/mid-level background, but primary framework experience is Vue rather than React and limited senior leadership.'
  }
];

export default function ResultsList({ candidates = SAMPLE_CANDIDATES }) {
  const candidateList = candidates && candidates.length > 0 ? candidates : SAMPLE_CANDIDATES;
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  // Sort best-to-worst by score
  const sortedCandidates = [...candidateList].sort((a, b) => (b.score || 0) - (a.score || 0));

  // Extract unique skills across candidates for quick filter suggestion chips
  const allSkills = Array.from(
    new Set(
      sortedCandidates.flatMap((c) => c.key_skills || c.skills || [])
    )
  ).slice(0, 8);

  // Filter candidates based on min score and search query
  const filteredCandidates = sortedCandidates.filter((c) => {
    const scoreMatch = (c.score || 0) >= minScoreFilter;
    if (!scoreMatch) return false;

    if (!searchQuery.trim()) return true;

    const queryLower = searchQuery.toLowerCase().trim();
    const nameMatch = (c.name || '').toLowerCase().includes(queryLower);
    const reasoningMatch = (c.reasoning || '').toLowerCase().includes(queryLower);
    const skillsList = c.key_skills || c.skills || [];
    const skillMatch = skillsList.some((s) => s.toLowerCase().includes(queryLower));

    return nameMatch || reasoningMatch || skillMatch;
  });

  const topMatch = sortedCandidates[0];
  const avgScore = (
    sortedCandidates.reduce((acc, curr) => acc + (curr.score || 0), 0) / sortedCandidates.length
  ).toFixed(1);

  const handleExportJSON = () => {
    const exportData = filteredCandidates.map((c, index) => ({
      rank: index + 1,
      name: c.name || 'Candidate',
      filename: c.filename || '',
      score: c.score,
      yearsExperience: c.years_experience ?? c.experienceYears ?? 0,
      skills: c.key_skills || c.skills || [],
      reasoning: c.reasoning || ''
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
    const headers = ['Rank', 'Name', 'Filename', 'Score (out of 10)', 'Years Experience', 'Key Skills', 'Reasoning'];
    const rows = filteredCandidates.map((c, index) => {
      const skillsStr = (c.key_skills || c.skills || []).join('; ');
      const exp = c.years_experience ?? c.experienceYears ?? 0;
      return [
        index + 1,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.filename || '').replace(/"/g, '""')}"`,
        c.score,
        exp,
        `"${skillsStr.replace(/"/g, '""')}"`,
        `"${(c.reasoning || '').replace(/"/g, '""')}"`
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
        style={{
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-20)',
          display: 'flex',
          justify: 'space-between',
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
              justify: 'center'
            }}
          >
            <Trophy size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Screening Results
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              {sortedCandidates.length} {sortedCandidates.length === 1 ? 'candidate' : 'candidates'} ranked by job alignment
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right', paddingRight: 'var(--space-8)' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.05em' }}>
              Average Fit
            </span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
              {avgScore} / 10
            </span>
          </div>

          {/* Export Dropdown / Buttons */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowExportOptions((prev) => !prev)}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-8) var(--space-12)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)',
                transition: 'border-color 150ms ease, background-color 150ms ease'
              }}
              aria-label="Export candidate screening results"
            >
              <Download size={15} style={{ color: 'var(--color-primary)' }} />
              Export
            </button>

            {showExportOptions && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  backgroundColor: 'var(--bg-panel)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  padding: 'var(--space-4)',
                  zIndex: 20,
                  minWidth: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)'
                }}
              >
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)',
                    width: '100%',
                    padding: 'var(--space-8) var(--space-12)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <FileSpreadsheet size={15} style={{ color: 'var(--color-success)' }} />
                  Export as CSV
                </button>

                <button
                  type="button"
                  onClick={handleExportJSON}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)',
                    width: '100%',
                    padding: 'var(--space-8) var(--space-12)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <FileJson size={15} style={{ color: 'var(--color-warning)' }} />
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Control Toolbar */}
      <div
        style={{
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-12) var(--space-16)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-12)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: 'var(--space-12)',
            flexWrap: 'wrap'
          }}
        >
          {/* Keyword Search Input */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 220px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 'var(--space-10)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by skill, name, or keyword..."
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-8) var(--space-28) var(--space-8) var(--space-32)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 'var(--space-8)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-sm)'
                }}
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Score Threshold Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Filter size={13} /> Score:
            </span>
            {[
              { label: 'All', value: 0 },
              { label: '≥7 Strong', value: 7 },
              { label: '≥5 Moderate', value: 5 }
            ].map((option) => {
              const isActive = minScoreFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMinScoreFilter(option.value)}
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary-muted)' : 'var(--bg-base)',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-4) var(--space-10)',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
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
          {filteredCandidates.map((candidate, index) => (
            <div
              key={candidate.id || candidate.filename || index}
              className="stagger-card"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CandidateCard candidate={candidate} rank={sortedCandidates.findIndex((c) => c === candidate) + 1} />
            </div>
          ))}
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
              Try adjusting your skill keywords or minimum score threshold
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setMinScoreFilter(0);
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
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
