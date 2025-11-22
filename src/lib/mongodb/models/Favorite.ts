import mongoose, { Schema, Model } from 'mongoose';

export interface IFavorite {
  _id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

type FavoriteModel = Model<IFavorite>;

const FavoriteSchema = new Schema<IFavorite, FavoriteModel>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    propertyId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Property',
      required: [true, 'Property ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure a user can only favorite a property once
FavoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

// Create indexes for better query performance
FavoriteSchema.index({ userId: 1 });
FavoriteSchema.index({ propertyId: 1 });
FavoriteSchema.index({ createdAt: -1 });

// Prevent model recompilation in development
const Favorite = (mongoose.models.Favorite as FavoriteModel) ||
  mongoose.model<IFavorite, FavoriteModel>('Favorite', FavoriteSchema);

export default Favorite;
