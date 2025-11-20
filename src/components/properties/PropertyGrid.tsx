'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { IProperty } from '@/types/property';

interface PropertyGridProps {
  initialProperties?: IProperty[];
  showPagination?: boolean;
  limit?: number;
}

export default function PropertyGrid({
  initialProperties,
  showPagination = true,
  limit = 12,
}: PropertyGridProps) {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<IProperty[]>(initialProperties || []);
  const [loading, setLoading] = useState(!initialProperties);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    pages: 0,
  });

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const response = await fetch(`/api/properties?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setProperties(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialProperties) {
      fetchProperties();
    }
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    fetchProperties(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchProperties(pagination.page)}
          className="mt-2 text-red-700 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          No properties found
        </h3>
        <p className="mt-1 text-gray-500">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{properties.length}</span> of{' '}
          <span className="font-semibold">{pagination.total}</span> properties
        </p>
      </div>

      {/* Properties grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1;
              // Show first, last, and pages around current
              if (
                page === 1 ||
                page === pagination.pages ||
                (page >= pagination.page - 1 && page <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      page === pagination.page
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === pagination.page - 2 ||
                page === pagination.page + 2
              ) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}