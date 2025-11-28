'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/formatters';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: {
    city: string;
    state: string;
  };
  images?: Array<{ url: string }>;
}

interface Inquiry {
  _id: string;
  property: Property;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [inquiries, selectedStatus, searchQuery]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      const data = await response.json();

      console.log(data);
      
      if (response.ok) {
        setInquiries(data.inquiries || []);
      } else {
        console.error('Failed to fetch inquiries:', data.error);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInquiries = () => {
    let filtered = [...inquiries];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        inquiry =>
          inquiry.name.toLowerCase().includes(query) ||
          inquiry.email.toLowerCase().includes(query) ||
          inquiry.property?.title?.toLowerCase().includes(query)
      );
    }

    setFilteredInquiries(filtered);
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    setUpdatingStatus(inquiryId);
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setInquiries(prevInquiries =>
          prevInquiries.map(inquiry =>
            inquiry._id === inquiryId
              ? { ...inquiry, status: newStatus as 'pending' | 'contacted' | 'closed' }
              : inquiry
          )
        );
      } else {
        console.error('Failed to update inquiry status');
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'closed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statusCounts = {
    all: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-12" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-screen-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
            <p className="text-gray-600 mt-1">Manage property inquiries from potential clients</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'All', value: statusCounts.all, status: 'all', color: 'from-gray-500 to-gray-600' },
            { label: 'Pending', value: statusCounts.pending, status: 'pending', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Contacted', value: statusCounts.contacted, status: 'contacted', color: 'from-blue-500 to-blue-600' },
            { label: 'Closed', value: statusCounts.closed, status: 'closed', color: 'from-green-500 to-green-600' },
          ].map((stat) => (
            <button
              key={stat.status}
              onClick={() => setSelectedStatus(stat.status)}
              className={`bg-white rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 hover:shadow-lg ${
                selectedStatus === stat.status ? 'ring-2 ring-primary-500 shadow-lg' : 'shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                {selectedStatus === stat.status && (
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <div className={`h-1 mt-3 rounded-full bg-gradient-to-r ${stat.color}`} />
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredInquiries.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Property Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {inquiry.property?.images?.[0]?.url ? (
                          <Image
                            src={inquiry.property.images[0].url}
                            alt={inquiry.property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/properties/${inquiry.property?._id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {inquiry.property?.title || 'Property'}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {inquiry.property?.location?.city}, {inquiry.property?.location?.state}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {formatPrice(inquiry.property?.price || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {inquiry.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{inquiry.name}</p>
                          <p className="text-sm text-gray-500 truncate">{inquiry.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{inquiry.phone}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                        {inquiry.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateInquiryStatus(inquiry._id, e.target.value)}
                        disabled={updatingStatus === inquiry._id}
                        className={`px-4 py-2 rounded-lg border font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusBadgeClass(
                          inquiry.status
                        )} ${updatingStatus === inquiry._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <div className="flex gap-2">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </a>
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Call"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || selectedStatus !== 'all' ? 'No inquiries found' : 'No inquiries yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Inquiries from potential clients will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
