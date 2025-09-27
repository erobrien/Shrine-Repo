import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPeptideSchema, insertCategorySchema, insertProtocolSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Peptide endpoints
  
  // GET /api/peptides - List all peptides
  app.get("/api/peptides", async (req, res) => {
    try {
      const peptides = await storage.getAllPeptides();
      res.json(peptides);
    } catch (error) {
      console.error("Error fetching peptides:", error);
      res.status(500).json({ error: "Failed to fetch peptides" });
    }
  });
  
  // GET /api/peptides/search - Search peptides
  app.get("/api/peptides/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const peptides = await storage.searchPeptides(query);
      res.json(peptides);
    } catch (error) {
      console.error("Error searching peptides:", error);
      res.status(500).json({ error: "Failed to search peptides" });
    }
  });
  
  // GET /api/peptides/:id - Get single peptide
  app.get("/api/peptides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const peptide = await storage.getPeptide(id);
      
      if (!peptide) {
        return res.status(404).json({ error: "Peptide not found" });
      }
      
      res.json(peptide);
    } catch (error) {
      console.error("Error fetching peptide:", error);
      res.status(500).json({ error: "Failed to fetch peptide" });
    }
  });
  
  // POST /api/peptides - Create peptide
  app.post("/api/peptides", async (req, res) => {
    try {
      const validated = insertPeptideSchema.parse(req.body);
      const peptide = await storage.createPeptide(validated);
      res.status(201).json(peptide);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid peptide data", details: error.errors });
      }
      console.error("Error creating peptide:", error);
      res.status(500).json({ error: "Failed to create peptide" });
    }
  });
  
  // PATCH /api/peptides/:id - Update peptide
  app.patch("/api/peptides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const partialValidated = insertPeptideSchema.partial().parse(req.body);
      const updated = await storage.updatePeptide(id, partialValidated);
      
      if (!updated) {
        return res.status(404).json({ error: "Peptide not found" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid peptide data", details: error.errors });
      }
      console.error("Error updating peptide:", error);
      res.status(500).json({ error: "Failed to update peptide" });
    }
  });
  
  // DELETE /api/peptides/:id - Delete peptide
  app.delete("/api/peptides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePeptide(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Peptide not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting peptide:", error);
      res.status(500).json({ error: "Failed to delete peptide" });
    }
  });
  
  // Category endpoints
  
  // GET /api/categories - List all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  
  // POST /api/categories - Create category
  app.post("/api/categories", async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });
  
  // Protocol endpoints
  
  // GET /api/protocols - List all protocols
  app.get("/api/protocols", async (req, res) => {
    try {
      const protocols = await storage.getAllProtocols();
      res.json(protocols);
    } catch (error) {
      console.error("Error fetching protocols:", error);
      res.status(500).json({ error: "Failed to fetch protocols" });
    }
  });
  
  // GET /api/protocols/:id - Get single protocol
  app.get("/api/protocols/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const protocol = await storage.getProtocol(id);
      
      if (!protocol) {
        return res.status(404).json({ error: "Protocol not found" });
      }
      
      res.json(protocol);
    } catch (error) {
      console.error("Error fetching protocol:", error);
      res.status(500).json({ error: "Failed to fetch protocol" });
    }
  });
  
  // POST /api/protocols - Create protocol
  app.post("/api/protocols", async (req, res) => {
    try {
      const validated = insertProtocolSchema.parse(req.body);
      const protocol = await storage.createProtocol(validated);
      res.status(201).json(protocol);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid protocol data", details: error.errors });
      }
      console.error("Error creating protocol:", error);
      res.status(500).json({ error: "Failed to create protocol" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}