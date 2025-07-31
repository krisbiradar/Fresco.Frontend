import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette, PaintbrushVertical } from "lucide-react";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onApplyColor: () => void;
  hasSelection: boolean;
}

const predefinedColors = [
  "#EF4444", // red
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // yellow
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#F97316", // orange
  "#06B6D4", // cyan
];

export function ColorPalette({
  selectedColor,
  onColorSelect,
  onApplyColor,
  hasSelection,
}: ColorPaletteProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Palette className="inline text-primary mr-2" size={20} />
          Color Palette
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedColor === color
                    ? 'border-primary ring-4 ring-primary/20'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Custom Color</Label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => onColorSelect(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>

          <Button
            onClick={onApplyColor}
            disabled={!hasSelection}
            className="w-full bg-accent hover:bg-accent/90"
            size="lg"
          >
            <PaintbrushVertical className="mr-2" size={16} />
            Apply Color
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
