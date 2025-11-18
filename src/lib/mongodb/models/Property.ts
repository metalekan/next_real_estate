import mongoose, { Schema, Model } from 'mongoose';
import { IProperty } from '@/types/property';

type PropertyModel = Model<IProperty>;

const PropertySchema = new Schema<IProperty, PropertyModel>(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'],
    },
    status: {
      type: String,
      required: [true, 'Property status is required'],
      enum: ['for-sale', 'for-rent', 'sold', 'rented'],
      default: 'for-sale',
    },
    condition: {
      type: String,
      enum: ['new', 'excellent', 'good', 'fair', 'needs-renovation'],
      default: 'good',
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'USA',
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    features: {
      bedrooms: {
        type: Number,
        required: [true, 'Number of bedrooms is required'],
        min: [0, 'Bedrooms cannot be negative'],
      },
      bathrooms: {
        type: Number,
        required: [true, 'Number of bathrooms is required'],
        min: [0, 'Bathrooms cannot be negative'],
      },
      squareFeet: {
        type: Number,
        required: [true, 'Square feet is required'],
        min: [0, 'Square feet cannot be negative'],
      },
      lotSize: Number,
      yearBuilt: Number,
      parking: {
        type: Number,
        default: 0,
      },
      garage: {
        type: Boolean,
        default: false,
      },
      pool: {
        type: Boolean,
        default: false,
      },
      garden: {
        type: Boolean,
        default: false,
      },
      balcony: {
        type: Boolean,
        default: false,
      },
      furnished: {
        type: Boolean,
        default: false,
      },
    },
    images: {
      type: [{
        url: { type: String, required: true },
        publicId: { type: String, required: true }
    }],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent is required'],
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
PropertySchema.index({ status: 1, isActive: 1 });
PropertySchema.index({ 'location.city': 1, 'location.state': 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ agent: 1 });
PropertySchema.index({ createdAt: -1 });

// Text index for search functionality
PropertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.state': 'text',
});

// Prevent model recompilation in development
const Property = (mongoose.models.Property as PropertyModel) ||
  mongoose.model<IProperty, PropertyModel>('Property', PropertySchema);

export default Property;