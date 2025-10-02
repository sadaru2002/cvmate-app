"use client"

import React, { useState, useEffect } from "react"
import { Camera, Crop } from "lucide-react" // Import Crop icon
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ImageCropperDialog } from "@/components/ImageCropperDialog"
import { dataURLtoFile } from "@/lib/utils"
import { useSession } from 'next-auth/react'; // Import useSession

interface ProfilePhotoSelectorProps {
  image?: string | null; // Current image URL
  setImage: (value: string | null) => void; // Callback to update image URL
  preview?: string; // Current preview URL (can be same as image)
  setPreview: (value: string | null) => void; // Callback to update preview URL
  onUpload?: (file: File) => Promise<string | null>; // Optional upload handler
  fullName?: string; // For avatar fallback
  disabled?: boolean;
}

export function ProfilePhotoSelector({
  image,
  setImage,
  preview,
  setPreview,
  onUpload,
  fullName,
  disabled = false,
}: ProfilePhotoSelectorProps) {
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [fileName, setFileName] = useState<string>("profile_picture.jpg"); // To keep track of original file name
  const { data: session, update: updateSession } = useSession(); // Get NextAuth session and update function

  // Use session image as initial image if available and no local image is set
  useEffect(() => {
    if (session?.user?.image && !image && !preview) {
      setImage(session.user.image);
      setPreview(session.user.image);
    }
  }, [session, image, preview, setImage, setPreview]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("📝 ProfilePhotoSelector: No file selected.");
      return;
    }
    console.log("📝 ProfilePhotoSelector: File selected:", file.name);
    setFileName(file.name); // Store file name

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageToCrop(result); // Set image for cropper
      setCropperOpen(true); // Open cropper dialog
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (croppedDataUrl: string) => {
    console.log("📝 ProfilePhotoSelector: Cropped image received from dialog.");
    setPreview(croppedDataUrl); // Update immediate preview with cropped image

    if (onUpload) {
      // Convert cropped Data URL to File object
      const croppedFile = dataURLtoFile(croppedDataUrl, fileName);
      try {
        const uploadedUrl = await onUpload(croppedFile);
        if (uploadedUrl) {
          console.log("📝 ProfilePhotoSelector: Upload successful, setting image to:", uploadedUrl);
          setImage(uploadedUrl);
          setPreview(uploadedUrl); // Ensure preview is the final uploaded URL
          toast.success("Profile image uploaded successfully!");
          // Update NextAuth session if user is logged in via Google
          if (session?.user) {
            await updateSession({
              user: {
                ...session.user,
                image: uploadedUrl,
              },
            });
          }
        } else {
          toast.error("Failed to upload image.");
          console.error("📝 ProfilePhotoSelector: Upload handler returned null/failed.");
        }
      } catch (error) {
        console.error("📝 ProfilePhotoSelector: Error during onUpload with cropped image:", error);
        toast.error("An error occurred during image upload.");
      }
    } else {
      // If no upload handler, just update the image state with the cropped data URL
      setImage(croppedDataUrl);
      toast.success("Profile image updated locally!");
    }
    setImageToCrop(null); // Clear image from cropper state
    setCropperOpen(false); // Close cropper dialog
  };

  const handleCropperClose = () => {
    setCropperOpen(false);
    setImageToCrop(null); // Clear image from cropper state if cancelled
  };

  const handleRecropExistingImage = () => {
    if (preview || image) {
      setImageToCrop(preview || image); // Use current preview or image for re-cropping
      setCropperOpen(true);
    } else {
      toast.info("No image to re-crop. Please upload one first.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="relative group">
        <Avatar className="size-28 border-2 border-white/30">
          <AvatarImage src={preview || image || session?.user?.image || "/placeholder-user.jpg"} alt="User Avatar" />
          <AvatarFallback className="bg-white/10 text-white text-2xl">
            {fullName?.split(' ').map(n => n[0]).join('') || 'JD'}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <Camera className="w-6 h-6" />
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
          {(preview || image || session?.user?.image) && ( // Show crop button only if an image is present
            <button
              type="button"
              onClick={handleRecropExistingImage}
              disabled={disabled}
              className="cursor-pointer p-2 rounded-full hover:bg-white/20 transition-colors ml-2"
              title="Reposition/Crop Image"
            >
              <Crop className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {imageToCrop && (
        <ImageCropperDialog
          imageSrc={imageToCrop}
          open={cropperOpen}
          onClose={handleCropperClose}
          onSave={handleCropSave}
          aspectRatio={1} // For circular profile pictures
          cropShape="round"
        />
      )}
    </div>
  );
}