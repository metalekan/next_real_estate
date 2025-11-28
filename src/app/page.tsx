'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MostViewedProperties from '@/components/properties/MostViewedProperties';

const heroImages = [
  'https://images.unsplash.com/photo-1630373389043-766e195ebd37?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1513880989635-6eb491ce7f5b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('buy');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Images Carousel */}
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Journey To Your Perfect Home
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let our expert team guide you through the magic of real estate and find exactly you'd like to invest, home, lease, buy or sell in the city
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('buy')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'buy'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'rent'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rent
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'sell'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sell
              </button>
            </div>

            {/* Search Form */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700">
                  <option>Select Property Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Villa</option>
                  <option>Land</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700">
                  <option>Select Location Point</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                  <option>Miami</option>
                  <option>San Francisco</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700">
                  <option>Select Price Point</option>
                  <option>$0 - $200k</option>
                  <option>$200k - $500k</option>
                  <option>$500k - $1M</option>
                  <option>$1M+</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <Link
              href="/properties"
              className="w-full block py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
            >
              Search
            </Link>

            {/* Popular Searches */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Popular Search:</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/properties?type=house"
                  className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors"
                >
                  Modern House
                </Link>
                <Link
                  href="/properties?type=apartment"
                  className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors"
                >
                  Studio Apartment
                </Link>
                <Link
                  href="/properties?location=countryside"
                  className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors"
                >
                  Countryside
                </Link>
                <Link
                  href="/properties?type=land"
                  className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors"
                >
                  Farmland House
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Statistics Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Stats */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Trusted Real<br />Estate Advisors
              </h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-gray-900 mb-2">17K+</div>
                  <div className="text-gray-600 font-medium">Satisfied Customers</div>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-white mb-2">25+</div>
                  <div className="text-white/80 font-medium">Year of Experience</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-gray-900 mb-2">150+</div>
                  <div className="text-gray-600 font-medium">Award Winning</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-gray-900 mb-2">25+</div>
                  <div className="text-gray-600 font-medium">Property Collections</div>
                </div>
              </div>
            </div>

            {/* Right Side - Trust Statement & Image */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A cutting-edge real estate agent that offers a seamless and immersive experience for finding your dream home in the heart of the city.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We have with a deep understanding of the ever-evolving landscape of the real estate market and become a trusted partner for thousands of satisfied clients.
                </p>
              </div>
              
              {/* Trust Image */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/trust-house.jpg"
                  alt="Modern house"
                  className="w-full h-full object-cover"
                />
                {/* Circular Badge */}
                <div className="absolute bottom-6 left-6 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Viewed Properties Section */}
      <MostViewedProperties />

      <Footer />
    </div>
  );
}