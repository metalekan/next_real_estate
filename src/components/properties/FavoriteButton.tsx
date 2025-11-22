'use client';

import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({
  propertyId,
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!userData);

    if (userData) {
      checkFavoriteStatus();
    }
  }, [propertyId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/check/${propertyId}`);

      const data = await response.json();
      if (data.success) {
        setIsFavorited(data.data.isFavorited);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in to save favorites');
      return;
    }

    setLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?propertyId=${propertyId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          setIsFavorited(false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ propertyId }),
        });

        const data = await response.json();
        if (data.success) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show button if not authenticated
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-all ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${showLabel ? 'px-4 w-auto gap-2' : ''}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={iconSizes[size]}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ color: isFavorited ? '#ef4444' : '#6b7280' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">
          {isFavorited ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
