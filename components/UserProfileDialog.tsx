"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera } from "lucide-react"
import { toast } from "sonner" // Using sonner for simple toasts
import { useSession } from 'next-auth/react'; // Import useSession

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Define the schema for user profile validation
const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  profileImageUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

interface UserProfileDialogProps {
  initialData: UserProfileFormValues; // This will now be passed from Header, which gets it from session or local storage
  onSave: (data: UserProfileFormValues) => void;
  children: React.ReactNode; // To accept the trigger element
}

export function UserProfileDialog({ initialData, onSave, children }: UserProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, update: updateSession } = useSession(); // Get NextAuth session and update function

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: initialData,
    mode: "onChange", // Validate on change for better user experience
  });

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) { // Only reset when dialog is opened
      // Prioritize session data if available and more recent, otherwise use initialData
      const dataToUse = session?.user ? {
        name: session.user.name || initialData.name,
        email: session.user.email || initialData.email,
        profileImageUrl: session.user.image || initialData.profileImageUrl,
      } : initialData;
      form.reset(dataToUse);
    }
  }, [initialData, form, open, session]);

  const onSubmit = async (data: UserProfileFormValues) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // For Google users, token might not exist, but we still need to update the backend
      // The /api/auth/profile route should handle updates for both types of users.
      // If it's a Google user, the userId will come from the session in the verifyAuth middleware.

      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }), // Only add token if it exists
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        onSave(result.user); // Update parent component's state with new user data
        
        // Update local storage for email/password users
        if (token) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        // Update NextAuth session for Google users
        if (session?.user) {
          await updateSession({
            user: {
              ...session.user,
              name: result.user.name,
              email: result.user.email,
              image: result.user.profileImageUrl,
            },
          });
        }
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An unexpected error occurred during profile update.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // For Google users, token might not exist, but the backend verifyAuth will use the session.
      // So, we only add the token if it's present (for email/password users).

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }), // Only add token if it exists
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile image uploaded successfully!");
        form.setValue("profileImageUrl", result.profileImageUrl);
        onSave(result.user); // Update parent component's state with new user data
        
        // Update local storage for email/password users
        if (token) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        // Update NextAuth session for Google users
        if (session?.user) {
          await updateSession({
            user: {
              ...session.user,
              image: result.user.profileImageUrl,
            },
          });
        }
      } else {
        toast.error(result.message || "Failed to upload image.");
      }
    } catch (error: any) { // Explicitly type error as any to access message
      console.error("Image upload error:", error);
      toast.error(`An unexpected error occurred during image upload: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-panel-high-contrast">
        <DialogHeader>
          <DialogTitle className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-300">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative group">
                <Avatar className="size-28 border-2 border-white/30">
                  <AvatarImage src={form.watch("profileImageUrl") || undefined} alt="User Avatar" />
                  <AvatarFallback className="bg-white/10 text-white text-2xl">
                    {form.watch("name")?.split(' ').map(n => n[0]).join('') || 'JD'}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6" />
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      {...field}
                      disabled={loading || (session?.user?.email === field.value && session?.user?.image)} // Disable email edit for Google users
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="text-white border-white/20 hover:bg-white/10">
            Cancel
          </Button>
          <Button type="submit" variant="gradient-glow" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}