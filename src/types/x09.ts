export type ActiveView = 'landing' | 'studio' | 'dashboard';

export type ProjectStatus =
  | 'draft'
  | 'interviewing'
  | 'planning'
  | 'designing'
  | 'building'
  | 'reviewing'
  | 'published'
  | 'archived';

export type CreditTransactionType =
  | 'welcome_bonus'
  | 'purchase'
  | 'subscription'
  | 'generation'
  | 'project_creation'
  | 'template_clone'
  | 'refund'
  | 'adjustment';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: CreditTransactionType;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface CreditEconomyConfig {
  welcomeBonus: number;
  projectCreationCost: number;
  templateCloneCost: number;
  aiCommandCost: number;
}

export const DEFAULT_CREDIT_ECONOMY: CreditEconomyConfig = {
  welcomeBonus: 15,
  projectCreationCost: 5,
  templateCloneCost: 5,
  aiCommandCost: 1,
};

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'creator';
  plan: 'Free' | 'Starter' | 'Pro' | 'Scale';
  credits: number;
  creditsTotal: number;
  createdAt: string;
  supabaseConnected?: boolean;
}

export interface X09Template {
  id: string;
  title: string;
  category: 'Sites' | 'SaaS' | 'Apps' | 'E-commerces';
  badge: string;
  description: string;
  thumbnail: string;
  suggestedSubdomain: string;
  features: string[];
  data: FitLifeState;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceBrl: number;
  badge?: string;
  description: string;
}

export interface MercadoPagoPlan {
  id: 'starter' | 'pro' | 'scale';
  name: string;
  priceMonthly: number;
  creditsMonthly: number;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export interface UserProject {
  id: string;
  userId: string;
  ownerId?: string; // Supabase owner UUID
  title: string;
  name?: string;
  slug: string;
  subdomain: string; // e.g. "fitlife" -> "fitlife.x09.com.br"
  customDomain?: string; // e.g. "fitlifeacademia.com.br"
  category: 'Sites' | 'SaaS' | 'Apps' | 'E-commerces';
  status: ProjectStatus;
  templateId?: string | null;
  description?: string;
  views: number;
  lastEdited: string;
  thumbnail: string;
  data: FitLifeState;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'x09' | 'user';
  text: string;
  time: string;
  quickReplies?: string[];
  fieldUpdated?: string;
}

export interface FitLifeState {
  name: string;
  slogan: string;
  headline: string;
  subheadline: string;
  phone: string;
  whatsapp: string;
  accentColor: string; // e.g. '#c6f135' (lime) or '#38bdf8' (cyan)
  activeStudents: string;
  trainersCount: string;
  satisfactionRate: string;
  yearsHistory: string;
  modalities: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
}

export interface ProjectProgress {
  stage: 'entrevista' | 'planejamento' | 'design' | 'construcao' | 'revisao' | 'publicacao';
  currentStepIndex: number;
  qualityScore: number;
  checklist: {
    design: boolean;
    content: boolean;
    assets: boolean;
    responsiveness: boolean;
  };
}

export interface ShowcaseProject {
  id: string;
  title: string;
  category: 'SaaS' | 'Sites' | 'Apps' | 'E-commerces';
  subtitle: string;
  image: string;
  metrics: string;
}

export interface IntegrationConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  cloudflareZoneId: string;
  hostingerVpsIp: string;
  domainBase: string; // "x09.com.br"
  studioSubdomain: string; // "studio.x09.com.br"
}
