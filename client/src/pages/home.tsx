import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { ImageCanvas } from "@/components/image-canvas";
import { MaskControls } from "@/components/mask-controls";
import { ColorPalette } from "@/components/color-palette";
import { ActionButtons } from "@/components/action-buttons";
import { useImageEditor } from "@/hooks/use-image-editor";
import { PaintbrushVertical, Brain, CloudUpload } from "lucide-react";

export default function Home() {
  const {
    uploadedImage,
    masks,
    selectedMasks,
    selectedColor,
    isGeneratingMasks,
    showMasks,
    showAllMasks,
    uploadImage,
    generateMasks,
    toggleMask,
    setSelectedColor,
    setShowMasks,
    setShowAllMasks,
    applyColor,
    clearSelection,
    downloadImage,
  } = useImageEditor();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <PaintbrushVertical className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fresco</h1>
                <p className="text-sm text-gray-500">Segment and paint building walls</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ImageUpload onImageUpload={uploadImage} />
            
            <MaskControls
              hasImage={!!uploadedImage}
              isGenerating={isGeneratingMasks}
              onGenerateMasks={generateMasks}
              showMasks={showMasks}
              onToggleShowMasks={setShowMasks}
              showAllMasks={showAllMasks}
              onToggleShowAllMasks={setShowAllMasks}
            />

            <ColorPalette
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              onApplyColor={applyColor}
              hasSelection={selectedMasks.length > 0}
            />

            <ActionButtons
              onClearSelection={clearSelection}
              onDownloadImage={downloadImage}
              hasSelection={selectedMasks.length > 0}
              hasImage={!!uploadedImage}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <ImageCanvas
              image={uploadedImage}
              masks={masks}
              selectedMasks={selectedMasks}
              showMasks={showMasks}
              showAllMasks={showAllMasks}
              onMaskClick={toggleMask}
              isGeneratingMasks={isGeneratingMasks}
            />

            {/* Status and Progress */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CloudUpload className="text-blue-600 text-sm" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Upload Status</p>
                    <p className="text-sm text-gray-500">
                      {uploadedImage ? "Image uploaded" : "Ready to upload"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Brain className="text-purple-600 text-sm" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">AI Processing</p>
                    <p className="text-sm text-gray-500">
                      {isGeneratingMasks 
                        ? "Generating masks..." 
                        : masks.length > 0 
                        ? `${masks.length} masks generated`
                        : "Waiting for image"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <PaintbrushVertical className="text-green-600 text-sm" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Paint Status</p>
                    <p className="text-sm text-gray-500">
                      {selectedMasks.length > 0 ? `${selectedMasks.length} masks selected` : "Ready to paint"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
