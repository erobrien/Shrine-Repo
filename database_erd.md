# Peptide Dojo Database Entity Relationship Diagram

## Tables

### Categories
```
categories
├── id (UUID, PK)
├── name (TEXT, NOT NULL)
├── slug (VARCHAR(255), UNIQUE, NOT NULL)
└── description (TEXT)
```

### Peptides
```
peptides
├── id (UUID, PK)
├── name (TEXT, NOT NULL)
├── sku (VARCHAR(255), UNIQUE, NOT NULL)
├── alternate_names (TEXT[])
├── category_id (UUID, FK → categories.id)
├── short_description (TEXT)
├── description (TEXT)
├── dosage (TEXT)
├── price (NUMERIC(10,2), NOT NULL)
├── is_blend (BOOLEAN, DEFAULT false)
├── ingredients (TEXT[]) -- For blends
└── research_applications (TEXT)
```

### Guides
```
guides
├── id (UUID, PK)
├── slug (VARCHAR(255), UNIQUE, NOT NULL)
├── title (TEXT, NOT NULL)
├── meta_title (VARCHAR(60), NOT NULL) -- SEO optimized
├── meta_description (VARCHAR(160), NOT NULL) -- SEO optimized
├── content (TEXT, NOT NULL)
├── excerpt (TEXT)
├── category (TEXT, NOT NULL)
├── tags (TEXT[])
├── related_peptides (UUID[]) -- Array of peptide IDs
├── author (TEXT, NOT NULL)
├── publish_date (TIMESTAMP, NOT NULL, DEFAULT NOW())
├── last_updated (TIMESTAMP, NOT NULL, DEFAULT NOW())
├── featured (BOOLEAN, DEFAULT false)
├── read_time (INTEGER, NOT NULL) -- in minutes
└── keywords (TEXT[]) -- SEO keywords
```

### Protocols
```
protocols
├── id (UUID, PK)
├── name (TEXT, NOT NULL)
├── description (TEXT)
├── peptides (UUID[]) -- Array of peptide IDs
├── duration (TEXT)
└── instructions (TEXT[])
```

### Users
```
users
├── id (VARCHAR, PK, DEFAULT gen_random_uuid())
├── username (TEXT, UNIQUE, NOT NULL)
└── password (TEXT, NOT NULL)
```

## Relationships

```
categories ||--o{ peptides : "category_id"
guides }o--o{ peptides : "related_peptides (array)"
protocols }o--o{ peptides : "peptides (array)"
```

## Data Summary (Current State)

- **Guides**: 111 total
  - Research Summaries: 15
  - Beginner Guides: 15  
  - Condition-Specific Guides: 20
  - Peptide Deep Dives: 25
  - Safety & Protocols: 12
  - Other categories: 24

- **Peptides**: 128 total (from Shrine Peptides catalog)
- **Categories**: Multiple categories for peptide organization

## Key Features

- **SEO Optimized**: Guides table includes meta_title (60 char limit) and meta_description (160 char limit)
- **Array Fields**: PostgreSQL arrays used for tags, keywords, related_peptides, ingredients
- **UUID Primary Keys**: All main entities use UUID for distributed system compatibility
- **Full-Text Content**: Rich HTML content with research citations and product links
- **Timestamp Tracking**: Automatic publish_date and last_updated timestamps