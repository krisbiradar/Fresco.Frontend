# Fresco Frontend Documentation

## Overview
Fresco Frontend is a web application that allows users to upload images, automatically generate masks for different parts of the image, and apply colors to those masks. It's particularly designed for painting or recoloring building walls in images.

## Project Structure

```
client/               # Frontend React application
  ├── src/           
    ├── components/  # React components
    ├── hooks/       # Custom React hooks
    ├── lib/         # Utility functions
    └── pages/       # Page components
server/              # Backend server
shared/              # Shared types and schemas
```

## Core Features
- Image upload and processing
- Automatic mask generation
- Interactive mask selection
- Color application to masks
- Real-time preview
- Image download with applied colors

## Technical Stack
- Frontend: React with TypeScript
- UI Components: Radix UI
- Styling: TailwindCSS
- State Management: React Query
- Backend: Express.js
- Build Tools: Vite

## Detailed Component Documentation

### Components

#### ImageCanvas (`components/image-canvas.tsx`)
The main canvas component that handles:
- Image display
- Mask visualization
- User interactions (clicking, selecting masks)
- Color preview

Props:
- `image`: The uploaded image data
- `masks`: Array of generated masks
- `selectedMasks`: Currently selected mask IDs
- `showMasks`: Boolean to toggle mask visibility
- `showAllMasks`: Boolean to show all masks or only selected ones
- `onMaskClick`: Handler for mask selection
- `isGeneratingMasks`: Loading state for mask generation
- `canvasRef`: Reference to the canvas element

#### ImageUpload (`components/image-upload.tsx`)
Handles image upload functionality with drag-and-drop support.

#### MaskControls (`components/mask-controls.tsx`)
Controls for mask generation and visibility.

#### ColorPalette (`components/color-palette.tsx`)
Color selection and application interface.

### Hooks

#### useImageEditor (`hooks/use-image-editor.ts`)
Central hook managing the image editing state and operations.

Features:
- Image upload and management
- Mask generation
- Color application
- Selection management
- Download functionality

State Management:
- `uploadedImage`: Current image being edited
- `masks`: Generated masks for the image
- `selectedMasks`: Currently selected masks
- `selectedColor`: Current color to apply
- `showMasks`: Visibility toggle for masks
- `showAllMasks`: Toggle for showing all masks

API Mutations:
- `uploadMutation`: Handles image upload
- `generateMasksMutation`: Generates masks for an image
- `applyColorMutation`: Applies colors to selected masks

### Utilities

#### canvas-utils.ts (`lib/canvas-utils.ts`)
Utility functions for canvas operations:
- `drawMasks`: Renders masks on the canvas
- `getClickedMask`: Detects clicked mask in coordinates

#### image-utils.ts (`lib/image-utils.ts`)
Image processing utilities.

## API Endpoints

### Image Operations
- `POST /api/upload`: Upload a new image
- `POST /api/generate-masks`: Generate masks for an image
- `POST /api/apply-color`: Apply color to selected masks
- `GET /api/images/:imageId`: Retrieve an image
- `POST /api/generate-final-image/:imageId`: Generate final image with applied colors

## Data Models

### Image
```typescript
interface UploadedImage {
  id: string;
  url: string;
  width: number;
  height: number;
  file: File;
}
```

### Mask
```typescript
interface Mask {
  id: string;
  imageId: string;
  maskData: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  color?: string;
}
```

## Getting Started

1. Installation
```bash
npm install
```

2. Development
```bash
npm run dev
```

3. Building
```bash
npm run build
```

4. Production
```bash
npm start
```

## Environment Configuration

Required environment variables:
- `NODE_ENV`: Application environment
- Additional configuration as needed

## Performance Considerations

- Canvas rendering is optimized for large images
- Mask operations are handled efficiently
- Image data is properly managed and cleaned up
- Browser memory management through proper cleanup of resources

## Security

- Input validation using Zod schemas
- Secure file upload handling
- Proper MIME type checking
- Size limitations on uploads

## Browser Compatibility

The application is designed to work in modern browsers with:
- Canvas API support
- File API support
- Modern JavaScript features
