export type ProjectCategory = 'all' | 'web-app' | 'ecommerce' | 'ui-ux' | 'infrastructure';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  categoryLabel: string;
  description: string;
  longDescription: string;
  year: string;
  image: string;
  tags: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  challenge: string;
  solution: string;
  architecture: string[];
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  iconName: string;
  deliverables: string[];
  techStack: string[];
}

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'database';
  level: string;
  icon: string;
}

export interface EstimatorOption {
  id: string;
  label: string;
  description?: string;
  price: number;
}
