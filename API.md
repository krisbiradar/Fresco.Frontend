# API Documentation

## Endpoints

### Image Upload
```
POST /api/upload
```
Uploads a new image for processing.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'image' file

**Response:**
```typescript
{
  imageId: string;
  width: number;
  height: number;
  filename: string;
}
```

### Generate Masks
```
POST /api/generate-masks
```
Generates masks for an uploaded image.

**Request:**
- Method: POST
- Content-Type: application/json
- Body:
```typescript
{
  imageId: string;
}
```

**Response:**
```typescript
{
  imageId: string;
  masks: Array<{
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
  }>;
  processingTime: number;
}
```

### Apply Color
```
POST /api/apply-color
```
Applies a color to selected masks.

**Request:**
- Method: POST
- Content-Type: application/json
- Body:
```typescript
{
  imageId: string;
  maskIds: string[];
  color: string; // hex color code
}
```

**Response:**
```typescript
{
  success: boolean;
  modifiedMasks: string[];
}
```

### Get Image
```
GET /api/images/:imageId
```
Retrieves an uploaded image.

**Parameters:**
- imageId: The ID of the image to retrieve

**Response:**
- Content-Type: image/*
- Body: Image file

### Generate Final Image
```
POST /api/generate-final-image/:imageId
```
Generates the final image with all applied colors.

**Parameters:**
- imageId: The ID of the image to finalize

**Response:**
- Content-Type: image/png
- Body: Final processed image file

## Data Models

### Image Schema
```typescript
export const uploadImageSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
});
```

### Mask Schema
```typescript
export const maskSchema = z.object({
  id: z.string(),
  imageId: z.string(),
  maskData: z.string(),
  boundingBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  confidence: z.number(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});
```

### Color Application Schema
```typescript
export const colorApplicationSchema = z.object({
  imageId: z.string(),
  maskIds: z.array(z.string()),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});
```

## Error Handling

All endpoints follow a consistent error response format:

```typescript
{
  message: string;
  error?: {
    code: string;
    details?: any;
  };
}
```

Common HTTP Status Codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API endpoints are subject to rate limiting:
- Upload: 10 requests per minute
- Generate Masks: 5 requests per minute
- Other endpoints: 60 requests per minute

## Authentication

Currently, the API is designed for client-side usage without authentication. Future versions may implement authentication for multi-user support.
