/**
 * ScreenerPage.jsx — Protected Recruiter Dashboard Workspace
 *
 * Implements the Recruiter Portal:
 * - Recruiter creates, edits, and opens/closes Job Offerings (stored globally in localStorage).
 * - Recruiter does NOT upload resumes or describe themselves.
 * - Recruiter selects a Job Offering and reviews candidate resumes that have been submitted
 *   by candidates and evaluated by the AI (stored globally in localStorage).
 * - Real-time candidate applicant tracking (ATS) dashboard with search, filters, and Excel exports.
 * - Review & Approve workflow: Recruiters approve or reject candidate submissions.
 * - Includes a Sandbox Console to pre-populate mock candidate submissions for testing.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, X, Database, Play, Briefcase, Plus, Lock, Unlock, Users, ChevronRight } from 'lucide-react';
import ResultsList from '../components/ResultsList';

const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    status: 'open',
    company: 'Shortlyst AI Corp',
    salary: '$140k - $180k',
    description: `Job Title: Senior Frontend Engineer (React/TypeScript)
Location: Remote / SF
Experience Required: 5+ years

Key Requirements:
- Extensive production experience with React, TypeScript, and Redux/Zustand
- Deep understanding of build tools (Vite) and performance optimization
- Experience writing clean automated tests (Jest/React Testing Library)
- Strong visual eye and experience matching design system tokens`
  },
  {
    id: 'job-2',
    title: 'Senior DevOps Engineer',
    status: 'open',
    company: 'SaaS Labs Inc',
    salary: '$150k - $190k',
    description: `Job Title: Infrastructure & DevOps Engineer
Location: Austin, TX / Remote
Experience Required: 5+ years

Key Requirements:
- Advanced Terraform Infrastructure-as-Code experience
- Production Kubernetes (AWS EKS) administration
- Hands-on CI/CD automation using GitHub Actions or GitLab`
  },
  {
    id: 'job-3',
    title: 'Lead UX Designer',
    status: 'closed',
    company: 'DesignFlow Studio',
    salary: '$110k - $140k',
    description: `Job Title: UX/UI Product Designer
Location: Los Angeles, CA / Hybrid
Experience Required: 4+ years

Key Requirements:
- Advanced portfolio showcasing high-fidelity Figma prototypes
- Experience creating, scaling, and maintaining production-level Design Systems`
  }
];

const MOCK_SUBMISSIONS = [
  {
    id: 'sub-1',
    jobId: 'job-1',
    name: 'Alex Rivera',
    filename: 'Alex_Rivera_Frontend_Engineer.pdf',
    years_experience: 6,
    score: 9.2,
    key_skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Redux', 'System Architecture'],
    reasoning: 'Excellent match. The candidate demonstrates 6+ years of full-stack React and TypeScript development. Has strong background building scalable design system tokens and webpack/vite configurations. Very strong experience with automated testing frameworks.',
    status: 'pending'
  },
  {
    id: 'sub-2',
    jobId: 'job-1',
    name: 'Elena Rostova',
    filename: 'Elena_Rostova_Data_Analyst.pdf',
    years_experience: 4,
    score: 7.8,
    key_skills: ['SQL', 'Python', 'Tableau', 'PowerBI', 'Excel', 'Data Modeling'],
    reasoning: 'Strong analytical background. 4 years experience building enterprise Tableau dashboards and complex SQL queries. Slight gap in production javascript/react software development, but highly proficient in scripting and data pipeline tasks.',
    status: 'pending'
  },
  {
    id: 'sub-3',
    jobId: 'job-1',
    name: 'Marcus Chen',
    filename: 'Marcus_Chen_DevOps_Engineer.pdf',
    years_experience: 2,
    score: 5.4,
    key_skills: ['Terraform', 'Docker', 'AWS EKS', 'Kubernetes', 'CI/CD', 'Git'],
    reasoning: 'Moderate match. Possesses solid junior/mid-level background in Infrastructure-as-Code (Terraform) and container orchestration. Lacks the target 5+ years experience and frontend/React integration requirements.',
    status: 'pending'
  }
];

export default function ScreenerPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  // Job creation state
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Initial load from local storage
  useEffect(() => {
    // Load jobs
    let storedJobs = localStorage.getItem('shortlyst_jobs');
    if (!storedJobs) {
      localStorage.setItem('shortlyst_jobs', JSON.stringify(INITIAL_JOBS));
      storedJobs = JSON.stringify(INITIAL_JOBS);
    }
    const parsedJobs = JSON.parse(storedJobs);
    setJobs(parsedJobs);

    // Default select first open job
    const defaultJob = parsedJobs.find((j) => j.status === 'open') || parsedJobs[0];
    setSelectedJob(defaultJob);

    // Load submissions
    const storedSubs = localStorage.getItem('shortlyst_submissions');
    if (storedSubs) {
      setSubmissions(JSON.parse(storedSubs));
    }
  }, []);

  // Listen for submissions updates from candidates
  useEffect(() => {
    const handleStorageUpdate = () => {
      const storedSubs = localStorage.getItem('shortlyst_submissions');
      if (storedSubs) {
        setSubmissions(JSON.parse(storedSubs));
      }
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // Filter submissions for the currently selected job
  const activeJobSubmissions = submissions.filter((s) => s.jobId === selectedJob?.id);

  // Toggle Job status
  const handleToggleJobStatus = (jobId) => {
    const updatedJobs = jobs.map((j) =>
      j.id === jobId ? { ...j, status: j.status === 'open' ? 'closed' : 'open' } : j
    );
    setJobs(updatedJobs);
    localStorage.setItem('shortlyst_jobs', JSON.stringify(updatedJobs));

    if (selectedJob?.id === jobId) {
      setSelectedJob(updatedJobs.find((j) => j.id === jobId));
    }
  };

  // Add a new Hiring Job Posting
  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) return;

    const newJob = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      status: 'open',
      company: 'Shortlyst AI Corp',
      salary: newJobSalary.trim() || '$120k - $150k',
      description: newJobDesc
    };

    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem('shortlyst_jobs', JSON.stringify(updatedJobs));

    setNewJobTitle('');
    setNewJobSalary('');
    setNewJobDesc('');
    setShowAddJobForm(false);
    setSelectedJob(newJob);
    setError(null);
  };

  // Pre-load sandbox mock candidate submissions for testing
  const handleLoadDemoData = () => {
    if (!selectedJob) {
      setError('Please select or create an open job posting first.');
      return;
    }

    // Set selected job submissions
    const mockApplicants = MOCK_SUBMISSIONS.map((s) => ({
      ...s,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      jobId: selectedJob.id,
      timestamp: new Date().toLocaleTimeString()
    }));

    // Update in local storage
    const updatedSubs = [...mockApplicants, ...submissions.filter((s) => s.jobId !== selectedJob.id)];
    setSubmissions(updatedSubs);
    localStorage.setItem('shortlyst_submissions', JSON.stringify(updatedSubs));
    
    // Dispatch storage event to sync other tabs
    window.dispatchEvent(new Event('storage'));
    setError(null);
  };

  // Approve / Reject callbacks passed down to ResultsList
  const handleApproveApplicant = (applicantId) => {
    const updatedSubs = submissions.map((s) =>
      s.id === applicantId ? { ...s, status: 'approved' } : s
    );
    setSubmissions(updatedSubs);
    localStorage.setItem('shortlyst_submissions', JSON.stringify(updatedSubs));

    // Also send an invitation notification to candidate notifications mailbox
    const applicant = submissions.find((s) => s.id === applicantId);
    if (applicant) {
      const newNotification = {
        id: `msg-${Date.now()}`,
        candidateName: applicant.name,
        senderName: 'Recruiter Admin',
        jobTitle: selectedJob?.title || 'Selected Role',
        messageText: `Congratulations! Your AI evaluation report for the "${selectedJob?.title}" role has been approved. We would love to schedule a technical chat. Let us know your availability next week!`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'approved'
      };
      const storedNotifs = JSON.parse(localStorage.getItem('shortlyst_notifications') || '[]');
      localStorage.setItem('shortlyst_notifications', JSON.stringify([newNotification, ...storedNotifs]));
    }
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleRejectApplicant = (applicantId) => {
    const updatedSubs = submissions.map((s) =>
      s.id === applicantId ? { ...s, status: 'rejected' } : s
    );
    setSubmissions(updatedSubs);
    localStorage.setItem('shortlyst_submissions', JSON.stringify(updatedSubs));

    const applicant = submissions.find((s) => s.id === applicantId);
    if (applicant) {
      const newNotification = {
        id: `msg-${Date.now()}`,
        candidateName: applicant.name,
        senderName: 'Recruiter Admin',
        jobTitle: selectedJob?.title || 'Selected Role',
        messageText: `Thank you for your interest in the "${selectedJob?.title}" posting. Unfortunately, we are not moving forward with your application at this time.`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'rejected'
      };
      const storedNotifs = JSON.parse(localStorage.getItem('shortlyst_notifications') || '[]');
      localStorage.setItem('shortlyst_notifications', JSON.stringify([newNotification, ...storedNotifs]));
    }

    window.dispatchEvent(new Event('storage'));
  };

  const handleResetApplicantList = () => {
    // Clear applicants for current job
    const updatedSubs = submissions.filter((s) => s.jobId !== selectedJob?.id);
    setSubmissions(updatedSubs);
    localStorage.setItem('shortlyst_submissions', JSON.stringify(updatedSubs));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'var(--space-32) var(--space-32) 120px var(--space-32)',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
        
        {/* Section Header */}
        <div className="fade-in-panel" style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-8) 0'
            }}
          >
            Recruiter Control Center
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>
            Manage active job offerings, and review candidate applications analyzed by Shortlyst AI.
          </p>
        </div>

        {/* Double Column Grid: Left Applicants, Right Job Offerings */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-24)',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Column: Applicants List for selected job */}
          <div
            style={{
              flex: '2 1 600px',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-20)'
            }}
          >
            {/* Sandbox helper banner if no candidates apply yet */}
            {activeJobSubmissions.length === 0 && (
              <div
                className="glass-panel fade-in-panel"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-24)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-12)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: '13px' }}>
                  <Database size={15} style={{ color: 'var(--color-primary)' }} />
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>ATS Sandbox Sandbox Mode</strong>
                    <span style={{ color: 'var(--text-muted)' }}>No candidate has submitted their resume for this job. Load test data:</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoadDemoData}
                  style={{
                    backgroundColor: 'var(--color-primary-muted)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-6) var(--space-12)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Play size={10} fill="currentColor" />
                  Load Sandbox Candidates
                </button>
              </div>
            )}

            {/* Render results list */}
            {activeJobSubmissions.length > 0 ? (
              <div className="fade-in-panel">
                <ResultsList
                  candidates={activeJobSubmissions}
                  onReset={handleResetApplicantList}
                  onApprove={handleApproveApplicant}
                  onReject={handleRejectApplicant}
                  customTitle={`Applicants: ${selectedJob?.title}`}
                />
              </div>
            ) : (
              <div
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-48) var(--space-32)',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <Users size={32} style={{ display: 'block', margin: '0 auto var(--space-12) auto', opacity: 0.5 }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Awaiting Applications
                </h3>
                <p style={{ margin: 'var(--space-8) 0 0 0', fontSize: '13px' }}>
                  Candidates who login as a Candidate will see the "{selectedJob?.title}" offering and apply.
                </p>
              </div>
            )}

            {error && (
              <div
                className="slide-down-banner"
                style={{
                  backgroundColor: 'var(--color-danger-muted)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-12) var(--space-16)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{error}</span>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setError(null)}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Job Offerings / Job Openings Manager */}
          <div
            style={{
              flex: '1 1 320px',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-20)'
            }}
          >
            <div
              className="glass-panel fade-in-panel"
              style={{
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-24)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-16)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Briefcase size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Job Offerings</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddJobForm((prev) => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  title="Create new job offering"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add Job Form */}
              {showAddJobForm && (
                <form
                  onSubmit={handleAddJob}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-10)'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Job Title (e.g. Lead Designer)"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-base)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px var(--space-10)',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Salary Range (e.g. $120k - $150k)"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-base)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px var(--space-10)',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <textarea
                    placeholder="Describe Job Requirements details..."
                    value={newJobDesc}
                    onChange={(e) => setNewJobDesc(e.target.value)}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-base)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px var(--space-10)',
                      fontSize: '12px',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddJobForm(false)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        border: 'none',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-inverse)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px var(--space-10)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Create Offering
                    </button>
                  </div>
                </form>
              )}

              {/* Job Offerings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
                {jobs.map((job) => {
                  const isOpen = job.status === 'open';
                  const isSelected = selectedJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      style={{
                        backgroundColor: isSelected ? 'var(--color-primary-muted)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-12)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-8)',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-8)' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.title}
                        </span>

                        <span
                          style={{
                            backgroundColor: isOpen ? 'var(--color-success-muted)' : 'var(--color-danger-muted)',
                            color: isOpen ? 'var(--color-success)' : 'var(--color-danger)',
                            borderRadius: 'var(--radius-full)',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                            flexShrink: 0
                          }}
                        >
                          {job.status}
                        </span>
                      </div>

                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {job.company} • {job.salary}
                      </span>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: 'var(--space-8)', marginTop: '2px' }}>
                        {/* Toggle Status */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleJobStatus(job.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            padding: '2px'
                          }}
                          title={isOpen ? "Lock/Close job posting" : "Unlock/Open job posting"}
                        >
                          {isOpen ? (
                            <>
                              <Unlock size={11} style={{ color: 'var(--color-success)' }} />
                              <span>Close Hiring</span>
                            </>
                          ) : (
                            <>
                              <Lock size={11} style={{ color: 'var(--color-danger)' }} />
                              <span>Open Hiring</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0
                          }}
                        >
                          <span>View Candidates</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
