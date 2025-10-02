"use client"

import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Area, Point } from "react-easy-crop"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getCroppedImg } from "@/lib/utils"
import { toast } from "sonner"

interface ImageCropperDialogProps {
  imageSrc: string; // The original image data URL
  open: boolean;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => void;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
}

export function ImageCropperDialog({
  imageSrc,
  open,
  onClose,
  onSave,
  aspectRatio = 1, // Default to square for profile pictures
  cropShape = "round", // Default to round for profile pictures
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      toast.error("Please crop the image first.");
      return;
    }
    setLoading(true);
    try {
      const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedDataUrl);
      onClose(); // Close dialog after saving
    } catch (e) {
      console.error("Error cropping image:", e);
      toast.error("Failed to crop image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset state when dialog opens with a new image
  React.useEffect(() => {
    if (open && imageSrc) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
    }
  }, [open, imageSrc]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px] glass-panel-high-contrast">
        <DialogHeader>
          <DialogTitle className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
            Crop Profile Picture
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Adjust the image to fit perfectly.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[300px] bg-gray-800 rounded-md overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={cropShape}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            showGrid={true}
            restrictPosition={false}
            classes={{
              containerClassName: "bg-gray-900",
              mediaClassName: "object-contain",
              cropAreaClassName: "border-2 border-cyan-400/50",
            }}
          />
        </div>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-5 h-5 text-gray-400" />
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
              className="flex-1"
            />
            <ZoomIn className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              disabled={loading}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Rotate
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="text-white border-white/20 hover:bg-white/10">
            Cancel
          </Button>
          <Button type="button" variant="gradient-glow" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save & Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}