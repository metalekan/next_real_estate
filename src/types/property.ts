export type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse' | 'land' | 'commercial';
export type PropertyStatus = 'for-sale' | 'for-rent' | 'sold' | 'rented';
export type PropertyCondition = 'new' | 'excellent' | 'good' | 'fair' | 'needs-renovation';

export interface ILocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IFeatures {
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  yearBuilt?: number;
  parking?: number;
  garage?: boolean;
  pool?: boolean;
  garden?: boolean;
  balcony?: boolean;
  furnished?: boolean;
}

// 💡 NEW INTERFACE: Defines the structure we save for each image
interface ImageAsset {
    url: string;
    publicId: string;
} 

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  condition: PropertyCondition;
  price: number;
  location: ILocation;
  features: IFeatures;
  images: ImageAsset[]; 
  amenities: string[];
  agentId: string; // User ID
  views: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyFilter {
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  state?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IPropertyResponse {
  properties: IProperty[];
  total: number;
  page: number;
  pages: number;
}