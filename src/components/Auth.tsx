import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';
import { PasswordReset } from './PasswordReset';
import { PasswordResetConfirm } from './PasswordResetConfirm';
import { authService } from '../services/authService';

type AuthView = 'login' | 'signup' | 'reset-request' | 'reset-confirm';

interface AuthProps {
  onAuthSuccess: (userData: { name?: string; email: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [resetToken, setResetToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('');
      const response = await authService.login(email, password);
      onAuthSuccess({ name: response.user.name, email: response.user.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      setError('');
      const response = await authService.signup(name, email, password);
      onAuthSuccess({ name: response.user.name, email: response.user.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const handleResetRequest = async (email: string) => {
    try {
      setError('');
      await authService.requestPasswordReset(email);
      // In a real application, the token would come from the URL after the user clicks
      // the reset link in their email. For demo purposes, we're simulating this.
      setResetToken('mock-reset-token');
      setCurrentView('reset-confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset request failed');
      throw err; // Re-throw to let the component handle the error state
    }
  };

  const handleResetConfirm = async (newPassword: string, token: string) => {
    try {
      setError('');
      await authService.confirmPasswordReset(token, newPassword);
      // After successful reset, return to login after a delay
      setTimeout(() => setCurrentView('login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      throw err; // Re-throw to let the component handle the error state
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
            onForgotPassword={() => setCurrentView('reset-request')}
          />
        );
      case 'signup':
        return (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'reset-request':
        return (
          <PasswordReset
            onResetRequest={handleResetRequest}
            onBackToLogin={() => setCurrentView('login')}
          />
        );
      case 'reset-confirm':
        return (
          <PasswordResetConfirm
            onResetConfirm={handleResetConfirm}
            onBackToLogin={() => setCurrentView('login')}
            token={resetToken}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}
      {renderCurrentView()}
    </>
  );
}; 