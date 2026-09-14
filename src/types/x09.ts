export type ActiveView = 'landing' | 'studio' | 'dashboard';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'creator';
  plan: 'Starter' | 'Pro' | 'Enterprise';
  createdAt: string;
  supabaseConnected?: boolean;
}

export interface UserProject {
  id: string;
  userId: string;
  title: string;
  slug: string;
  subdomain: string; // e.g. "fitlife" -> "fitlife.x09.com.br"
  customDomain?: string; // e.g. "fitlifeacademia.com.br"
  category: 'Sites' | 'SaaS' | 'Apps' | 'E-commerces';
  status: 'published' | 'draft' | 'building';
  views: number;
  lastEdited: string;
  thumbnail: string;
  data: FitLifeState;
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
