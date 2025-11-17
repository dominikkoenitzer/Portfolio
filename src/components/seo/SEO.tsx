import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '@/constants';
import type { SEOProps } from '@/types/seo';
import {
  createFAQSchema,
  createHowToSchema,
  createBreadcrumbSchema,
} from '@/lib/seo-utils';

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
  alternateLanguages = [],
  structuredData,
  geoLocation,
  faqSchema,
  howToSchema,
  citationLinks,
}: SEOProps) {
  const siteTitle = title 
    ? `${title} | ${SITE_CONFIG.name}` 
    : `${SITE_CONFIG.title} | ${SITE_CONFIG.name}`;
  
  const siteDescription = description || SITE_CONFIG.description;
  const siteUrl = url || SITE_CONFIG.url;
  const siteImage = image || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;
  const canonicalUrl = canonical || siteUrl;
  
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1',
  ].join(', ');

  // Combine structured data
  const allStructuredData: object[] = [];

  if (structuredData) {
    if (Array.isArray(structuredData)) {
      allStructuredData.push(...structuredData);
    } else {
      allStructuredData.push(structuredData);
    }
  }

  // Add FAQ schema if provided
  const faqSchemaData = createFAQSchema(faqSchema || [], citationLinks);
  if (faqSchemaData) {
    allStructuredData.push(faqSchemaData);
  }

  // Add HowTo schema if provided
  if (howToSchema) {
    const howToSchemaData = createHowToSchema(howToSchema, citationLinks);
    if (howToSchemaData) {
      allStructuredData.push(howToSchemaData);
    }
  }

  // Add Article schema if type is article
  if (type === 'article' && publishedTime) {
    allStructuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: siteDescription,
      image: siteImage,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        '@type': 'Person',
        name: author || SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      publisher: {
        '@type': 'Person',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      ...(section && { articleSection: section }),
      ...(tags.length > 0 && { keywords: tags.join(', ') }),
    });
  }

  // Add BreadcrumbList schema
  const breadcrumbSchema = createBreadcrumbSchema(siteUrl);
  if (breadcrumbSchema) {
    allStructuredData.push(breadcrumbSchema);
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author || SITE_CONFIG.author} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Geographic SEO */}
      {geoLocation && (
        <>
          <meta name="geo.region" content={geoLocation.region} />
          <meta name="geo.placename" content={geoLocation.placename} />
          <meta name="ICBM" content={`${geoLocation.latitude}, ${geoLocation.longitude}`} />
          <meta name="geo.position" content={`${geoLocation.latitude};${geoLocation.longitude}`} />
        </>
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={siteTitle} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="de_CH" />
      {author && <meta property="article:author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.length > 0 && tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      <meta name="twitter:image:alt" content={siteTitle} />
      <meta name="twitter:creator" content="@dominikkoenitzer" />
      <meta name="twitter:site" content="@dominikkoenitzer" />
      
      {/* Alternate Languages */}
      {alternateLanguages.map((alt) => (
        <link key={alt.lang} rel="alternate" hreflang={alt.lang} href={alt.url} />
      ))}
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* Citations for GEO - AI engines use these for authority signals */}
      {citationLinks?.map((citation, index) => (
        <link key={index} rel="citation" href={citation.url} />
      ))}
    </Helmet>
  );
}

