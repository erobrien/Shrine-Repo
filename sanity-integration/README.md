# PeptideDojo Sanity Integration

This service provides a REST API that connects the PeptideDojo Render deployment with Sanity CMS.

## Features

- **Peptides API** - Get all peptides with categories and images
- **Categories API** - Get all peptide categories
- **Protocols API** - Get research protocols and guides
- **Stats API** - Get site statistics
- **Glossary API** - Get research terms and definitions
- **Featured API** - Get featured content
- **Search API** - Search across all content types

## API Endpoints

### Health Check
```
GET /health
```

### Peptides
```
GET /api/peptides
```
Returns all peptides with categories, images, and metadata.

### Categories
```
GET /api/categories
```
Returns all peptide categories with colors and icons.

### Protocols
```
GET /api/protocols
```
Returns all research protocols with steps and materials.

### Statistics
```
GET /api/stats
```
Returns site statistics (research partners, active members, etc.).

### Glossary
```
GET /api/glossary
```
Returns research terms and definitions.

### Featured Content
```
GET /api/featured
```
Returns featured peptides, categories, and protocols.

### Search
```
GET /api/search?q=term
```
Search across all content types.

## Deployment

### Local Development
```bash
npm install
npm run dev
```

### Render Deployment
1. Connect to GitHub repository
2. Use `render.yaml` configuration
3. Set environment variables
4. Deploy

## Environment Variables

- `SANITY_PROJECT_ID` - Sanity project ID (regqjwlq)
- `SANITY_DATASET` - Sanity dataset (production)
- `SANITY_API_VERSION` - API version (2025-10-22)
- `SANITY_TOKEN` - Sanity API token (optional for read-only)
- `PORT` - Server port (default: 3003)
- `CORS_ORIGIN` - Allowed CORS origin

## Integration with Render Deployment

The Render deployment at `https://shrine-repo-dojo.onrender.com` can be updated to use this Sanity API by:

1. Updating API endpoints to point to this service
2. Adding Sanity client configuration
3. Implementing real-time content updates

## CORS Configuration

This service is configured to allow requests from:
- `https://shrine-repo-dojo.onrender.com`
- Local development (localhost)

## Error Handling

All endpoints include proper error handling and return appropriate HTTP status codes.

## Performance

- Uses Sanity CDN for fast content delivery
- Implements proper caching headers
- Optimized queries for minimal data transfer
