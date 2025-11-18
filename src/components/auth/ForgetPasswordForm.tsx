'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/utils/constants';

// Interface for Forgot Password specific data
interface ForgotPasswordFormData {
  email: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ForgotPasswordForm() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Client-side validation (only email required)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage(''); // Clear previous success messages

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // API request to the FORGOT_PASSWORD endpoint
      await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, formData);

      // On successful request (regardless of whether the email exists, for security)
      setSuccessMessage('A password reset link has been sent to your email address.');
      
      // Optionally, redirect after a short delay
      // setTimeout(() => router.push('/login'), 5000);

    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // NOTE: For security, it's best practice not to tell the user if the email
      // specifically does not exist. We show a generic success/error.
      if (error.response?.data?.error) {
        setApiError(error.response.data.error);
      } else {
        // Even on an error, we can sometimes show the success message to prevent
        // user enumeration attacks, but for this generic handler, we'll show an error.
        setApiError('Could not process your request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="text-gray-500 mt-2">Enter your email to receive a password reset link.</p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{apiError}</p>
          </div>
        )}
        
        {/* API Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
              disabled={!!successMessage} // Disable input after successful submission
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}