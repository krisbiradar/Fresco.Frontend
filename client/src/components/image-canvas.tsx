import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { drawMasks, getClickedMask } from "@/lib/canvas-utils";
import type { Mask } from "@shared/schema";

interface ImageCanvasProps {
  image: { id: string; url: string; width: number; height: number } | null;
  masks: Mask[];
  selectedMasks: string[];
  showMasks: boolean;
  showAllMasks: boolean;
  onMaskClick: (maskId: string, isShiftClick: boolean, isRightClick: boolean) => void;
  isGeneratingMasks: boolean;
}

export function ImageCanvas({
  image,
  masks,
  selectedMasks,
  showMasks,
  showAllMasks,
  onMaskClick,
  isGeneratingMasks,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Draw masks on canvas
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw masks if enabled
    if (showMasks && masks.length > 0) {
      drawMasks(ctx, masks, selectedMasks, showAllMasks);
    }
  }, [masks, selectedMasks, showMasks, showAllMasks, imageLoaded]);

  // Handle canvas clicks
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageRef.current || masks.length === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to image size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const imageX = x * scaleX;
    const imageY = y * scaleY;

    // Find clicked mask
    const clickedMask = getClickedMask(masks, imageX, imageY);
    if (clickedMask) {
      onMaskClick(clickedMask.id, event.shiftKey, event.button === 2);
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    // Set canvas size to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    setImageLoaded(true);
  };

  if (!image) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              <ImageIcon className="inline text-primary mr-2" size={20} />
              Image Editor
            </h2>
          </div>

          <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No image uploaded</h3>
                <p className="text-gray-500 text-sm">Upload an image to start segmenting and painting walls</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            <ImageIcon className="inline text-primary mr-2" size={20} />
            Image Editor
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-600">
              {selectedMasks.length} masks selected
            </div>
            <Button variant="ghost" size="sm">
              <ZoomIn size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <ZoomOut size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize2 size={16} />
            </Button>
          </div>
        </div>

        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={image.url}
            alt="Building image for wall painting"
            className="w-full h-auto rounded-lg shadow-lg"
            onLoad={handleImageLoad}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          
          {imageLoaded && (
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
              onClick={handleCanvasClick}
              onContextMenu={(e) => e.preventDefault()}
            />
          )}

          {isGeneratingMasks && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Image</h3>
                <p className="text-gray-500 text-sm">Generating segmentation masks...</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2 w-64 mx-auto">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {image && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Dimensions:</span>
                <span className="ml-2 font-medium">{image.width}x{image.height}</span>
              </div>
              <div>
                <span className="text-gray-500">Masks Generated:</span>
                <span className="ml-2 font-medium">{masks.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Selected:</span>
                <span className="ml-2 font-medium">{selectedMasks.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 font-medium">
                  {isGeneratingMasks ? "Processing..." : "Ready"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
