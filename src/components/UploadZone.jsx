import React, { useState, useRef } from 'react';
import { Upload, FileText, X, UploadCloud } from 'lucide-react';

export default function UploadZone({ files = [], onFilesAdd, onFileRemove }) {
  const [internalFiles, setInternalFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const activeFiles = onFilesAdd ? files : internalFiles;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (selectedFiles.length > 0) {
        addFiles(selectedFiles);
      }
      e.target.value = '';
    }
  };

  const addFiles = (newFiles) => {
    if (onFilesAdd) {
      onFilesAdd(newFiles);
    } else {
      setInternalFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    if (onFileRemove) {
      onFileRemove(index);
    } else {
      setInternalFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-12)'
      }}
    >
      <label
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)'
        }}
      >
        <Upload size={16} style={{ color: 'var(--color-primary)' }} />
        Upload Resumes
      </label>

      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleZoneClick();
          }
        }}
        style={{
          backgroundColor: isDragOver ? 'var(--color-primary-muted)' : 'var(--bg-base)',
          border: `2px dashed ${isDragOver ? 'var(--color-primary)' : 'var(--outline-variant)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-24) var(--space-16)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-12)',
          outline: 'none',
          userSelect: 'none',
          boxShadow: isDragOver ? '0 0 20px rgba(192, 193, 255, 0.15)' : 'none'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDragOver ? 'var(--color-primary)' : 'var(--color-primary)',
            transform: isDragOver ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 200ms ease, border-color 200ms ease'
          }}
        >
          <UploadCloud size={26} />
        </div>

        <div>
          <p
            style={{
              margin: '0 0 var(--space-4) 0',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            Drag resumes here or <span style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>click to browse</span>
          </p>
          <p
            style={{
              margin: 0,
              color: 'var(--text-muted)',
              fontSize: '12px'
            }}
          >
            Supports PDF files (Max 50 files)
          </p>
        </div>
      </div>

      {activeFiles.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            marginTop: 'var(--space-4)',
            maxHeight: '90px',
            overflowY: 'auto',
            paddingRight: '6px'
          }}
        >
          {activeFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="file-chip"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: 'var(--space-6) var(--space-12)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 500,
                animationDelay: `${index * 40}ms`
              }}
            >
              <FileText size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span
                style={{
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={file.name}
              >
                {file.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'color 150ms ease, background-color 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-danger)';
                  e.currentTarget.style.backgroundColor = 'var(--color-danger-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label={`Remove ${file.name}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

