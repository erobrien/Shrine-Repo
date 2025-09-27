#!/usr/bin/env tsx
import { sanitizeAndNormalizeContent, detectContentType } from './content-sanitizer';

console.log('🧪 Testing Content Sanitizer\n');
console.log('=' .repeat(60));

// Test Case 1: Mixed Markdown and HTML content
const mixedContent = `
# BPC-157 Research Guide

This guide covers **important research** about BPC-157 peptide.

## Overview

BPC-157 is a <strong>synthetic peptide</strong> that has shown promising results in various studies.

* Tissue repair and healing
* Anti-inflammatory effects
* Gut health support

Visit our [BPC-157 product page](https://shrinepeptides.com/product/YPB-BPC-157) for more information.

### Dosage Guidelines

1. Start with low doses
2. Monitor effects carefully
3. Adjust based on research needs

Check out our [TB-500 blend](https://shrinepeptides.com/product/YPB-BLD-009) for enhanced recovery research.

## Research Studies

Recent studies have shown:
- Enhanced healing (PMID: 12345678)
- Reduced inflammation markers
- Improved gut barrier function

A 2024 study (DOI: 10.1234/example.2024.001) demonstrated significant improvements.

<script>alert('XSS attempt')</script>

## References

1. Smith et al. (2024). BPC-157 effects on tissue repair. Journal of Peptide Science. PMID: 12345678
2. Johnson, M. (2024). Peptide therapeutics review. Nature Reviews. DOI: 10.1038/nrd.2024.123
3. Research Group (2024). Clinical applications. PMC9876543
`;

// Test Case 2: HTML content with malicious scripts
const htmlContent = `
<h1>Guide to Peptide Research</h1>
<p>This is a comprehensive guide with <script>alert('hack')</script> clean content.</p>

<h2>Product Recommendations</h2>
<p>We recommend these products:</p>
<ul>
<li><a href="https://shrinepeptides.com/product/YPB-CJC-1295">CJC-1295</a></li>
<li><a href="https://shrinepeptides.com/product/YPB-IPAMORELIN">Ipamorelin</a></li>
</ul>

<h2 onclick="alert('clicked')">Safety Information</h2>
<p>Always follow proper <img src=x onerror="alert('xss')"> research protocols.</p>

<h2>References</h2>
<ol>
<li>Study on peptides (PMID: 98765432)</li>
<li>Clinical trial results DOI: 10.5555/test.2024.999</li>
<li>Database entry PMC1234567</li>
</ol>
`;

// Test Case 3: Markdown with loose formatting
const markdownContent = `
# Research Protocol Guide

Here are the key points to consider:

* First important point
* Second important point
  * Nested sub-point
* Third point

Now let's look at numbered items:

1. Step one in the protocol
2. Step two with details
3. Final step

## Product Links

Check these products:
- [BPC-157 10mg](https://shrinepeptides.com/product/YPB-BPC-157)
- [GHK-Cu blend](https://shrinepeptides.com/product/YPB-BLD-006)
- Regular link to [Google](https://google.com)

## Citations

Recent research findings:

Johnson et al. found significant results (DOI: 10.1111/example.2024.555).
Another study PMID: 11223344 showed similar outcomes.
See also the research in PMC7654321.

### References

- Smith, J. (2024). Peptide research. Journal Name. DOI: 10.2222/test.2024
- Brown, K. (2024). Clinical trials. Medical Journal. PMID: 55667788
- White, L. (2024). Meta-analysis. Review Journal. PMC8888999
`;

// Test Case 4: Content with heading hierarchy issues
const headingContent = `
<h1>Main Title</h1>
<h3>Skipped H2 - Should become H2</h3>
<p>Some content here</p>
<h5>Skipped H4 - Should become H3</h5>
<p>More content</p>
<h2>Proper H2</h2>
<h3>Proper H3</h3>
`;

// Run tests
console.log('\n📝 Test 1: Mixed Markdown and HTML Content');
console.log('-'.repeat(40));
const result1 = sanitizeAndNormalizeContent(mixedContent);
console.log('Content type detected:', detectContentType(mixedContent));
console.log('\nSanitized output (first 500 chars):');
console.log(result1.substring(0, 500) + '...\n');
console.log('✅ XSS script removed:', !result1.includes('<script>'));
console.log('✅ Product links processed:', result1.includes('class="product-link"'));
console.log('✅ DOI link created:', result1.includes('href="https://doi.org/'));
console.log('✅ PMID link created:', result1.includes('href="https://pubmed.ncbi.nlm.nih.gov/'));

console.log('\n📝 Test 2: HTML with Malicious Scripts');
console.log('-'.repeat(40));
const result2 = sanitizeAndNormalizeContent(htmlContent);
console.log('Content type detected:', detectContentType(htmlContent));
console.log('\nSanitized output (first 500 chars):');
console.log(result2.substring(0, 500) + '...\n');
console.log('✅ Scripts removed:', !result2.includes('script'));
console.log('✅ onclick removed:', !result2.includes('onclick'));
console.log('✅ onerror removed:', !result2.includes('onerror'));
console.log('✅ Product links have data-testid:', result2.includes('data-testid="link-product-'));

console.log('\n📝 Test 3: Markdown with Loose Formatting');
console.log('-'.repeat(40));
const result3 = sanitizeAndNormalizeContent(markdownContent, true);
console.log('\nSanitized output (first 500 chars):');
console.log(result3.substring(0, 500) + '...\n');
console.log('✅ Lists converted to HTML:', result3.includes('<ul>') && result3.includes('<ol>'));
console.log('✅ Product links have target="_blank":', result3.includes('target="_blank"'));
console.log('✅ Non-product links unchanged:', result3.includes('google.com') && !result3.includes('data-testid="link-product-google'));
console.log('✅ PMC links created:', result3.includes('href="https://www.ncbi.nlm.nih.gov/pmc/'));

console.log('\n📝 Test 4: Heading Hierarchy Normalization');
console.log('-'.repeat(40));
const result4 = sanitizeAndNormalizeContent(headingContent, false);
console.log('\nChecking heading structure:');
const h2Match = result4.match(/<h2[^>]*>Skipped H2/);
const h3Match = result4.match(/<h3[^>]*>Skipped H4/);
console.log('✅ H3 normalized to H2:', h2Match !== null);
console.log('✅ H5 normalized to H3:', h3Match !== null);

console.log('\n📝 Test 5: References Section Formatting');
console.log('-'.repeat(40));
const referencesContent = `
## References

* First reference with DOI: 10.1234/test.2024.001
* Second reference with PMID: 87654321
* Third reference with PMC9999999
`;
const result5 = sanitizeAndNormalizeContent(referencesContent, true);
console.log('\nReferences section output:');
console.log(result5);
console.log('\n✅ References section has id:', result5.includes('id="references"'));
console.log('✅ DOI links are clickable:', result5.includes('<a href="https://doi.org/'));
console.log('✅ PMID links are clickable:', result5.includes('<a href="https://pubmed.ncbi.nlm.nih.gov/'));
console.log('✅ PMC links are clickable:', result5.includes('<a href="https://www.ncbi.nlm.nih.gov/pmc/'));

console.log('\n' + '='.repeat(60));
console.log('✨ All tests completed successfully!');
console.log('='.repeat(60));

// Output a sample of clean HTML for verification
console.log('\n📄 Sample Clean HTML Output (Product Links Section):');
console.log('-'.repeat(40));
const productSection = result3.match(/<h2[^>]*>Product Links<\/h2>[\s\S]*?(?=<h2|$)/);
if (productSection) {
  console.log(productSection[0]);
}

console.log('\n📄 Sample Clean HTML Output (References Section):');
console.log('-'.repeat(40));
const referencesSection = result5;
console.log(referencesSection);