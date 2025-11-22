'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyForm from '@/components/properties/PropertyForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NewPropertyPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      // const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!userStr) {
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        // Only agents and admins can create properties
        if (user.role === 'agent' || user.role === 'admin') {
          setIsAuthorized(true);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to list a new property
          </p>
        </div>

        <PropertyForm mode="create" />
      </main>

      <Footer />
    </div>
  );
}
