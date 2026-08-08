import React from 'react';
import { FileSearch } from 'lucide-react';

export default function EmptyState() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-32) var(--space-24)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-16)',
        minHeight: '320px'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}
      >
        <FileSearch size={28} />
      </div>

      <div style={{ maxWidth: '320px' }}>
        <h3
          style={{
            margin: '0 0 var(--space-8) 0',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}
        >
          No Candidates Screened Yet
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: '1.5'
          }}
        >
          Add a job description and resumes to get started
        </p>
      </div>
    </div>
  );
}
