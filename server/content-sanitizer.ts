import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';

// Create a window object for DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Get Node constants from the window
const Node = window.Node;

// Configure DOMPurify to allow safe HTML elements and attributes
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
  'ul', 'ol', 'li', 'a', 'img', 'blockquote',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'section', 'article'
];

const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'target', 'rel', 'class', 'data-testid'],
  'img': ['src', 'alt', 'width', 'height'],
  '*': ['id', 'class']
};

// Product URL patterns for Shrine Peptides
const PRODUCT_URL_PATTERNS = [
  /shrinepeptides\.com\/product\//i,
  /shrine-peptides\.com\/product\//i,
  /\/product\/([A-Z0-9-]+)/i
];

// Common DOI and PMID patterns
const DOI_PATTERN = /10\.\d{4,}\/[-._;()\/:A-Za-z0-9]+/g;
const PMID_PATTERN = /PMID:\s*(\d+)/gi;
const PMCID_PATTERN = /PMC\d+/gi;

/**
 * Sanitizes and normalizes content, converting markdown to HTML if needed
 * @param content - The raw content (HTML or Markdown)
 * @param isMarkdown - Whether the content is in Markdown format (auto-detected if not specified)
 * @returns Sanitized and normalized HTML content
 */
export function sanitizeAndNormalizeContent(
  content: string, 
  isMarkdown?: boolean
): string {
  if (!content) {
    return '';
  }

  // Auto-detect markdown if not specified
  if (isMarkdown === undefined) {
    // Simple heuristics for markdown detection
    const markdownIndicators = [
      /^#{1,6}\s/m,        // Markdown headers
      /^\*\s/m,            // Bullet lists
      /^\d+\.\s/m,         // Numbered lists
      /\[.*?\]\(.*?\)/,    // Markdown links
      /\*\*.*?\*\*/,       // Bold text
      /\*.*?\*/,           // Italic text
      /^>\s/m              // Blockquotes
    ];
    
    isMarkdown = markdownIndicators.some(pattern => pattern.test(content));
  }

  // Convert markdown to HTML if needed
  let htmlContent = isMarkdown ? marked(content) : content;

  // Create a DOM from the HTML for manipulation
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // 1. Normalize heading hierarchy
  normalizeHeadings(document);

  // 2. Normalize lists (convert loose bullet points and numbered items)
  normalizeLists(document);

  // 3. Ensure paragraphs are properly wrapped
  normalizeParagraphs(document);

  // 4. Handle product links
  processProductLinks(document);

  // 5. Format citations and references
  formatCitations(document);

  // Get the normalized HTML
  const normalizedHTML = document.body.innerHTML;

  // Sanitize with DOMPurify - need to be more permissive with attributes
  const cleanHTML = purify.sanitize(normalizedHTML, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'data-testid', 'id', 'src', 'alt', 'width', 'height'],
    KEEP_CONTENT: true,
    ADD_TAGS: ['section', 'article'],
    ADD_ATTR: ['data-testid', 'target', 'rel']
  });

  return cleanHTML;
}

/**
 * Normalizes heading hierarchy to ensure proper structure
 */
function normalizeHeadings(document: Document): void {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  
  headings.forEach((heading) => {
    const currentLevel = parseInt(heading.tagName[1]);
    
    // Ensure headings don't skip levels
    if (lastLevel > 0 && currentLevel > lastLevel + 1) {
      const newLevel = lastLevel + 1;
      const newHeading = document.createElement(`h${newLevel}`);
      newHeading.innerHTML = heading.innerHTML;
      Array.from(heading.attributes).forEach(attr => {
        newHeading.setAttribute(attr.name, attr.value);
      });
      heading.parentNode?.replaceChild(newHeading, heading);
      lastLevel = newLevel;
    } else {
      lastLevel = currentLevel;
    }
  });
}

/**
 * Normalizes lists by converting loose bullet points and numbered items
 */
function normalizeLists(document: Document): void {
  const body = document.body;
  const walker = document.createTreeWalker(
    body,
    window.NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes: Node[] = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    const text = textNode.textContent || '';
    const lines = text.split('\n');
    
    const processedLines: (string | HTMLElement)[] = [];
    let currentList: HTMLElement | null = null;
    let listType: 'ul' | 'ol' | null = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check for bullet points
      const bulletMatch = trimmedLine.match(/^[\*\-•]\s+(.+)$/);
      // Check for numbered items
      const numberMatch = trimmedLine.match(/^\d+[\.\)]\s+(.+)$/);
      
      if (bulletMatch) {
        if (!currentList || listType !== 'ul') {
          if (currentList) processedLines.push(currentList);
          currentList = document.createElement('ul');
          listType = 'ul';
        }
        const li = document.createElement('li');
        li.textContent = bulletMatch[1];
        currentList.appendChild(li);
      } else if (numberMatch) {
        if (!currentList || listType !== 'ol') {
          if (currentList) processedLines.push(currentList);
          currentList = document.createElement('ol');
          listType = 'ol';
        }
        const li = document.createElement('li');
        li.textContent = numberMatch[1];
        currentList.appendChild(li);
      } else {
        if (currentList) {
          processedLines.push(currentList);
          currentList = null;
          listType = null;
        }
        if (trimmedLine) {
          processedLines.push(line);
        }
      }
    });

    if (currentList) {
      processedLines.push(currentList);
    }

    // Replace text node with processed content
    if (processedLines.length > 0 && textNode.parentNode) {
      const fragment = document.createDocumentFragment();
      processedLines.forEach((item, index) => {
        if (typeof item === 'string') {
          fragment.appendChild(document.createTextNode(item));
          if (index < processedLines.length - 1) {
            fragment.appendChild(document.createTextNode('\n'));
          }
        } else {
          fragment.appendChild(item);
        }
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  });
}

/**
 * Ensures paragraphs are properly wrapped in <p> tags
 */
function normalizeParagraphs(document: Document): void {
  const body = document.body;
  const childNodes = Array.from(body.childNodes);
  
  let currentParagraph: HTMLElement | null = null;
  const newChildren: Node[] = [];

  childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').trim();
      if (text) {
        if (!currentParagraph) {
          currentParagraph = document.createElement('p');
          newChildren.push(currentParagraph);
        }
        currentParagraph.appendChild(document.createTextNode(text + ' '));
      } else if (currentParagraph && (node.textContent || '').includes('\n\n')) {
        // Double newline indicates paragraph break
        currentParagraph = null;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const blockTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'blockquote', 'table', 'div', 'section', 'article'];
      
      if (blockTags.includes(element.tagName.toLowerCase())) {
        currentParagraph = null;
        newChildren.push(node);
      } else {
        // Inline element
        if (!currentParagraph) {
          currentParagraph = document.createElement('p');
          newChildren.push(currentParagraph);
        }
        currentParagraph.appendChild(node);
      }
    }
  });

  // Replace body content with normalized content
  body.innerHTML = '';
  newChildren.forEach(child => body.appendChild(child));
}

/**
 * Processes product links to add special attributes
 */
function processProductLinks(document: Document): void {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    
    // Check if this is a product link
    const isProductLink = PRODUCT_URL_PATTERNS.some(pattern => pattern.test(href));
    
    if (isProductLink) {
      // Extract SKU from URL if possible
      const skuMatch = href.match(/\/([A-Z0-9-]+)(?:\?|#|$)/i);
      const sku = skuMatch ? skuMatch[1] : 'unknown';
      
      // Add special attributes
      link.setAttribute('class', 'product-link');
      link.setAttribute('data-testid', `link-product-${sku.toLowerCase()}`);
      link.setAttribute('rel', 'noopener');
      link.setAttribute('target', '_blank');
    }
  });
}

/**
 * Formats citations and references section
 */
function formatCitations(document: Document): void {
  // Find references section
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let referencesSection: HTMLElement | null = null;
  
  headings.forEach(heading => {
    if (/references?|citations?|bibliography/i.test(heading.textContent || '')) {
      referencesSection = heading as HTMLElement;
      referencesSection.setAttribute('id', 'references');
    }
  });

  if (referencesSection) {
    // Find the content following the references heading
    let nextElement = referencesSection.nextElementSibling;
    
    while (nextElement) {
      // Check if it's a list that needs formatting
      if (nextElement.tagName === 'UL') {
        // Convert UL to OL for references
        const ol = document.createElement('ol');
        Array.from(nextElement.children).forEach(child => {
          ol.appendChild(child.cloneNode(true));
        });
        nextElement.parentNode?.replaceChild(ol, nextElement);
        nextElement = ol;
      }
      
      // Process reference text for DOIs and PMIDs
      if (nextElement.tagName === 'OL' || nextElement.tagName === 'UL') {
        const listItems = nextElement.querySelectorAll('li');
        listItems.forEach(li => {
          let html = li.innerHTML;
          
          // Convert DOIs to links
          html = html.replace(DOI_PATTERN, (match) => {
            return `<a href="https://doi.org/${match}" target="_blank" rel="noopener">${match}</a>`;
          });
          
          // Convert PMIDs to links
          html = html.replace(PMID_PATTERN, (match, pmid) => {
            return `<a href="https://pubmed.ncbi.nlm.nih.gov/${pmid}/" target="_blank" rel="noopener">PMID: ${pmid}</a>`;
          });
          
          // Convert PMCIDs to links
          html = html.replace(PMCID_PATTERN, (match) => {
            const pmcid = match.replace('PMC', '');
            return `<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${pmcid}/" target="_blank" rel="noopener">${match}</a>`;
          });
          
          li.innerHTML = html;
        });
      }
      
      // Check if we've hit another major section
      if (nextElement.tagName.match(/^H[1-6]$/)) {
        break;
      }
      
      nextElement = nextElement.nextElementSibling;
    }
  }

  // Also process inline citations throughout the document
  const allTextElements = document.querySelectorAll('p, li, td, th');
  allTextElements.forEach(element => {
    let html = element.innerHTML;
    
    // Convert DOIs to links
    html = html.replace(DOI_PATTERN, (match) => {
      // Check if already in a link
      if (!element.querySelector(`a[href*="${match}"]`)) {
        return `<a href="https://doi.org/${match}" target="_blank" rel="noopener">${match}</a>`;
      }
      return match;
    });
    
    // Convert PMIDs to links
    html = html.replace(PMID_PATTERN, (match, pmid) => {
      // Check if already in a link
      if (!element.querySelector(`a[href*="${pmid}"]`)) {
        return `<a href="https://pubmed.ncbi.nlm.nih.gov/${pmid}/" target="_blank" rel="noopener">PMID: ${pmid}</a>`;
      }
      return match;
    });
    
    // Convert PMCIDs to links
    html = html.replace(PMCID_PATTERN, (match) => {
      const pmcid = match.replace('PMC', '');
      // Check if already in a link
      if (!element.querySelector(`a[href*="PMC${pmcid}"]`)) {
        return `<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${pmcid}/" target="_blank" rel="noopener">${match}</a>`;
      }
      return match;
    });
    
    element.innerHTML = html;
  });
}

// Export helper function for testing
export function detectContentType(content: string): 'markdown' | 'html' {
  const markdownIndicators = [
    /^#{1,6}\s/m,        // Markdown headers
    /^\*\s/m,            // Bullet lists
    /^\d+\.\s/m,         // Numbered lists
    /\[.*?\]\(.*?\)/,    // Markdown links
    /\*\*.*?\*\*/,       // Bold text
    /^>\s/m              // Blockquotes
  ];
  
  const htmlIndicators = [
    /<[^>]+>/,           // HTML tags
    /&[a-z]+;/i          // HTML entities
  ];
  
  const markdownScore = markdownIndicators.filter(pattern => pattern.test(content)).length;
  const htmlScore = htmlIndicators.filter(pattern => pattern.test(content)).length;
  
  return markdownScore > htmlScore ? 'markdown' : 'html';
}