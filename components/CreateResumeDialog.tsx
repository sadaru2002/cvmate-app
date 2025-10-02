"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Check } from "lucide-react" // Added Check icon
import { toast } from "sonner"
import Image from "next/image" // Import Image component

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
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
// Import initialResumeData and availableTemplates for default values
import { initialResumeData, availableTemplates } from "@/hooks/use-resume-builder"

const formSchema = z.object({
  title: z.string().min(1, "Resume title is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateResumeDialogProps {
  onResumeCreated: () => void; // Callback to refresh dashboard after creation
  children: React.ReactNode; // The trigger element (e.g., a button or card)
}

export function CreateResumeDialog({ onResumeCreated, children }: CreateResumeDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Removed selectedTemplateId state, will default to initialResumeData.template

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Use the default template and color palette from initialResumeData
      const templateToUse = initialResumeData.template;
      const colorPaletteToUse = initialResumeData.colorPalette;

      // Construct the full resume data to send, merging the title with initialResumeData
      const fullResumeDataToSave = {
        ...initialResumeData, // Start with the full initial structure
        title: data.title, // Override the title with the user's input
        template: templateToUse, // Ensure template is set
        colorPalette: colorPaletteToUse, // Ensure color palette is set
        _id: undefined, // Ensure _id is not sent for new creation
        thumbnailLink: undefined, // Ensure thumbnailLink is not sent for new creation
      };

      const response = await api.post("/resumes", fullResumeDataToSave); // Send the full data
      toast.success("Resume created successfully!");
      setOpen(false); // Close the dialog
      form.reset(); // Clear form fields
      onResumeCreated(); // Refresh the dashboard list
      router.push(`/resume-builder?id=${response.resume._id}`); // Navigate to the new resume
    } catch (error: any) {
      console.error("Error creating resume:", error);
      // Removed redundant toast.error here, as axios interceptor handles it.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl glass-panel-high-contrast"> {/* Increased max-width */}
        <DialogHeader>
          <DialogTitle className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
            Create New Resume
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Give your resume a title to get started. A default template will be applied.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Removed Template Selection from here */}

            {/* Resume Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Resume Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: Mike's Resume"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="submit" variant="gradient-glow" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Resume"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}