import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'moss' | 'earth';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ForestButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const ForestButton: React.FC<ForestButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'forest-button border-organic shadow-natural';
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-forest hover:shadow-glow-forest',
    secondary: 'bg-gradient-earth hover:shadow-glow-earth',
    moss: 'bg-gradient-moss hover:shadow-glow-moss',
    earth: 'bg-gradient-earth hover:shadow-glow-earth'
  };
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:translate-y-[-2px]'}
        ${className}
      `}
      {...props}
    >
      <div className="button-content">
        {icon && iconPosition === 'left' && (
          <span className="button-icon left">{icon}</span>
        )}
        <span className="button-text">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="button-icon right">{icon}</span>
        )}
      </div>
      <div className="button-texture texture-bark" />
    </button>
  );
};

// Add forest-inspired button styles
const styles = `
.forest-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-inverse);
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.forest-button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.forest-button:active:not(:disabled) {
  transform: scale(0.98);
}

.button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-icon.left {
  margin-right: 0.25rem;
}

.button-icon.right {
  margin-left: 0.25rem;
}

.button-texture {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.forest-button:hover .button-texture {
  opacity: 0.1;
}

/* Dark mode adjustments */
[data-theme="dark"] .forest-button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

[data-theme="dark"] .button-texture {
  opacity: 0.08;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .forest-button,
  .button-texture {
    transition: none;
  }
  
  .forest-button:hover {
    transform: none;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 