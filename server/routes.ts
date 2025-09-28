import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPeptideSchema, insertCategorySchema, insertProtocolSchema, insertGuideSchema } from "@shared/schema";
import { z } from "zod";
import { sanitizeAndNormalizeContent } from "./content-sanitizer";

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
  
  // Guide endpoints
  
  // GET /api/guides - List guides with efficient pagination
  app.get("/api/guides", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      const result = await storage.getGuidesPaginated(limit, offset);
      
      // For list view, skip expensive content sanitization (only needed for individual article view)
      const guides = result.data;
      
      res.json({
        data: guides,
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      });
    } catch (error) {
      console.error("Error fetching guides:", error);
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });
  
  // GET /api/guides/featured - Get featured guides
  app.get("/api/guides/featured", async (req, res) => {
    try {
      const guides = await storage.getFeaturedGuides();
      
      // Sanitize content for featured guides
      const sanitizedGuides = guides.map(guide => ({
        ...guide,
        content: sanitizeAndNormalizeContent(guide.content, true)
      }));
      
      res.json(sanitizedGuides);
    } catch (error) {
      console.error("Error fetching featured guides:", error);
      res.status(500).json({ error: "Failed to fetch featured guides" });
    }
  });
  
  // GET /api/guides/search - Search guides
  app.get("/api/guides/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const guides = await storage.searchGuides(query);
      
      // For search results, skip expensive sanitization (only needed for individual article view)
      res.json(guides);
    } catch (error) {
      console.error("Error searching guides:", error);
      res.status(500).json({ error: "Failed to search guides" });
    }
  });
  
  // GET /api/guides/category/:category - Get guides by category
  app.get("/api/guides/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const guides = await storage.getGuidesByCategory(category);
      
      // Sanitize content for guides by category
      const sanitizedGuides = guides.map(guide => ({
        ...guide,
        content: sanitizeAndNormalizeContent(guide.content, true)
      }));
      
      res.json(sanitizedGuides);
    } catch (error) {
      console.error("Error fetching guides by category:", error);
      res.status(500).json({ error: "Failed to fetch guides by category" });
    }
  });
  
  // GET /api/guides/:slug - Get single guide by slug
  app.get("/api/guides/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const guide = await storage.getGuideBySlug(slug);
      
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }
      
      // Sanitize the content before returning
      const sanitizedGuide = {
        ...guide,
        content: sanitizeAndNormalizeContent(guide.content, true)
      };
      
      res.json(sanitizedGuide);
    } catch (error) {
      console.error("Error fetching guide:", error);
      res.status(500).json({ error: "Failed to fetch guide" });
    }
  });
  
  // POST /api/guides - Create guide
  app.post("/api/guides", async (req, res) => {
    try {
      const validated = insertGuideSchema.parse(req.body);
      const guide = await storage.createGuide(validated);
      res.status(201).json(guide);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid guide data", details: error.errors });
      }
      console.error("Error creating guide:", error);
      res.status(500).json({ error: "Failed to create guide" });
    }
  });
  
  // PUT /api/guides/:id - Update guide
  app.put("/api/guides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const partialValidated = insertGuideSchema.partial().parse(req.body);
      const updated = await storage.updateGuide(id, partialValidated);
      
      if (!updated) {
        return res.status(404).json({ error: "Guide not found" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid guide data", details: error.errors });
      }
      console.error("Error updating guide:", error);
      res.status(500).json({ error: "Failed to update guide" });
    }
  });
  
  // DELETE /api/guides/:id - Delete guide
  app.delete("/api/guides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGuide(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Guide not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting guide:", error);
      res.status(500).json({ error: "Failed to delete guide" });
    }
  });

  // Sitemap endpoint for SEO
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://peptide-dojo.replit.app' 
        : 'http://localhost:5000';
      
      // Get all content for sitemap
      const [peptides, guides] = await Promise.all([
        storage.getAllPeptides(),
        storage.getAllGuides()
      ]);

      const currentDate = new Date().toISOString().split('T')[0];
      
      // Static pages with priority and change frequency
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
        { url: '/peptides', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
        { url: '/research', priority: '0.9', changefreq: 'daily', lastmod: currentDate }
      ];

      // Dynamic peptide pages
      const peptidePages = peptides.map(peptide => ({
        url: `/peptide/${peptide.id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: currentDate
      }));

      // Dynamic guide pages  
      const guidePages = guides.map(guide => ({
        url: `/guide/${guide.slug}`,
        priority: '0.8', 
        changefreq: 'weekly',
        lastmod: new Date(guide.publishDate).toISOString().split('T')[0]
      }));

      // Combine all pages
      const allPages = [...staticPages, ...peptidePages, ...guidePages];

      // Generate XML sitemap
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).json({ error: "Failed to generate sitemap" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}