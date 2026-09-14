import { ServiceItem } from '../types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Desenvolvimento Web Moderno',
    badge: 'Core Service',
    description: 'Aplicações web, portais corporativos e landing pages desenvolvidos com código limpo, velocidade incomparável e SEO técnico.',
    iconName: 'Code2',
    deliverables: [
      'Single Page Apps (SPA) com React & Vite',
      'Arquiteturas Next.js com Server-Side Rendering',
      'Compatibilidade total para mobile, tablet e desktop',
      'Otimização Core Web Vitals (nota 95+ no Google)',
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js'],
  },
  {
    id: 'ui-ux',
    title: 'Design de Interfaces & UI/UX',
    badge: 'Estratégia & Visual',
    description: 'Transformamos ideias complexas em interfaces elegantes, intuitivas e matematicamente proporcionadas com foco em conversão.',
    iconName: 'Palette',
    deliverables: [
      'Design Systems escaláveis e guias de estilo',
      'Prototipagem interativa e fluxos de navegação',
      'Acessibilidade e conformidade WCAG AA / AAA',
      'Identidade digital consistente para marcas contemporâneas',
    ],
    techStack: ['Figma', 'Tokens de Design', 'Tailwind Utilities', 'Micro-animações'],
  },
  {
    id: 'vps-devops',
    title: 'Infraestrutura VPS & Deploy',
    badge: 'Autonomia & Nuvem',
    description: 'Configuração completa e profissional do seu servidor VPS (Hostinger, AWS, DigitalOcean), Nginx, domínio, SSL e deploy contínuo via GitHub.',
    iconName: 'Server',
    deliverables: [
      'Configuração do servidor Linux (Ubuntu LTS) e segurança firewall',
      'Proxy reverso Nginx com compressão Brotli / Gzip',
      'Instalação de Certificados SSL HTTPS gratuitos e automáticos',
      'Pipeline de deploy via Git / GitHub para atualização em 1 comando',
    ],
    techStack: ['Ubuntu Linux', 'Nginx', 'GitHub Actions', 'PM2', 'Certbot / Let\'s Encrypt'],
  },
  {
    id: 'api-backend',
    title: 'Backends & Integrações',
    badge: 'Engenharia de Dados',
    description: 'Desenvolvimento de APIs robustas, autenticação segura, bancos de dados relacionais e integrações com meios de pagamento e IA.',
    iconName: 'Cpu',
    deliverables: [
      'APIs RESTful e microsserviços em Node.js / Express',
      'Bancos de dados estruturados (PostgreSQL, SQLite, Redis)',
      'Integração com gateways (Stripe, Mercado Pago, PIX)',
      'Conexão com modelos inteligentes de IA (Gemini API)',
    ],
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'REST / WebSockets'],
  },
];
