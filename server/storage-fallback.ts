import { db } from "./db";
import { MemStorage } from "./storage";
import type { Storage } from "./storage";

class FallbackStorage implements Storage {
  private memStorage = new MemStorage();
  private useDatabase = false;

  constructor() {
    this.useDatabase = !!db;
    if (!this.useDatabase) {
      console.log('📦 Using in-memory storage (database not available)');
      this.initializeSampleData();
    } else {
      console.log('🗄️  Using database storage');
    }
  }

  private initializeSampleData() {
    // Add some sample data for demo purposes
    this.memStorage.createPeptide({
      name: "BPC-157",
      sequence: "GEPPPGKPADDAGLV",
      description: "Body Protection Compound - known for healing properties",
      benefits: ["Tissue repair", "Gut health", "Anti-inflammatory"],
      category: "Healing"
    });

    this.memStorage.createPeptide({
      name: "TB-500",
      sequence: "LKKTETQ",
      description: "Thymosin Beta-4 fragment - promotes healing and recovery",
      benefits: ["Wound healing", "Muscle recovery", "Flexibility"],
      category: "Recovery"
    });

    this.memStorage.createCategory({
      name: "Healing",
      description: "Peptides focused on tissue repair and healing"
    });

    this.memStorage.createCategory({
      name: "Recovery",
      description: "Peptides for post-workout recovery and muscle repair"
    });
  }

  // Delegate all methods to appropriate storage
  async getAllPeptides() {
    return this.useDatabase && db ? 
      await db.query.peptides.findMany() : 
      this.memStorage.getAllPeptides();
  }

  async getPeptide(id: string) {
    return this.useDatabase && db ?
      await db.query.peptides.findFirst({ where: (peptides, { eq }) => eq(peptides.id, id) }) :
      this.memStorage.getPeptide(id);
  }

  async searchPeptides(query: string) {
    return this.memStorage.searchPeptides(query);
  }

  async createPeptide(data: any) {
    return this.memStorage.createPeptide(data);
  }

  async updatePeptide(id: string, data: any) {
    return this.memStorage.updatePeptide(id, data);
  }

  async deletePeptide(id: string) {
    return this.memStorage.deletePeptide(id);
  }

  async getAllCategories() {
    return this.useDatabase && db ?
      await db.query.categories.findMany() :
      this.memStorage.getAllCategories();
  }

  async createCategory(data: any) {
    return this.memStorage.createCategory(data);
  }

  async getAllProtocols() {
    return this.memStorage.getAllProtocols();
  }

  async getProtocol(id: string) {
    return this.memStorage.getProtocol(id);
  }

  async createProtocol(data: any) {
    return this.memStorage.createProtocol(data);
  }

  async getAllGuides() {
    return this.memStorage.getAllGuides();
  }

  async getGuidesPaginated(limit: number, offset: number) {
    return this.memStorage.getGuidesPaginated(limit, offset);
  }

  async getFeaturedGuides() {
    return this.memStorage.getFeaturedGuides();
  }

  async searchGuides(query: string) {
    return this.memStorage.searchGuides(query);
  }

  async getGuidesByCategory(category: string) {
    return this.memStorage.getGuidesByCategory(category);
  }

  async getGuideBySlug(slug: string) {
    return this.memStorage.getGuideBySlug(slug);
  }

  async createGuide(data: any) {
    return this.memStorage.createGuide(data);
  }

  async updateGuide(id: string, data: any) {
    return this.memStorage.updateGuide(id, data);
  }

  async deleteGuide(id: string) {
    return this.memStorage.deleteGuide(id);
  }
}

// Export singleton instance
export const fallbackStorage = new FallbackStorage();
