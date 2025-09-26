"use client"

import React from "react"
import { PlusCircle, MinusCircle, Lightbulb } from "lucide-react"
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

// Define the schema for a single skill item
const skillItemSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  proficiency: z.number().min(0).max(5).optional(), // 0-5 scale for UI, validation can be stricter on save
});

// Define the schema for the entire form (an array of skill items)
const skillsFormSchema = z.object({
  skills: z.array(skillItemSchema),
});

type SkillsFormValues = z.infer<typeof skillsFormSchema>;

interface SkillsFormProps {
  data: SkillItem[]; // Now directly receives data from global state
  onUpdate: (data: SkillItem[]) => void; // Called on every keystroke for real-time updates
  className?: string;
  navigationButtons: React.ReactNode;
}

export function SkillsForm({ data, onUpdate, className, navigationButtons }: SkillsFormProps) {
  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skills: data,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  // Ref to track if the current update originated from user input in this form
  const isInternalUpdateRef = React.useRef(false);

  // Effect to reset form when external 'data' prop changes
  React.useEffect(() => {
    // Only reset if the update is NOT internal (i.e., it's an external load/change)
    // And ensure the data is actually different to avoid unnecessary resets
    if (!isInternalUpdateRef.current) {
      const currentFormSkills = form.getValues().skills;
      if (JSON.stringify(currentFormSkills) !== JSON.stringify(data)) {
        form.reset({ skills: data });
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
        const watchedSkills = currentFormValues.skills || [];
        onUpdate(watchedSkills); // Propagate the change immediately
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const addSkill = () => {
    const newSkill = { name: "", proficiency: 0 };
    append(newSkill);
    onUpdate(form.getValues().skills || []); // Explicitly call onUpdate
  };

  const removeSkill = (index: number) => {
    remove(index);
    onUpdate(form.getValues().skills || []); // Explicitly call onUpdate
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 glow-text">
        <Lightbulb className="inline-block w-6 h-6 mr-2" /> Skills
      </h2>

      <Form {...form}>
        <form className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative p-4 border border-white/20 rounded-lg space-y-4 bg-white/5">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-6 bg-red-600/30 hover:bg-red-700/40 text-red-300 border-red-500/30"
                onClick={() => removeSkill(index)}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              <FormField
                control={form.control}
                name={`skills.${index}.name`}
                render={({ field: itemField }) => (
                  <Input
                    id={`skillName-${index}`}
                    label="Skill Name"
                    placeholder="UI Design"
                    {...itemField}
                  />
                )}
              />
              <div>
                <FormLabel className="block text-sm font-medium text-gray-300 mb-2">Proficiency (1-5)</FormLabel>
                <FormField
                  control={form.control}
                  name={`skills.${index}.proficiency`}
                  render={({ field: itemField }) => (
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={cn(
                            "size-6 rounded-full border border-white/30 transition-colors",
                            (itemField.value || 0) >= level ? "bg-purple-500" : "bg-white/10 hover:bg-white/20"
                          )}
                          onClick={() => itemField.onChange(level)}
                        />
                      ))}
                    </div>
                  )}
                />
                <FormMessage />
              </div>
            </div>
          ))}
        </form>
      </Form>

      <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10" onClick={addSkill}>
        <PlusCircle className="w-4 h-4 mr-2" /> Add Skill
      </Button>
      {navigationButtons}
    </div>
  );
}