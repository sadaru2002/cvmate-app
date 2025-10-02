import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a Resume document
export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  thumbnailLink?: string;
  template?: string; // Re-added template field
  colorPalette?: string[]; // Re-added colorPalette field
  profileInfo?: {
    profilePreviewUrl?: string;
    profilePictureUrl?: string;
    fullName?: string;
    designation?: string;
    summary?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  workExperiences?: Array<{
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: Array<{
    name?: string;
    proficiency?: number; // Changed from progress to proficiency
  }>;
  projects?: Array<{
    title?: string;
    description?: string;
    github?: string;
    LiveDemo?: string;
  }>;
  certifications?: Array<{
    title?: string;
    issuer?: string;
    year?: string;
  }>;
  languages?: Array<{
    name?: string;
    proficiency?: number; // Changed from progress to proficiency
  }>;
  interests?: Array<{ name: string }>; // Changed to array of objects
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnailLink: {
      type: String,
    },
    template: {
      type: String,
    },
    colorPalette: {
      type: [String],
    },
    profileInfo: {
      profilePreviewUrl: String,
      profilePictureUrl: String,
      fullName: String,
      designation: String,
      summary: String,
    },
    contactInfo: {
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
    },
    workExperiences: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
      },
    ],
    skills: [
      {
        name: String,
        proficiency: Number, // Changed from progress to proficiency
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        github: String,
        LiveDemo: String,
      },
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        year: String,
      },
    ],
    languages: [
      {
        name: String,
        proficiency: Number, // Changed from progress to proficiency
      },
    ],
    interests: [{ name: String }], // Changed to array of objects with 'name'
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Export the Mongoose model. If the model already exists, use it; otherwise, create it.
const Resume = mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;