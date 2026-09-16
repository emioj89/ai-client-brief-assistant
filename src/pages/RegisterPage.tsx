import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { UnconfiguredState } from '../components/ui/UnconfiguredState';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="auth-layout">
        <div className="auth-card">
          <UnconfiguredState />
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please complete all fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const client = getSupabaseClient();
      const redirectUrl = new URL(
        import.meta.env.BASE_URL,
        window.location.origin
      ).toString();

      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMessage('Unable to register account. Please try again.');
      } else if (data.session) {
        navigate('/dashboard', { replace: true });
      } else {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-layout">
        <div className="auth-card text-center">
          <div className="auth-header">
            <div className="auth-brand">
              <span className="brand-icon">✉️</span>
              <h2>Confirm Your Email</h2>
            </div>
            <p className="auth-subtitle margin-top-sm">
              Check your email to confirm your account before signing in.
            </p>
          </div>

          <div className="auth-footer margin-top-md">
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => navigate('/login')}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-icon">🤖</span>
            <h2>AI Brief Assistant</h2>
          </div>
          <p className="auth-subtitle">Create an account to start analyzing client requests</p>
        </div>

        {errorMessage && (
          <div className="alert alert--error" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              className="form-control"
              placeholder="you@studio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">
              Password (min. 6 chars)
            </label>
            <input
              id="reg-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm-password" className="form-label">
              Confirm Password
            </label>
            <input
              id="reg-confirm-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

