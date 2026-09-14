import { ChatMessage, FitLifeState, ShowcaseProject } from '../types/x09';

export const INITIAL_FITLIFE_DATA: FitLifeState = {
  name: 'FitLife',
  slogan: 'Academia Premium',
  headline: 'DISCIPLINA HOJE, RESULTADOS SEMPRE.',
  subheadline: 'Mais que uma academia. Um estilo de vida.',
  phone: '(19) 99999-9999',
  whatsapp: '(19) 99999-9999',
  accentColor: '#c4f039', // Neon Lime from the reference
  activeStudents: '+2.500',
  trainersCount: '12',
  satisfactionRate: '98%',
  yearsHistory: '+5 Anos',
  modalities: [
    {
      id: '1',
      title: 'MUSCULAÇÃO',
      description: 'Força e resultado com maquinário biomecânico de última geração.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      title: 'FUNCIONAL',
      description: 'Movimento, agilidade e energia em circuitos dinâmicos de alta intensidade.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '3',
      title: 'PERSONAL',
      description: 'Treino sob medida e acompanhamento 1 a 1 com metodologia validada.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '4',
      title: 'NUTRIÇÃO',
      description: 'Saúde, bioimpedância periódica e performance com planos alimentares alinhados.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    },
  ],
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'x09',
    text: 'Olá! 👋 Vamos criar um SaaS moderno para academia. Para que o resultado fique perfeito, vou te fazer algumas perguntas simples, uma de cada vez, tudo bem? Qual será o nome do seu SaaS?',
    time: '10:24',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'FitLife',
    time: '10:24',
    fieldUpdated: 'name',
  },
  {
    id: 'msg-3',
    sender: 'x09',
    text: 'Perfeito! FitLife é um ótimo nome. 💪 Qual o número de WhatsApp ou telefone que você deseja disponibilizar para seus clientes?',
    time: '10:24',
  },
  {
    id: 'msg-4',
    sender: 'user',
    text: '(19) 99999-9999',
    time: '10:25',
    fieldUpdated: 'phone',
  },
  {
    id: 'msg-5',
    sender: 'x09',
    text: 'Ótimo! Deseja adicionar mais algum número de contato? Pode ser telefone fixo, outro WhatsApp ou prefere seguir apenas com este?',
    time: '10:25',
    quickReplies: ['Apenas este', 'Adicionar outro', 'Não tenho outro'],
  },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'fitpro',
    title: 'FITPRO',
    category: 'SaaS',
    subtitle: 'SaaS completo para academias e estúdios fitness com gestão de alunos e pagamentos.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
    metrics: '+2.5K Alunos • 98% Satisfação',
  },
  {
    id: 'nexus',
    title: 'NEXUS',
    category: 'Sites',
    subtitle: 'Dashboard financeiro corporativo com liquidação instantânea e gráficos em tempo real.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
    metrics: 'R$ 4.2M Transacionados • 0ms Latência',
  },
  {
    id: 'bella',
    title: 'Bella',
    category: 'E-commerces',
    subtitle: 'E-commerce de moda minimalista com checkout de alta conversão e catálogo 3D.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80',
    metrics: '14.2% Conversão • Mobile First',
  },
  {
    id: 'aura',
    title: 'Aura Health',
    category: 'Apps',
    subtitle: 'Aplicativo de telemedicina e monitoramento de saúde preventiva com IA.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80',
    metrics: '50k+ Consultas • 4.9★ App Store',
  },
];

export const SAMPLE_ASSETS = [
  {
    id: 'asset-1',
    name: 'Academia & Pesos',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80',
    status: 'Selecionado',
  },
  {
    id: 'asset-2',
    name: 'Treino Funcional',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80',
    status: 'Selecionado',
  },
  {
    id: 'asset-3',
    name: 'Atleta em Foco',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80',
    status: 'Selecionado',
  },
  {
    id: 'asset-4',
    name: 'Nutrição Esportiva',
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=80',
    status: 'Selecionado',
  },
];
