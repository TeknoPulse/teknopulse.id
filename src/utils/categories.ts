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
    color: 'hsl(270, 80%, 60%)',      // Purple
    bgColor: 'hsl(270, 80%, 60% / 0.1)',
    hoverColor: 'hsl(270, 80%, 60% / 0.2)',
    description: 'Machine Learning, AI models, research, and tools'
  },
  Cloud: {
    name: 'Cloud',
    slug: 'cloud',
    color: 'hsl(195, 80%, 50%)',      // Cyan
    bgColor: 'hsl(195, 80%, 50% / 0.1)',
    hoverColor: 'hsl(195, 80%, 50% / 0.2)',
    description: 'Cloud infrastructure, services, and pricing'
  },
  Security: {
    name: 'Security',
    slug: 'security',
    color: 'hsl(0, 85%, 60%)',        // Red
    bgColor: 'hsl(0, 85%, 60% / 0.1)',
    hoverColor: 'hsl(0, 85%, 60% / 0.2)',
    description: 'Cybersecurity, vulnerabilities, and compliance'
  },
  DevTools: {
    name: 'DevTools',
    slug: 'devtools',
    color: 'hsl(140, 70%, 45%)',      // Green
    bgColor: 'hsl(140, 70%, 45% / 0.1)',
    hoverColor: 'hsl(140, 70%, 45% / 0.2)',
    description: 'Development tools, workflows, and productivity'
  },
  Policy: {
    name: 'Policy',
    slug: 'policy',
    color: 'hsl(38, 90%, 55%)',       // Orange
    bgColor: 'hsl(38, 90%, 55% / 0.1)',
    hoverColor: 'hsl(38, 90%, 55% / 0.2)',
    description: 'Technology regulations, compliance, and legal'
  }
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categories[name];
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return Object.values(categories).find(cat => cat.slug === slug);
};

export const getAllCategories = (): Category[] => {
  return Object.values(categories);
};

export const getCategoryColorClasses = (categoryName: string): string => {
  const category = getCategoryByName(categoryName);
  if (!category) return '';

  return `category-${category.slug}`;
};

export const getCategoryTailwindClasses = (categoryName: string): {
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
      hover: 'hover:bg-gray-200'
    };
  }

  return {
    badge: `bg-[${category.bgColor}] text-[${category.color}] hover:bg-[${category.hoverColor}]`,
    text: `text-[${category.color}]`,
    bg: `bg-[${category.bgColor}]`,
    hover: `hover:bg-[${category.hoverColor}]`
  };
};