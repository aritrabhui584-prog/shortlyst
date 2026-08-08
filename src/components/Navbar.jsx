/**
 * Navbar.jsx — Global Header Navigation Bar
 *
 * Renders brand logo, page navigation links, and dynamic auth action buttons.
 * Adapts nav links dynamically based on user role (Candidate Portal vs Recruiter Portal).
 * Features a dynamic Theme Toggle (Light/Dark mode) that updates :root variables.
 * Features a Recruiter Contact Center: Recruiter inbox tracking active outreach.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Sparkles, ArrowRight, Sun, Moon, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Theme state: read from local storage or fallback to system preference
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Recruiter Messaging Tracking State
  const [showRecruiterChats, setShowRecruiterChats] = useState(false);
  const [recruiterOutreach, setRecruiterOutreach] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load outreach tracking lists
  useEffect(() => {
    if (isAuthenticated && user?.role === 'recruiter') {
      const loadOutreach = () => {
        const stored = localStorage.getItem('shortlyst_notifications') || '[]';
        try {
          const parsed = JSON.parse(stored);
          setRecruiterOutreach(parsed);
        } catch {
          setRecruiterOutreach([]);
        }
      };

      loadOutreach();
      window.addEventListener('storage', loadOutreach);
      return () => window.removeEventListener('storage', loadOutreach);
    }
  }, [isAuthenticated, user]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    setShowRecruiterChats(false);
    navigate('/');
  };

  // Determine landing route depending on user role
  const getAppRoot = () => {
    if (!isAuthenticated) return '/login';
    return user.role === 'candidate' ? '/candidate' : '/app';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-navbar)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid var(--border-navbar)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
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
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-24)' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-10)',
              textDecoration: 'none'
            }}
          >
            <img
              src="/logo.png"
              alt="Shortlyst Logo"
              width="30"
              height="30"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
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
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: 'var(--space-16)' }}>
            <Link
              to="/"
              style={{
                fontSize: '14px',
                fontWeight: location.pathname === '/' ? 600 : 500,
                color: location.pathname === '/' ? 'var(--color-primary)' : 'var(--text-muted)',
                borderBottom: location.pathname === '/' ? '2px solid var(--color-primary)' : 'none',
                paddingBottom: 'var(--space-4)',
                textDecoration: 'none'
              }}
            >
              Home
            </Link>

            {/* Dynamic Dashboard Link */}
            <Link
              to={getAppRoot()}
              style={{
                fontSize: '14px',
                fontWeight: location.pathname === '/app' || location.pathname === '/candidate' ? 600 : 500,
                color: location.pathname === '/app' || location.pathname === '/candidate' ? 'var(--color-primary)' : 'var(--text-muted)',
                borderBottom: location.pathname === '/app' || location.pathname === '/candidate' ? '2px solid var(--color-primary)' : 'none',
                paddingBottom: 'var(--space-4)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-4)'
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
              {isAuthenticated && user.role === 'candidate' ? 'Fit Checker' : 'Screener App'}
            </Link>
          </nav>
        </div>

        {/* Dynamic Auth Section & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', position: 'relative' }}>
          
          {/* Recruiter Outreach Messaging Center Dropdown (Only visible if Recruiter role is active) */}
          {isAuthenticated && user?.role === 'recruiter' && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowRecruiterChats((prev) => !prev)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
                aria-label="Toggle Outreach Logs"
              >
                <MessageSquare size={15} />
              </button>

              {showRecruiterChats && (
                <div
                  className="glass-panel stagger-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '320px',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-16)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-12)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-8)' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Recruiter Outreach Center</span>
                    <button
                      onClick={() => setShowRecruiterChats(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxHeight: '240px', overflowY: 'auto' }}>
                    {recruiterOutreach.length > 0 ? (
                      recruiterOutreach.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-8)',
                            fontSize: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '2px' }}>
                            <span>To: {item.candidateName}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.timestamp}</span>
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.messageText}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: 'var(--space-20)', color: 'var(--text-muted)', fontSize: '12px' }}>
                        <span>No outreach invitations sent yet. Click "Contact Candidate" on approved cards.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
              {/* User Profile Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-8)',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: 'var(--space-4) var(--space-12)'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-muted)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {user.avatarInitials}
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    maxWidth: '140px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user.name} ({user.role === 'recruiter' ? 'Recruiter' : 'Candidate'})
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6) var(--space-12)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-6)',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-danger)';
                  e.currentTarget.style.borderColor = 'var(--color-danger)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)' }}>
              <Link
                to="/login"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6) var(--space-16)',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 150ms ease'
                }}
              >
                Sign In
              </Link>

              <Link
                to="/login"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--text-inverse)',
                  border: '1px solid var(--color-primary-hover)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6) var(--space-16)',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-6)',
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'all 150ms ease'
                }}
              >
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
