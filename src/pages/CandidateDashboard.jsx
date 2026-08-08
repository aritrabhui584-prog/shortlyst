/**
 * CandidateDashboard.jsx — Premium Scoped Dashboard for Job Seekers
 *
 * Implements:
 * 1. 5-Step Interactive Onboarding Survey (pre-requisite to access dashboard)
 * 2. Multi-Tab Navigation Workspace (Jobs Market, Check Fit, Notifications, Edit Profile)
 * 3. Dynamic Jobs Feed: Loads open/closed positions dynamically from shortlyst_jobs in localStorage
 * 4. Candidate Applications (ATS Integration): Submitting a fit check automatically pushes candidate
 *    resume evaluations, parsed skills, and match scores into shortlyst_submissions in localStorage
 * 5. Live Notifications Board: Listens for recruiter status approvals/rejections and updates dynamically
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, X, FileText, CheckCircle2, ChevronRight, Briefcase, Bell, User } from 'lucide-react';
import UploadZone from '../components/UploadZone';
import LoadingState from '../components/LoadingState';
import ScoreBadge from '../components/ScoreBadge';
import { extractPdfText } from '../lib/pdfExtract';
import { postForScoring } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'Shortlyst AI Corp',
    location: 'Remote / San Francisco',
    status: 'open',
    salary: '$140k - $180k',
    description: 'Extensive production experience with React, TypeScript, and Redux/Zustand. Deep build tools (Vite) optimization.'
  },
  {
    id: 'job-2',
    title: 'Senior DevOps Engineer',
    company: 'SaaS Labs Inc',
    location: 'Remote / Austin TX',
    status: 'open',
    salary: '$150k - $190k',
    description: 'Advanced Terraform Infrastructure-as-Code experience. Production Kubernetes (AWS EKS) administration.'
  },
  {
    id: 'job-3',
    title: 'UX/UI Product Designer',
    company: 'DesignFlow Studio',
    location: 'Hybrid / Los Angeles',
    status: 'closed',
    salary: '$110k - $140k',
    description: 'Advanced portfolio showcasing high-fidelity Figma prototypes. Deep system tokens design execution.'
  }
];

export default function CandidateDashboard() {
  const { user } = useAuth();
  const candidateName = user?.name || 'Job Seeker';

  // ── Onboarding Survey State ───────────────────────────────────────────
  const [surveyCompleted, setSurveyCompleted] = useState(() => {
    return localStorage.getItem(`survey_completed_${candidateName}`) === 'true';
  });
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({
    role: 'Frontend',
    setup: 'Remote',
    experience: '5+ years',
    tech: 'React & TypeScript',
    salary: '$110k - $150k'
  });

  // ── Dashboard Navigation & Dynamic States ──────────────────────────────
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'fit' | 'notifications' | 'profile'
  const [notifications, setNotifications] = useState([]);
  const [availableJobs, setAvailableJobs] = useState(DEFAULT_JOBS);
  const [profileSkills, setProfileSkills] = useState(['React', 'TypeScript', 'Tailwind CSS']);

  // Fit checker states
  const [selectedRoleId, setSelectedRoleId] = useState('job-1');
  const [isCustomJd, setIsCustomJd] = useState(false);
  const [customJdText, setCustomJdText] = useState('');
  const [files, setFiles] = useState([]);
  const [isScreening, setIsScreening] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load jobs list dynamically from localStorage
  useEffect(() => {
    const loadJobs = () => {
      const stored = localStorage.getItem('shortlyst_jobs');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAvailableJobs(parsed);
          // Set default selected role ID to the first open job
          const firstOpen = parsed.find((j) => j.status === 'open');
          if (firstOpen) {
            setSelectedRoleId(firstOpen.id);
          } else if (parsed.length > 0) {
            setSelectedRoleId(parsed[0].id);
          }
        } catch {
          setAvailableJobs(DEFAULT_JOBS);
        }
      }
    };
    
    loadJobs();
    window.addEventListener('storage', loadJobs);
    return () => window.removeEventListener('storage', loadJobs);
  }, []);

  // Load Notifications dynamically
  useEffect(() => {
    const loadNotifs = () => {
      const stored = localStorage.getItem('shortlyst_notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const candidateNotifs = parsed.filter(
            (n) => n.candidateName.toLowerCase() === candidateName.toLowerCase()
          );
          setNotifications(candidateNotifs);
        } catch {
          setNotifications([]);
        }
      }
    };

    loadNotifs();
    window.addEventListener('storage', loadNotifs);
    return () => window.removeEventListener('storage', loadNotifs);
  }, [candidateName]);

  const handleSurveyComplete = () => {
    localStorage.setItem(`survey_completed_${candidateName}`, 'true');
    setSurveyCompleted(true);
  };

  const handleFilesAdd = (newFiles) => {
    setFiles([newFiles[0]]);
    setResult(null);
  };

  const handleFileRemove = () => {
    setFiles([]);
    setResult(null);
  };

  // Triggers client parsing and API/Gemini evaluation
  const handleCheckFit = async () => {
    if (files.length === 0) return;

    const targetJob = availableJobs.find((j) => j.id === selectedRoleId);
    const jd = isCustomJd ? customJdText : targetJob?.description || '';
    if (!jd.trim()) return;

    setError(null);
    setIsScreening(true);
    setResult(null);

    // ─── Efficiency Cache Lookup ────────────────────────────────────
    const cacheKey = `shortlyst_fit_cache_${candidateName.replace(/ /g, '_')}_${selectedRoleId}_${files[0].name}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const candidateResult = JSON.parse(cachedData);
        // Artificial delay for smooth UX transition animations
        await new Promise((resolve) => setTimeout(resolve, 800));
        setResult(candidateResult);

        // 1. Construct and save candidate application to shared submission database
        const newSubmission = {
          id: `sub-${Date.now()}`,
          jobId: isCustomJd ? 'job-custom' : selectedRoleId,
          name: candidateName,
          filename: files[0].name,
          years_experience: candidateResult.years_experience || 4,
          score: candidateResult.score,
          key_skills: candidateResult.key_skills || [],
          reasoning: candidateResult.reasoning || '',
          status: 'pending',
          timestamp: new Date().toLocaleTimeString()
        };

        const storedSubs = JSON.parse(localStorage.getItem('shortlyst_submissions') || '[]');
        const filteredSubs = storedSubs.filter(
          (s) => !(s.jobId === selectedRoleId && s.name.toLowerCase() === candidateName.toLowerCase())
        );
        const updatedSubs = [newSubmission, ...filteredSubs];
        localStorage.setItem('shortlyst_submissions', JSON.stringify(updatedSubs));

        // 2. Log confirmation notification
        const newNotification = {
          id: `fit-eval-cached-${Date.now()}`,
          candidateName,
          senderName: 'Shortlyst AI Cache',
          jobTitle: isCustomJd ? 'Custom fit screening' : targetJob?.title || 'Selected Role',
          messageText: `Loaded from cache! Your match rating is ${candidateResult.score}/10. Details submitted directly to the Recruiter Dashboard.`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'info'
        };
        const allNotifs = JSON.parse(localStorage.getItem('shortlyst_notifications') || '[]');
        localStorage.setItem('shortlyst_notifications', JSON.stringify([newNotification, ...allNotifs]));
        setNotifications((prev) => [newNotification, ...prev]);

        // Dispatch window storage event to alert active tabs immediately
        window.dispatchEvent(new Event('storage'));
        setIsScreening(false);
        return;
      } catch (_e) {
        // Fall back to live scoring on cache parse error
      }
    }

    try {
      const resumeText = await extractPdfText(files[0]);
      const response = await postForScoring(jd, [{ filename: files[0].name, text: resumeText }]);

      if (response && Array.isArray(response.results) && response.results.length > 0) {
        const candidateResult = response.results[0];
        setResult(candidateResult);

        // Save to cache for subsequent checks
        localStorage.setItem(cacheKey, JSON.stringify(candidateResult));

        // 1. Construct and save candidate application to shared submission database
        const newSubmission = {
          id: `sub-${Date.now()}`,
          jobId: isCustomJd ? 'job-custom' : selectedRoleId,
          name: candidateName,
          filename: files[0].name,
          years_experience: candidateResult.years_experience || 4,
          score: candidateResult.score,
          key_skills: candidateResult.key_skills || [],
          reasoning: candidateResult.reasoning || '',
          status: 'pending',
          timestamp: new Date().toLocaleTimeString()
        };

        const storedSubs = JSON.parse(localStorage.getItem('shortlyst_submissions') || '[]');
        // Clean out previous submissions by same candidate for same job to prevent double listing
        const filteredSubs = storedSubs.filter(
          (s) => !(s.jobId === selectedRoleId && s.name.toLowerCase() === candidateName.toLowerCase())
        );
        const updatedSubs = [newSubmission, ...filteredSubs];
        localStorage.setItem('shortlyst_submissions', JSON.stringify(updatedSubs));

        // 2. Log confirmation notification
        const newNotification = {
          id: `fit-eval-${Date.now()}`,
          candidateName,
          senderName: 'Shortlyst AI Agent',
          jobTitle: isCustomJd ? 'Custom fit screening' : targetJob?.title || 'Selected Role',
          messageText: `Scoring complete! You scored a match fit rating of ${candidateResult.score}/10. Your details have been submitted directly to the Recruiter Dashboard for active review.`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'info'
        };
        const allNotifs = JSON.parse(localStorage.getItem('shortlyst_notifications') || '[]');
        localStorage.setItem('shortlyst_notifications', JSON.stringify([newNotification, ...allNotifs]));
        setNotifications((prev) => [newNotification, ...prev]);

        // Dispatch window storage event to alert active tabs immediately
        window.dispatchEvent(new Event('storage'));
      } else {
        throw new Error('Unable to parse match score results.');
      }
    } catch (err) {
      setError(err.message || 'Error executing fit analysis.');
    } finally {
      setIsScreening(false);
    }
  };

  // ── Onboarding Survey Render ───────────────────────────────────────────
  if (!surveyCompleted) {
    const surveyQuestions = [
      {
        key: 'role',
        title: 'What is your target software engineering specialization?',
        options: ['Frontend React/TS', 'Backend Node/Python', 'DevOps & Cloud', 'UI/UX Product Design']
      },
      {
        key: 'setup',
        title: 'What is your preferred work setup?',
        options: ['Fully Remote', 'Hybrid Office', 'Onsite / Headquarters']
      },
      {
        key: 'experience',
        title: 'What is your professional experience level?',
        options: ['Entry Level (0-2 yrs)', 'Mid Level (2-5 yrs)', 'Senior Level (5-8 yrs)', 'Lead / Director (8+ yrs)']
      },
      {
        key: 'tech',
        title: 'Which core technology stack do you specialize in?',
        options: ['React, TypeScript, CSS', 'Node.js, SQL, AWS', 'Terraform, Kubernetes, Docker', 'Figma, Design Systems']
      },
      {
        key: 'salary',
        title: 'What is your desired salary preference?',
        options: ['$80k - $110k', '$110k - $150k', '$150k - $190k', '$190k+']
      }
    ];

    const currentQuestion = surveyQuestions[currentQuestionIdx];

    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-64) var(--space-16)' }}>
        <div
          className="glass-panel login-card-animated"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-32)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-24)',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Onboarding Survey</span>
              <span>Question {currentQuestionIdx + 1} of 5</span>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)' }}>
              <div
                style={{
                  width: `${((currentQuestionIdx + 1) / 5) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 250ms ease'
                }}
              />
            </div>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {currentQuestion.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.key] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [currentQuestion.key]: option })}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary-muted)' : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-14) var(--space-20)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-10)' }}>
            <button
              type="button"
              onClick={() => {
                if (currentQuestionIdx < 4) {
                  setCurrentQuestionIdx((prev) => prev + 1);
                } else {
                  handleSurveyComplete();
                }
              }}
              className="btn-primary"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-inverse)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-10) var(--space-20)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{currentQuestionIdx === 4 ? 'Finish Setup' : 'Next Question'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Dashboard Workspace Render ───────────────────────────────────
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-32) var(--space-16) 120px var(--space-16)' }}>
      {/* Dynamic Header banner */}
      <div className="fade-in-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-12)', marginBottom: 'var(--space-28)' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0' }}>
            Welcome, {candidateName}!
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Profile preferences set to {answers.role} ({answers.setup}) • Expected salary: {answers.salary}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-24)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Navigation Sidebar */}
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-16)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            
            {/* Jobs Market Tab */}
            <button
              onClick={() => setActiveTab('jobs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-10)',
                backgroundColor: activeTab === 'jobs' ? 'var(--color-primary-muted)' : 'transparent',
                color: activeTab === 'jobs' ? 'var(--color-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-12) var(--space-16)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 150ms ease'
              }}
            >
              <Briefcase size={16} />
              <span>Jobs Market</span>
            </button>

            {/* Check Fit Tab */}
            <button
              onClick={() => setActiveTab('fit')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-10)',
                backgroundColor: activeTab === 'fit' ? 'var(--color-primary-muted)' : 'transparent',
                color: activeTab === 'fit' ? 'var(--color-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-12) var(--space-16)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 150ms ease'
              }}
            >
              <FileText size={16} />
              <span>Check Job Fit</span>
            </button>

            {/* Notifications Tab */}
            <button
              onClick={() => setActiveTab('notifications')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: activeTab === 'notifications' ? 'var(--color-primary-muted)' : 'transparent',
                color: activeTab === 'notifications' ? 'var(--color-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-12) var(--space-16)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 150ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)' }}>
                <Bell size={16} />
                <span>Notifications</span>
              </div>
              {notifications.length > 0 && (
                <span style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-inverse)', fontSize: '10px', fontWeight: 700, borderRadius: 'var(--radius-full)', padding: '2px 6px' }}>
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-10)',
                backgroundColor: activeTab === 'profile' ? 'var(--color-primary-muted)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-12) var(--space-16)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 150ms ease'
              }}
            >
              <User size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Content Panel Area */}
        <div style={{ flex: '3 1 600px' }}>
          
          {/* TAB 1: Jobs Market */}
          {activeTab === 'jobs' && (
            <div className="glass-panel fade-in-panel" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-28)', display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0' }}>
                  Hiring Job Positions
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Live open positions mapped to your background preferences.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                {availableJobs.map((job) => {
                  const isOpen = job.status === 'open';
                  return (
                    <div
                      key={job.id}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-16)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-10)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {job.title}
                          </h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {job.company} • {job.location} • <strong style={{ color: 'var(--color-primary)' }}>{job.salary}</strong>
                          </span>
                        </div>
                        <span
                          style={{
                            backgroundColor: isOpen ? 'var(--color-success-muted)' : 'var(--color-danger-muted)',
                            color: isOpen ? 'var(--color-success)' : 'var(--color-danger)',
                            borderRadius: 'var(--radius-full)',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}
                        >
                          {job.status}
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
                        {job.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Check Job Fit */}
          {activeTab === 'fit' && (
            <div className="glass-panel fade-in-panel" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-28)', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
              
              {isScreening ? (
                <LoadingState />
              ) : result ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Analysis Results & Submission Status
                      </h3>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Experience: {result.years_experience} years estimated experience • **Submitted to Recruiter**
                      </span>
                    </div>
                    <ScoreBadge score={result.score} size="lg" />
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 var(--space-6) 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Identified Strengths
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
                      {result.key_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-primary)',
                            borderRadius: 'var(--radius-full)',
                            padding: 'var(--space-2) var(--space-10)',
                            fontSize: '11px',
                            fontWeight: 500,
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--color-primary-muted)', borderRadius: 'var(--radius-md)', padding: 'var(--space-14)', display: 'flex', gap: 'var(--space-10)' }}>
                    <Sparkles size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                      {result.reasoning}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFileRemove}
                    className="btn-primary"
                    style={{
                      alignSelf: 'flex-end',
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-inverse)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-8) var(--space-16)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Check Another Job Fit
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0' }}>
                      Apply & Analyze Resume Fit
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                      Select a job from the market, drop your resume, and apply. AI evaluates fit strictly in real-time.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Select Target Position
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
                      {availableJobs.filter(j => j.status === 'open').map((job) => (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => { setSelectedRoleId(job.id); setIsCustomJd(false); }}
                          style={{
                            backgroundColor: selectedRoleId === job.id && !isCustomJd ? 'var(--color-primary-muted)' : 'rgba(255, 255, 255, 0.02)',
                            color: selectedRoleId === job.id && !isCustomJd ? 'var(--color-primary)' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: selectedRoleId === job.id && !isCustomJd ? 'var(--color-primary)' : 'var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-6) var(--space-12)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {job.title}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setIsCustomJd(true)}
                        style={{
                          backgroundColor: isCustomJd ? 'var(--color-primary-muted)' : 'rgba(255, 255, 255, 0.02)',
                          color: isCustomJd ? 'var(--color-primary)' : 'var(--text-muted)',
                          border: '1px solid',
                          borderColor: isCustomJd ? 'var(--color-primary)' : 'var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: 'var(--space-6) var(--space-12)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Custom Requirements
                      </button>
                    </div>

                    {isCustomJd && (
                      <textarea
                        value={customJdText}
                        onChange={(e) => setCustomJdText(e.target.value)}
                        placeholder="Paste target job descriptions requirements here..."
                        rows={4}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--bg-base)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: 'var(--space-12)',
                          fontSize: '13px',
                          fontFamily: 'var(--font-sans)',
                          outline: 'none',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          marginTop: 'var(--space-8)'
                        }}
                      />
                    )}
                  </div>

                  <UploadZone
                    files={files}
                    onFilesAdd={handleFilesAdd}
                    onFileRemove={handleFileRemove}
                  />

                  <button
                    type="button"
                    onClick={handleCheckFit}
                    disabled={files.length === 0 || (isCustomJd && !customJdText.trim())}
                    className={(files.length > 0 && (!isCustomJd || customJdText.trim())) ? 'btn-primary' : ''}
                    style={{
                      width: '100%',
                      padding: 'var(--space-12) var(--space-20)',
                      backgroundColor: files.length > 0 && (!isCustomJd || customJdText.trim()) ? 'var(--color-primary)' : 'var(--bg-elevated)',
                      color: files.length > 0 && (!isCustomJd || customJdText.trim()) ? 'var(--text-inverse)' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: (files.length > 0 && (!isCustomJd || customJdText.trim())) ? 'pointer' : 'not-allowed',
                      boxShadow: files.length > 0 && (!isCustomJd || customJdText.trim()) ? 'var(--shadow-glow)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-6)'
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Run AI Evaluation & Apply</span>
                  </button>

                  {error && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={14} />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Notifications Center */}
          {activeTab === 'notifications' && (
            <div className="glass-panel fade-in-panel" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-28)', display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0' }}>
                  Notifications Board
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Status updates, screening summaries, and recruiter invitations.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                {notifications.length > 0 ? (
                  notifications.map((notif) => {
                    const isInvitation = notif.status === 'approved';
                    const isRejected = notif.status === 'rejected';

                    let bannerBg = 'rgba(255, 255, 255, 0.02)';
                    let borderCol = 'var(--border-color)';
                    let statusLabel = 'System Update';
                    let labelColor = 'var(--text-muted)';

                    if (isInvitation) {
                      bannerBg = 'var(--color-success-muted)';
                      borderCol = 'var(--color-success)';
                      statusLabel = 'Interview Invitation';
                      labelColor = 'var(--color-success)';
                    } else if (isRejected) {
                      bannerBg = 'var(--color-danger-muted)';
                      borderCol = 'var(--color-danger)';
                      statusLabel = 'Screening Closed';
                      labelColor = 'var(--color-danger)';
                    }

                    return (
                      <div
                        key={notif.id}
                        style={{
                          backgroundColor: bannerBg,
                          border: `1px solid ${borderCol}`,
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-16)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--space-6)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            {statusLabel}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {notif.timestamp}
                          </span>
                        </div>

                        <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          From: {notif.senderName} • Position: {notif.jobTitle}
                        </strong>

                        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {notif.messageText}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-32)', color: 'var(--text-muted)' }}>
                    <Bell size={24} style={{ display: 'block', margin: '0 auto var(--space-8) auto', opacity: 0.5 }} />
                    <span style={{ fontSize: '13px' }}>No messages in your mailbox yet.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Edit Profile Preferences */}
          {activeTab === 'profile' && (
            <div className="glass-panel fade-in-panel" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-28)', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0' }}>
                  Edit Preferences Profile
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Adjust target preferences and tag chips used for matching live positions.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-16)', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Hiring Job Role</label>
                    <select
                      value={answers.role}
                      onChange={(e) => setAnswers({ ...answers, role: e.target.value })}
                      style={{
                        backgroundColor: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 'var(--space-8)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Frontend">Frontend React/TS</option>
                      <option value="Backend">Backend Node/Python</option>
                      <option value="DevOps">DevOps Infrastructure</option>
                      <option value="UI/UX Designer">UX/UI Product Design</option>
                    </select>
                  </div>

                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Work Environment</label>
                    <select
                      value={answers.setup}
                      onChange={(e) => setAnswers({ ...answers, setup: e.target.value })}
                      style={{
                        backgroundColor: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 'var(--space-8)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Remote">Fully Remote</option>
                      <option value="Hybrid">Hybrid Office</option>
                      <option value="Onsite">Onsite Headquarters</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Core Skills Tag Chips</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
                    {profileSkills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px var(--space-12)',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: '1px solid var(--border-color)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => setProfileSkills(profileSkills.filter((s) => s !== skill))}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: '4px' }}>
                    <input
                      type="text"
                      placeholder="Add another skill (e.g. Docker)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const val = e.currentTarget.value.trim();
                          if (!profileSkills.includes(val)) {
                            setProfileSkills([...profileSkills, val]);
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px var(--space-10)',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
