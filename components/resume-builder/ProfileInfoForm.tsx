"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ProfilePhotoSelector } from "@/components/inputs/ProfilePhotoSelector"
import { Input } from "@/components/inputs/Input"

// Define the schema for profile info validation
const profileInfoSchema = z.object({
  profilePictureUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  fullName: z.string().optional().or(z.literal('')),
  designation: z.string().optional().or(z.literal('')),
  summary: z.string().optional().or(z.literal('')),
});

type ProfileInfoFormValues = z.infer<typeof profileInfoSchema>;

interface ProfileInfoFormProps {
  data: ProfileInfoFormValues; // Now directly receives data from global state
  onUpdate: (data: ProfileInfoFormValues) => void; // Called on every keystroke for real-time updates
  className?: string;
  navigationButtons: React.ReactNode;
}

export function ProfileInfoForm({ data, onUpdate, className, navigationButtons }: ProfileInfoFormProps) {
  const form = useForm<ProfileInfoFormValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: data, // Set default values from the 'data' prop
  });

  // Ref to track if the current update originated from user input in this form
  const isInternalUpdateRef = React.useRef(false);

  // Effect to reset form when external 'data' prop changes
  React.useEffect(() => {
    // Only reset if the update is NOT internal (i.e., it's an external load/change)
    // And ensure the data is actually different to avoid unnecessary resets
    if (!isInternalUpdateRef.current) {
      const currentFormValues = form.getValues();
      if (JSON.stringify(currentFormValues) !== JSON.stringify(data)) {
        form.reset(data);
      }
    }
    // Reset the flag after the render cycle, so the next external data change can trigger a reset
    isInternalUpdateRef.current = false; 
  }, [data, form]);

  // Effect to propagate internal form changes to the parent via onUpdate
  React.useEffect(() => {
    const subscription = form.watch((currentFormValues, { name, type }) => {
      // If the change is from user input (type 'change') and it's not an external reset
      if (type === 'change' && name) {
        isInternalUpdateRef.current = true; // Flag that an internal update is happening
        onUpdate(currentFormValues as ProfileInfoFormValues); // Propagate the change immediately
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      console.log("🔄 Starting image upload...");
      const token = localStorage.getItem('token');
      // For Google users, token might not exist, but the backend verifyAuth will use the session.
      // So, we only add the token if it's present (for email/password users).

      const formData = new FormData();
      formData.append('image', file);

      console.log("📤 Making upload request...");
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }), // Only add token if it exists
        },
        body: formData,
      });

      console.log("📥 Upload response status:", response.status);
      const result = await response.json();
      console.log("📥 Upload response data:", result);

      if (response.ok) {
        console.log("✅ Upload successful, returning URL:", result.profileImageUrl);
        return result.profileImageUrl;
      } else {
        console.log("❌ Upload failed:", result);
        return null;
      }
    } catch (error: any) {
      console.error("💥 Image upload error:", error);
      return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 glow-text">
        Personal Information
      </h2>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem className="flex justify-center">
                <FormControl>
                  <ProfilePhotoSelector
                    image={field.value}
                    setImage={field.onChange}
                    preview={field.value}
                    setPreview={field.onChange}
                    onUpload={handleImageUpload}
                    fullName={form.watch("fullName")}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <Input
                  id="fullName"
                  label="Full Name"
                  placeholder="John Doe"
                  type="text"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <Input
                  id="designation"
                  label="Designation"
                  placeholder="UI UX Designer"
                  type="text"
                  {...field}
                />
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Short Introduction"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {navigationButtons}
    </div>
  );
}