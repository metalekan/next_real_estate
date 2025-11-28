import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertiesContent from './PropertiesContent';

// Loading fallback component
function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Discover the perfect property from our exclusive collection of houses, apartments, and estates.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-12">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8 animate-pulse">
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="h-64 bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesContent />
      </Suspense>
      <Footer />
    </>
  );
}