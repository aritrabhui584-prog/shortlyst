/**
 * App.jsx — Primary Application Entry & Router Configuration
 *
 * Configures React Router routes:
 * - `/`          → LandingPage (Public product overview)
 * - `/login`     → LoginPage (Public authentication with role selector)
 * - `/app`       → ScreenerPage (Protected Recruiter batch screening workspace)
 * - `/candidate` → CandidateDashboard (Protected Job Seeker single-fit check workspace)
 * - `*`          → Redirect to `/`
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ScreenerPage from './pages/ScreenerPage';
import CandidateDashboard from './pages/CandidateDashboard';
import './styles/tokens.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div
          style={{
            minHeight: '100vh',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowY: 'auto'
          }}
        >
          {/* Global Ambient Background System */}
          <GlobalBackgroundWrapper />

          {/* Global Header Navbar */}
          <Navbar />

          {/* Page Routing Views */}
          <main style={{ flex: 1, width: '100%' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute allowedRole="recruiter">
                    <ScreenerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate"
                element={
                  <ProtectedRoute allowedRole="candidate">
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <footer
            style={{
              borderTop: '1px solid var(--outline-variant)',
              padding: 'var(--space-16) var(--space-32)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              marginTop: 'auto',
              flexShrink: 0
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}
            >
              © {new Date().getFullYear()} Shortlyst AI
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  opacity: 0.8
                }}
              >
                Privacy
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  opacity: 0.8
                }}
              >
                Terms
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  opacity: 0.8
                }}
              >
                Help
              </a>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Inline wrapper for GlobalBackground to prevent rendering errors if file imports are delayed
import GlobalBackground from './components/GlobalBackground';
function GlobalBackgroundWrapper() {
  return <GlobalBackground />;
}
