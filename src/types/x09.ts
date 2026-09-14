export type ActiveView = 'landing' | 'studio';

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
