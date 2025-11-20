'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/formatters';

interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  recentProperties: any[];
  recentInquiries: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0,
    recentProperties: [],
    recentInquiries: [],
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch properties
        const propertiesRes = await fetch('/api/properties/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const propertiesData = await propertiesRes.json();

        // Fetch inquiries
        const inquiriesRes = await fetch('/api/inquiries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const inquiriesData = await inquiriesRes.json();

        if (propertiesData.success) {
          const properties = propertiesData.data || [];
          const activeListings = properties.filter(
            (p: any) => p.status === 'for-sale' || p.status === 'for-rent'
          ).length;
          const totalViews = properties.reduce(
            (sum: number, p: any) => sum + (p.views || 0),
            0
          );

          setStats({
            totalProperties: properties.length,
            activeListings,
            totalViews,
            totalInquiries: inquiriesData.data?.length || 0,
            recentProperties: properties.slice(0, 5),
            recentInquiries: inquiriesData.data?.slice(0, 5) || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-blue-500',
      link: '/my-properties',
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      link: '/my-properties',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-purple-500',
      link: '/my-properties',
    },
    {
      title: 'Inquiries',
      value: stats.totalInquiries,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: 'bg-orange-500',
      link: '/inquiries',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
          >
            <div className={`inline-flex p-3 rounded-lg ${stat.color} text-white mb-4`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-600">{stat.title}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/my-properties/new"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </Link>
          <Link
            href="/properties"
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Properties
          </Link>
          <Link
            href="/inquiries"
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            View Inquiries
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Properties</h2>
              <Link
                href="/my-properties"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {stats.recentProperties.length > 0 ? (
              stats.recentProperties.map((property: any) => (
                <Link
                  key={property._id}
                  href={`/properties/${property._id}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {property.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.location?.city}, {property.location?.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      {formatPrice(property.price)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        property.status === 'for-sale'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'for-rent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {property.status === 'for-sale'
                        ? 'For Sale'
                        : property.status === 'for-rent'
                        ? 'For Rent'
                        : property.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No properties yet</p>
                <Link
                  href="/my-properties/new"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Add your first property
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Inquiries</h2>
              <Link
                href="/inquiries"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {stats.recentInquiries.length > 0 ? (
              stats.recentInquiries.map((inquiry: any) => (
                <div key={inquiry._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{inquiry.name}</p>
                      <p className="text-sm text-gray-500">{inquiry.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        inquiry.status === 'new'
                          ? 'bg-yellow-100 text-yellow-800'
                          : inquiry.status === 'read'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {inquiry.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No inquiries yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}