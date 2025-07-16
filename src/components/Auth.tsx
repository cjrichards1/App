import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (user) {
        onAuthSuccess({ name: user.name, email: user.email });
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthSuccess]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('');
      const user = await authService.login(email, password);
      onAuthSuccess({ name: user.name, email: user.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      setError('');
      const user = await authService.signup(name, email, password);
      onAuthSuccess({ name: user.name, email: user.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const handleResetRequest = async (email: string) => {
    try {
      setError('');
      await authService.requestPasswordReset(email);
      // Show success message and switch to login view after a delay
      setTimeout(() => setCurrentView('login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset request failed');
    }
  };

  const handleResetConfirm = async (newPassword: string) => {
    try {
      setError('');
      await authService.updatePassword(newPassword);
      // After successful reset, return to login
      setTimeout(() => setCurrentView('login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
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