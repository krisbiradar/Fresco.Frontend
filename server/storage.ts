import { type ProcessedImage, type Mask, type ColorApplication } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Image management
  saveProcessedImage(image: Omit<ProcessedImage, "id" | "processedAt">): Promise<ProcessedImage>;
  getProcessedImage(id: string): Promise<ProcessedImage | undefined>;
  deleteProcessedImage(id: string): Promise<boolean>;
  
  // Mask management
  saveMasks(imageId: string, masks: Omit<Mask, "id" | "imageId">[]): Promise<Mask[]>;
  getMasks(imageId: string): Promise<Mask[]>;
  getMask(maskId: string): Promise<Mask | undefined>;
  
  // Color applications
  saveColorApplication(application: ColorApplication): Promise<void>;
  getColorApplications(imageId: string): Promise<ColorApplication[]>;
}

export class MemStorage implements IStorage {
  private processedImages: Map<string, ProcessedImage>;
  private masks: Map<string, Mask>;
  private colorApplications: Map<string, ColorApplication[]>;

  constructor() {
    this.processedImages = new Map();
    this.masks = new Map();
    this.colorApplications = new Map();
  }

  async saveProcessedImage(image: Omit<ProcessedImage, "id" | "processedAt">): Promise<ProcessedImage> {
    const id = randomUUID();
    const processedImage: ProcessedImage = {
      ...image,
      id,
      processedAt: new Date(),
    };
    this.processedImages.set(id, processedImage);
    return processedImage;
  }

  async getProcessedImage(id: string): Promise<ProcessedImage | undefined> {
    return this.processedImages.get(id);
  }

  async deleteProcessedImage(id: string): Promise<boolean> {
    // Also clean up related data
    this.colorApplications.delete(id);
    Array.from(this.masks.values())
      .filter(mask => mask.imageId === id)
      .forEach(mask => this.masks.delete(mask.id));
    
    return this.processedImages.delete(id);
  }

  async saveMasks(imageId: string, masks: Omit<Mask, "id" | "imageId">[]): Promise<Mask[]> {
    const savedMasks = masks.map(mask => {
      const id = randomUUID();
      const fullMask: Mask = { ...mask, id, imageId };
      this.masks.set(id, fullMask);
      return fullMask;
    });

    // Update the processed image with mask references
    const image = this.processedImages.get(imageId);
    if (image) {
      image.masks = savedMasks;
      this.processedImages.set(imageId, image);
    }

    return savedMasks;
  }

  async getMasks(imageId: string): Promise<Mask[]> {
    return Array.from(this.masks.values()).filter(mask => mask.imageId === imageId);
  }

  async getMask(maskId: string): Promise<Mask | undefined> {
    return this.masks.get(maskId);
  }

  async saveColorApplication(application: ColorApplication): Promise<void> {
    const existing = this.colorApplications.get(application.imageId) || [];
    existing.push(application);
    this.colorApplications.set(application.imageId, existing);
  }

  async getColorApplications(imageId: string): Promise<ColorApplication[]> {
    return this.colorApplications.get(imageId) || [];
  }
}

export const storage = new MemStorage();
