import { useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Mask, GenerateMasksResponse } from "@shared/schema";


interface UploadedImage {
  id: string;
  url: string;
  width: number;
  height: number;
  file: File;
}

export function useImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [masks, setMasks] = useState<Mask[]>([]);
  const [selectedMasks, setSelectedMasks] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("#3B82F6");
  const [showMasks, setShowMasks] = useState<boolean>(true);
  const [showAllMasks, setShowAllMasks] = useState<boolean>(false);

  const { toast } = useToast();

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiRequest("POST", "/api/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      if (uploadedImage?.file) {
        URL.revokeObjectURL(uploadedImage.url);
      }

      const imageUrl = `/api/images/${data.imageId}`;
      setUploadedImage({
        id: data.imageId,
        url: imageUrl,
        width: data.width,
        height: data.height,
        file: uploadedImage?.file || new File([], data.filename),
      });
      setMasks([]);
      setSelectedMasks([]);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate masks mutation
  const generateMasksMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const formData = new FormData();
      formData.append("file", uploadedImage?.file || new File([], "temp.png"));
      const response = await apiRequest("POST", "/api/v1/generate-masks", formData);
      return response.json() as Promise<GenerateMasksResponse>;
    },
    onSuccess: (data) => {
      setMasks(data.masks);
      setSelectedMasks([]);

      toast({
        title: "Masks Generated",
        description: `Generated ${data.masks.length} masks in ${(data.processingTime).toFixed(1)}s`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Apply color mutation
  const applyColorMutation = useMutation({
    mutationFn: async () => {
      if (!uploadedImage || selectedMasks.length === 0) {
        throw new Error("No image or masks selected");
      }

      const response = await apiRequest("POST", "/api/apply-color", {
        imageId: uploadedImage.id,
        maskIds: selectedMasks,
        color: selectedColor,
      });
      return response.json();
    },
    onSuccess: () => {
      setMasks(prevMasks => prevMasks.map(mask =>
        selectedMasks.includes(mask.id)
          ? { ...mask, color: selectedColor }
          : mask
      ));
      toast({
        title: "Color Applied",
        description: `Applied ${selectedColor} to ${selectedMasks.length} masks`,
      });
    },
    onError: (error) => {
      toast({
        title: "Apply Color Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadImage = useCallback((file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setUploadedImage(prev => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return {
        id: "",
        url: tempUrl,
        width: 0,
        height: 0,
        file,
      };
    });

    uploadMutation.mutate(file);
  }, [uploadMutation]);

  const generateMasks = useCallback(() => {
    if (!uploadedImage?.id) return;
    generateMasksMutation.mutate(uploadedImage.id);
  }, [uploadedImage?.id, generateMasksMutation]);

  const toggleMask = useCallback((maskId: string, isShiftClick: boolean, isRightClick: boolean) => {
    setSelectedMasks(prev => {
      if (isRightClick && isShiftClick) {
        // Shift+right-click: remove from selection
        return prev.filter(id => id !== maskId);
      } else if (isShiftClick) {
        // Shift+click: add to selection
        return prev.includes(maskId) ? prev : [...prev, maskId];
      } else {
        // Regular click: replace selection
        return [maskId];
      }
    });
  }, []);

  const applyColor = useCallback(() => {
    applyColorMutation.mutate();
  }, [applyColorMutation]);

  const clearSelection = useCallback(() => {
    setSelectedMasks([]);
  }, []);

  const downloadImage = useCallback(async () => {

    try {
      // 1. Get the <img> element and the colored masks <canvas>
      const imageElement = document.getElementById('base-image') as HTMLImageElement | null;
      const coloredCanvas = document.getElementById('mask-canvas') as HTMLCanvasElement | null;

      if (!(imageElement instanceof HTMLImageElement) || !(coloredCanvas instanceof HTMLCanvasElement)) {
        console.error("Could not find the required image or canvas elements.");
        return;
      }

      // 2. Create a temporary canvas
      const tempCanvas = document.createElement('canvas');
      // Use the natural, full resolution of the image
      tempCanvas.width = imageElement.naturalWidth;
      tempCanvas.height = imageElement.naturalHeight;
      const ctx = tempCanvas.getContext('2d');

      if (!ctx) return;

      // 3. Draw the <img> element FIRST, then the colored canvas on TOP
      ctx.drawImage(imageElement, 0, 0);
      ctx.drawImage(coloredCanvas, 0, 0);

      // 4. Trigger the download from the combined canvas
      const link = document.createElement('a');
      link.download = 'painted-image.png';
      link.href = tempCanvas.toDataURL("image/png");
      link.click();
      toast({
        title: "Download Complete",
        description: "Your painted image has been downloaded!",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  }, [uploadedImage, toast]);

  return {
    uploadedImage,
    masks,
    selectedMasks,
    selectedColor,
    showMasks,
    showAllMasks,
    isGeneratingMasks: generateMasksMutation.isPending,
    uploadImage,
    generateMasks,
    toggleMask,
    setSelectedColor,
    setShowMasks,
    setShowAllMasks,
    applyColor,
    clearSelection,
    downloadImage,
  };
}
