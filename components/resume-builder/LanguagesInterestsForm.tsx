"use client"

import React from "react"
import { PlusCircle, MinusCircle, Languages, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/inputs/Input"
import { cn } from "@/lib/utils"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner" // Import toast for user feedback
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface LanguageItem {
  name?: string;
  proficiency?: number; // 1-5 scale
}

// Define the schema for a single language item
const languageItemSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  proficiency: z.number().min(0).max(5).optional(),
});

// Define the schema for a single interest item
interface InterestItem {
  name: string;
}
const interestItemSchema = z.object({
  name: z.string().min(1, "Interest cannot be empty"),
});

// Define the schema for the entire form (languages and interests)
const languagesInterestsFormSchema = z.object({
  languages: z.array(languageItemSchema),
  interests: z.array(interestItemSchema), // Now an array of objects
  newInterestInput: z.string().optional(), // Temporary field for adding new interest
});

type LanguagesInterestsFormValues = z.infer<typeof languagesInterestsFormSchema>;

interface LanguagesInterestsFormProps {
  languagesData: LanguageItem[]; // Now directly receives languages data from global state
  onUpdateLanguages: (data: LanguageItem[]) => void; // Called on every keystroke for real-time updates
  interestsData: InterestItem[]; // Now directly receives interests data from global state
  onUpdateInterests: (data: InterestItem[]) => void; // Called on every keystroke for real-time updates
  className?: string;
  navigationButtons: React.ReactNode;
}

export function LanguagesInterestsForm({
  languagesData,
  onUpdateLanguages,
  interestsData,
  onUpdateInterests,
  className,
  navigationButtons,
}: LanguagesInterestsFormProps) {
  const form = useForm<LanguagesInterestsFormValues>({
    resolver: zodResolver(languagesInterestsFormSchema),
    defaultValues: {
      languages: languagesData,
      // Map incoming string array to object array for default values
      interests: interestsData.map(item => ({ name: item.name })),
      newInterestInput: "", // Initialize temporary input
    },
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const { fields: interestFields, append: appendInterest, remove: removeInterest } = useFieldArray({
    control: form.control,
    name: "interests",
  });

  // Ref to track if the current update originated from user input in this form
  const isInternalUpdateRef = React.useRef(false);

  // Effect to reset form when external 'languagesData' or 'interestsData' props change
  React.useEffect(() => {
    // Only reset if the update is NOT internal (i.e., it's an external load/change)
    // And ensure the data is actually different to avoid unnecessary resets
    if (!isInternalUpdateRef.current) {
      const currentFormValues = form.getValues();
      const currentFormLanguages = currentFormValues.languages || [];
      const currentFormInterests = currentFormValues.interests || [];

      const hasLanguagesChanged = JSON.stringify(currentFormLanguages) !== JSON.stringify(languagesData);
      const hasInterestsChanged = JSON.stringify(currentFormInterests) !== JSON.stringify(interestsData.map(item => ({ name: item.name })));

      if (hasLanguagesChanged || hasInterestsChanged) {
        form.reset({
          languages: languagesData,
          interests: interestsData.map(item => ({ name: item.name })),
          newInterestInput: form.getValues("newInterestInput") || "", // Keep newInterestInput state
        });
      }
    }
    // Reset the flag after the render cycle, so the next external data change can trigger a reset
    isInternalUpdateRef.current = false; 
  }, [languagesData, interestsData, form]);

  // Effect to propagate internal 'languages' changes to the parent via onUpdateLanguages
  React.useEffect(() => {
    const subscription = form.watch((currentFormValues, { name, type }) => {
      // If the change is from user input (type 'change') and it's not an external reset
      if (type === 'change' && name && name.startsWith("languages")) {
        isInternalUpdateRef.current = true; // Flag that an internal update is happening
        const watchedLanguages = currentFormValues.languages || [];
        onUpdateLanguages(watchedLanguages);
      }
    }, { name: "languages" }); // Watch only 'languages'
    return () => subscription.unsubscribe();
  }, [form, onUpdateLanguages]);

  // Effect to propagate internal 'interests' changes to the parent via onUpdateInterests
  // This useEffect is now primarily for changes within existing interest fields,
  // but for append/remove, we'll call onUpdateInterests explicitly.
  React.useEffect(() => {
    const subscription = form.watch((currentFormValues, { name, type }) => {
      if (type === 'change' && name && name.startsWith("interests")) {
        isInternalUpdateRef.current = true;
        const watchedInterests = currentFormValues.interests || [];
        onUpdateInterests(watchedInterests);
      }
    }, { name: "interests" });
    return () => subscription.unsubscribe();
  }, [form, onUpdateInterests]);

  const handleAddLanguage = () => {
    appendLanguage({ name: "", proficiency: 0 });
    onUpdateLanguages(form.getValues().languages || []); // Explicitly call onUpdateLanguages
  };

  const handleRemoveLanguage = (index: number) => {
    removeLanguage(index);
    onUpdateLanguages(form.getValues().languages || []); // Explicitly call onUpdateLanguages
  };

  const handleAddInterest = () => {
    const newInterestValue = form.getValues("newInterestInput");
    
    const trimmedValue = newInterestValue?.trim();
    
    if (!trimmedValue) {
      toast.error("Please enter an interest to add."); // More prominent error for empty input
      return;
    }

    if (interestFields.some(item => item.name === trimmedValue)) { // Check against item.name
      toast.info("This interest already exists."); // Info for duplicate
      return;
    }
    
    appendInterest({ name: trimmedValue }); // Append an object with 'name' property
    form.setValue("newInterestInput", ""); // Clear the temporary input

    // Explicitly call onUpdateInterests after appending
    onUpdateInterests([...form.getValues("interests")]);
  };

  const handleRemoveInterest = (index: number) => {
    removeInterest(index);
    // Explicitly call onUpdateInterests after removing
    onUpdateInterests([...form.getValues("interests")]);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Languages Section */}
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 glow-text">
        <Languages className="inline-block w-6 h-6 mr-2" /> Languages
      </h2>

      <Form {...form}>
        <form className="space-y-6">
          {languageFields.map((field, index) => (
            <div key={field.id} className="relative p-4 border border-white/20 rounded-lg space-y-4 bg-white/5">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-6 bg-red-600/30 hover:bg-red-700/40 text-red-300 border-red-500/30"
                onClick={() => handleRemoveLanguage(index)}
                type="button"
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              <FormField
                control={form.control}
                name={`languages.${index}.name`}
                render={({ field: itemField }) => (
                  <Input
                    id={`languageName-${index}`}
                    label="Language"
                    placeholder="English"
                    {...itemField}
                  />
                )}
              />
              <div>
                <FormLabel className="block text-sm font-medium text-gray-300 mb-2">Proficiency (1-5)</FormLabel>
                <FormField
                  control={form.control}
                  name={`languages.${index}.proficiency`}
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

      <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10" onClick={handleAddLanguage} type="button">
        <PlusCircle className="w-4 h-4 mr-2" /> Add Language
      </Button>

      {/* Interests Section */}
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mt-10 mb-6 glow-text">
        <Heart className="inline-block w-6 h-6 mr-2" /> Interests
      </h2>

      <Form {...form}>
        <form className="space-y-4">
          {interestFields.map((field, index) => (
            <div key={field.id} className="relative p-3 border border-white/20 rounded-lg flex items-center justify-between bg-white/5">
              <span className="text-white">{field.name}</span> {/* Corrected to field.name */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="bg-red-600/30 hover:bg-red-700/40 text-red-300 border-red-500/30"
                onClick={() => handleRemoveInterest(index)}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <FormField
              control={form.control}
              name="newInterestInput" // Temporary field for adding new interest
              render={({ field }) => (
                <Input
                  id="newInterest"
                  label=""
                  placeholder="e.g. Reading"
                  className="flex-1"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Button type="button" variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={handleAddInterest}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Interest
            </Button>
          </div>
        </form>
      </Form>
      {navigationButtons}
    </div>
  );
}