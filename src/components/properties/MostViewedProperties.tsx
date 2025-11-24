'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';

export default function MostViewedProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMostViewed();
  }, []);

  const fetchMostViewed = async () => {
    try {
      const response = await fetch('/api/properties?sort=-views&limit=6');
      const data = await response.json();

      if (data.success) {
        setProperties(data.data.properties || []);
      }
    } catch (error) {
      console.error('Failed to fetch most viewed properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Most Viewed Properties
            </h2>
            <p className="text-gray-600 text-lg">
              Discover what others are looking at
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold text-sm mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Trending Now
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Most Viewed Properties
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the properties that are catching everyone's attention
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property, index) => (
            <div key={property._id} className="relative">
              {/* Ranking Badge */}
              {index < 3 && (
                <div className="absolute -top-3 -left-3 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    'bg-gradient-to-br from-orange-400 to-orange-600'
                  }`}>
                    #{index + 1}
                  </div>
                </div>
              )}
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All Properties
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
