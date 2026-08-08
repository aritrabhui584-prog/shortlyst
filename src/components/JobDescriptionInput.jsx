import React, { useState } from 'react';
import { FileText } from 'lucide-react';

export default function JobDescriptionInput({ value: propValue, onChange: propOnChange, placeholder }) {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const value = propValue !== undefined ? propValue : internalValue;
  const handleChange = (e) => {
    if (propOnChange) {
      propOnChange(e.target.value);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const charCount = value.length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-12)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label
          htmlFor="job-description-textarea"
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
            letterSpacing: '0.01em'
          }}
        >
          <FileText size={16} style={{ color: 'var(--color-primary)' }} />
          Job Description
        </label>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: 'var(--text-muted)'
          }}
        >
          {charCount}/2000
        </span>
      </div>

      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          transition: 'all 180ms ease'
        }}
      >
        <textarea
          id="job-description-textarea"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || "Paste the full job description here..."}
          rows={5}
          style={{
            width: '100%',
            backgroundColor: 'var(--surface-container)',
            color: 'var(--text-primary)',
            border: `1px solid ${isFocused ? 'var(--color-primary)' : 'var(--outline-variant)'}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-16)',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'var(--font-sans)',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 180ms ease, box-shadow 180ms ease',
            boxShadow: isFocused ? '0 0 16px rgba(192, 193, 255, 0.15)' : 'none'
          }}
        />
      </div>
    </div>
  );
}
