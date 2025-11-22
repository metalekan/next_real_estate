import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['user', 'agent']).optional(),
});

export const ForgotPaswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// Property validation schemas
export const propertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial']),
  status: z.enum(['for-sale', 'for-rent', 'sold', 'rented']),
  condition: z.enum(['new', 'excellent', 'good', 'fair', 'needs-renovation']),
  price: z.number().min(0, 'Price cannot be negative'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    country: z.string().default('USA'),
    zipCode: z.string().min(3, 'Zip code is required'),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  features: z.object({
    bedrooms: z.number().min(0),
    bathrooms: z.number().min(0),
    squareFeet: z.number().min(0),
    lotSize: z.number().optional(),
    yearBuilt: z.number().optional(),
    parking: z.number().optional(),
    garage: z.boolean().optional(),
    pool: z.boolean().optional(),
    garden: z.boolean().optional(),
    balcony: z.boolean().optional(),
    furnished: z.boolean().optional(),
  }),
  images: z.array(
    z.object({
      url: z.string(),
      publicId: z.string(),
    })
  ).min(1, 'At least one image is required'),
  amenities: z.array(z.string()).optional(),
});

// Inquiry validation schema
export const inquirySchema = z.object({
  property: z.string().min(1, 'Property ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Validation helper function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path.join('.')] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}