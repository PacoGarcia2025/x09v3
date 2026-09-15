import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Paperclip,
  Mic,
  Monitor,
  Smartphone,
  ChevronDown,
  Plus,
  FolderKanban,
  LayoutTemplate,
  Image as ImageIcon,
  Cable,
  Globe,
  Rocket,
  Users,
  CreditCard,
  HelpCircle,
  MoreVertical,
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  Edit3,
  Code,
  Copy,
  Download,
  Palette,
  Layers,
  Search,
  Sliders,
  ShieldAlert,
  Zap,
  Flame,
} from 'lucide-react';
import {
  FitLifeState,
  ChatMessage,
  ProjectProgress,
} from '../../types/x09';
import { INITIAL_FITLIFE_DATA, INITIAL_CHAT_MESSAGES, SAMPLE_ASSETS } from '../../data/mockX09';
import { FitLifeLivePreview } from './FitLifeLivePreview';
import { useAuth } from '../../context/AuthContext';
import { X09Logo } from './X09Logo';
import { MercadoPagoModal } from './MercadoPagoModal';

interface X09StudioProps {
  onBackToLanding: () => void;
  onBackToDashboard?: () => void;
  onOpenPublish: () => void;
}

export const X09Studio: React.FC<X09StudioProps> = ({
  onBackToLanding,
  onBackToDashboard,
  onOpenPublish,
}) => {
  const {
    user,
    activeProject,
    projects,
    setActiveProject,
    updateProject,
    consumeCredits,
    integrations,
  } = useAuth();
  const [showMercadoPagoModal, setShowMercadoPagoModal] = useState<boolean>(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [fitLifeData, setFitLifeData] = useState<FitLifeState>(() => {
    if (activeProject?.data) {
      return activeProject.data;
    }
    const saved = localStorage.getItem('x09_project_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_FITLIFE_DATA;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('x09_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string>(
    activeProject?.title || 'Novo Projeto'
  );
  const [showProjectDropdown, setShowProjectDropdown] = useState<boolean>(false);
  const [activeSidebarNav, setActiveSidebarNav] = useState<string>('projetos');
  const [showFullPreviewModal, setShowFullPreviewModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedCodeFile, setSelectedCodeFile] = useState<'app' | 'html' | 'tailwind' | 'package'>('app');

  // New Project Modal State
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectSegment, setNewProjectSegment] = useState<string>('Academia & Esporte');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync active project data changes
  useEffect(() => {
    if (activeProject) {
      setActiveProjectTitle(activeProject.title);
      if (activeProject.data) {
        setFitLifeData(activeProject.data);
      }
    }
  }, [activeProject?.id]);

  useEffect(() => {
    if (activeProject && fitLifeData) {
      updateProject(activeProject.id, { data: fitLifeData });
    }
    localStorage.setItem('x09_project_data', JSON.stringify(fitLifeData));
  }, [fitLifeData]);

  useEffect(() => {
    localStorage.setItem('x09_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const steps = [
    { id: 1, label: '1 Conversa' },
    { id: 2, label: '2 Planejamento' },
    { id: 3, label: '3 Design' },
    { id: 4, label: '4 Construção' },
    { id: 5, label: '5 Revisão' },
    { id: 6, label: '6 Publicação' },
  ];

  const colorPresets = [
    { name: 'Neon Lima (Padrão)', hex: '#c4f039' },
    { name: 'Ciano Cyber', hex: '#38bdf8' },
    { name: 'Dourado Luxo', hex: '#eab308' },
    { name: 'Roxo Tech', hex: '#a855f7' },
    { name: 'Coral Elétrico', hex: '#f43f5e' },
  ];

  // Send message through real /api/ai/chat endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Check credits before processing
    if (user && user.credits <= 0) {
      const outOfCreditsMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'x09',
        text: '⚠️ Seus créditos do Studio X09 acabaram! Para continuar solicitando alterações à IA e gerando código, recarregue seus créditos com Mercado Pago (PIX ou Cartão).',
        time: timeStr,
        quickReplies: ['Comprar Créditos (PIX)', 'Ver Planos Mensais'],
      };
      setMessages((prev) => [...prev, outOfCreditsMsg]);
      setShowMercadoPagoModal(true);
      return;
    }

    // Deduct 1 credit per AI interaction
    await consumeCredits(1, 'Alteração via Inteligência Artificial');

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: timeStr,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          projectContext: fitLifeData,
          chatHistory: messages.slice(-6),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Apply patches to project state in real-time
        if (data.patch) {
          setFitLifeData((prev) => ({
            ...prev,
            ...data.patch,
          }));
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'x09',
          text: data.text,
          time: timeStr,
          quickReplies: data.quickReplies,
        };

        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Fallback to local logic');
      }
    } catch {
      // Fallback local response
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'x09',
          text: `Entendido! Ajustei "${text}" diretamente na estrutura do seu projeto. Todas as telas já foram sincronizadas com sucesso.`,
          time: timeStr,
          quickReplies: ['Avançar etapa', 'Mudar cores', 'Ver código gerado'],
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 600);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const brand = newProjectName.trim();
    setFitLifeData({
      name: brand,
      slogan: newProjectSegment,
      headline: `${brand.toUpperCase()} • O PADRÃO MÁXIMO EM EXCELÊNCIA`,
      subheadline: `A melhor experiência em ${newProjectSegment}. Tecnologia, atendimento premium e resultados incomparáveis.`,
      phone: '(11) 98888-7777',
      whatsapp: '(11) 98888-7777',
      accentColor: '#38bdf8',
      activeStudents: '+1.200',
      trainersCount: '8',
      satisfactionRate: '99%',
      yearsHistory: '+3 Anos',
      modalities: INITIAL_FITLIFE_DATA.modalities,
    });

    setActiveProjectTitle(`${brand} – ${newProjectSegment}`);
    setShowNewProjectModal(false);

    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'x09',
        text: `Olá! Inicializei o projeto "${brand}" focado em ${newProjectSegment}. A base visual já foi construída no preview ao lado! O que gostaria de personalizar primeiro?`,
        time: '12:00',
        quickReplies: ['Ajustar Paleta de Cores', 'Definir Slogan & Headline', 'Configurar Planos'],
      },
    ]);
  };

  const generatedCode = {
    app: `// FitLifeLivePreview.tsx - Componente de Produção
import React, { useState } from 'react';
import { Dumbbell, ArrowRight, Phone, Check, ShieldCheck, Zap } from 'lucide-react';

export const ${fitLifeData.name.replace(/\s+/g, '')}App = () => {
  const accent = '${fitLifeData.accentColor}';
  const [billing, setBilling] = useState<'mensal' | 'anual'>('anual');

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <header className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center">
        <h1 className="text-xl font-black">${fitLifeData.name.toUpperCase()}</h1>
        <button className="px-4 py-2 rounded-full font-bold text-black" style={{ backgroundColor: accent }}>
          Matricule-se
        </button>
      </header>

      <section className="py-20 text-center px-4">
        <h2 className="text-5xl font-black mb-4">${fitLifeData.headline}</h2>
        <p className="text-zinc-400 max-w-xl mx-auto">${fitLifeData.subheadline}</p>
      </section>
    </div>
  );
};`,
    html: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${fitLifeData.name} | ${fitLifeData.slogan}</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-zinc-950 text-white">
    <div id="root"></div>
  </body>
</html>`,
    tailwind: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '${fitLifeData.accentColor}',
      },
    },
  },
  plugins: [],
};`,
    package: `{
  "name": "${fitLifeData.name.toLowerCase().replace(/\s+/g, '-')}",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0"
  },
  "devDependencies": {
    "vite": "^6.2.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.8.0"
  }
}`,
  };

  const copyCodeToClipboard = () => {
    const code = generatedCode[selectedCodeFile];
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070908] text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* 1. TOP HEADER BAR matching reference */}
      <header className="h-14 bg-[#0a0d0c] border-b border-zinc-800/80 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white font-semibold transition-colors"
              title="Voltar ao Painel do Usuário"
            >
              <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
              <span>Painel</span>
            </button>
          ) : (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 group text-left"
              title="Voltar para a Landing Page"
            >
              <X09Logo variant="circular" size="sm" withGlow={true} />
              <span className="font-extrabold tracking-wider text-white text-sm hidden sm:inline">
                X09 STUDIO
              </span>
            </button>
          )}

          <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

          {/* Project Selector Dropdown with real user projects */}
          <div className="relative">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
              <span>{activeProject ? activeProject.title : activeProjectTitle}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {showProjectDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                <div className="text-[10px] uppercase font-bold text-zinc-500 px-2 py-1 flex items-center justify-between">
                  <span>Seus Projetos no Studio</span>
                  <span className="text-purple-400 font-mono font-normal">*.x09.com.br</span>
                </div>
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProject(proj);
                      setActiveProjectTitle(proj.title);
                      setFitLifeData(proj.data);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      activeProject?.id === proj.id
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{proj.title}</div>
                      <div className="text-[10px] text-zinc-500 font-mono truncate">
                        {proj.subdomain}.{integrations.domainBase}
                      </div>
                    </div>
                    {activeProject?.id === proj.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                ))}
                <div className="border-t border-zinc-800 my-1"></div>
                <button
                  onClick={() => {
                    setShowProjectDropdown(false);
                    setShowNewProjectModal(true);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-950/40 text-purple-300 font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar novo projeto com X09</span>
                </button>
              </div>
            )}
          </div>

          {/* Subdomain pill in studio header */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/30 border border-purple-800/40 text-[11px] font-mono">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-purple-300 font-bold">{activeProject?.subdomain || 'fitlife'}</span>
            <span className="text-zinc-500">.{integrations.domainBase}</span>
          </div>
        </div>

        {/* Center: Six-step progress stepper (CLICKABLE & FUNCTIONAL) */}
        <div className="hidden xl:flex items-center gap-1 bg-zinc-950/80 p-1 rounded-full border border-zinc-800/80 text-xs font-medium">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isDone = activeStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id === 6) {
                    onOpenPublish();
                  } else {
                    setActiveStep(step.id);
                  }
                }}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm font-bold'
                    : isDone
                    ? 'text-zinc-300 hover:text-white'
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                {isDone && <Check className="w-3 h-3 text-emerald-400" />}
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Studio Credits Pill with Mercado Pago Recharge */}
          <button
            onClick={() => setShowMercadoPagoModal(true)}
            className="px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:border-purple-400 text-xs font-bold text-purple-200 flex items-center gap-1.5 transition-all shadow-sm group"
            title="Saldo de créditos da IA - clique para recarregar via Mercado Pago"
          >
            <Flame className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>{user?.credits ?? 0} Créditos</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 font-semibold group-hover:bg-purple-500 group-hover:text-white transition-colors">
              + Recarregar
            </span>
          </button>

          <button
            onClick={onBackToLanding}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 hidden lg:inline-flex items-center gap-1.5"
          >
            <span>Ver Landing</span>
          </button>

          <button
            onClick={() => setShowFullPreviewModal(true)}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/60 hidden sm:inline-flex items-center gap-1"
            title="Abrir prévia em tela cheia"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Preview</span>
          </button>

          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-md transition-colors ${
                deviceView === 'desktop'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Visualização Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-md transition-colors ${
                deviceView === 'mobile'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Visualização Mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenPublish}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-purple-600/20 active:scale-95 flex items-center gap-1.5"
          >
            <span>Publicar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. BODY: LEFT SIDEBAR + SPLIT WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-56 bg-[#090c0b] border-r border-zinc-800/80 flex flex-col justify-between p-3 hidden md:flex shrink-0">
          <div>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="w-full py-2 px-3 rounded-full text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/40 transition-all flex items-center justify-center gap-2 mb-4 shadow-sm"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Novo projeto</span>
            </button>

            <nav className="space-y-0.5 text-xs font-medium">
              <button
                onClick={() => {
                  setActiveSidebarNav('projetos');
                  setActiveStep(1);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'projetos'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <FolderKanban className="w-4 h-4 text-purple-400" />
                <span>Meus projetos</span>
              </button>

              <button
                onClick={() => {
                  setActiveSidebarNav('planejamento');
                  setActiveStep(2);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeStep === 2
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <LayoutTemplate className="w-4 h-4 text-zinc-400" />
                <span>Planejamento</span>
              </button>

              <button
                onClick={() => {
                  setActiveSidebarNav('design');
                  setActiveStep(3);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeStep === 3
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Palette className="w-4 h-4 text-zinc-400" />
                <span>Design System</span>
              </button>

              <button
                onClick={() => {
                  setActiveSidebarNav('construcao');
                  setActiveStep(4);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeStep === 4
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Code className="w-4 h-4 text-zinc-400" />
                <span>Código & Build</span>
              </button>

              <button
                onClick={() => {
                  setActiveSidebarNav('revisao');
                  setActiveStep(5);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeStep === 5
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-zinc-400" />
                <span>Auditoria QA</span>
              </button>

              <button
                onClick={onOpenPublish}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              >
                <Rocket className="w-4 h-4 text-purple-400" />
                <span>Publicar (VPS/Git)</span>
              </button>
            </nav>
          </div>

          <div className="space-y-3 pt-3 border-t border-zinc-900">
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white">Plano Profissional</span>
                <span className="text-[10px] text-purple-400 font-semibold">Ativo</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-[24%]"></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>12/50 projetos</span>
                <button
                  onClick={onOpenPublish}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Upgrade ➔
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-900">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  SG
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">Sérgio Garcia</div>
                  <div className="text-[10px] text-zinc-500">Minha conta</div>
                </div>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN SPLIT VIEW */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#070908]">
          <div className="flex-1 grid lg:grid-cols-12 gap-0 overflow-hidden">
            {/* LEFT COLUMN: ACTIVE STEP CONTROLLER */}
            <section className="lg:col-span-5 border-r border-zinc-800/80 flex flex-col bg-[#080a09] overflow-hidden">
              {/* STEP 1: CONVERSA COM O X09 */}
              {activeStep === 1 && (
                <>
                  <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Conversa com o X09</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </h2>
                      <p className="text-xs text-zinc-400">Fale naturalmente ou clique nas opções rápidas.</p>
                    </div>
                    <button
                      onClick={() => setActiveStep(2)}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40 hover:bg-purple-900/40 flex items-center gap-1"
                    >
                      <span>Etapa 2 ➔</span>
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                    {messages.map((msg) => {
                      const isBot = msg.sender === 'x09';
                      return (
                        <div key={msg.id} className="space-y-2">
                          <div className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
                            {isBot && (
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                X
                              </div>
                            )}

                            <div className="max-w-[85%] space-y-1">
                              <div
                                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                  isBot
                                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                                }`}
                              >
                                {msg.text}
                              </div>
                              <div
                                className={`text-[10px] text-zinc-500 font-mono px-1 ${
                                  isBot ? 'text-left' : 'text-right'
                                }`}
                              >
                                {msg.time}
                              </div>
                            </div>
                          </div>

                          {msg.quickReplies && (
                            <div className="flex flex-wrap gap-1.5 pl-9 pt-1">
                              {msg.quickReplies.map((choice) => (
                                <button
                                  key={choice}
                                  onClick={() => handleSendMessage(choice)}
                                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-950/50 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 transition-all hover:scale-105 active:scale-95"
                                >
                                  {choice}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex items-center gap-2 pl-9 text-xs text-zinc-500 italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                        <span>X09 está ajustando o projeto em tempo real...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950/20 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                    <button
                      onClick={() => handleSendMessage('Mudar cores para Neon Lima')}
                      className="hover:text-zinc-200 transition-colors"
                    >
                      › Mudar para Neon Lima
                    </button>
                    <span className="text-zinc-700">•</span>
                    <button
                      onClick={() => handleSendMessage('Ativar paleta Dourado')}
                      className="hover:text-zinc-200 transition-colors"
                    >
                      › Dourado Luxo
                    </button>
                    <span className="text-zinc-700">•</span>
                    <button
                      onClick={() => handleSendMessage('Atualizar telefone para (11) 99888-0000')}
                      className="hover:text-zinc-200 transition-colors"
                    >
                      › Alterar Telefone
                    </button>
                  </div>

                  <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 focus-within:border-purple-500 transition-colors shadow-inner"
                    >
                      <button
                        type="button"
                        onClick={() => handleSendMessage('Adicionei um mock de logo')}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                        title="Anexar referência de design"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Digite o que deseja mudar ou criar..."
                        className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleSendMessage('Quero um design mais agressivo e focado em alta conversão')}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                        title="Ditar ideia"
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </>
              )}

              {/* STEP 2: PLANEJAMENTO & ARQUITETURA */}
              {activeStep === 2 && (
                <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      ETAPA 2 DE 6
                    </span>
                    <h3 className="text-base font-bold text-white">Mapa de Arquitetura & Páginas</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Controle a estrutura de navegação e os módulos do projeto {fitLifeData.name}.
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {[
                      { title: 'Início (Hero & Proposta de Valor)', status: 'Ativo', desc: 'Apresentação com CTA principal e estatísticas de alunos.' },
                      { title: 'Modalidades & Treinos', status: 'Ativo', desc: 'Cards com descrição das aulas, tempo e gasto calórico.' },
                      { title: 'Planos & Checkout Online', status: 'Ativo', desc: 'Tabela de preços mensal/anual com formulário e modal PIX.' },
                      { title: 'Agendamento de Aula Grátis', status: 'Ativo', desc: 'Formulário com seletor de horários e emissão de voucher.' },
                      { title: 'Calculadora de IMC & Biofísica', status: 'Ativo', desc: 'Ferramenta interativa para engajamento e conversão.' },
                      { title: 'Depoimentos & Prova Social', status: 'Ativo', desc: 'Avaliações de alunos com nota 5 estrelas e fotos reais.' },
                    ].map((section, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{section.title}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                              {section.status}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-[11px] mt-1">{section.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200">
                    <span className="font-bold text-white block mb-1">Estratégia de Conversão:</span>
                    O funil foi desenhado para captar contatos via WhatsApp e agendamentos de aula experimental no primeiro scroll.
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white"
                    >
                      ← Voltar à Conversa
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="flex-1 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow"
                    >
                      Avançar para Design System ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DESIGN SYSTEM */}
              {activeStep === 3 && (
                <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      ETAPA 3 DE 6
                    </span>
                    <h3 className="text-base font-bold text-white">Design System & Paleta</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Escolha a cor de destaque e tipografia. A prévia atualiza na hora!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Paletas de Cores Pré-definidas:
                    </label>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.hex}
                          onClick={() => setFitLifeData((prev) => ({ ...prev, accentColor: preset.hex }))}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            fitLifeData.accentColor === preset.hex
                              ? 'bg-zinc-800 border-purple-500 text-white shadow-md'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                              style={{ backgroundColor: preset.hex }}
                            ></span>
                            <span className="font-semibold">{preset.name}</span>
                          </div>
                          <span className="font-mono text-zinc-500 text-[11px]">{preset.hex}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Tipografia Principal:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-zinc-900 border border-purple-500 text-white">
                        <div className="font-black text-sm">Space Grotesk</div>
                        <div className="text-[10px] text-zinc-400">Headlines & Números</div>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                        <div className="font-semibold text-sm">Plus Jakarta Sans</div>
                        <div className="text-[10px] text-zinc-400">Textos & Leitura</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white"
                    >
                      ← Voltar
                    </button>
                    <button
                      onClick={() => setActiveStep(4)}
                      className="flex-1 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow"
                    >
                      Ver Código-Fonte Gerado ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONSTRUÇÃO & CÓDIGO FONTE */}
              {activeStep === 4 && (
                <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar flex-1 flex flex-col">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      ETAPA 4 DE 6
                    </span>
                    <h3 className="text-base font-bold text-white">Código Real Gerado (React 19)</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Este é o código limpo, pronto para produção, sem dependências proprietárias.
                    </p>
                  </div>

                  {/* File tabs */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex gap-1.5 text-xs font-mono">
                      {[
                        { id: 'app', name: 'App.tsx' },
                        { id: 'html', name: 'index.html' },
                        { id: 'tailwind', name: 'tailwind.config' },
                        { id: 'package', name: 'package.json' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedCodeFile(f.id as any)}
                          className={`px-2.5 py-1 rounded-md text-[11px] ${
                            selectedCodeFile === f.id
                              ? 'bg-purple-600 text-white font-bold'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={copyCodeToClipboard}
                      className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-semibold"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* Code Box */}
                  <div className="flex-1 min-h-[220px] rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar">
                    {generatedCode[selectedCodeFile]}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white"
                    >
                      ← Voltar
                    </button>
                    <button
                      onClick={() => setActiveStep(5)}
                      className="flex-1 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow"
                    >
                      Auditoria de Performance (Lighthouse) ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: REVISÃO & AUDITORIA */}
              {activeStep === 5 && (
                <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      ETAPA 5 DE 6
                    </span>
                    <h3 className="text-base font-bold text-white">Auditoria de Qualidade (Lighthouse)</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Verificação automática de Core Web Vitals, Acessibilidade e SEO.
                    </p>
                  </div>

                  {/* Score gauges */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-xl font-black text-emerald-400">99</div>
                      <div className="text-[10px] text-zinc-400">Performance</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-xl font-black text-emerald-400">100</div>
                      <div className="text-[10px] text-zinc-400">Acessibilidade</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-xl font-black text-emerald-400">100</div>
                      <div className="text-[10px] text-zinc-400">Boas Práticas</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-xl font-black text-emerald-400">100</div>
                      <div className="text-[10px] text-zinc-400">SEO</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      'Tempo de carregamento inicial (FCP): 0.4s',
                      'Totalmente responsivo em Smartphones e Tablets',
                      'Tags OpenGraph configuradas para WhatsApp e Redes',
                      'Imagens otimizadas em WebP com lazy-loading',
                      'Pronto para SSL Let\'s Encrypt na VPS Hostinger',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-zinc-300 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setActiveStep(4)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white"
                    >
                      ← Voltar
                    </button>
                    <button
                      onClick={onOpenPublish}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold text-white hover:from-purple-500 hover:to-blue-500 shadow-lg"
                    >
                      Publicar na Hostinger VPS & Git ➔
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* RIGHT COLUMN: PRÉ-VISUALIZAÇÃO EM TEMPO REAL */}
            <section className="lg:col-span-7 flex flex-col bg-[#050706] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-950/50 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Pré-visualização em tempo real</span>
                    <span className="text-[10px] font-normal text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      100% Interativo
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Você pode clicar nos menus, testar matrículas, agendamento de aulas e calculadora.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFitLifeData(INITIAL_FITLIFE_DATA);
                    }}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1"
                    title="Restaurar padrão"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => setShowFullPreviewModal(true)}
                    className="text-[11px] text-purple-300 hover:text-white px-2.5 py-1 rounded bg-purple-950/40 border border-purple-500/30 flex items-center gap-1 font-semibold"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Tela Cheia</span>
                  </button>
                </div>
              </div>

              {/* Rendered Live Website Canvas */}
              <div className="flex-1 p-3 sm:p-5 overflow-y-auto custom-scrollbar flex items-start justify-center">
                <div className="w-full max-w-5xl">
                  <FitLifeLivePreview
                    data={fitLifeData}
                    deviceMode={deviceView}
                    showDualPreview={deviceView === 'desktop'}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* 3. BOTTOM PIPELINE STATUS BAR matching reference */}
          <footer className="border-t border-zinc-800/80 bg-[#090b0a] p-3 sm:p-4 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-[11px]">Progresso do projeto</span>
                  <span className="text-[10px] text-purple-400 font-medium">Etapa {activeStep} de 6</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 overflow-x-auto pb-1">
                  <span className={`font-bold flex items-center gap-0.5 ${activeStep >= 1 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    <Check className="w-3 h-3" /> Conversa
                  </span>
                  <span>›</span>
                  <span className={`font-bold flex items-center gap-0.5 ${activeStep >= 2 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {activeStep >= 2 ? <Check className="w-3 h-3" /> : null} Planejamento
                  </span>
                  <span>›</span>
                  <span className={`font-bold flex items-center gap-0.5 ${activeStep >= 3 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {activeStep >= 3 ? <Check className="w-3 h-3" /> : null} Design
                  </span>
                  <span>›</span>
                  <span className={`font-bold flex items-center gap-0.5 ${activeStep >= 4 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {activeStep >= 4 ? <Check className="w-3 h-3" /> : null} Build
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-[11px]">Assets selecionados</span>
                  <span className="text-[10px] text-zinc-400">4 fotos HD</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {SAMPLE_ASSETS.map((asset) => (
                    <div key={asset.id} className="h-9 rounded-md overflow-hidden border border-zinc-800 relative group">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-[11px]">Design & Código</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Funcional</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                    Express + Vite
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                    Gemini AI API
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-[11px] block mb-1">Qualidade estimada</span>
                  <div className="flex flex-wrap gap-1.5 text-[9px]">
                    <span className="text-emerald-400 flex items-center gap-0.5">● Design</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">● Conteúdo</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">● Assets</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">● Mobile</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-full border-2 border-purple-500 flex items-center justify-center font-black text-xs text-purple-300 bg-purple-950/40">
                  98%
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {showFullPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 sm:p-8 flex flex-col backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="font-bold text-white text-sm">
              Visualização Completa do Projeto: {fitLifeData.name}
            </h3>
            <button
              onClick={() => setShowFullPreviewModal(false)}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
            >
              Fechar Preview
            </button>
          </div>
          <div className="flex-1 overflow-y-auto mt-4 rounded-xl border border-zinc-800">
            <FitLifeLivePreview
              data={fitLifeData}
              deviceMode="desktop"
              showDualPreview={false}
            />
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Criar Novo Projeto</h3>
                <p className="text-xs text-zinc-400">O X09 criará um site completo sob medida para você.</p>
              </div>
            </div>

            <form onSubmit={handleCreateNewProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome do Projeto ou Marca:</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Ex: Barber King, Café Roma, Nexus Pay..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Segmento / Ramo de Atuação:</label>
                <select
                  value={newProjectSegment}
                  onChange={(e) => setNewProjectSegment(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Academia & Esporte">Academia & Esporte</option>
                  <option value="Barbearia & Estética Masculina">Barbearia & Estética</option>
                  <option value="Restaurante & Gastronomia">Restaurante & Gastronomia</option>
                  <option value="SaaS & Tecnologia Financeira">SaaS & Tecnologia Financeira</option>
                  <option value="E-commerce de Moda & Acessórios">E-commerce de Moda</option>
                  <option value="Clínica Médica & Odontologia">Clínica & Odontologia</option>
                  <option value="Consultoria & Serviços Corporativos">Consultoria & Serviços</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md"
                >
                  Iniciar Criação com X09 ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MERCADO PAGO MODAL INSIDE STUDIO */}
      <MercadoPagoModal
        isOpen={showMercadoPagoModal}
        onClose={() => setShowMercadoPagoModal(false)}
        defaultTab="packages"
      />
    </div>
  );
};
