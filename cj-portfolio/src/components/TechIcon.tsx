import React from 'react';

export interface TechIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({
  name,
  className = '',
  size = 16,
  color,
}) => {
  const norm = name.trim().toLowerCase();

  // HTML / HTML5
  if (norm === 'html' || norm === 'html5') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4.135 2.5L5.75 20.625L12 22.355L18.25 20.625L19.865 2.5H4.135Z" fill="#E44D26" />
        <path d="M12 4.167V20.767L16.892 19.412L18.225 4.167H12Z" fill="#F16529" />
        <path d="M7.4 7.5H12V10.167H9.733L10.067 13.9H12V16.567H12.067L8.9 15.688L8.6 12.333H6.867L7.4 18.25L12 19.525V17.067L12 7.5H7.4Z" fill="#EBEBEB" />
        <path d="M12 7.5V10.167H16.267L15.933 13.9L12 14.958V17.625L15.4 16.667L15.467 15.9L15.9 11.033L16.033 9.4L16.6 7.5H12Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // CSS / CSS3
  if (norm === 'css' || norm === 'css3') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4.135 2.5L5.75 20.625L12 22.355L18.25 20.625L19.865 2.5H4.135Z" fill="#1572B6" />
        <path d="M12 4.167V20.767L16.892 19.412L18.225 4.167H12Z" fill="#33A9DC" />
        <path d="M12 7.5H7.4L7.667 10.5H12V7.5ZM7.933 13.5H12V10.5H7.667L7.933 13.5ZM8.2 16.5L8.4 18.25L12 19.25V16.3L9.667 15.65L9.5 13.8H7.933L8.2 16.5Z" fill="#EBEBEB" />
        <path d="M12 7.5V10.5H16.333L16.6 7.5H12ZM12 10.5V13.5H14.667L14.4 16.5L12 17.15V19.25L15.6 18.25L16.067 13.5H12Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // JavaScript
  if (norm === 'javascript' || norm === 'js') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7 17.5C7.8 18.5 8.9 19 10.2 19C12.1 19 13 17.8 13 15.5V9H10.8V15.4C10.8 16.4 10.4 17 9.5 17C8.8 17 8.3 16.6 7.8 16L7 17.5ZM14.2 17.2C15.1 18.4 16.4 19 17.9 19C20.2 19 21.6 17.7 21.6 15.6C21.6 13.7 20.4 12.8 18.7 12.1L18 11.8C17 11.4 16.5 11 16.5 10.3C16.5 9.6 17.1 9 18 9C18.8 9 19.4 9.4 19.9 10.2L21.3 9.1C20.5 7.7 19.4 7.2 18 7.2C15.9 7.2 14.6 8.5 14.6 10.4C14.6 12.2 15.7 13 17.3 13.7L18.1 14C19.2 14.5 19.7 15 19.7 15.8C19.7 16.7 18.9 17.3 17.8 17.3C16.6 17.3 15.7 16.6 15.1 15.5L14.2 17.2Z" fill="#000000" />
      </svg>
    );
  }

  // TypeScript
  if (norm === 'typescript' || norm === 'ts') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M5 9.5H13V11.5H10.1V18.5H7.9V11.5H5V9.5ZM13.8 17.2C14.6 18.3 15.8 18.9 17.2 18.9C19.3 18.9 20.6 17.7 20.6 15.8C20.6 14 19.5 13.2 17.9 12.5L17.2 12.2C16.3 11.8 15.8 11.4 15.8 10.7C15.8 10.1 16.3 9.6 17.1 9.6C17.8 9.6 18.4 10 18.8 10.7L20.1 9.7C19.4 8.5 18.4 8 17.1 8C15.2 8 14 9.1 14 10.8C14 12.4 15 13.1 16.4 13.7L17.2 14C18.2 14.4 18.7 14.9 18.7 15.7C18.7 16.5 18 17.1 17 17.1C15.9 17.1 15.1 16.5 14.6 15.5L13.8 17.2Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // React
  if (norm === 'react' || norm === 'react.js') {
    return (
      <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" className={className}>
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Figma
  if (norm === 'figma') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
        <path d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z" fill="#A259FF" />
        <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
        <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
        <path d="M20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12Z" fill="#1ABCFE" />
      </svg>
    );
  }

  // Python
  if (norm === 'python') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M11.87 2C6.98 2 7.28 4.12 7.28 4.12L7.3 6.32H12.06V7H5.25C5.25 7 2 6.64 2 11.53C2 16.42 4.84 16.14 4.84 16.14H6.53V13.8C6.53 11.13 8.87 11.13 8.87 11.13H13.62C14.7 11.13 15.6 10.23 15.6 9.15V4.28C15.6 3.2 14.7 2 11.87 2ZM9.72 3.65C10.22 3.65 10.62 4.05 10.62 4.55C10.62 5.05 10.22 5.45 9.72 5.45C9.22 5.45 8.82 5.05 8.82 4.55C8.82 4.05 9.22 3.65 9.72 3.65Z" fill="#3776AB" />
        <path d="M12.13 22C17.02 22 16.72 19.88 16.72 19.88L16.7 17.68H11.94V17H18.75C18.75 17 22 17.36 22 12.47C22 7.58 19.16 7.86 19.16 7.86H17.47V10.2C17.47 12.87 15.13 12.87 15.13 12.87H10.38C9.3 12.87 8.4 13.77 8.4 14.85V19.72C8.4 20.8 9.3 22 12.13 22ZM14.28 20.35C13.78 20.35 13.38 19.95 13.38 19.45C13.38 18.95 13.78 18.55 14.28 18.55C14.78 18.55 15.18 18.95 15.18 19.45C15.18 19.95 14.78 20.35 14.28 20.35Z" fill="#FFD438" />
      </svg>
    );
  }

  // Java
  if (norm === 'java') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9.8 19.2C9.8 19.2 12.7 18.6 15 19.2C16.8 19.6 19.2 20.6 19.2 20.6C19.2 20.6 17 21.6 13.4 21.7C9.3 21.8 7.3 20.8 7.3 20.8C7.3 20.8 8.6 20.2 9.8 19.2ZM9.1 16.9C9.1 16.9 12.5 16.1 16 17.1C18.6 17.8 20.8 19.2 20.8 19.2C20.8 19.2 18.9 19.9 15.3 19.8C10.7 19.7 7.7 18.4 7.7 18.4C7.7 18.4 8.4 17.7 9.1 16.9ZM14.1 12.4C14.9 13.4 14.4 14.5 14.4 14.5C14.4 14.5 17 13.5 16 11.9C15.1 10.5 14.3 10.3 13.2 9.2C12.1 8.1 12.8 6.7 12.8 6.7C12.8 6.7 11.5 8 12.4 9.8C13.2 11.5 13.8 12.1 14.1 12.4ZM11.1 6.5C11.1 6.5 12.6 7.7 11.5 9.7C10.5 11.3 9.4 12.4 12.1 14.6C10.2 14.1 8.8 12.9 9.3 11.4C9.8 9.7 11.8 8.6 11.1 6.5ZM16.4 14.8C16.4 14.8 18.8 13.8 17.8 12.6C17 11.7 16.3 11.5 15.8 10.6C15.3 9.8 15.7 8.8 15.7 8.8C15.7 8.8 14.6 9.8 15.3 11.2C15.9 12.6 16.3 13 16.4 14.8Z" fill="#EA2D2E" />
        <path d="M12 2C12 2 8 5.5 10 9C10.8 10.4 12.5 11.2 12.5 11.2C12.5 11.2 11.5 10.4 11 9.5C10 7.8 11.2 5.5 12 2Z" fill="#007396" />
      </svg>
    );
  }

  // Node.js
  if (norm === 'node.js' || norm === 'node' || norm === 'nodejs') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2.5L20.66 7.5V17.5L12 22.5L3.34 17.5V7.5L12 2.5Z" fill="#339933" />
        <path d="M12 4.5L18.93 8.5V16.5L12 20.5L5.07 16.5V8.5L12 4.5Z" fill="#43853D" />
        <path d="M12 6.5L10 8V12L12 13.2L14 12V8L12 6.5Z" fill="#FFFFFF" />
        <path d="M9 13.5L12 15.3L15 13.5V16L12 17.8L9 16V13.5Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // PostgreSQL
  if (norm === 'postgresql' || norm === 'postgres') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12.02 2C6.49 2 2 6.48 2 12C2 17.52 6.49 22 12.02 22C17.55 22 22 17.52 22 12C22 6.48 17.55 2 12.02 2Z" fill="#336791" />
        <path d="M12.2 6.2C10.3 6.2 9.2 7.4 8.7 8.5C8.2 9.5 8 10.8 8.1 11.9C8.2 13 8.7 13.9 9.3 14.5C9.9 15.1 10.6 15.4 11.3 15.6C11.1 16.1 10.7 16.7 10 17.1C9.4 17.4 8.6 17.6 7.7 17.4V18.6C8.9 18.8 10.1 18.6 11 18C12 17.3 12.6 16.3 12.9 15.4C13.8 15.3 14.7 14.9 15.3 14.2C16 13.4 16.4 12.4 16.3 11.2C16.2 9.8 15.5 8.7 14.6 7.8C13.8 7 13 6.2 12.2 6.2ZM12.1 7.4C12.7 7.4 13.3 7.8 13.9 8.5C14.5 9.2 14.9 10 15 11.1C15.1 11.9 14.8 12.6 14.3 13.2C13.8 13.7 13.2 14 12.5 14.1C11.8 14 11.3 13.8 10.8 13.4C10.3 12.9 9.9 12.2 9.8 11.4C9.7 10.6 9.9 9.7 10.3 9C10.7 8.1 11.4 7.4 12.1 7.4Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Supabase
  if (norm === 'supabase') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M13.4 23.3C12.8 24.1 11.5 23.7 11.5 22.7V13.8H3.2C2.1 13.8 1.5 12.5 2.2 11.7L12.3 0.6C12.9 -0.1 14.2 0.3 14.2 1.3V10.2H21.7C22.8 10.2 23.4 11.5 22.7 12.3L13.4 23.3Z" fill="#3ECF8E" />
      </svg>
    );
  }

  // MySQL
  if (norm === 'mysql') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#00758F" />
        <path d="M6 16.5C8.5 16.5 9.2 14.5 9.2 14.5C9.2 14.5 10 16.5 12.5 16.5C15 16.5 15.5 14.2 15.5 14.2C15.5 14.2 16.2 16.5 18.5 16.5M6 16.5V9.5M12.5 16.5V9.5M18.5 16.5V9.5" stroke="#F29111" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // MSSQL (Microsoft SQL Server)
  if (norm === 'mssql' || norm === 'microsoft sql server' || norm === 'sql server') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#CC292B" />
        <ellipse cx="12" cy="7" rx="6" ry="2.2" fill="#FFFFFF" />
        <path d="M6 7V12C6 13.2 8.7 14.2 12 14.2C15.3 14.2 18 13.2 18 12V7" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <path d="M6 12V17C6 18.2 8.7 19.2 12 19.2C15.3 19.2 18 18.2 18 17V12" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // Docker
  if (norm === 'docker') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M22.5 11.5C21.8 11.4 21.2 11.6 20.8 12C20.6 11.2 20 10.6 19.2 10.4L18.4 10.2L18.1 11C17.9 11.6 17.5 12.1 16.9 12.4C15.6 12 14.3 12 12.9 12.2H1.5C1.2 13.4 1.4 14.8 2 15.9C3.1 18.2 5.5 19.5 8.3 19.5C14.2 19.5 18.5 16.3 20.3 13.1C21.4 13.2 22.4 12.6 22.5 11.5Z" fill="#2496ED" />
        <rect x="5.5" y="8.5" width="2.4" height="2.4" rx="0.3" fill="#2496ED" />
        <rect x="8.5" y="8.5" width="2.4" height="2.4" rx="0.3" fill="#2496ED" />
        <rect x="11.5" y="8.5" width="2.4" height="2.4" rx="0.3" fill="#2496ED" />
        <rect x="8.5" y="5.5" width="2.4" height="2.4" rx="0.3" fill="#2496ED" />
        <rect x="11.5" y="5.5" width="2.4" height="2.4" rx="0.3" fill="#2496ED" />
        <rect x="14.5" y="8.5" width="2.4" height="2.4" rx="0.3" fill="#2496ED" />
      </svg>
    );
  }

  // VirtualBox
  if (norm === 'virtualbox' || norm === 'oracle virtualbox') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#183A61" />
        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="#2D72D9" strokeWidth="1.5" fill="#102540" />
        <path d="M12 3V21M4 7.5L20 16.5M20 7.5L4 16.5" stroke="#4DA3FF" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // Draw.io
  if (norm === 'draw.io' || norm === 'diagrams.net' || norm === 'drawio') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#F08705" />
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" fill="#FFFFFF" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" fill="#FFFFFF" />
        <path d="M10.5 7.25H16.75V13.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Mermaid.js
  if (norm === 'mermaid.js' || norm === 'mermaid') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#FF3670" />
        <path d="M6 7C9.5 7 12 9.5 12 12C12 14.5 14.5 17 18 17M6 17C9.5 17 12 14.5 12 12C12 9.5 14.5 7 18 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Cisco
  if (norm === 'cisco') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M2 13V15M5 11V17M8 9V19M11 7V21M13 7V21M16 9V19M19 11V17M22 13V15" stroke="#1BA0D7" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  // VS Code
  if (norm === 'vs code' || norm === 'vscode' || norm === 'visual studio code') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17.5 2.2L6.8 11.2L2.5 8L1 9.2L4.5 12L1 14.8L2.5 16L6.8 12.8L17.5 21.8L23 19.2V4.8L17.5 2.2ZM17.5 6.8L10.2 12L17.5 17.2V6.8Z" fill="#007ACC" />
      </svg>
    );
  }

  // Git
  if (norm === 'git') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21.6 10.9L13.1 2.4C12.6 1.9 11.8 1.9 11.3 2.4L9.5 4.2L12 6.7C12.6 6.5 13.3 6.6 13.8 7.1C14.3 7.6 14.4 8.3 14.2 8.9L16.6 11.3C17.2 11.1 17.9 11.2 18.4 11.7C19.1 12.4 19.1 13.6 18.4 14.3C17.7 15 16.5 15 15.8 14.3C15.3 13.8 15.2 13.1 15.4 12.5L13.2 10.3V15.2C13.4 15.5 13.5 15.8 13.5 16.2C13.5 17.3 12.6 18.2 11.5 18.2C10.4 18.2 9.5 17.3 9.5 16.2C9.5 15.4 10 14.7 10.7 14.4V9.6C10 9.3 9.5 8.6 9.5 7.8C9.5 7.4 9.6 7.1 9.8 6.8L7.3 4.3L2.4 9.2C1.9 9.7 1.9 10.5 2.4 11L10.9 19.5C11.4 20 12.2 20 12.7 19.5L21.6 12.6C22.1 12.1 22.1 11.4 21.6 10.9Z" fill="#F05032" />
      </svg>
    );
  }

  // GitHub
  if (norm === 'github') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017C2 16.446 4.87 20.198 8.84 21.524C9.34 21.617 9.52 21.306 9.52 21.042C9.52 20.808 9.51 20.024 9.51 19.201C6.73 19.805 6.14 17.86 6.14 17.86C5.69 16.717 5.04 16.413 5.04 16.413C4.13 15.792 5.11 15.805 5.11 15.805C6.12 15.876 6.65 16.848 6.65 16.848C7.55 18.39 9 17.944 9.58 17.684C9.67 17.03 9.93 16.584 10.22 16.333C7.99 16.08 5.66 15.216 5.66 11.378C5.66 10.285 6.05 9.39 6.69 8.692C6.59 8.438 6.24 7.42 6.79 6.052C6.79 6.052 7.63 5.782 9.54 7.076C10.34 6.853 11.19 6.742 12.04 6.738C12.89 6.742 13.74 6.853 14.54 7.076C16.45 5.782 17.29 6.052 17.29 6.052C17.84 7.42 17.49 8.438 17.39 8.692C18.03 9.39 18.42 10.285 18.42 11.378C18.42 15.228 16.08 16.077 13.84 16.325C14.2 16.636 14.52 17.248 14.52 18.188C14.52 19.537 14.51 20.627 14.51 20.957C14.51 21.224 14.69 21.539 15.2 21.437C19.16 20.106 22.02 16.398 22.02 12.017C22.02 6.484 17.53 2 12 2Z" />
      </svg>
    );
  }

  // GitHub Desktop
  if (norm === 'github desktop' || norm === 'github-desktop') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="5" fill="#6F42C1" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.58 4 4 7.58 4 12C4 15.54 6.29 18.54 9.47 19.6C9.87 19.67 10.01 19.43 10.01 19.22C10.01 19.03 10 18.4 10 17.74C7.78 18.22 7.31 16.67 7.31 16.67C6.95 15.76 6.43 15.51 6.43 15.51C5.7 15.02 6.48 15.03 6.48 15.03C7.29 15.09 7.71 15.86 7.71 15.86C8.43 17.1 9.59 16.74 10.05 16.53C10.12 16.01 10.33 15.65 10.56 15.45C8.78 15.25 6.92 14.56 6.92 11.49C6.92 10.62 7.23 9.9 7.74 9.34C7.66 9.14 7.38 8.33 7.82 7.23C7.82 7.23 8.49 7.02 10.02 8.05C10.66 7.87 11.34 7.78 12.02 7.78C12.7 7.78 13.38 7.87 14.02 8.05C15.55 7.02 16.22 7.23 16.22 7.23C16.66 8.33 16.38 9.14 16.3 9.34C16.81 9.9 17.12 10.62 17.12 11.49C17.12 14.57 15.25 15.25 13.46 15.45C13.75 15.7 14.01 16.19 14.01 16.94C14.01 18.02 14 18.89 14 19.16C14 19.37 14.14 19.62 14.55 19.54C17.73 18.48 20.02 15.51 20.02 12C20.02 7.58 16.44 4 12 4Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // PyCharm
  if (norm === 'pycharm') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#21D789" />
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#000000" />
        <path d="M4 17H10V19H4V17Z" fill="#21D789" />
        <path d="M5 6H8.5C9.9 6 11 7.1 11 8.5C11 9.9 9.9 11 8.5 11H7V14H5V6ZM7 9.2H8.3C8.8 9.2 9.1 8.9 9.1 8.5C9.1 8.1 8.8 7.8 8.3 7.8H7V9.2Z" fill="#FFFFFF" />
        <path d="M12.5 10C12.5 7.8 14.1 6 16.3 6C17.6 6 18.7 6.6 19.3 7.6L17.7 8.8C17.4 8.3 16.9 8 16.3 8C15.2 8 14.4 8.9 14.4 10C14.4 11.1 15.2 12 16.3 12C16.9 12 17.4 11.7 17.7 11.2L19.3 12.4C18.7 13.4 17.6 14 16.3 14C14.1 14 12.5 12.2 12.5 10Z" fill="#21D789" />
      </svg>
    );
  }

  // Vercel
  if (norm === 'vercel') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2L23 21H1L12 2Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Codex
  if (norm === 'codex' || norm === 'openai codex') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#10A37F" />
        <path d="M12 6.5C8.96 6.5 6.5 8.96 6.5 12C6.5 15.04 8.96 17.5 12 17.5C15.04 17.5 17.5 15.04 17.5 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
        <path d="M17.5 9L15 11.5M17.5 15L15 12.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // Claude
  if (norm === 'claude' || norm === 'anthropic' || norm === 'claude ai') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#D97706" />
        <path d="M12 3.5V20.5M3.5 12H20.5M6 6L18 18M18 6L6 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  // Gemini
  if (norm === 'gemini' || norm === 'gemini ai' || norm === 'google gemini') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" fill="url(#geminiGradient)" />
        <defs>
          <linearGradient id="geminiGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4E82EE" />
            <stop offset="0.5" stopColor="#9B72CF" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Antigravity
  if (norm === 'antigravity' || norm === 'google antigravity' || norm === 'agy') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M12 4L19 17H5L12 4Z" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="2.5" fill="#4285F4" />
        <circle cx="12" cy="13" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  // Atlassian (Jira / Confluence)
  if (
    norm.includes('atlassian') ||
    norm.includes('jira') ||
    norm.includes('confluence')
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#0052CC" />
        <path d="M11.6 3.5C11.6 3.5 8.2 7.5 8.2 11.2C8.2 13 9.4 14.5 11 15C11.5 13.5 12.2 11.8 13.5 10.5C14.8 9.2 16.5 8.5 18 8C17.5 6.4 16 5.2 14.2 5.2C13.2 5.2 12.3 5.6 11.6 6.3L11.6 3.5Z" fill="#2684FF" />
        <path d="M12.4 20.5C12.4 20.5 15.8 16.5 15.8 12.8C15.8 11 14.6 9.5 13 9C12.5 10.5 11.8 12.2 10.5 13.5C9.2 14.8 7.5 15.5 6 16C6.5 17.6 8 18.8 9.8 18.8C10.8 18.8 11.7 18.4 12.4 17.7L12.4 20.5Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Microsoft Teams
  if (norm === 'microsoft teams' || norm === 'teams' || norm === 'ms teams') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#6264A7" />
        <circle cx="16.5" cy="8" r="2" fill="#FFFFFF" />
        <path d="M14 12.5C14 11.5 15 11 16.5 11C18 11 19 11.5 19 12.5V14.5H14V12.5Z" fill="#FFFFFF" opacity="0.8" />
        <rect x="5" y="8" width="8" height="8" rx="1.5" fill="#FFFFFF" />
        <path d="M7 10H11M9 10V14" stroke="#6264A7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Zoom
  if (norm === 'zoom') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="5" fill="#2D8CFF" />
        <path d="M5.5 8.5C5.5 7.67 6.17 7 7 7H13.5C14.33 7 15 7.67 15 8.5V15.5C15 16.33 14.33 17 13.5 17H7C6.17 17 5.5 16.33 5.5 15.5V8.5Z" fill="#FFFFFF" />
        <path d="M16 10.3L18.8 8.4C19.2 8.1 19.8 8.4 19.8 8.9V15.1C19.8 15.6 19.2 15.9 18.8 15.6L16 13.7V10.3Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Google Meet
  if (norm === 'google meet' || norm === 'meet') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="6" width="11" height="12" rx="2" fill="#00897B" />
        <path d="M14 10L19.5 6.5V17.5L14 14V10Z" fill="#FFBA00" />
        <path d="M14 10L19.5 6.5V12L14 10Z" fill="#00AA47" />
        <path d="M14 14L19.5 17.5V12L14 14Z" fill="#EB4335" />
        <circle cx="8.5" cy="12" r="2.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // Tailwind CSS
  if (norm === 'tailwind css' || norm === 'tailwind') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 6C9.6 6 8.1 7.2 7.5 9.6C8.4 8.4 9.45 8.1 10.65 8.7C12.02 9.39 13 10.4 14.07 11.5C15.82 13.29 17.84 15.36 22 15.36C24.4 15.36 25.9 14.16 26.5 11.76C25.6 12.96 24.55 13.26 23.35 12.66C21.98 11.97 21 10.96 19.93 9.86C18.18 8.07 16.16 6 12 6ZM2 15.36C-0.4 15.36 -1.9 16.56 -2.5 18.96C-1.6 17.76 -0.55 17.46 0.65 18.06C2.02 18.75 3 19.76 4.07 20.86C5.82 22.65 7.84 24.72 12 24.72C14.4 24.72 15.9 23.52 16.5 21.12C15.6 22.32 14.55 22.02 13.35 21.42C11.98 20.73 11 19.72 9.93 18.62C8.18 16.83 6.16 15.36 2 15.36Z" transform="scale(0.8) translate(3, -1)" fill="#06B6D4" />
      </svg>
    );
  }

  // Vite
  if (norm === 'vite' || norm === 'vite.js') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21.5 3.5L12.5 22.5L2.5 3.5H21.5Z" fill="#646CFF" opacity="0.3" />
        <path d="M19.5 4.5L12 20.5L4.5 4.5H19.5Z" fill="#646CFF" />
        <path d="M12.5 2.5L8.5 11.5H12L11 18.5L16 9.5H12.5L14 2.5H12.5Z" fill="#FFD62E" />
      </svg>
    );
  }

  // Leaflet.js
  if (norm === 'leaflet.js' || norm === 'leaflet') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M19.5 4.5C16.5 4.5 9 7.5 5.5 15.5C4 19 5.5 20.5 7.5 20.5C14.5 20.5 19.5 12 19.5 4.5Z" fill="#199900" />
        <path d="M6 19C9.5 16 13.5 12 18 6.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Express.js
  if (norm === 'express.js' || norm === 'express') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#222222" />
        <text x="5" y="16" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#FFFFFF">ex</text>
      </svg>
    );
  }

  // PHP
  if (norm === 'php') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <ellipse cx="12" cy="12" rx="10" ry="6.5" fill="#777BB4" />
        <text x="6" y="15" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#FFFFFF">PHP</text>
      </svg>
    );
  }

  // Firebase
  if (norm === 'firebase') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4.5 18.2L6.8 4.2C6.9 3.7 7.5 3.5 7.8 3.9L10.9 9.3L4.5 18.2Z" fill="#FFA000" />
        <path d="M12.5 12.1L14.7 7.8C14.9 7.4 15.5 7.4 15.7 7.8L19.5 18.2L12.5 12.1Z" fill="#F57C00" />
        <path d="M4.5 18.2L11.5 22.3C11.8 22.5 12.2 22.5 12.5 22.3L19.5 18.2L12.5 12.1L4.5 18.2Z" fill="#FFCA28" />
      </svg>
    );
  }

  // Firestore
  if (norm === 'firestore') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" fill="#FFA000" />
        <path d="M12 4.5L6 7.5V16.5L12 19.5L18 16.5V7.5L12 4.5Z" fill="#FFCA28" />
        <ellipse cx="12" cy="12" rx="3" ry="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // REST APIs
  if (norm === 'rest apis' || norm === 'rest api' || norm === 'api') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#009688" />
        <path d="M7 9L4 12L7 15M17 9L20 12L17 15M14 7L10 17" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // OpenAI API
  if (norm === 'openai api' || norm === 'openai') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#10A37F" />
        <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M12 4V7M12 17V20M4 12H7M17 12H20" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // GroqCloud
  if (norm === 'groqcloud' || norm === 'groq') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#F55036" />
        <circle cx="12" cy="12" r="6" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Networking & Security Items
  if (norm === 'protocols') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#38BDF8' }}>
        <path d="M4 17l6-6-6-6M12 19h8" />
      </svg>
    );
  }

  if (norm === 'subnetting') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#34D399' }}>
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="2" width="6" height="6" rx="1" />
        <rect x="9" y="16" width="6" height="6" rx="1" />
        <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M12 13v3" />
      </svg>
    );
  }

  if (norm === 'ip config' || norm === 'ip configuration') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#F59E0B' }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" />
      </svg>
    );
  }

  if (norm === 'vlan') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#A78BFA' }}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }

  if (norm === 'rbac') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#EC4899' }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  // Core Strengths
  if (norm === 'agile') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#10B981' }}>
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    );
  }

  if (norm === 'problem-solving' || norm === 'problem solving') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#F59E0B' }}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6M10 22h4" />
      </svg>
    );
  }

  if (norm === 'analytical') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#60A5FA' }}>
        <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
      </svg>
    );
  }

  if (norm === 'team collab' || norm === 'team collaboration') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#6366F1' }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  // Fallback icon for any other tag
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: color || '#888888' }}>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
};

export default TechIcon;
