import { z } from "zod";

const profileInfoSchema = z.object({
  profilePreviewUrl: z.string().url().optional().or(z.literal('')),
  profilePictureUrl: z.string().url().optional().or(z.literal('')),
  fullName: z.string().optional().or(z.literal('')), // Allow empty string for initial creation
  designation: z.string().optional().or(z.literal('')), // Allow empty string for initial creation
  summary: z.string().optional().or(z.literal('')), // Allow empty string for initial creation
}).optional();

const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  website: z.string().url("Invalid website URL").optional().or(z.literal('')),
}).optional();

const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required").optional(),
  role: z.string().min(1, "Role is required").optional(),
  startDate: z.string().min(1, "Start date is required").optional(),
  endDate: z.string().optional().or(z.literal('')), // Can be empty for current job
  description: z.string().min(1, "Description is required").optional(),
}).optional();

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required").optional(),
  institution: z.string().min(1, "Institution is required").optional(),
  startDate: z.string().min(1, "Start date is required").optional(),
  endDate: z.string().optional().or(z.literal('')), // Can be empty for ongoing education
}).optional();

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").optional(),
  proficiency: z.number().min(1, "Proficiency must be at least 1").max(5, "Proficiency must be at most 5").optional(), // Changed from progress to proficiency, 1-5 scale
}).optional();

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required").optional(),
  description: z.string().min(1, "Project description is required").optional(),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  LiveDemo: z.string().url("Invalid Live Demo URL").optional().or(z.literal('')),
}).optional();

const certificationSchema = z.object({
  title: z.string().min(1, "Certification title is required").optional(),
  issuer: z.string().min(1, "Issuer is required").optional(),
  year: z.string().min(4).max(4, "Year must be 4 digits").optional(),
}).optional();

const languageSchema = z.object({
  name: z.string().min(1, "Language name is required").optional(),
  proficiency: z.number().min(1, "Proficiency must be at least 1").max(5, "Proficiency must be at most 5").optional(), // Changed from progress to proficiency, 1-5 scale
}).optional();

// New schema for an individual interest item
const interestItemSchema = z.object({
  name: z.string().min(1, "Interest name is required"),
});

// Main Resume Schema
export const resumeSchema = z.object({
  title: z.string().min(1, "Resume title is required"),
  thumbnailLink: z.string().url().optional().or(z.literal('')),
  template: z.string().optional(), // Re-added template field
  colorPalette: z.array(z.string()).optional(), // Re-added colorPalette field
  profileInfo: profileInfoSchema,
  contactInfo: contactInfoSchema,
  workExperiences: z.array(workExperienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  languages: z.array(languageSchema).optional(),
  interests: z.array(interestItemSchema).optional(), // Changed to array of objects
});

export type ResumeInput = z.infer<typeof resumeSchema>;