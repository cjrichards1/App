import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface ForestCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const ForestCheckbox: React.FC<ForestCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label 
      className={`forest-checkbox-container ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <div 
        className={`
          forest-checkbox 
          border-organic 
          ${checked ? 'is-checked' : ''}
          ${disabled ? 'disabled' : ''}
        `}
        onClick={handleClick}
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="checkbox-ring texture-bark">
          <div className="checkbox-center">
            {checked && (
              <CheckIcon className="check-icon animate-grow" />
            )}
          </div>
        </div>
      </div>
      {label && (
        <span className="forest-checkbox-label">
          {label}
        </span>
      )}
    </label>
  );
};

// Add forest-inspired checkbox styles
const styles = `
.forest-checkbox-container {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  user-select: none;
}

.forest-checkbox {
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  border-radius: 0.375rem;
  background: var(--bg-primary);
  border: 2px solid var(--primary-300);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.forest-checkbox:hover:not(.disabled) {
  border-color: var(--primary-400);
  transform: scale(1.05);
}

.forest-checkbox:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.forest-checkbox.is-checked {
  background: var(--primary-500);
  border-color: var(--primary-600);
}

.forest-checkbox.is-checked:hover:not(.disabled) {
  background: var(--primary-600);
  border-color: var(--primary-700);
}

.checkbox-ring {
  position: absolute;
  inset: -4px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, var(--earth-300), var(--primary-300));
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.forest-checkbox.is-checked .checkbox-ring {
  opacity: 0.1;
  transform: scale(1);
}

.checkbox-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.check-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 3;
}

@keyframes grow {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-grow {
  animation: grow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.forest-checkbox-label {
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Dark mode adjustments */
[data-theme="dark"] .forest-checkbox {
  background: var(--bg-elevated);
}

[data-theme="dark"] .checkbox-ring {
  background: linear-gradient(135deg, var(--earth-700), var(--primary-700));
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .forest-checkbox,
  .checkbox-ring {
    transition: none;
  }
  
  .animate-grow {
    animation: none;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 