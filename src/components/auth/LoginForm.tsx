'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/utils/constants';

// Interface for Login specific data
interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function LoginForm() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    // NOTE: Usually, login validation doesn't check minimum length, 
    // it just ensures the field is not empty.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // API request to the LOGIN endpoint
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, formData);
      console.log(response.data.data);

      if (response.data.success) {
        // --- NOTE ON COOKIE AUTH ---
        // Since the server sets an HTTP-Only cookie, we DO NOT need to store
        // the token here. The browser handles the cookie automatically.
        // We only store the user object returned in the JSON body.
        
        // Store user data returned in the JSON body
        localStorage.setItem('user', JSON.stringify(response.data.data));

        // Redirect based on role
        if (response.data.data.role === 'agent') {
          router.push('/dashboard');
        } else {
          router.push('/properties');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data?.error) {
        // General API error (e.g., 'Invalid email or password')
        setApiError(error.response.data.error);
      } else if (error.response?.data?.errors) {
        // Handle field-specific validation errors from backend
        setErrors(error.response.data.errors);
      } else {
        setApiError('Login failed. Please check your credentials and try again.');
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
          <h2 className="text-4xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your real estate account</p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{apiError}</p>
          </div>
        )}

        {/* Login Form */}
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
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            // Tailwind primary colors are often in the blue-600 or indigo-600 range.
            // Adjust to your project's primary color definition.
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}