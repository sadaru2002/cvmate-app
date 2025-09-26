"use client"

import React from "react"
import { PlusCircle, MinusCircle, Award } from "lucide-react"
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

// Define the schema for a single certification item
const certificationItemSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  issuer: z.string().optional().or(z.literal('')),
  year: z.string().optional().or(z.literal('')),
});

// Define the schema for the entire form (an array of certification items)
const certificationsFormSchema = z.object({
  certifications: z.array(certificationItemSchema),
});

type CertificationsFormValues = z.infer<typeof certificationsFormSchema>;

interface CertificationsFormProps {
  data: CertificationItem[]; // Now directly receives data from global state
  onUpdate: (data: CertificationItem[]) => void; // Called on every keystroke for real-time updates
  className?: string;
  navigationButtons: React.ReactNode;
}

export function CertificationsForm({ data, onUpdate, className, navigationButtons }: CertificationsFormProps) {
  const form = useForm<CertificationsFormValues>({
    resolver: zodResolver(certificationsFormSchema),
    defaultValues: {
      certifications: data,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  // Ref to track if the current update originated from user input in this form
  const isInternalUpdateRef = React.useRef(false);

  // Effect to reset form when external 'data' prop changes
  React.useEffect(() => {
    // Only reset if the update is NOT internal (i.e., it's an external load/change)
    // And ensure the data is actually different to avoid unnecessary resets
    if (!isInternalUpdateRef.current) {
      const currentFormCertifications = form.getValues().certifications;
      if (JSON.stringify(currentFormCertifications) !== JSON.stringify(data)) {
        form.reset({ certifications: data });
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
        const watchedCertifications = currentFormValues.certifications || [];
        onUpdate(watchedCertifications); // Propagate the change immediately
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const addCertification = () => {
    append({ title: "", issuer: "", year: "" });
    onUpdate(form.getValues().certifications || []); // Explicitly call onUpdate
  };

  const removeCertification = (index: number) => {
    remove(index);
    onUpdate(form.getValues().certifications || []); // Explicitly call onUpdate
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 glow-text">
        <Award className="inline-block w-6 h-6 mr-2" /> Certifications
      </h2>

      <Form {...form}>
        <form className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative p-4 border border-white/20 rounded-lg space-y-4 bg-white/5">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-6 bg-red-600/30 hover:bg-red-700/40 text-red-300 border-red-500/30"
                onClick={() => removeCertification(index)}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              <FormField
                control={form.control}
                name={`certifications.${index}.title`}
                render={({ field: itemField }) => (
                  <Input
                    id={`certTitle-${index}`}
                    label="Certificate Title"
                    placeholder="UI UX Design Certificate"
                    {...itemField}
                  />
                )}
              />
              <FormField
                control={form.control}
                name={`certifications.${index}.issuer`}
                render={({ field: itemField }) => (
                  <Input
                    id={`certIssuer-${index}`}
                    label="Issuer"
                    placeholder="Time To Program"
                    {...itemField}
                  />
                )}
              />
              <FormField
                control={form.control}
                name={`certifications.${index}.year`}
                render={({ field: itemField }) => (
                  <Input
                    id={`certYear-${index}`}
                    label="Year"
                    placeholder="2022"
                    {...itemField}
                  />
                )}
              />
            </div>
          ))}
        </form>
      </Form>

      <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10" onClick={addCertification}>
        <PlusCircle className="w-4 h-4 mr-2" /> Add Certification
      </Button>
      {navigationButtons}
    </div>
  );
}