'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  PRICE_RANGES,
} from '@/lib/utils/constants';

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    city: searchParams.get('city') || '',
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      type: searchParams.get('type') || '',
      status: searchParams.get('status') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      city: searchParams.get('city') || '',
    });
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Preserve sort if exists
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);

    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
    });
    router.push('/properties');
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b cursor-pointer lg:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </h3>
        <button className="lg:hidden">
          <svg
            className={`w-5 h-5 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {PROPERTY_STATUS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          {/* Quick price buttons */}
          <div className="flex flex-wrap gap-1 mt-2">
            {PRICE_RANGES.slice(1, 5).map((range) => (
              <button
                key={range.label}
                type="button"
                onClick={() => {
                  handleFilterChange('minPrice', range.min.toString());
                  handleFilterChange(
                    'maxPrice',
                    range.max === Infinity ? '' : range.max.toString()
                  );
                }}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleFilterChange('bedrooms', '')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filters.bedrooms === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Any
            </button>
            {BEDROOM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleFilterChange('bedrooms', opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filters.bedrooms === opt.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {opt.value === '0' ? 'Studio' : `${opt.value}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleFilterChange('bathrooms', '')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filters.bathrooms === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Any
            </button>
            {BATHROOM_OPTIONS.slice(0, 4).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleFilterChange('bathrooms', opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  filters.bathrooms === opt.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {opt.value}+
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            placeholder="Enter city name"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-2">
          <button
            onClick={applyFilters}
            className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Apply Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}