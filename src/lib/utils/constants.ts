// Property types
export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
] as const;

// Property status
export const PROPERTY_STATUS = [
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
] as const;

// Property conditions
export const PROPERTY_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'needs-renovation', label: 'Needs Renovation' },
] as const;

// Common amenities
export const COMMON_AMENITIES = [
  'Air Conditioning',
  'Heating',
  'WiFi',
  'Parking',
  'Garage',
  'Pool',
  'Gym',
  'Garden',
  'Balcony',
  'Terrace',
  'Fireplace',
  'Storage',
  'Laundry',
  'Dishwasher',
  'Security System',
  'Pet Friendly',
  'Elevator',
  'Wheelchair Accessible',
  'Hardwood Floors',
  'Walk-in Closet',
] as const;

// User roles
export const USER_ROLES = [
  { value: 'user', label: 'User' },
  { value: 'agent', label: 'Agent' },
  { value: 'admin', label: 'Admin' },
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

// Price ranges
export const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under $100K', min: 0, max: 100000 },
  { label: '$100K - $250K', min: 100000, max: 250000 },
  { label: '$250K - $500K', min: 250000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: 'Over $1M', min: 1000000, max: Infinity },
] as const;

// Bedroom options
export const BEDROOM_OPTIONS = [
  { value: '0', label: 'Studio' },
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
] as const;

// Bathroom options
export const BATHROOM_OPTIONS = [
  { value: '1', label: '1 Bathroom' },
  { value: '1.5', label: '1.5 Bathrooms' },
  { value: '2', label: '2 Bathrooms' },
  { value: '2.5', label: '2.5 Bathrooms' },
  { value: '3', label: '3 Bathrooms' },
  { value: '3.5', label: '3.5 Bathrooms' },
  { value: '4', label: '4+ Bathrooms' },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Viewed' },
  { value: 'features.squareFeet', label: 'Size: Small to Large' },
  { value: '-features.squareFeet', label: 'Size: Large to Small' },
] as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  PROPERTIES: {
    BASE: '/api/properties',
    BY_ID: (id: string) => `/api/properties/${id}`,
    SEARCH: '/api/properties/search',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  UPLOAD: '/api/upload',
} as const;