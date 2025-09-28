import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  schema?: object;
  noIndex?: boolean;
}

export default function PageMeta({ 
  title, 
  description, 
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  keywords,
  schema,
  noIndex = false
}: PageMetaProps) {
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      let metaTag = document.querySelector(selector);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (selector.includes('property=')) {
          metaTag.setAttribute('property', selector.split('"')[1]);
        } else if (selector.includes('name=')) {
          metaTag.setAttribute('name', selector.split('"')[1]);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute(attribute, content);
    };

    // Basic meta tags
    if (description) {
      updateMetaTag('meta[name="description"]', description);
    }

    if (keywords && keywords.length > 0) {
      updateMetaTag('meta[name="keywords"]', keywords.join(', '));
    }

    if (author) {
      updateMetaTag('meta[name="author"]', author);
    }

    // Robots meta tag
    if (noIndex) {
      updateMetaTag('meta[name="robots"]', 'noindex, nofollow');
    } else {
      updateMetaTag('meta[name="robots"]', 'index, follow');
    }

    // Canonical URL
    if (url) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', url);
    }

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    if (description) {
      updateMetaTag('meta[property="og:description"]', description);
    }
    updateMetaTag('meta[property="og:type"]', type);
    if (url) {
      updateMetaTag('meta[property="og:url"]', url);
    }
    if (image) {
      updateMetaTag('meta[property="og:image"]', image);
      updateMetaTag('meta[property="og:image:alt"]', title);
    }
    updateMetaTag('meta[property="og:site_name"]', 'Peptide Dojo');

    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', image ? 'summary_large_image' : 'summary');
    updateMetaTag('meta[name="twitter:title"]', title);
    if (description) {
      updateMetaTag('meta[name="twitter:description"]', description);
    }
    if (image) {
      updateMetaTag('meta[name="twitter:image"]', image);
    }

    // Article specific meta tags
    if (type === 'article') {
      if (author) {
        updateMetaTag('meta[property="article:author"]', author);
      }
      if (publishedTime) {
        updateMetaTag('meta[property="article:published_time"]', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
      }
    }

    // JSON-LD Structured Data
    if (schema) {
      let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(schema);
    }
    
    // Cleanup function
    return () => {
      // Remove JSON-LD script if it exists and no schema is provided
      if (!schema) {
        const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
        if (jsonLdScript) {
          jsonLdScript.remove();
        }
      }
    };
  }, [title, description, image, url, type, author, publishedTime, modifiedTime, keywords, schema, noIndex]);
  
  return null;
}