import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import {
  uploadImageSchema,
  generateMasksRequestSchema,
  colorApplicationSchema,
  type GenerateMasksResponse,
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload image endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Get image metadata using sharp
      const metadata = await sharp(req.file.path).metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      // Save processed image record
      const processedImage = await storage.saveProcessedImage({
        originalFilename: req.file.originalname,
        filePath: req.file.path,
        width,
        height,
        masks: [],
      });

      res.json({
        imageId: processedImage.id,
        filename: processedImage.originalFilename,
        width: processedImage.width,
        height: processedImage.height,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Serve uploaded images
  app.get("/api/images/:imageId", async (req, res) => {
    try {
      const { imageId } = req.params;
      const processedImage = await storage.getProcessedImage(imageId);

      if (!processedImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      if (!fs.existsSync(processedImage.filePath)) {
        return res.status(404).json({ message: "Image file not found" });
      }

      res.sendFile(path.resolve(processedImage.filePath));
    } catch (error) {
      console.error("Serve image error:", error);
      res.status(500).json({ message: "Failed to serve image" });
    }
  });

  // Generate masks using SAM2
  app.post("/api/generate-masks", async (req, res) => {
    try {
      const validatedData = generateMasksRequestSchema.parse(req.body);
      const { imageId } = validatedData;

      const processedImage = await storage.getProcessedImage(imageId);
      if (!processedImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Call external SAM2 service
      const startTime = Date.now();
      const masks = await callSAM2Service(processedImage.filePath);
      const processingTime = Date.now() - startTime;

      // Save masks to storage
      const savedMasks = await storage.saveMasks(imageId, masks);

      const response: GenerateMasksResponse = {
        imageId,
        masks: savedMasks,
        processingTime,
      };

      res.json(response);
    } catch (error) {
      console.error("Generate masks error:", error);
      res.status(500).json({ message: "Failed to generate masks" });
    }
  });

  // Get masks for an image
  app.get("/api/images/:imageId/masks", async (req, res) => {
    try {
      const { imageId } = req.params;
      const masks = await storage.getMasks(imageId);
      res.json({ masks });
    } catch (error) {
      console.error("Get masks error:", error);
      res.status(500).json({ message: "Failed to get masks" });
    }
  });

  // Apply color to selected masks
  app.post("/api/apply-color", async (req, res) => {
    try {
      const validatedData = colorApplicationSchema.parse(req.body);
      await storage.saveColorApplication(validatedData);
      res.json({ success: true });
    } catch (error) {
      console.error("Apply color error:", error);
      res.status(500).json({ message: "Failed to apply color" });
    }
  });

  // Generate final colored image
  app.post("/api/generate-final-image/:imageId", async (req, res) => {
    try {
      const { imageId } = req.params;
      const processedImage = await storage.getProcessedImage(imageId);
      const colorApplications = await storage.getColorApplications(imageId);

      if (!processedImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Generate the final image with applied colors
      const finalImagePath = await generateFinalImage(
        processedImage.filePath,
        processedImage.masks,
        colorApplications
      );

      res.sendFile(path.resolve(finalImagePath));
    } catch (error) {
      console.error("Generate final image error:", error);
      res.status(500).json({ message: "Failed to generate final image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Mock SAM2 service call - replace with actual implementation
async function callSAM2Service(imagePath: string) {
  // This would be replaced with actual API call to Modal/Beam service
  // For now, return mock masks that represent different regions of the image
  const mockMasks = [
    {
      maskData: "base64_encoded_mask_data_1",
      boundingBox: { x: 100, y: 100, width: 200, height: 150 },
      confidence: 0.95,
    },
    {
      maskData: "base64_encoded_mask_data_2", 
      boundingBox: { x: 300, y: 200, width: 180, height: 120 },
      confidence: 0.87,
    },
    {
      maskData: "base64_encoded_mask_data_3",
      boundingBox: { x: 150, y: 300, width: 250, height: 100 },
      confidence: 0.92,
    },
  ];

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return mockMasks;
}

// Generate final image with color applications
async function generateFinalImage(
  originalImagePath: string,
  masks: any[],
  colorApplications: any[]
): Promise<string> {
  const finalImagePath = path.join(uploadsDir, `final_${Date.now()}.jpg`);
  
  // For now, just copy the original image
  // In a real implementation, this would composite the colors onto the masks
  await sharp(originalImagePath)
    .jpeg({ quality: 90 })
    .toFile(finalImagePath);
    
  return finalImagePath;
}
