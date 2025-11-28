'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        // Fetch properties
        const propertiesRes = await fetch('/api/properties/my');
        const propertiesData = await propertiesRes.json();

        // Fetch inquiries
        const inquiriesRes = await fetch('/api/inquiries');
        const inquiries = await inquiriesRes.json();
        const inquiriesData = inquiries.inquiries;

        console.log(inquiriesData);

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
            totalInquiries: inquiriesData?.length || 0,
            recentProperties: properties.slice(0, 5),
            recentInquiries: inquiriesData?.slice(0, 5) || [],
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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/my-properties',
      change: '+12%',
      changePositive: true,
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/my-properties',
      change: '+8%',
      changePositive: true,
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/my-properties',
      change: '+23%',
      changePositive: true,
    },
    {
      title: 'Inquiries',
      value: stats.totalInquiries,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/inquiries',
      change: '+5%',
      changePositive: true,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in bg-gray-100 min-h-screen">
        <div className="h-10 bg-gray-200 rounded-lg w-96 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-xl mb-4" />
              <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 bg-gray-100 min-h-screen">
      {/* Welcome Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-primary-100 text-lg">
                Here's what's happening with your properties today
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="flex gap-3">
                <Link
                  href="/my-properties/new"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Property
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgLight} p-3 rounded-xl ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.changePositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600">{stat.title}</div>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
          </Link>
        ))}
      </div>

      {/* Quick Actions - Mobile */}
      <div className="lg:hidden bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/my-properties/new"
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
          >
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-semibold">Add Property</span>
          </Link>
          <Link
            href="/properties"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all border border-gray-200"
          >
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-semibold">Browse</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Properties</h2>
              <Link
                href="/my-properties"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentProperties.length > 0 ? (
              stats.recentProperties.map((property: any) => (
                <Link
                  key={property._id}
                  href={`/properties/${property._id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {property.images?.[0]?.url ? (
                      <Image
                        src={property.images[0].url}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {property.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {property.location?.city}, {property.location?.state}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-lg">
                      {formatPrice(property.price)}
                    </p>
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                        property.status === 'for-sale'
                          ? 'bg-green-100 text-green-700'
                          : property.status === 'for-rent'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
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
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium mb-2">No properties yet</p>
                <Link
                  href="/my-properties/new"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add your first property
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
              <Link
                href="/inquiries"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentInquiries.length > 0 ? (
              stats.recentInquiries.map((inquiry: any) => (
                <div key={inquiry._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                        {inquiry.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{inquiry.name}</p>
                        <p className="text-sm text-gray-500">{inquiry.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        inquiry.status === 'new'
                          ? 'bg-yellow-100 text-yellow-700'
                          : inquiry.status === 'read'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 ml-13">
                    {inquiry.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 ml-13">
                    {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">No inquiries yet</p>
                <p className="text-sm text-gray-500 mt-1">Inquiries will appear here when users contact you</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}