/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNotification } from '../../utils/NotificationSystem';
import Loading from '../../utils/Loading';
import Error from '../../utils/ErrorProps';
import { type RootState } from '../../store/store';
import { setAuth } from '../../store/slices/authSlice';
import { AlertCircle } from 'lucide-react';
interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setNetworkError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember: rememberMe,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        dispatch(
          setAuth({
            token: result.token,
            user: result.user || { id: '1', name: formData.email, role: 'User' },
          }),
        );
        addNotification('Logged in successfully!', 'success');
        navigate('/dashboard');
      } else {
        setErrors({ general: result.message || 'Invalid credentials' });
        addNotification(result.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      setNetworkError('Network error. Please check your connection and try again.');
      addNotification('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setNetworkError(null);
    handleSubmit({ preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (networkError) {
    return <Error message={networkError} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-background-dark dark:to-neutral-900 p-4 transition-all duration-400 ease-smooth">
      <div className="w-full max-w-md inventory-card p-8 backdrop-blur-xs animate-fade-in">
        {/* Header with Ojaflow Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <Package className="h-12 w-12 text-primary-500 animate-pulse" />
              <div className="absolute inset-0 h-12 w-12 rounded-full bg-primary-500/20 animate-pulse" />
            </div>
            <span className="ml-3 text-2xl font-bold font-display text-foreground dark:text-foreground-dark">
              Ojaflow
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground dark:text-foreground-dark mb-3">
            Sign In
          </h1>
          <p className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
            Access your inventory management dashboard
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="notification-error flex items-center p-4 mb-6 rounded-lg animate-bounce-in">
            <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium text-error-800 dark:text-error-200">
              {errors.general}
            </span>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground dark:text-foreground-dark">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <Mail className="h-5 w-5 text-neutral-400" /> */}
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Enter your email"
                className={`inventory-input pl-10 transition-all duration-200 ${
                  errors.email ? 'border-error-500 focus:ring-error-500' : 'focus:ring-primary-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-error-600 dark:text-error-400 flex items-center animate-fade-in">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground dark:text-foreground-dark">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <Lock className="h-5 w-5 text-neutral-400" /> */}
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Enter your password"
                className={`inventory-input pl-10 pr-12 transition-all duration-200 ${
                  errors.password ? 'border-error-500 focus:ring-error-500' : 'focus:ring-primary-500'
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors duration-200" />
                ) : (
                  <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors duration-200" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-error-600 dark:text-error-400 flex items-center animate-fade-in">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded transition-colors duration-200"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-foreground-secondary dark:text-foreground-secondary-dark"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors duration-200"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inventory-button-primary w-full flex items-center justify-center py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 animate-bounce-in"
          >
            {isLoading ? (
              <>
                <Loading />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-3" />
                Sign In
              </>
            )}
          </button>
        </div>

        {/* Demo Credentials */}
        {/* <div className="mt-6 p-4 notification-info rounded-lg animate-fade-in">
          <p className="text-sm font-medium text-info-800 dark:text-info-200 mb-2 text-center">
            Demo Account
          </p>
          <div className="text-sm text-info-700 dark:text-info-300 space-y-1 text-center">
            <p><strong>Email:</strong> admin@demo.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div> */}

        {/* Sign Up Link */}
        <div className="text-center mt-6 pt-4 border-t border-border dark:border-border-dark">
          <p className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
