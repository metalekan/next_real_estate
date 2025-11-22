import mongoose, { Schema, Model } from 'mongoose';

export interface IInquiry {
  _id: string;
  property: string; // Property ID
  user: string; // User ID
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

type InquiryModel = Model<IInquiry>;

const InquirySchema = new Schema<IInquiry, InquiryModel>(
  {
    property: {
      type: Schema.Types.ObjectId as any,
      ref: 'Property',
      required: [true, 'Property reference is required'],
    },
    user: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
InquirySchema.index({ property: 1 });
InquirySchema.index({ user: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ createdAt: -1 });

// Prevent model recompilation in development
const Inquiry = (mongoose.models.Inquiry as InquiryModel) ||
  mongoose.model<IInquiry, InquiryModel>('Inquiry', InquirySchema);

export default Inquiry;