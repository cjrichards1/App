import React, { useState } from 'react';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import '../styles/auth.css';

interface PasswordResetProps {
  onResetRequest: (email: string) => Promise<void>;
  onBackToLogin: () => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({
  onResetRequest,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    
    if (emailError) {
      setError(emailError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onResetRequest(email);
      setIsRequestSent(true);
    } catch (err) {
      setError('Failed to send reset request. Please try again.');
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
          <h2>Reset Password</h2>
          <p>
            {isRequestSent
              ? 'Check your email for reset instructions'
              : 'Enter your email to reset your password'}
          </p>
        </div>

        {!isRequestSent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <EnvelopeIcon className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? 'error' : ''}
                  disabled={isLoading}
                />
              </div>
              {error && <span className="error-message">{error}</span>}
            </div>

            <button
              type="submit"
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="reset-success">
            <div className="success-message">
              <p className="text-green-600 font-medium mb-4">
                Reset link sent successfully!
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Please check your email ({email}) for instructions to reset your
                password. The link will expire in 1 hour.
              </p>
              <button
                onClick={onBackToLogin}
                className="auth-button"
              >
                Return to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 