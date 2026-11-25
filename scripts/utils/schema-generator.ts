/**
 * Schema.org JSON-LD Generator
 * Generate Guide and HowTo structured data from guide frontmatter
 */

export interface GuideFrontmatter {
  title: string;
  // Slug URL guide (`/guides/<slug>/`). Bila kosong, diturunkan dari title.
  slug?: string;
  description: string;
  metaDescription?: string;
  publishedAt: Date | string;
  updatedAt: Date | string;
  tags: string[];
  category: string;
  author: string;
  difficulty: 'pemula' | 'menengah' | 'lanjutan';
  targetKeyword: string;
  secondaryKeywords: string[];
  sources: Array<{
    title: string;
    url: string;
    author?: string;
    date?: string;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  coverImage?: string;
  readingTime?: number;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export interface SchemaGuide {
  '@context': 'https://schema.org';
  '@type': 'Guide';
  name: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  keywords: string;
  about: string[];
  url?: string;
  mentions?: Array<{
    '@type': 'Article';
    name: string;
    url: string;
    author?: { '@type': 'Person'; name: string };
    datePublished?: string;
  }>;
  hasPart?: Array<{
    '@type': 'WebPageElement';
    name: string;
    text: string;
  }>;
}

export interface SchemaHowTo {
  '@context': 'https://schema.org';
  '@type': 'HowTo';
  name: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  keywords: string;
  totalTime?: string; // ISO 8601 duration
  url?: string;
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: 'IDR';
    value: '0';
  };
  supply?: Array<{
    '@type': 'HowToSupply';
    name: string;
  }>;
  tool?: Array<{
    '@type': 'HowToTool';
    name: string;
  }>;
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    image?: {
      '@type': 'ImageObject';
      url: string;
    };
  }>;
}

export interface SchemaFAQPage {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

/**
 * Generate Guide schema (for conceptual/educational content)
 */
export function generateGuideSchema(
  fm: GuideFrontmatter,
  sections?: Array<{ heading: string; content: string }>
): SchemaGuide {
  const baseUrl = 'https://teknopulse.id';
  const guideUrl = `${baseUrl}/guides/${fm.slug ?? slugify(fm.title)}/`;

  const schema: SchemaGuide = {
    '@context': 'https://schema.org',
    '@type': 'Guide',
    name: fm.title,
    description: fm.description,
    url: guideUrl,
    datePublished: normalizeDate(fm.publishedAt),
    dateModified: normalizeDate(fm.updatedAt),
    author: authorSchema(fm.author),
    publisher: {
      '@type': 'Organization',
      name: 'TeknoPulse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://teknopulse.id/logo.png',
      },
    },
    keywords: [fm.targetKeyword, ...fm.secondaryKeywords].join(', '),
    about: fm.tags,
  };

  // Add sources as mentions
  if (fm.sources && fm.sources.length > 0) {
    schema.mentions = fm.sources.map((s) => ({
      '@type': 'Article',
      name: s.title,
      url: s.url,
      author: s.author ? { '@type': 'Person', name: s.author } : undefined,
      datePublished: s.date ? normalizeDate(s.date) : undefined,
    }));
  }

  // Add sections as hasPart
  if (sections && sections.length > 0) {
    schema.hasPart = sections.map((s) => ({
      '@type': 'WebPageElement',
      name: s.heading,
      text: s.content.substring(0, 500), // truncate for schema
    }));
  }

  return schema;
}

/**
 * Generate HowTo schema (for step-by-step procedural content)
 */
export function generateHowToSchema(
  fm: GuideFrontmatter,
  steps: HowToStep[],
  supplies: string[] = [],
  tools: string[] = [],
  totalMinutes?: number
): SchemaHowTo {
  const baseUrl = 'https://teknopulse.id';

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: fm.title,
    description: fm.description,
    url: `${baseUrl}/guides/${fm.slug ?? slugify(fm.title)}/`,
    datePublished: normalizeDate(fm.publishedAt),
    dateModified: normalizeDate(fm.updatedAt),
    author: authorSchema(fm.author),
    publisher: {
      '@type': 'Organization',
      name: 'TeknoPulse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://teknopulse.id/logo.png',
      },
    },
    keywords: [fm.targetKeyword, ...fm.secondaryKeywords].join(', '),
    totalTime: totalMinutes ? `PT${totalMinutes}M` : undefined,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'IDR',
      value: '0',
    },
    supply: supplies.map((name) => ({ '@type': 'HowToSupply', name })),
    tool: tools.map((name) => ({ '@type': 'HowToTool', name })),
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      image: step.image
        ? {
            '@type': 'ImageObject',
            url: step.image,
          }
        : undefined,
    })),
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faq: Array<{ question: string; answer: string }>): SchemaFAQPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * Auto-detect schema type based on content structure
 */
export function detectSchemaType(content: string): 'Guide' | 'HowTo' {
  // Count step indicators
  const stepPatterns = [
    /^##\s+Langkah\s+\d+/gim,
    /^##\s+Step\s+\d+/gim,
    /^\d+\.\s+\w+/gm, // numbered lists at start of line
  ];

  let stepCount = 0;
  for (const pattern of stepPatterns) {
    stepCount += (content.match(pattern) || []).length;
  }

  // If 3+ clear steps, use HowTo
  return stepCount >= 3 ? 'HowTo' : 'Guide';
}

/**
 * Extract steps from markdown content for HowTo schema
 */
export function extractStepsFromMarkdown(content: string): HowToStep[] {
  const steps: HowToStep[] = [];

  // Match ## Langkah N: Title or ## Step N: Title
  const stepRegex = /^##\s+(?:Langkah|Step)\s+(\d+)[:.\s]*(.+)$/gim;
  let match;

  while ((match = stepRegex.exec(content)) !== null) {
    const stepNum = match[1];
    const stepTitle = match[2].trim();

    // Get content until next ## heading
    const nextHeadingIndex = content.indexOf('\n## ', match.index + match[0].length);
    const stepContent =
      nextHeadingIndex > 0
        ? content.substring(match.index + match[0].length, nextHeadingIndex).trim()
        : content.substring(match.index + match[0].length).trim();

    steps.push({
      name: `${stepNum}. ${stepTitle}`,
      text: stepContent.substring(0, 1000), // limit length
    });
  }

  // Fallback: look for numbered lists
  if (steps.length === 0) {
    const numberedRegex = /^(\d+)\.\s+(.+)$/gm;
    while ((match = numberedRegex.exec(content)) !== null) {
      steps.push({
        name: `${match[1]}. ${match[2].trim()}`,
        text: '', // Would need more context
      });
    }
  }

  return steps;
}

/**
 * Generate all applicable schemas for a guide
 */
export function generateAllSchemas(
  fm: GuideFrontmatter,
  content: string
): Array<SchemaGuide | SchemaHowTo | SchemaFAQPage> {
  const schemas: Array<SchemaGuide | SchemaHowTo | SchemaFAQPage> = [];

  // Detect type and generate appropriate main schema
  const type = detectSchemaType(content);

  if (type === 'HowTo') {
    const steps = extractStepsFromMarkdown(content);
    if (steps.length >= 3) {
      schemas.push(generateHowToSchema(fm, steps));
    } else {
      schemas.push(generateGuideSchema(fm));
    }
  } else {
    schemas.push(generateGuideSchema(fm));
  }

  // Always add FAQ schema if FAQ exists
  if (fm.faq && fm.faq.length > 0) {
    schemas.push(generateFAQSchema(fm.faq));
  }

  return schemas;
}

/**
 * Convert schemas to JSON-LD script tag HTML
 */
export function schemasToJsonLd(schemas: Array<SchemaGuide | SchemaHowTo | SchemaFAQPage>): string {
  return schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
    )
    .join('\n');
}

// Helpers
/**
 * Byline JSON-LD dari nama penulis di frontmatter. URL profil hanya diisi
 * untuk byline yang terdaftar di src/utils/authors.ts (slug-nya mengikuti
 * pola `redaksi-teknopulse` → `/authors/redaksi-teknopulse/`).
 */
function authorSchema(name: string): SchemaGuide['author'] {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return {
    '@type': 'Person',
    name,
    url: slug ? `https://teknopulse.id/authors/${slug}/` : undefined,
  };
}

function normalizeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
