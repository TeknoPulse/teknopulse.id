export interface Category {
  name: string;
  slug: string;
  color: string;
  bgColor: string;
  hoverColor: string;
  description: string;
}

export const categories: Record<string, Category> = {
  AI: {
    name: 'AI',
    slug: 'ai',
    color: 'hsl(270, 80%, 60%)', // Purple
    bgColor: 'hsl(270, 80%, 60% / 0.1)',
    hoverColor: 'hsl(270, 80%, 60% / 0.2)',
    description: 'Machine Learning, AI models, research, and tools',
  },
  Developer: {
    name: 'Developer',
    slug: 'developer',
    color: 'hsl(140, 70%, 45%)', // Green
    bgColor: 'hsl(140, 70%, 45% / 0.1)',
    hoverColor: 'hsl(140, 70%, 45% / 0.2)',
    description:
      'Programming languages, APIs, libraries, IDEs, development tools, dan workflow untuk membangun software',
  },
  Software: {
    name: 'Software',
    slug: 'software',
    color: 'hsl(200, 80%, 55%)', // Light blue
    bgColor: 'hsl(200, 80%, 55% / 0.1)',
    hoverColor: 'hsl(200, 80%, 55% / 0.2)',
    description:
      'Aplikasi, platform, operating systems, databases, frameworks, dan perkembangan software',
  },
  Automation: {
    name: 'Automation',
    slug: 'automation',
    color: 'hsl(40, 85%, 55%)', // Yellow-orange
    bgColor: 'hsl(40, 85%, 55% / 0.1)',
    hoverColor: 'hsl(40, 85%, 55% / 0.2)',
    description:
      'Workflow automation, integrations, APIs, agents, no-code/low-code, dan sistem yang menghubungkan berbagai tools',
  },
  Experiments: {
    name: 'Experiments',
    slug: 'experiments',
    color: 'hsl(330, 75%, 60%)', // Pink-red
    bgColor: 'hsl(330, 75%, 60% / 0.1)',
    hoverColor: 'hsl(330, 75%, 60% / 0.2)',
    description:
      'Eksperimen dan proyek yang menggunakan teknologi secara langsung untuk melihat kemampuan dan keterbatasannya',
  },
  Insights: {
    name: 'Insights',
    slug: 'insights',
    color: 'hsl(180, 70%, 50%)', // Teal
    bgColor: 'hsl(180, 70%, 50% / 0.1)',
    hoverColor: 'hsl(180, 70%, 50% / 0.2)',
    description: 'Explainers, analysis, dan konteks di balik perkembangan teknologi',
  },
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categories[name];
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return Object.values(categories).find((cat) => cat.slug === slug);
};

export const getAllCategories = (): Category[] => {
  return Object.values(categories);
};

// URL slug for a category name; falls back to lowercase name for unknown values.
export const getCategorySlug = (name: string): string => {
  return getCategoryByName(name)?.slug ?? name.toLowerCase();
};

// Display label (e.g. 'Developer' -> 'Developer').
export const getCategoryLabel = (name: string): string => {
  return getCategoryByName(name)?.name ?? name;
};

// CSS token used by category-badge classes (token = slug).
export const getCategoryToken = (name: string): string => {
  return getCategorySlug(name);
};

export const getCategoryUrl = (name: string): string => {
  return `/category/${getCategorySlug(name)}`;
};

export const getCategoryColorClasses = (categoryName: string): string => {
  const category = getCategoryByName(categoryName);
  if (!category) return '';

  return `category-${category.slug}`;
};

export const getCategoryTailwindClasses = (
  categoryName: string
): {
  badge: string;
  text: string;
  bg: string;
  hover: string;
} => {
  const category = getCategoryByName(categoryName);
  if (!category) {
    return {
      badge: 'bg-gray-100 text-gray-800',
      text: 'text-gray-800',
      bg: 'bg-gray-100',
      hover: 'hover:bg-gray-200',
    };
  }

  return {
    badge: `bg-[${category.bgColor}] text-[${category.color}] hover:bg-[${category.hoverColor}]`,
    text: `text-[${category.color}]`,
    bg: `bg-[${category.bgColor}]`,
    hover: `hover:bg-[${category.hoverColor}]`,
  };
};
