import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, boolean, uuid } from "drizzle-orm/pg-core";
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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;