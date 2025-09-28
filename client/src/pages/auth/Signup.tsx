

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, UserPlus, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../utils/NotificationSystem';
import Loading from '../../utils/Loading';
import Error from '../../utils/ErrorProps';
import { setAuth } from '../../store/slices/authSlice';
import { type RegisterFormData, states, businessSizes, businessTypes, industries, planTypes, type InputFieldProps } from '../../types/types';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState<RegisterFormData>({
    role: 'user',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    state: '',
    business_name: '',
    business_type: '',
    website: '',
    business_size: '',
    industry: '',
    platform: 'web',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
          formData.password
        )
      ) {
        newErrors.password =
          'Password must include uppercase, lowercase, number, and special character';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    } else if (step === 2) {
      if (formData.business_name && !formData.business_type) {
        newErrors.business_type = 'Business type is required if business name is provided';
      }
      if (formData.website && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(formData.website)) {
        newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
      }
    } else if (step === 3) {
      if (!formData.platform) {
        newErrors.platform = 'Please select a plan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // console.log(`Input change: ${name}=${value}`); // Debug: Uncomment to track input changes
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          state: formData.state,
          business_name: formData.business_name,
          business_type: formData.business_type,
          website: formData.website,
          business_size: formData.business_size,
          industry: formData.industry,
          platform: formData.platform,
        }),
      });

      const result = await response.json();

    //   if (!response.ok) {
    //     throw new Error(result.message || 'Registration failed');
    //   }

      dispatch(setAuth({
        token: result.token,
        user: result.user,
      }));
      addNotification('Account created successfully! Redirecting to dashboard...', 'success');
      setTimeout(() => {
        navigate('/business/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setGeneralError(error.message || 'Network error. Please try again.');
      addNotification('Registration failed. Please check your details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setGeneralError(null);
  };

  const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    showToggle,
    onToggle,
    options,
  }) => {
    const inputId = `input-${name}`;
    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground dark:text-foreground-dark"
        >
          {label}
        </label>
        {options ? (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={isSubmitting}
            autoComplete={name === 'state' ? 'address-level1' : 'off'}
            className={`w-full inventory-input transition-all duration-300 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-foreground dark:text-foreground-dark focus:ring-2 ${
              error ? 'border-error-500 focus:ring-error-500 shake' : 'focus:ring-primary-500'
            }`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="relative">
            <input
              id={inputId}
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              disabled={isSubmitting}
              placeholder={placeholder}
              autoComplete={
                name === 'name' ? 'name' :
                name === 'email' ? 'email' :
                name === 'password' ? 'new-password' :
                name === 'confirmPassword' ? 'new-password' :
                name === 'phone' ? 'tel' :
                name === 'website' ? 'url' :
                name === 'business_name' ? 'organization' :
                'off'
              }
              className={`w-full inventory-input transition-all duration-300 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-foreground dark:text-foreground-dark focus:ring-2 ${
                showToggle ? 'pr-10' : ''
              } ${error ? 'border-error-500 focus:ring-error-500 shake' : 'focus:ring-primary-500'}`}
            />
            {showToggle && type === 'password' && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-primary-500 transition-colors duration-200"
                onClick={onToggle}
                disabled={isSubmitting}
              >
                {name === 'password' && showPassword || name === 'confirmPassword' && showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        )}
        {error && (
          <p className="text-xs text-error-500 dark:text-error-400 flex items-center mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  };

  if (isSubmitting) {
    return <Loading />;
  }

  if (generalError) {
    return <Error message={generalError} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-info-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl inventory-card p-6 rounded-2xl shadow-xl backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-0 hover:shadow-glow transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full mb-4 shadow-lg shadow-primary-500/40 hover:scale-105 transition-transform duration-300">
            <UserPlus className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 mb-2">
            Join Ojaflow
          </h1>
          <p className="text-sm text-foreground-muted dark:text-foreground-muted-dark font-sans">
            {currentStep === 1
              ? 'Enter your personal details'
              : currentStep === 2
              ? 'Add your business info'
              : 'Select your plan'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground-secondary dark:text-foreground-secondary-dark">
              Step {currentStep} of 3
            </span>
            <span className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
              {Math.round((currentStep / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300 ease-smooth"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form autoComplete="off" className="space-y-4">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="you@company.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="Create a strong password"
                  showToggle
                  onToggle={() => setShowPassword(!showPassword)}
                />
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  showToggle
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  placeholder="+234 123 456 7890"
                />
                <InputField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={errors.state}
                  options={states}
                />
              </div>
              <div className="p-4 bg-info-50/50 dark:bg-info-900/30 border border-info-200/50 dark:border-info-700/50 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-info-700 dark:text-info-300 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Password: 8+ characters, uppercase, lowercase, number, special character.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary-50/50 dark:bg-secondary-900/30 border border-secondary-200/50 dark:border-secondary-700/50 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-secondary-700 dark:text-secondary-300 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Business info is optional but helps us tailor your experience.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Business Name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  error={errors.business_name}
                  placeholder="Your business name"
                />
                <InputField
                  label="Business Type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  error={errors.business_type}
                  options={businessTypes}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  error={errors.website}
                  placeholder="https://your-website.com"
                />
                <InputField
                  label="Business Size"
                  name="business_size"
                  value={formData.business_size}
                  onChange={handleInputChange}
                  error={errors.business_size}
                  options={businessSizes}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  error={errors.industry}
                  options={industries}
                />
              </div>
            </div>
          )}

          {/* Step 3: Plan Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-info-50/50 dark:bg-info-900/30 border border-info-200/50 dark:border-info-700/50 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-info-700 dark:text-info-300 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Select a plan to start. You can change it later.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Subscription Plan"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  error={errors.platform}
                  options={planTypes}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inventory-button-secondary flex items-center justify-center py-2 px-6 text-sm font-semibold rounded-xl shadow-md hover:shadow-card-hover disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={currentStep < 3 ? handleNext : handleSubmit}
              disabled={isSubmitting}
              className="flex-1 inventory-button-primary py-2 text-base font-semibold rounded-xl shadow-md hover:shadow-glow hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 flex items-center justify-center"
            >
              {currentStep < 3 ? (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6 pt-4 border-t border-border/50 dark:border-border-dark/50">
            <p className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors duration-200"
              >
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 text-center text-xs text-foreground-muted dark:text-foreground-muted-dark">
        © 2025 Ojaflow. Secured with end-to-end encryption.
      </div>
    </div>
  );
};

export default Register;