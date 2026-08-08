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
        gap: 'var(--space-8)'
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
            gap: 'var(--space-8)'
          }}
        >
          <FileText size={16} style={{ color: 'var(--color-primary)' }} />
          Target Job Requirements
        </label>
        <span
          style={{
            fontSize: '12px',
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
          placeholder={placeholder || "Paste the full job description or key role requirements here..."}
          rows={6}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-base)',
            color: 'var(--text-primary)',
            border: `1px solid ${isFocused ? 'var(--color-primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
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

