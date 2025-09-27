import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description?: string;
  // Note: For dynamic OG tags, we'd need React Helmet or similar
  // This component focuses on document.title management
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Update meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
    
    // Cleanup function to reset on unmount if needed
    return () => {
      // Optionally reset to default title
    };
  }, [title, description]);
  
  return null;
}