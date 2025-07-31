# WallPainter AI - Replit Project Documentation

## Overview

WallPainter AI is a web application that allows users to upload images of Indian buildings, generate segmentation masks using the Segment Anything Model 2 (SAM2), and interactively color different sections of the building walls. The application provides an intuitive interface for mask selection, color application, and image download functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with a clear separation between frontend and backend responsibilities:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **File Handling**: Multer for image uploads with Sharp for image processing
- **Storage**: In-memory storage implementation (expandable to database)
- **Development**: Hot reload with Vite integration

## Key Components

### Frontend Components
1. **ImageUpload**: Drag-and-drop interface for image selection
2. **ImageCanvas**: Interactive canvas for displaying images and masks with click handlers
3. **MaskControls**: UI for generating masks and toggling visibility
4. **ColorPalette**: Color selection interface with predefined colors
5. **ActionButtons**: Clear selection and download functionality

### Backend Services
1. **File Upload Handler**: Processes and stores uploaded images
2. **Storage Service**: Abstract interface for data persistence (currently in-memory)
3. **Image Processing**: Sharp integration for metadata extraction and manipulation
4. **API Routes**: RESTful endpoints for image and mask operations

### Shared Schema
- **Zod Validation**: Type-safe schemas for API communication
- **Data Models**: ProcessedImage, Mask, and ColorApplication types
- **Request/Response Types**: Consistent data structures across frontend/backend

## Data Flow

1. **Image Upload**: User uploads image → Multer processes file → Sharp extracts metadata → Storage saves processed image
2. **Mask Generation**: User requests masks → Backend calls SAM2 service → Masks stored and returned to frontend
3. **Interactive Selection**: User clicks on image → Frontend identifies clicked mask → Visual feedback provided
4. **Color Application**: User selects color and applies → Frontend combines selected masks → Color overlay applied
5. **Image Download**: User downloads final image → Frontend generates composite image with applied colors

## External Dependencies

### Core Dependencies
- **Database**: Drizzle ORM with PostgreSQL support (configured but not implemented)
- **Neon Database**: Serverless PostgreSQL integration
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Image Processing**: Sharp for server-side image manipulation
- **File Uploads**: Multer for multipart form handling

### GPU Service Integration
The application is designed to integrate with external GPU services for SAM2 processing:
- **Supported Services**: Beam Cloud, Modal, Vast.ai, RunPod
- **API Design**: Ready for external service integration
- **Fallback**: Mock implementation for development

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reload**: Vite development server with Express middleware
- **Environment Variables**: DATABASE_URL configuration ready

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend in production

### Database Migration
- **Drizzle Kit**: Database schema management and migrations
- **PostgreSQL**: Production-ready database configuration
- **Schema Location**: `shared/schema.ts` for type safety

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types between frontend and backend for consistency
2. **TypeScript Throughout**: Full type safety across the entire stack
3. **Modular Storage**: Abstract storage interface allows easy migration from in-memory to database
4. **Component-Based UI**: Reusable UI components with consistent styling
5. **External GPU Services**: Designed for integration with cloud GPU providers for SAM2 processing
6. **Development-First**: Optimized for Replit development environment with production deployment ready

The application is structured to be easily deployable and scalable, with clear separation of concerns and modern development practices throughout.