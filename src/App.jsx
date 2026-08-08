import React, { useState } from 'react';
import { Sparkles, AlertCircle, X, Bot, Info } from 'lucide-react';
import JobDescriptionInput from './components/JobDescriptionInput';
import UploadZone from './components/UploadZone';
import CandidateCard from './components/CandidateCard';
import ResultsList from './components/ResultsList';
import ScoreBadge from './components/ScoreBadge';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import ThemeToggle from './components/ThemeToggle';
import { extractPdfText } from './lib/pdfExtract';
import { postForScoring } from './lib/api';
import './styles/tokens.css';

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isScreening, setIsScreening] = useState(false);
  const [hasScreened, setHasScreened] = useState(false);
  const [screenedCandidates, setScreenedCandidates] = useState([]);
  const [error, setError] = useState(null);

  const handleFilesAdd = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileRemove = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const isFormValid = jobDescription.trim().length > 0 && files.length > 0;

  const handleScreenCandidates = async () => {
    if (!isFormValid) return;
    setError(null);
    setIsScreening(true);

    try {
      // 1. Extract text from all PDF files in browser
      const extractedResumes = await Promise.all(
        files.map(async (file) => {
          const text = await extractPdfText(file);
          return {
            filename: file.name,
            text
          };
        })
      );

      // 2. Call backend Gemini API endpoint
      const response = await postForScoring(jobDescription, extractedResumes);

      if (response && Array.isArray(response.results)) {
        setScreenedCandidates(response.results);
        setHasScreened(true);
      } else {
        throw new Error('Server returned an unexpected format.');
      }
    } catch (err) {
      console.error('Screening failed:', err);
      setError(
        err?.message ||
          'Unable to complete candidate screening. Please check your inputs and try again.'
      );
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 var(--space-32)',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-24)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)' }}>
              <img src="/favicon.svg" alt="Shortlyst Logo" width="28" height="28" />
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.02em'
                }}
              >
                Shortlyst
              </span>
            </div>
            <nav style={{ display: 'flex', gap: 'var(--space-16)' }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  borderBottom: '2px solid var(--color-primary)',
                  paddingBottom: 'var(--space-4)',
                  textDecoration: 'none'
                }}
              >
                Candidates
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textDecoration: 'none'
                }}
              >
                Pipelines
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textDecoration: 'none'
                }}
              >
                Settings
              </a>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
            <ScoreBadge />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'var(--space-32)',
          boxSizing: 'border-box'
        }}
      >
        <div className="main-grid">
        {/* Left Column: Two-step vertical flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
          {/* Step 1: Job Description Panel */}
          <section
            className="fade-in-panel"
            style={{
              animationDelay: '0ms',
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-24)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                1
              </span>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Target Job Requirements
              </h2>
            </div>
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />
          </section>

          {/* Step 2: Upload Panel */}
          <section
            className="fade-in-panel"
            style={{
              animationDelay: '100ms',
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-24)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                2
              </span>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Candidate Resumes
              </h2>
            </div>
            <UploadZone
              files={files}
              onFilesAdd={handleFilesAdd}
              onFileRemove={handleFileRemove}
            />
          </section>

          {/* Step 3: Full-width Primary Screen Candidates Button */}
          <div
            className="fade-in-panel"
            style={{ animationDelay: '200ms' }}
          >
            <button
              type="button"
              onClick={handleScreenCandidates}
              disabled={!isFormValid || isScreening}
              style={{
                width: '100%',
                padding: 'var(--space-16) var(--space-24)',
                backgroundColor: isFormValid ? 'var(--color-primary)' : 'var(--bg-elevated)',
                color: isFormValid ? 'var(--text-inverse)' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: isFormValid ? 'var(--color-primary-hover)' : 'var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isFormValid && !isScreening ? 'pointer' : 'not-allowed',
                opacity: isFormValid ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-8)',
                transition: 'all 180ms ease',
                boxShadow: isFormValid ? '0px 4px 20px rgba(192, 193, 255, 0.25)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (isFormValid && !isScreening) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid && !isScreening) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                }
              }}
            >
              <Sparkles size={18} />
              {isScreening ? 'Screening Candidates...' : 'Screen Candidates'}
            </button>

            {!isFormValid && (
              <p
                style={{
                  margin: 'var(--space-8) 0 0 0',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textAlign: 'center'
                }}
              >
                {!jobDescription.trim() && !files.length
                  ? 'Add a job description and at least 1 PDF resume to activate screening'
                  : !jobDescription.trim()
                  ? 'Paste a job description above to continue'
                  : 'Upload at least one candidate PDF resume to continue'}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Results view / State representations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
          {error && (
            <div
              className="slide-down-banner"
              style={{
                backgroundColor: 'var(--color-danger-muted)',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-12) var(--space-16)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                gap: 'var(--space-12)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                <AlertCircle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
                aria-label="Dismiss error message"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div key={isScreening ? 'loading' : hasScreened ? 'results' : 'empty'} className="view-transition">
            {isScreening ? (
              <LoadingState />
            ) : hasScreened ? (
              <ResultsList candidates={screenedCandidates} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </main>
  </div>
  );
}
