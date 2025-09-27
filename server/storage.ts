import { 
  type User, 
  type InsertUser, 
  type Peptide, 
  type InsertPeptide,
  type Category,
  type InsertCategory,
  type Protocol,
  type InsertProtocol,
  type Guide,
  type InsertGuide,
  users,
  peptides,
  categories,
  protocols,
  guides
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, ilike, or, desc, asc } from "drizzle-orm";

// Extended interface with all CRUD methods
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Peptide operations
  createPeptide(peptide: InsertPeptide): Promise<Peptide>;
  getPeptide(id: string): Promise<Peptide | undefined>;
  getAllPeptides(): Promise<Peptide[]>;
  updatePeptide(id: string, peptide: Partial<InsertPeptide>): Promise<Peptide | undefined>;
  deletePeptide(id: string): Promise<boolean>;
  searchPeptides(query: string): Promise<Peptide[]>;
  
  // Category operations
  createCategory(category: InsertCategory): Promise<Category>;
  getAllCategories(): Promise<Category[]>;
  
  // Protocol operations
  createProtocol(protocol: InsertProtocol): Promise<Protocol>;
  getAllProtocols(): Promise<Protocol[]>;
  getProtocol(id: string): Promise<Protocol | undefined>;
  
  // Guide operations
  createGuide(guide: InsertGuide): Promise<Guide>;
  getGuide(id: string): Promise<Guide | undefined>;
  getGuideBySlug(slug: string): Promise<Guide | undefined>;
  getAllGuides(): Promise<Guide[]>;
  updateGuide(id: string, guide: Partial<InsertGuide>): Promise<Guide | undefined>;
  deleteGuide(id: string): Promise<boolean>;
  getGuidesByCategory(category: string): Promise<Guide[]>;
  getFeaturedGuides(): Promise<Guide[]>;
  searchGuides(query: string): Promise<Guide[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private peptides: Map<string, Peptide>;
  private categories: Map<string, Category>;
  private protocols: Map<string, Protocol>;
  private guides: Map<string, Guide>;

  constructor() {
    this.users = new Map();
    this.peptides = new Map();
    this.categories = new Map();
    this.protocols = new Map();
    this.guides = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Peptide operations
  async createPeptide(insertPeptide: InsertPeptide): Promise<Peptide> {
    const id = randomUUID();
    const peptide: Peptide = { 
      ...insertPeptide, 
      id,
      alternateNames: insertPeptide.alternateNames || null,
      ingredients: insertPeptide.ingredients || null,
      categoryId: insertPeptide.categoryId || null,
      shortDescription: insertPeptide.shortDescription || null,
      description: insertPeptide.description || null,
      dosage: insertPeptide.dosage || null,
      researchApplications: insertPeptide.researchApplications || null,
    } as Peptide;
    this.peptides.set(id, peptide);
    return peptide;
  }
  
  async getPeptide(id: string): Promise<Peptide | undefined> {
    return this.peptides.get(id);
  }
  
  async getAllPeptides(): Promise<Peptide[]> {
    return Array.from(this.peptides.values());
  }
  
  async updatePeptide(id: string, peptideData: Partial<InsertPeptide>): Promise<Peptide | undefined> {
    const existing = this.peptides.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...peptideData };
    this.peptides.set(id, updated);
    return updated;
  }
  
  async deletePeptide(id: string): Promise<boolean> {
    return this.peptides.delete(id);
  }
  
  async searchPeptides(query: string): Promise<Peptide[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.peptides.values()).filter(
      (peptide) => 
        peptide.name.toLowerCase().includes(lowercaseQuery) ||
        (peptide.description && peptide.description.toLowerCase().includes(lowercaseQuery)) ||
        (peptide.shortDescription && peptide.shortDescription.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  // Category operations
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null
    } as Category;
    this.categories.set(id, category);
    return category;
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  // Protocol operations
  async createProtocol(insertProtocol: InsertProtocol): Promise<Protocol> {
    const id = randomUUID();
    const protocol: Protocol = { 
      ...insertProtocol, 
      id,
      description: insertProtocol.description || null,
      peptides: insertProtocol.peptides || null,
      duration: insertProtocol.duration || null,
      instructions: insertProtocol.instructions || null
    } as Protocol;
    this.protocols.set(id, protocol);
    return protocol;
  }
  
  async getAllProtocols(): Promise<Protocol[]> {
    return Array.from(this.protocols.values());
  }
  
  async getProtocol(id: string): Promise<Protocol | undefined> {
    return this.protocols.get(id);
  }
  
  // Guide operations
  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const id = randomUUID();
    const now = new Date();
    const guide: Guide = { 
      ...insertGuide, 
      id,
      excerpt: insertGuide.excerpt || null,
      tags: insertGuide.tags || null,
      relatedPeptides: insertGuide.relatedPeptides || null,
      keywords: insertGuide.keywords || null,
      publishDate: now,
      lastUpdated: now
    } as Guide;
    this.guides.set(id, guide);
    return guide;
  }
  
  async getGuide(id: string): Promise<Guide | undefined> {
    return this.guides.get(id);
  }
  
  async getGuideBySlug(slug: string): Promise<Guide | undefined> {
    return Array.from(this.guides.values()).find(
      (guide) => guide.slug === slug
    );
  }
  
  async getAllGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values());
  }
  
  async updateGuide(id: string, guideData: Partial<InsertGuide>): Promise<Guide | undefined> {
    const existing = this.guides.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...guideData,
      lastUpdated: new Date()
    };
    this.guides.set(id, updated);
    return updated;
  }
  
  async deleteGuide(id: string): Promise<boolean> {
    return this.guides.delete(id);
  }
  
  async getGuidesByCategory(category: string): Promise<Guide[]> {
    return Array.from(this.guides.values()).filter(
      (guide) => guide.category === category
    );
  }
  
  async getFeaturedGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values()).filter(
      (guide) => guide.featured === true
    );
  }
  
  async searchGuides(query: string): Promise<Guide[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.guides.values()).filter(
      (guide) => 
        guide.title.toLowerCase().includes(lowercaseQuery) ||
        guide.content.toLowerCase().includes(lowercaseQuery) ||
        guide.metaDescription.toLowerCase().includes(lowercaseQuery) ||
        (guide.excerpt && guide.excerpt.toLowerCase().includes(lowercaseQuery)) ||
        (guide.tags && guide.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
        (guide.keywords && guide.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)))
    );
  }
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Peptide operations
  async createPeptide(insertPeptide: InsertPeptide): Promise<Peptide> {
    const [peptide] = await db
      .insert(peptides)
      .values(insertPeptide)
      .returning();
    return peptide;
  }
  
  async getPeptide(id: string): Promise<Peptide | undefined> {
    const [peptide] = await db
      .select()
      .from(peptides)
      .where(eq(peptides.id, id))
      .limit(1);
    return peptide;
  }
  
  async getAllPeptides(): Promise<Peptide[]> {
    return await db.select().from(peptides);
  }
  
  async updatePeptide(id: string, peptideData: Partial<InsertPeptide>): Promise<Peptide | undefined> {
    const [updated] = await db
      .update(peptides)
      .set(peptideData)
      .where(eq(peptides.id, id))
      .returning();
    return updated;
  }
  
  async deletePeptide(id: string): Promise<boolean> {
    const result = await db
      .delete(peptides)
      .where(eq(peptides.id, id))
      .returning();
    return result.length > 0;
  }
  
  async searchPeptides(query: string): Promise<Peptide[]> {
    return await db
      .select()
      .from(peptides)
      .where(
        or(
          ilike(peptides.name, `%${query}%`),
          ilike(peptides.description, `%${query}%`),
          ilike(peptides.shortDescription, `%${query}%`)
        )
      );
  }
  
  // Category operations
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }
  
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  
  // Protocol operations
  async createProtocol(insertProtocol: InsertProtocol): Promise<Protocol> {
    const [protocol] = await db
      .insert(protocols)
      .values(insertProtocol)
      .returning();
    return protocol;
  }
  
  async getAllProtocols(): Promise<Protocol[]> {
    return await db.select().from(protocols);
  }
  
  async getProtocol(id: string): Promise<Protocol | undefined> {
    const [protocol] = await db
      .select()
      .from(protocols)
      .where(eq(protocols.id, id))
      .limit(1);
    return protocol;
  }
  
  // Guide operations
  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const [guide] = await db
      .insert(guides)
      .values(insertGuide)
      .returning();
    return guide;
  }
  
  async getGuide(id: string): Promise<Guide | undefined> {
    const [guide] = await db
      .select()
      .from(guides)
      .where(eq(guides.id, id))
      .limit(1);
    return guide;
  }
  
  async getGuideBySlug(slug: string): Promise<Guide | undefined> {
    const [guide] = await db
      .select()
      .from(guides)
      .where(eq(guides.slug, slug))
      .limit(1);
    return guide;
  }
  
  async getAllGuides(): Promise<Guide[]> {
    return await db
      .select()
      .from(guides)
      .orderBy(desc(guides.publishDate));
  }
  
  async updateGuide(id: string, guideData: Partial<InsertGuide>): Promise<Guide | undefined> {
    const [updated] = await db
      .update(guides)
      .set({
        ...guideData,
        lastUpdated: new Date()
      })
      .where(eq(guides.id, id))
      .returning();
    return updated;
  }
  
  async deleteGuide(id: string): Promise<boolean> {
    const result = await db
      .delete(guides)
      .where(eq(guides.id, id))
      .returning();
    return result.length > 0;
  }
  
  async getGuidesByCategory(category: string): Promise<Guide[]> {
    return await db
      .select()
      .from(guides)
      .where(eq(guides.category, category))
      .orderBy(desc(guides.publishDate));
  }
  
  async getFeaturedGuides(): Promise<Guide[]> {
    return await db
      .select()
      .from(guides)
      .where(eq(guides.featured, true))
      .orderBy(desc(guides.publishDate));
  }
  
  async searchGuides(query: string): Promise<Guide[]> {
    return await db
      .select()
      .from(guides)
      .where(
        or(
          ilike(guides.title, `%${query}%`),
          ilike(guides.content, `%${query}%`),
          ilike(guides.metaDescription, `%${query}%`),
          ilike(guides.excerpt, `%${query}%`)
        )
      )
      .orderBy(desc(guides.publishDate));
  }
}

// Use DatabaseStorage when DATABASE_URL is present, otherwise use MemStorage
export const storage: IStorage = process.env.DATABASE_URL 
  ? new DatabaseStorage()
  : new MemStorage();