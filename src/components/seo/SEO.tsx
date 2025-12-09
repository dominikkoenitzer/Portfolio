import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/constants";
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createHowToSchema,
} from "@/lib/seo-utils";
import type { SEOProps } from "@/types/seo";

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
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
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
    "max-snippet:-1",
    "max-image-preview:large",
    "max-video-preview:-1",
  ].join(", ");

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
  if (type === "article" && publishedTime) {
    allStructuredData.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: siteDescription,
      image: siteImage,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        "@type": "Person",
        name: author || SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      publisher: {
        "@type": "Person",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      ...(section && { articleSection: section }),
      ...(tags.length > 0 && { keywords: tags.join(", ") }),
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
      <meta content={siteTitle} name="title" />
      <meta content={siteDescription} name="description" />
      {keywords && <meta content={keywords} name="keywords" />}
      <meta content={author || SITE_CONFIG.author} name="author" />
      <meta content={robotsContent} name="robots" />
      <meta content={robotsContent} name="googlebot" />

      {/* Canonical URL */}
      <link href={canonicalUrl} rel="canonical" />

      {/* Geographic SEO */}
      {geoLocation && (
        <>
          <meta content={geoLocation.region} name="geo.region" />
          <meta content={geoLocation.placename} name="geo.placename" />
          <meta
            content={`${geoLocation.latitude}, ${geoLocation.longitude}`}
            name="ICBM"
          />
          <meta
            content={`${geoLocation.latitude};${geoLocation.longitude}`}
            name="geo.position"
          />
        </>
      )}

      {/* Open Graph / Facebook */}
      <meta content={type} property="og:type" />
      <meta content={siteUrl} property="og:url" />
      <meta content={siteTitle} property="og:title" />
      <meta content={siteDescription} property="og:description" />
      <meta content={siteImage} property="og:image" />
      <meta content="1200" property="og:image:width" />
      <meta content="630" property="og:image:height" />
      <meta content={siteTitle} property="og:image:alt" />
      <meta content={SITE_CONFIG.name} property="og:site_name" />
      <meta content="en_US" property="og:locale" />
      <meta content="de_CH" property="og:locale:alternate" />
      {author && <meta content={author} property="article:author" />}
      {publishedTime && (
        <meta content={publishedTime} property="article:published_time" />
      )}
      {modifiedTime && (
        <meta content={modifiedTime} property="article:modified_time" />
      )}
      {section && <meta content={section} property="article:section" />}
      {tags.length > 0 &&
        tags.map((tag) => (
          <meta content={tag} key={tag} property="article:tag" />
        ))}

      {/* Twitter */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={siteUrl} name="twitter:url" />
      <meta content={siteTitle} name="twitter:title" />
      <meta content={siteDescription} name="twitter:description" />
      <meta content={siteImage} name="twitter:image" />
      <meta content={siteTitle} name="twitter:image:alt" />
      <meta content="@dominikkoenitzer" name="twitter:creator" />
      <meta content="@dominikkoenitzer" name="twitter:site" />

      {/* Alternate Languages */}
      {alternateLanguages.map((alt) => (
        <link
          href={alt.url}
          hreflang={alt.lang}
          key={alt.lang}
          rel="alternate"
        />
      ))}

      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          key={index}
          type="application/ld+json"
        />
      ))}

      {/* Citations for GEO - AI engines use these for authority signals */}
      {citationLinks?.map((citation, index) => (
        <link href={citation.url} key={index} rel="citation" />
      ))}
    </Helmet>
  );
}
