'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  PROPERTY_CONDITIONS,
  COMMON_AMENITIES,
} from '@/lib/utils/constants';

interface PropertyFormData {
  title: string;
  description: string;
  type: string;
  status: string;
  condition: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    lotSize: number;
    yearBuilt: number;
    parking: number;
    garage: boolean;
    pool: boolean;
    garden: boolean;
    balcony: boolean;
    furnished: boolean;
  };
  images: { url: string; publicId: string }[];
  amenities: string[];
}

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  propertyId?: string;
  mode: 'create' | 'edit';
}

export default function PropertyForm({
  initialData,
  propertyId,
  mode,
}: PropertyFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'house',
    status: initialData?.status || 'for-sale',
    condition: initialData?.condition || 'good',
    price: initialData?.price || 0,
    location: {
      address: initialData?.location?.address || '',
      city: initialData?.location?.city || '',
      state: initialData?.location?.state || '',
      country: initialData?.location?.country || 'USA',
      zipCode: initialData?.location?.zipCode || '',
    },
    features: {
      bedrooms: initialData?.features?.bedrooms || 0,
      bathrooms: initialData?.features?.bathrooms || 0,
      squareFeet: initialData?.features?.squareFeet || 0,
      lotSize: initialData?.features?.lotSize || 0,
      yearBuilt: initialData?.features?.yearBuilt || new Date().getFullYear(),
      parking: initialData?.features?.parking || 0,
      garage: initialData?.features?.garage || false,
      pool: initialData?.features?.pool || false,
      garden: initialData?.features?.garden || false,
      balcony: initialData?.features?.balcony || false,
      furnished: initialData?.features?.furnished || false,
    },
    images: initialData?.images || [],
    amenities: initialData?.amenities || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.location.address) {
      newErrors['location.address'] = 'Address is required';
    }
    if (!formData.location.city) {
      newErrors['location.city'] = 'City is required';
    }
    if (!formData.location.state) {
      newErrors['location.state'] = 'State is required';
    }
    if (!formData.location.zipCode) {
      newErrors['location.zipCode'] = 'Zip code is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const url =
        mode === 'create'
          ? '/api/properties'
          : `/api/properties/${propertyId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/my-properties');
      } else {
        setErrors({ submit: result.error || 'Failed to save property' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Images Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Property Images</h2>
        <ImageUpload
          images={formData.images}
          onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
          maxImages={10}
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-2">{errors.images}</p>
        )}
      </div>

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Beautiful 3-Bedroom Family Home"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the property in detail..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {PROPERTY_STATUS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {PROPERTY_CONDITIONS.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="500000"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['location.address'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main Street"
            />
            {errors['location.address'] && (
              <p className="text-red-500 text-sm mt-1">
                {errors['location.address']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['location.city'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['location.state'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="NY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code *
            </label>
            <input
              type="text"
              name="location.zipCode"
              value={formData.location.zipCode}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['location.zipCode'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="USA"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              name="features.bedrooms"
              value={formData.features.bedrooms}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              name="features.bathrooms"
              value={formData.features.bathrooms}
              onChange={handleChange}
              min="0"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Square Feet
            </label>
            <input
              type="number"
              name="features.squareFeet"
              value={formData.features.squareFeet}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lot Size (sqft)
            </label>
            <input
              type="number"
              name="features.lotSize"
              value={formData.features.lotSize}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <input
              type="number"
              name="features.yearBuilt"
              value={formData.features.yearBuilt}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parking Spaces
            </label>
            <input
              type="number"
              name="features.parking"
              value={formData.features.parking}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Boolean Features */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'features.garage', label: 'Garage' },
            { name: 'features.pool', label: 'Pool' },
            { name: 'features.garden', label: 'Garden' },
            { name: 'features.balcony', label: 'Balcony' },
            { name: 'features.furnished', label: 'Furnished' },
          ].map((feature) => (
            <label key={feature.name} className="flex items-center">
              <input
                type="checkbox"
                name={feature.name}
                checked={
                  (formData.features as any)[feature.name.split('.')[1]]
                }
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {COMMON_AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Property'
            : 'Update Property'}
        </button>
      </div>
    </form>
  );
}