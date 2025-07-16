import React, { useState } from 'react';
import { LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import '../styles/auth.css';

interface PasswordResetConfirmProps {
  onResetConfirm: (newPassword: string, token: string) => Promise<void>;
  onBackToLogin: () => void;
  token: string;
}

export const PasswordResetConfirm: React.FC<PasswordResetConfirmProps> = ({
  onResetConfirm,
  onBackToLogin,
  token
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = { password: '', confirmPassword: '' };
    let isValid = true;

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onResetConfirm(password, token);
      setIsSuccess(true);
    } catch (err) {
      setErrors({
        ...errors,
        password: 'Failed to reset password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button
          onClick={onBackToLogin}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Login
        </button>

        <div className="auth-header">
          <h2>Reset Your Password</h2>
          <p>
            {isSuccess
              ? 'Your password has been reset successfully'
              : 'Enter your new password'}
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <LockClosedIcon className="input-icon" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'error' : ''}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <LockClosedIcon className="input-icon" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="password-requirements">
              <p className="text-sm text-gray-600 mb-2">Password requirements:</p>
              <ul className="text-xs text-gray-500 list-disc list-inside">
                <li>At least 6 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
              </ul>
            </div>

            <button
              type="submit"
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          <div className="reset-success">
            <div className="success-message">
              <p className="text-green-600 font-medium mb-4">
                Password reset successful!
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Your password has been updated. You can now log in with your new password.
              </p>
              <button
                onClick={onBackToLogin}
                className="auth-button"
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 