import type { Mask } from "@shared/schema";

export function drawMasks(
  ctx: CanvasRenderingContext2D,
  masks: Mask[],
  selectedMasks: string[],
  showAllMasks: boolean
) {
  const masksToShow = showAllMasks ? masks : masks.filter(mask => selectedMasks.includes(mask.id));
  
  masksToShow.forEach((mask) => {
    const isSelected = selectedMasks.includes(mask.id);
    
    // For demo purposes, draw bounding box as mask representation
    // In real implementation, this would decode and draw the actual mask data
    ctx.save();
    
    if (mask.color) {
      // If mask has a color applied, use it
      const color = mask.color;
      ctx.fillStyle = `${color}80`; // 50% opacity
      ctx.strokeStyle = color;
      ctx.lineWidth = isSelected ? 2 : 1;
    } else if (isSelected) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // blue for selected
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 2;
    } else {
      ctx.fillStyle = 'rgba(156, 163, 175, 0.2)'; // gray for unselected
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
      ctx.lineWidth = 1;
    }
    
    const { x, y, width, height } = mask.boundingBox;
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    
    // Draw confidence score
    if (isSelected) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${Math.round(mask.confidence * 100)}%`, x + 5, y + 15);
    }
    
    ctx.restore();
  });
}

export function getClickedMask(masks: Mask[], x: number, y: number): Mask | null {
  // Find the smallest mask that contains the click point (most specific)
  let clickedMask: Mask | null = null;
  let smallestArea = Infinity;
  
  for (const mask of masks) {
    const { x: maskX, y: maskY, width, height } = mask.boundingBox;
    
    if (x >= maskX && x <= maskX + width && y >= maskY && y <= maskY + height) {
      const area = width * height;
      if (area < smallestArea) {
        smallestArea = area;
        clickedMask = mask;
      }
    }
  }
  
  return clickedMask;
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
