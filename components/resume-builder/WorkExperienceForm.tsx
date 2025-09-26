"use client"

import React from "react"
import { PlusCircle, MinusCircle, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/inputs/Input"
import { Textarea } from "@/components/ui/textarea"
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

// Define the schema for a single work experience item
const workExperienceItemSchema = z.object({
  company: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

// Define the schema for the entire form (an array of work experience items)
const workExperienceFormSchema = z.object({
  workExperiences: z.array(workExperienceItemSchema),
});

type WorkExperienceFormValues = z.infer<typeof workExperienceFormSchema>;

interface WorkExperienceFormProps {
  data: WorkExperienceItem[]; // Now directly receives data from global state
  onUpdate: (data: WorkExperienceItem[]) => void; // Called on every keystroke for real-time updates
  className?: string;
  navigationButtons: React.ReactNode;
}

export function WorkExperienceForm({ data, onUpdate, className, navigationButtons }: WorkExperienceFormProps) {
  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceFormSchema),
    defaultValues: {
      workExperiences: data,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  // Ref to track if the current update originated from user input in this form
  const isInternalUpdateRef = React.useRef(false);

  // Effect to reset form when external 'data' prop changes
  React.useEffect(() => {
    // Only reset if the update is NOT internal (i.e., it's an external load/change)
    // And ensure the data is actually different to avoid unnecessary resets
    if (!isInternalUpdateRef.current) {
      const currentFormExperiences = form.getValues().workExperiences;
      if (JSON.stringify(currentFormExperiences) !== JSON.stringify(data)) {
        form.reset({ workExperiences: data });
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
        const watchedExperiences = currentFormValues.workExperiences || [];
        onUpdate(watchedExperiences); // Propagate the change immediately
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const addExperience = () => {
    append({ company: "", role: "", startDate: "", endDate: "", description: "" });
    onUpdate(form.getValues().workExperiences || []); // Explicitly call onUpdate
  };

  const removeExperience = (index: number) => {
    remove(index);
    onUpdate(form.getValues().workExperiences || []); // Explicitly call onUpdate
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 glow-text">
        <Briefcase className="inline-block w-6 h-6 mr-2" /> Work Experience
      </h2>

      <Form {...form}>
        <form className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative p-4 border border-white/20 rounded-lg space-y-4 bg-white/5">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-6 bg-red-600/30 hover:bg-red-700/40 text-red-300 border-red-500/30"
                onClick={() => removeExperience(index)}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              <FormField
                control={form.control}
                name={`workExperiences.${index}.company`}
                render={({ field: itemField }) => (
                  <Input
                    id={`company-${index}`}
                    label="Company"
                    placeholder="ABC Corp"
                    {...itemField}
                    value={itemField.value || ""}
                    onChange={(e) => itemField.onChange(e)}
                  />
                )}
              />
              <FormField
                control={form.control}
                name={`workExperiences.${index}.role`}
                render={({ field: itemField }) => (
                  <Input
                    id={`role-${index}`}
                    label="Role"
                    placeholder="Frontend Developer"
                    {...itemField}
                    value={itemField.value || ""}
                    onChange={(e) => itemField.onChange(e)}
                  />
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.startDate`}
                  render={({ field: itemField }) => (
                    <Input
                      id={`startDate-${index}`}
                      label="Start Date"
                      placeholder="Jan 2020"
                      {...itemField}
                      value={itemField.value || ""}
                      onChange={(e) => itemField.onChange(e)}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.endDate`}
                  render={({ field: itemField }) => (
                    <Input
                      id={`endDate-${index}`}
                      label="End Date"
                      placeholder="Present / Apr 2023"
                      {...itemField}
                      value={itemField.value || ""}
                      onChange={(e) => itemField.onChange(e)}
                    />
                  )}
                />
              </div>
              <div>
                <FormLabel htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </FormLabel>
                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.description`}
                  render={({ field: itemField }) => (
                    <Textarea
                      id={`description-${index}`}
                      placeholder="What did you do in this role?"
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                      {...itemField}
                      value={itemField.value || ""}
                      onChange={(e) => itemField.onChange(e)}
                    />
                  )}
                />
                <FormMessage />
              </div>
            </div>
          ))}
        </form>
      </Form>

      <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10" onClick={addExperience}>
        <PlusCircle className="w-4 h-4 mr-2" /> Add Work Experience
      </Button>
      {navigationButtons}
    </div>
  );
}