import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import '../styles/auth.css';

interface PasswordResetConfirmProps {
  onResetConfirm: (newPassword: string) => Promise<void>;
  onBackToLogin: () => void;
}

export const PasswordResetConfirm: React.FC<PasswordResetConfirmProps> = ({
  onResetConfirm,
  onBackToLogin,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError('Password must contain uppercase, lowercase, and number');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    try {
      await onResetConfirm(newPassword);
      // Success will be handled by the parent component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-icon-wrapper">
              <LockClosedIcon className="input-icon" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <LockClosedIcon className="input-icon" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={onBackToLogin} className="switch-auth-button" disabled={isLoading}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}; 