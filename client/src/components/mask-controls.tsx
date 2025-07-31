import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layers, Wand2, Info } from "lucide-react";

interface MaskControlsProps {
  hasImage: boolean;
  isGenerating: boolean;
  onGenerateMasks: () => void;
  showMasks: boolean;
  onToggleShowMasks: (show: boolean) => void;
  showAllMasks: boolean;
  onToggleShowAllMasks: (show: boolean) => void;
}

export function MaskControls({
  hasImage,
  isGenerating,
  onGenerateMasks,
  showMasks,
  onToggleShowMasks,
  showAllMasks,
  onToggleShowAllMasks,
}: MaskControlsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Layers className="inline text-primary mr-2" size={20} />
          Mask Controls
        </h3>
        
        <div className="space-y-4">
          <Button 
            onClick={onGenerateMasks}
            disabled={!hasImage || isGenerating}
            className="w-full"
            size="lg"
          >
            <Wand2 className="mr-2" size={16} />
            {isGenerating ? "Generating..." : "Generate Masks"}
          </Button>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-masks" className="text-sm font-medium text-gray-700">
              Show Masks
            </Label>
            <Switch
              id="show-masks"
              checked={showMasks}
              onCheckedChange={onToggleShowMasks}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-all-masks" className="text-sm font-medium text-gray-700">
              Show All Masks
            </Label>
            <Switch
              id="show-all-masks"
              checked={showAllMasks}
              onCheckedChange={onToggleShowAllMasks}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              <Info className="inline mr-1" size={14} />
              How to use:
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Click on image to select mask</li>
              <li>• Shift+Click to add to selection</li>
              <li>• Shift+Right-Click to remove</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
