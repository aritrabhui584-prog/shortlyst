/**
 * PipelineSection.jsx — Visual Screening Workflow Component
 *
 * Renders a visually clear candidate processing pipeline:
 * Step 1: Upload Resumes (in-browser dropzone)
 * Step 2: Extract Text (client-side PDF.js parsing)
 * Step 3: AI Scoring Analysis (Gemini structured evaluation)
 * Step 4: Ranked Leaderboard (results dashboard + exports)
 *
 * Includes SVG connecting flow arrows, custom spacing, Lucide icons,
 * and handles staggered viewport reveal scroll animations via CSS keyframes.
 */

import React from 'react';
import { UploadCloud, FileText, Cpu, Award, ArrowRight } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    icon: UploadCloud,
    title: "1. Upload Resumes",
    description: "Drag and drop up to 50 candidate PDF resume files directly into the secure in-browser upload zone."
  },
  {
    icon: FileText,
    title: "2. Parse PDF Locally",
    description: "Mozilla PDF.js parses resume text stream in the client — raw files never leave your local device."
  },
  {
    icon: Cpu,
    title: "3. AI Scoring",
    description: "Gemini 2.5 Flash matches skills, evaluates experience, and returns a 1–10 score with written reasoning."
  },
  {
    icon: Award,
    title: "4. Ranked Results",
    description: "Candidates are instantly sorted by job description fit with inline keyword filtering and CSV downloads."
  }
];

export default function PipelineSection() {
  return (
    <section
      className="scroll-reveal"
      style={{
        width: '100%',
        padding: 'var(--space-32) 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-40)',
        boxSizing: 'border-box'
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            backgroundColor: 'var(--color-primary-muted)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-4) var(--space-12)',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: 'var(--space-12)'
          }}
        >
          <Award size={13} />
          <span>Screening Pipeline</span>
        </div>
        <h2
          style={{
            fontSize: '32px',
            lineHeight: '40px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            margin: '0 0 var(--space-8) 0'
          }}
        >
          How Shortlyst Works
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Shortlyst uses a privacy-first, serverless-accelerated candidate scoring pipeline to evaluate candidates.
        </p>
      </div>

      {/* Visual Step Connectors Grid */}
      <div
        className="pipeline-grid"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: 'var(--space-16)',
          flexWrap: 'wrap'
        }}
      >
        {PIPELINE_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isLast = idx === PIPELINE_STEPS.length - 1;

          return (
            <React.Fragment key={idx}>
              {/* Step Card Container */}
              <div
                className="stagger-card glass-panel interactive-card"
                style={{
                  flex: '1 1 220px',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-24)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-12)',
                  animationDelay: `${idx * 100}ms`,
                  position: 'relative'
                }}
              >
                {/* Step Icon */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-muted)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <StepIcon size={22} />
                </div>

                {/* Step Title */}
                <h3
                  style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Connecting Flow Arrow between cards (Desktop Only) */}
              {!isLast && (
                <div
                  className="pipeline-arrow"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--outline-variant)'
                  }}
                >
                  <ArrowRight size={20} className="arrow-icon" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
