"use client"

import React from "react"
import { PlusCircle, MinusCircle, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/inputs/Input"
import { cn } from "@/lib/utils"
import { useForm, useFieldArray } from "react-hook-form"
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

// Define the schema for a single education item
const educationItemSchema = z.object({
  degree: z.string().optional().or(z.literal('')),
  institution: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
});

// Define the schema for the entire form (an array of education items)
const educationFormSchema = z.object({
  education: z.array(educationItemSchema),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

interface EducationFormProps {
  data: EducationItem[]; // Now directly receives data from global state
  onUpdate: (data: EducationItem[]) => void; // Called on every keystroke for real-time updates
  className?: string;
  navigationButtons: React.ReactNode;
}

export function EducationForm({ data, onUpdate, className, navigationButtons }: EducationFormProps) {
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      education: data,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  // Ref to track if the current update originated from user input in this form
  const isInternalUpdateRef = React.useRef(false);

  // Effect to reset form when external 'data' prop changes
  React.useEffect(() => {
    // Only reset if the update is NOT internal (i.e., it's an external load/change)
    // And ensure the data is actually different to avoid unnecessary resets
    if (!isInternalUpdateRef.current) {
      const currentFormEducation = form.getValues().education;
      if (JSON.stringify(currentFormEducation) !== JSON.stringify(data)) {
        form.reset({ education: data });
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
        const watchedEducation = currentFormValues.education || [];
        onUpdate(watchedEducation); // Propagate the change immediately
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const addEducation = () => {
    append({ degree: "", institution: "", startDate: "", endDate: "" });
    onUpdate(form.getValues().education || []); // Explicitly call onUpdate
  };

  const removeEducation = (index: number) => {
    remove(index);
    onUpdate(form.getValues().education || []); // Explicitly call onUpdate
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 glow-text">
        <GraduationCap className="inline-block w-6 h-6 mr-2" /> Education
      </h2>

      <Form {...form}>
        <form className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative p-4 border border-white/20 rounded-lg space-y-4 bg-white/5">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-6 bg-red-600/30 hover:bg-red-700/40 text-red-300 border-red-500/30"
                onClick={() => removeEducation(index)}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field: itemField }) => (
                  <Input
                    id={`degree-${index}`}
                    label="Degree"
                    placeholder="Bachelor of Design"
                    {...itemField}
                  />
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.institution`}
                render={({ field: itemField }) => (
                  <Input
                    id={`institution-${index}`}
                    label="Institution"
                    placeholder="Art & Design University"
                    {...itemField}
                  />
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`education.${index}.startDate`}
                  render={({ field: itemField }) => (
                    <Input
                      id={`eduStartDate-${index}`}
                      label="Start Date"
                      placeholder="Sep 2015"
                      {...itemField}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.endDate`}
                  render={({ field: itemField }) => (
                    <Input
                      id={`eduEndDate-${index}`}
                      label="End Date"
                      placeholder="May 2019"
                      {...itemField}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </form>
      </Form>

      <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10" onClick={addEducation}>
        <PlusCircle className="w-4 h-4 mr-2" /> Add Education
      </Button>
      {navigationButtons}
    </div>
  );
}