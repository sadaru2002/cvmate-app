"use client"

import React from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"
import { Input } from "@/components/inputs/Input"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Define the schema for contact info validation
const contactInfoSchema = z.object({
  location: z.string().optional().or(z.literal('')),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  website: z.string().url("Invalid website URL").optional().or(z.literal('')),
});

type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

interface ContactInfoFormProps {
  data: ContactInfoFormValues; // Now directly receives data from global state
  onUpdate: (data: ContactInfoFormValues) => void; // Called on every keystroke for real-time updates
  className?: string;
  navigationButtons: React.ReactNode;
}

export function ContactInfoForm({ data, onUpdate, className, navigationButtons }: ContactInfoFormProps) {
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: data,
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
        onUpdate(currentFormValues as ContactInfoFormValues); // Propagate the change immediately
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 glow-text">
        <Mail className="inline-block w-6 h-6 mr-2" /> Contact Information
      </h2>

      <Form {...form}>
        <form className="relative p-4 border border-white/20 rounded-lg space-y-4 bg-white/5">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <Input
                id="location"
                label="Address"
                placeholder="Short Address"
                {...field}
              />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input
                  id="email"
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <Input
                  id="phoneNumber"
                  label="Phone Number"
                  placeholder="9876543210"
                  type="tel"
                  {...field}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <Input
                  id="linkedin"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <Input
                  id="github"
                  label="GitHub"
                  placeholder="https://github.com/username"
                  type="url"
                  {...field}
                />
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <Input
                id="website"
                label="Portfolio / Website"
                placeholder="https://yourwebsite.com"
                type="url"
                {...field}
              />
            )}
          />
        </form>
      </Form>
      {navigationButtons}
    </div>
  );
}