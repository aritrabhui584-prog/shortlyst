/**
 * FAQ.jsx — Styled Accordion Component for Landing Page
 *
 * Implements a premium, token-driven FAQ accordion:
 * - Expand/collapse height transition with smooth fade (one item open at a time)
 * - ChevronDown rotation transition
 * - Content addresses 9 questions including Recruiter vs Candidate roles.
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "Do my candidate resumes get uploaded to a third-party server?",
    answer: "No. Shortlyst is designed with privacy in mind. Raw PDF resume text extraction happens 100% client-side directly in your browser using Mozilla PDF.js. Your files are never uploaded to a backend database or external file storage bucket."
  },
  {
    question: "What is the difference between a Recruiter and a Candidate account?",
    answer: "Recruiter accounts access the full Screening Suite to upload batches of up to 50 resumes, review ranked candidate tables, search skills, filter thresholds, and download spreadsheets. Candidate accounts access a lightweight Fit Checker to upload a single resume and check alignment against open roles or a custom description."
  },
  {
    question: "Can recruiters view resumes that candidates upload to check their fit?",
    answer: "No. Shortlyst is completely private and session-based. A recruiter can only see candidate scoring cards for resumes they manually drop into their active upload zone during a session. Candidate self-test uploads are never saved or shared."
  },
  {
    question: "What AI engine powers the candidate evaluation and scoring?",
    answer: "Shortlyst uses Google Gemini 2.5 Flash via structured JSON schema mode. The backend enforces a strict data shape (name, years of experience, key skills, match score, written reasoning) to ensure accurate and formatted feedback."
  },
  {
    question: "What file formats are supported, and is there an upload limit?",
    answer: "Currently, Shortlyst supports PDF files (.pdf) since they are the industry standard for candidate resumes. You can batch upload up to 50 resumes simultaneously for fast parallel screening."
  },
  {
    question: "How is the candidate match score (1–10) calculated?",
    answer: "The Google Gemini 2.5 Flash model evaluates the candidate's professional work experience, key skills, and overall qualifications against the requirements listed in your job description, assigning a weighted score based on match alignment."
  },
  {
    question: "Is my recruitment data or candidate text stored?",
    answer: "No. Shortlyst is stateless. Once you close or reset the screening dashboard, the extracted text and evaluation metadata are cleared from memory. No data is stored or trained on."
  },
  {
    question: "Can I customize the screening parameters or target criteria?",
    answer: "Yes, you can edit the details in the job description textbox to emphasize specific credentials (e.g. 'requires 3 years React experience' or 'Tableau dashboard certification'). Gemini adapts its scoring criteria dynamically based on your text."
  },
  {
    question: "Can I export candidate screening lists?",
    answer: "Yes. Once candidate resumes are screened and ranked, you can click the Export button on the results dashboard to download the ranked candidate spreadsheet in formatted CSV or JSON files."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      className="scroll-reveal"
      style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'var(--space-32) 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-28)',
        boxSizing: 'border-box'
      }}
    >
      {/* FAQ Header */}
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
          <HelpCircle size={13} />
          <span>Frequently Asked Questions</span>
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
          Have questions? We have answers.
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
          Learn about Shortlyst privacy, recruiter vs candidate access limits, and AI configuration.
        </p>
      </div>

      {/* Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = activeIndex === idx;

          return (
             <div
               key={idx}
               className="glass-panel"
               style={{
                 borderRadius: 'var(--radius-lg)',
                 overflow: 'hidden',
                 transition: 'all 200ms ease'
               }}
             >
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                style={{
                  width: '100%',
                  padding: 'var(--space-20) var(--space-24)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-16)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none'
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: isOpen ? 'var(--color-primary)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    transition: 'color 180ms ease'
                  }}
                >
                  {item.question}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: isOpen ? 'var(--color-primary)' : 'var(--text-muted)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease, color 180ms ease',
                    flexShrink: 0
                  }}
                />
              </button>

              {/* Collapsible Content Area */}
              <div
                style={{
                  maxHeight: isOpen ? '220px' : '0px',
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease',
                  paddingLeft: 'var(--space-24)',
                  paddingRight: 'var(--space-24)',
                  paddingBottom: isOpen ? 'var(--space-20)' : '0px',
                  boxSizing: 'border-box'
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
