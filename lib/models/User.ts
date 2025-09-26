import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a User document
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Made optional for Google OAuth users
  image?: string; // For profile pictures from OAuth
  provider?: 'email' | 'google'; // To track authentication method
  emailVerified?: Date; // For email verification status
  lastLogin?: Date; // New field to track last login
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false }, // Made optional for Google OAuth users
    image: { type: String, required: false }, // For profile pictures from OAuth
    provider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email'
    },
    emailVerified: {
      type: Date,
      required: false
    },
    lastLogin: { // New field
      type: Date,
      required: false
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Export the Mongoose model. If the model already exists, use it; otherwise, create it.
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;