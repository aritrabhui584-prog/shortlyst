/**
 * InputField.jsx — Shared Production Input Component
 *
 * Guarantees zero icon/text overlap across all forms & viewports by using
 * explicit, un-collapsable left/right pixel padding:
 * - Icon: Positioned absolutely at left: 14px (width: 18px)
 * - Input padding-left: EXPLICIT 48px (14px left offset + 18px icon + 16px clear text gutter)
 * - Input padding-right: EXPLICIT 48px when right element (eye toggle) is present
 * - Font inheritance: Strictly inherits var(--font-sans) with clean label/placeholder contrast
 */

import React, { useState } from 'react';

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  rightElement,
  error,
  required = false
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.01em'
          }}
        >
          {label}
        </label>
      )}

      {/* Input Outer Container */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        {/* Leading Icon */}
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFocused ? 'var(--color-primary)' : 'var(--text-muted)',
              pointerEvents: 'none',
              zIndex: 2,
              transition: 'color 180ms ease'
            }}
          >
            <Icon size={18} />
          </div>
        )}

        {/* Real Input Element */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            height: '46px',
            boxSizing: 'border-box',
            backgroundColor: 'var(--surface-container)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 'normal',
            border: `1px solid ${
              error
                ? 'var(--color-danger)'
                : isFocused
                ? 'var(--color-primary)'
                : 'var(--outline-variant)'
            }`,
            borderRadius: 'var(--radius-md)',
            /* EXPLICIT UNBREAKABLE PADDING VALUES — GUARANTEES NO ICON OVERLAP */
            paddingLeft: Icon ? '48px' : '16px',
            paddingRight: rightElement ? '48px' : '16px',
            paddingTop: '12px',
            paddingBottom: '12px',
            outline: 'none',
            transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
            boxShadow: isFocused ? '0 0 16px rgba(192, 193, 255, 0.2)' : 'none'
          }}
        />

        {/* Trailing Right Element (e.g. Password Eye Toggle) */}
        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            {rightElement}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-danger)',
            fontFamily: 'var(--font-sans)',
            marginTop: '2px'
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
