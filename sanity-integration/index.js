const express = require('express');
const cors = require('cors');
const { createClient } = require('@sanity/client');

const app = express();
const PORT = process.env.PORT || 3003;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Sanity client configuration
const sanityClient = createClient({
  projectId: 'regqjwlq',
  dataset: 'production',
  apiVersion: '2025-10-22',
  useCdn: true
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'PeptideDojo Sanity Integration' });
});

// Get all peptides from Sanity
app.get('/api/peptides', async (req, res) => {
  try {
    const peptides = await sanityClient.fetch(`
      *[_type == "peptide"] {
        _id,
        name,
        sku,
        alternateNames,
        shortDescription,
        description,
        dosage,
        price,
        isBlend,
        ingredients,
        researchApplications,
        featured,
        "category": category->{
          _id,
          name,
          color,
          icon
        },
        "images": images[0...3]{
          asset->{
            _ref,
            url
          },
          alt
        }
      } | order(featured desc, name asc)
    `);
    
    res.json(peptides);
  } catch (error) {
    console.error('Error fetching peptides:', error);
    res.status(500).json({ error: 'Failed to fetch peptides' });
  }
});

// Get all categories from Sanity
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await sanityClient.fetch(`
      *[_type == "category"] {
        _id,
        name,
        slug,
        description,
        color,
        icon,
        featured
      } | order(featured desc, name asc)
    `);
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all protocols from Sanity
app.get('/api/protocols', async (req, res) => {
  try {
    const protocols = await sanityClient.fetch(`
      *[_type == "protocol"] {
        _id,
        title,
        slug,
        description,
        difficulty,
        duration,
        steps,
        materials,
        safetyNotes,
        featured
      } | order(featured desc, title asc)
    `);
    
    res.json(protocols);
  } catch (error) {
    console.error('Error fetching protocols:', error);
    res.status(500).json({ error: 'Failed to fetch protocols' });
  }
});

// Get site statistics from Sanity
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await sanityClient.fetch(`
      *[_type == "siteStats"][0] {
        researchPartners,
        activeMembers,
        scienceBased,
        expertSupport
      }
    `);
    
    res.json(stats || {
      researchPartners: "50+",
      activeMembers: "10K+",
      scienceBased: "100%",
      expertSupport: "24/7"
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get glossary terms from Sanity
app.get('/api/glossary', async (req, res) => {
  try {
    const terms = await sanityClient.fetch(`
      *[_type == "glossaryTerm"] {
        _id,
        term,
        definition,
        relatedPeptides,
        category
      } | order(term asc)
    `);
    
    res.json(terms);
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    res.status(500).json({ error: 'Failed to fetch glossary terms' });
  }
});

// Get featured content
app.get('/api/featured', async (req, res) => {
  try {
    const [featuredPeptides, featuredCategories, featuredProtocols] = await Promise.all([
      sanityClient.fetch(`*[_type == "peptide" && featured == true][0...6]{
        _id,
        name,
        shortDescription,
        "category": category->{name, color, icon},
        "images": images[0...1]{
          asset->{_ref, url},
          alt
        }
      }`),
      sanityClient.fetch(`*[_type == "category" && featured == true][0...4]{
        _id,
        name,
        description,
        color,
        icon
      }`),
      sanityClient.fetch(`*[_type == "protocol" && featured == true][0...3]{
        _id,
        title,
        description,
        difficulty,
        duration
      }`)
    ]);
    
    res.json({
      peptides: featuredPeptides,
      categories: featuredCategories,
      protocols: featuredProtocols
    });
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Failed to fetch featured content' });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }
  
  try {
    const results = await sanityClient.fetch(`
      *[_type in ["peptide", "category", "protocol", "glossaryTerm"] && 
        (name match "*${q}*" || title match "*${q}*" || term match "*${q}*" || 
         description match "*${q}*" || shortDescription match "*${q}*")] {
        _type,
        _id,
        name,
        title,
        term,
        description,
        shortDescription,
        "category": category->{name, color}
      } | order(_type asc, name asc)
    `);
    
    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PeptideDojo Sanity Integration running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧬 Peptides API: http://localhost:${PORT}/api/peptides`);
  console.log(`📁 Categories API: http://localhost:${PORT}/api/categories`);
  console.log(`📋 Protocols API: http://localhost:${PORT}/api/protocols`);
  console.log(`📈 Stats API: http://localhost:${PORT}/api/stats`);
  console.log(`📚 Glossary API: http://localhost:${PORT}/api/glossary`);
  console.log(`⭐ Featured API: http://localhost:${PORT}/api/featured`);
  console.log(`🔍 Search API: http://localhost:${PORT}/api/search?q=term`);
});
