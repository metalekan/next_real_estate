'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropertyForm from '@/components/properties/PropertyForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface EditPropertyPageProps {
  params: {
    id: string;
  };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      const data = await response.json();

      if (data.success) {
        // Check if the current user owns this property
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          
          // Only allow editing if the user is the agent who created it or an admin
          if (
            data.data.agentId?._id !== user.id &&
            data.data.agentId !== user.id &&
            user.role !== 'agent'
          ) {
            setError('You do not have permission to edit this property');
            setTimeout(() => router.push('/my-properties'), 2000);
            return;
          }
        }

        setProperty(data.data);
      } else {
        setError('Property not found');
        setTimeout(() => router.push('/my-properties'), 2000);
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
      setError('Failed to load property');
      setTimeout(() => router.push('/my-properties'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to My Properties...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="mt-2 text-gray-600">
            Update the details of your property listing
          </p>
        </div>

        <PropertyForm 
          mode="edit" 
          propertyId={params.id}
          initialData={{
            title: property.title,
            description: property.description,
            type: property.type,
            status: property.status,
            condition: property.condition,
            price: property.price,
            location: property.location,
            features: property.features,
            images: property.images,
            amenities: property.amenities,
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
