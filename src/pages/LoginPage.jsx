/**
 * LoginPage.jsx — Premium Auth Card & Form Component with Role Selection UX
 *
 * Implements a dual-role authentication flow:
 * 1. Role Selection Screen: Side-by-side Recruiter vs Candidate card selectors
 * 2. URL State Persistence: Uses useSearchParams (?role=recruiter | ?role=candidate)
 * 3. Adaptable Input Fields: Adapts labels, placeholders, and buttons per role
 * 4. Inline Validation & Transitions: Reuses the explicit padding and focus animation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, AlertCircle, Loader2, Users, FileText, ArrowRight } from 'lucide-react';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get('role'); // 'recruiter' | 'candidate' | null

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [errorMessage, setErrorMessage] = useState('');

  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || (role === 'candidate' ? '/candidate' : '/app');

  // Sync route redirect on role change if logged in
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user.role === 'candidate' ? '/candidate' : '/app', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Inline Validation Rules
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 6;
  const isNameValid = !isSignUp || name.trim().length >= 2;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRoleSelect = (selectedRole) => {
    setSearchParams({ role: selectedRole });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setTouched({ name: true, email: true, password: true });

    if (!isEmailValid || !isPasswordValid || (isSignUp && !isNameValid)) {
      setErrorMessage('Please fix the validation errors below before submitting.');
      return;
    }

    try {
      if (isSignUp) {
        await signup(name, email, password, role);
      } else {
        await login(email, password, role);
      }
      // Redirect dynamically based on role after login
      navigate(role === 'candidate' ? '/candidate' : '/app', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your details.');
    }
  };

  // If no role is selected, render the Role Selection UX
  const showRoleSelection = !role || (role !== 'recruiter' && role !== 'candidate');

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-32) var(--space-16)',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >


      {showRoleSelection ? (
        /* ── Role Selection UX Screen ────────────────────────────────── */
        <div
          className="login-card-animated"
          style={{
            width: '100%',
            maxWidth: '680px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-28)',
            position: 'relative',
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <img
                src="/logo.png"
                alt="Shortlyst Logo"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto var(--space-16) auto',
                  display: 'block',
                  boxShadow: '0px 4px 20px rgba(192, 193, 255, 0.2)'
                }}
              />
            </Link>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: '0 0 var(--space-8) 0'
              }}
            >
              Get Started with Shortlyst
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
              Select your user account role to continue to the screening portal.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-20)',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {/* Recruiter Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleRoleSelect('recruiter')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleRoleSelect('recruiter');
              }}
              style={{
                flex: '1 1 280px',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-32) var(--space-24)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-16)'
              }}
              className="interactive-card glass-panel"
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users size={22} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 var(--space-6) 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  I'm a Recruiter / Manager
                </h3>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                  Access the full screening suite. Upload batches of resumes, compare experience, extract custom skill lists, and rank top fits.
                </p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                Access Screening Suite <ArrowRight size={14} />
              </div>
            </div>

            {/* Candidate Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleRoleSelect('candidate')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleRoleSelect('candidate');
              }}
              style={{
                flex: '1 1 280px',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-32) var(--space-24)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-16)'
              }}
              className="interactive-card glass-panel"
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 var(--space-6) 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  I'm a Candidate / Job Seeker
                </h3>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                  Check your candidate fit. Upload your resume and score your qualifications against sample openings or a pasted job description.
                </p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                Test Your Resume <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Sign In / Sign Up Card Screen ───────────────────────────── */
        <div
          className="login-card-animated glass-panel"
          style={{
            width: '100%',
            maxWidth: '440px',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-32)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-24)',
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Ambient Top Glow Orb */}
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              right: '-120px',
              width: '240px',
              height: '240px',
              background: 'var(--color-primary)',
              opacity: 0.1,
              borderRadius: '50%',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />

          {/* Card Header */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-12)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
                }}
              >
                <img src="/logo.png" alt="Shortlyst" width="30" height="30" style={{ borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            </Link>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                backgroundColor: 'var(--color-primary-muted)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-2) var(--space-10)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-10)'
              }}
            >
              {role === 'recruiter' ? 'Recruiter Portal' : 'Candidate Portal'}
            </div>

            <h1
              style={{
                margin: '0 0 var(--space-6) 0',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.01em'
              }}
            >
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
              {isSignUp
                ? 'Sign up to start screening with Gemini 2.5 Flash'
                : 'Sign in to access your custom Shortlyst dashboard'}
            </p>
          </div>

          {/* Sliding Pill Tab Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-base)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '4px',
                bottom: '4px',
                left: '4px',
                width: 'calc(50% - 4px)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--surface-variant)',
                borderRadius: 'var(--radius-sm)',
                transform: isSignUp ? 'translateX(100%)' : 'translateX(0%)',
                transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }}
            />

            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage('');
              }}
              style={{
                flex: 1,
                padding: 'var(--space-8) 0',
                backgroundColor: 'transparent',
                color: !isSignUp ? 'var(--color-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 2,
                transition: 'color 180ms ease'
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage('');
              }}
              style={{
                flex: 1,
                padding: 'var(--space-8) 0',
                backgroundColor: 'transparent',
                color: isSignUp ? 'var(--color-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 2,
                transition: 'color 180ms ease'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div
              className="slide-down-banner"
              style={{
                backgroundColor: 'var(--color-danger-muted)',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-10) var(--space-14)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                position: 'relative',
                zIndex: 1
              }}
            >
              <AlertCircle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', position: 'relative', zIndex: 1 }}
          >
            {isSignUp && (
              <InputField
                id="auth-name"
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Alex Morgan"
                icon={User}
                error={touched.name && !isNameValid ? 'Name must be at least 2 characters long.' : null}
              />
            )}

            <InputField
              id="auth-email"
              label="Work Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="recruiter@company.com"
              icon={Mail}
              error={touched.email && !isEmailValid ? 'Please enter a valid work email address.' : null}
            />

            <InputField
              id="auth-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              icon={Lock}
              error={touched.password && !isPasswordValid ? 'Password must be at least 6 characters.' : null}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: showPassword ? 'var(--color-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'color 180ms ease'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <div
                    style={{
                      transform: showPassword ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 200ms ease',
                      display: 'flex'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                marginTop: 'var(--space-8)',
                width: '100%',
                padding: 'var(--space-14) var(--space-20)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-inverse)',
                border: '1px solid var(--color-primary-hover)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-8)',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {isSignUp ? 'Create Free Account' : role === 'recruiter' ? 'Sign In as Recruiter' : 'Sign In as Candidate'}
                </>
              )}
            </button>
          </form>

          {/* Role Switching Link Footer */}
          <div
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-8)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: 'var(--space-16)'
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleSelect(role === 'recruiter' ? 'candidate' : 'recruiter')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                opacity: 0.9,
                transition: 'opacity 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
            >
              {role === 'recruiter'
                ? 'Candidate looking to check fit? Switch to Candidate Access'
                : 'Recruiter looking to screen? Switch to Recruiter Access'}
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                opacity: 0.7
              }}
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
