import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eraser, Download, Settings } from "lucide-react";

interface ActionButtonsProps {
  onClearSelection: () => void;
  onDownloadImage: () => void;
  hasSelection: boolean;
  hasImage: boolean;
}

export function ActionButtons({
  onClearSelection,
  onDownloadImage,
  hasSelection,
  hasImage,
}: ActionButtonsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Settings className="inline text-primary mr-2" size={20} />
          Actions
        </h3>
        
        <div className="space-y-3">
          <Button
            onClick={onClearSelection}
            disabled={!hasSelection}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            <Eraser className="mr-2" size={16} />
            Clear Selection
          </Button>
          
          <Button
            onClick={onDownloadImage}
            disabled={!hasImage}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Download className="mr-2" size={16} />
            Download Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
