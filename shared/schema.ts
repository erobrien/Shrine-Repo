import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, boolean, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
});

// Peptides table
export const peptides = pgTable("peptides", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sku: varchar("sku", { length: 255 }).notNull().unique(),
  alternateNames: text("alternate_names").array(),
  categoryId: uuid("category_id").references(() => categories.id),
  shortDescription: text("short_description"),
  description: text("description"),
  dosage: text("dosage"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isBlend: boolean("is_blend").default(false).notNull(),
  ingredients: text("ingredients").array(), // For blends
  researchApplications: text("research_applications"),
});

// Protocols table
export const protocols = pgTable("protocols", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  peptides: uuid("peptides").array(), // Array of peptide IDs
  duration: text("duration"),
  instructions: text("instructions").array(),
});

// Guides table for SEO-optimized educational content
export const guides = pgTable("guides", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  metaTitle: varchar("meta_title", { length: 60 }).notNull(), // SEO: 60 chars max
  metaDescription: varchar("meta_description", { length: 160 }).notNull(), // SEO: 160 chars max
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  relatedPeptides: uuid("related_peptides").array(), // Array of peptide IDs
  author: text("author").notNull(),
  publishDate: timestamp("publish_date").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  featured: boolean("featured").default(false).notNull(),
  readTime: integer("read_time").notNull(), // in minutes
  keywords: text("keywords").array(), // SEO keywords
});

// Authors table for detailed expert credentials
export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  bio: text("bio").notNull(), // Professional background
  credentials: text("credentials").array(), // Array of qualifications like ["PhD Biochemistry", "10+ years peptide research"]
  affiliation: text("affiliation"), // Institution or company
  expertise: text("expertise").array(), // Array of specializations
  publications: text("publications"), // Notable publications or research
  contactEmail: text("contact_email"),
  linkedinUrl: text("linkedin_url"),
  researchGateUrl: text("research_gate_url"),
  isActive: boolean("is_active").default(true).notNull(),
});

// Users table (keeping existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertPeptideSchema = createInsertSchema(peptides).omit({
  id: true,
}).extend({
  price: z.string().or(z.number()).transform((val) => String(val)),
  alternateNames: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
});

export const insertProtocolSchema = createInsertSchema(protocols).omit({
  id: true,
}).extend({
  peptides: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
});

export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
  publishDate: true,
  lastUpdated: true,
}).extend({
  tags: z.array(z.string()).optional(),
  relatedPeptides: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  metaTitle: z.string().max(60, "Meta title must be 60 characters or less"),
  metaDescription: z.string().max(160, "Meta description must be 160 characters or less"),
  readTime: z.number().int().positive(),
});

export const insertAuthorSchema = createInsertSchema(authors).omit({
  id: true,
}).extend({
  credentials: z.array(z.string()).optional(),
  expertise: z.array(z.string()).optional(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Peptide = typeof peptides.$inferSelect;
export type InsertPeptide = z.infer<typeof insertPeptideSchema>;

export type Protocol = typeof protocols.$inferSelect;
export type InsertProtocol = z.infer<typeof insertProtocolSchema>;

export type Guide = typeof guides.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = z.infer<typeof insertAuthorSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;