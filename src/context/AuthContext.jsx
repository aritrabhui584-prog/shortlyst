/**
 * AuthContext.jsx — Lightweight Role-Based Authentication Context & Session Store
 *
 * Manages user session state using localStorage persistence.
 * Provides login, signup, and logout methods with role context propagation.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'shortlyst_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email, password, role = 'recruiter') => {
    setLoading(true);
    // Simulate network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      setLoading(false);
      throw new Error('Please enter both email and password.');
    }

    if (password.length < 6) {
      setLoading(false);
      throw new Error('Password must be at least 6 characters.');
    }

    // Synthesize user name from email
    const namePart = email.split('@')[0];
    const formattedName = namePart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const authenticatedUser = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: formattedName || (role === 'recruiter' ? 'Recruiter' : 'Candidate'),
      email: email.toLowerCase(),
      role: role,
      avatarInitials: (formattedName || 'RU').substring(0, 2).toUpperCase(),
      createdAt: new Date().toISOString()
    };

    setUser(authenticatedUser);
    setLoading(false);
    return authenticatedUser;
  };

  const signup = async (name, email, password, role = 'recruiter') => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!name || !email || !password) {
      setLoading(false);
      throw new Error('Please fill in all required fields.');
    }

    if (password.length < 6) {
      setLoading(false);
      throw new Error('Password must be at least 6 characters.');
    }

    const newUser = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role,
      avatarInitials: name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase(),
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
