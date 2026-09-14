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
} from 'lucide-react';
import {
  FitLifeState,
  ChatMessage,
  ProjectProgress,
} from '../../types/x09';
import {
  INITIAL_FITLIFE_DATA,
  INITIAL_CHAT_MESSAGES,
  SAMPLE_ASSETS,
} from '../../data/mockX09';
import { FitLifeLivePreview } from './FitLifeLivePreview';

interface X09StudioProps {
  onBackToLanding: () => void;
  onOpenPublish: () => void;
}

export const X09Studio: React.FC<X09StudioProps> = ({
  onBackToLanding,
  onOpenPublish,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [fitLifeData, setFitLifeData] = useState<FitLifeState>(INITIAL_FITLIFE_DATA);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string>('FitLife – Academia Premium');
  const [showProjectDropdown, setShowProjectDropdown] = useState<boolean>(false);
  const [activeSidebarNav, setActiveSidebarNav] = useState<string>('projetos');
  const [showFullPreviewModal, setShowFullPreviewModal] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: timeStr,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Context-aware AI bot logic
    setTimeout(() => {
      let botResponse: string;
      let quickOptions: string[] | undefined;

      const lower = text.toLowerCase();

      if (lower.includes('apenas este') || lower.includes('não tenho outro') || lower.includes('seguir')) {
        botResponse = 'Excelente! Agora me diga: qual o tom e identidade visual que você deseja transmitir? Algo mais Neon Vibrante (Lima / Preto) como as academias modernas, Minimalista Dark, ou Dourado Luxo?';
        quickOptions = ['Neon Lima & Preto', 'Minimalista Dark', 'Dourado Luxo', 'Ciano Elétrico'];
      } else if (lower.includes('neon') || lower.includes('lima')) {
        setFitLifeData((prev) => ({ ...prev, accentColor: '#c4f039' }));
        botResponse = 'Perfeito! Apliquei a paleta Neon Lima de alta energia na pré-visualização. Quais as principais modalidades que sua academia oferece?';
        quickOptions = ['Musculação, Funcional e Cross', 'Apenas Musculação', 'Lutas, Dança e Musculação'];
      } else if (lower.includes('minimalista')) {
        setFitLifeData((prev) => ({ ...prev, accentColor: '#38bdf8' }));
        botResponse = 'Ótima escolha! Estilo Minimalista sofisticado aplicado com toques em ciano. Deseja incluir valores de planos ou chamada direta para WhatsApp?';
        quickOptions = ['Mostrar Planos (Mensal/Anual)', 'Botão direto para WhatsApp'];
      } else if (lower.includes('dourado') || lower.includes('luxo')) {
        setFitLifeData((prev) => ({ ...prev, accentColor: '#eab308' }));
        botResponse = 'Visual Dourado Luxo ativado no layout! A marca agora transmite exclusividade máxima. Gostaria de alterar o slogan principal?';
        quickOptions = ['Manter atual', 'Mudar para "Sua melhor versão"', 'Inserir meu próprio slogan'];
      } else {
        botResponse = `Entendido! Incorporei "${text}" diretamente na estrutura do seu projeto. O design e os textos já foram sincronizados ao lado. Deseja avançar para a etapa de Planejamento de Páginas?`;
        quickOptions = ['Sim, avançar!', 'Ajustar mais detalhes de contato', 'Ver publicação na Hostinger'];
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'x09',
        text: botResponse,
        time: timeStr,
        quickReplies: quickOptions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#070908] text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* 1. TOP HEADER BAR matching x09-studio-reference.png */}
      <header className="h-14 bg-[#0a0d0c] border-b border-zinc-800/80 px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Logo & Project selector */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 group text-left"
            title="Voltar para a Landing Page"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-white text-xs shadow-md">
              X
            </div>
            <span className="font-extrabold tracking-wider text-white text-sm hidden sm:inline">
              X09 STUDIO
            </span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

          {/* Project Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
              <span>{activeProjectTitle}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {showProjectDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                <div className="text-[10px] uppercase font-bold text-zinc-500 px-2 py-1">
                  Seus Projetos
                </div>
                <button
                  onClick={() => {
                    setActiveProjectTitle('FitLife – Academia Premium');
                    setShowProjectDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg bg-zinc-800/80 text-white font-medium flex items-center justify-between"
                >
                  <span>FitLife – Academia Premium</span>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </button>
                <button
                  onClick={() => {
                    setActiveProjectTitle('Nexus – Dashboard Financeiro');
                    setShowProjectDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  Nexus – Dashboard Financeiro
                </button>
                <button
                  onClick={() => {
                    setActiveProjectTitle('Bella – Moda & E-commerce');
                    setShowProjectDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  Bella – Moda & E-commerce
                </button>
                <div className="border-t border-zinc-800 my-1"></div>
                <button
                  onClick={() => {
                    setShowProjectDropdown(false);
                    onOpenPublish();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-950/40 text-purple-300 font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar novo projeto com X09</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Six-step progress stepper */}
        <div className="hidden xl:flex items-center gap-1 bg-zinc-950/80 p-1 rounded-full border border-zinc-800/80 text-xs font-medium">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isDone = activeStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
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
          {/* Landing Mode quick toggle */}
          <button
            onClick={onBackToLanding}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 hidden lg:inline-flex items-center gap-1.5"
          >
            <span>Ver Landing</span>
          </button>

          {/* New Tab / Full Preview */}
          <button
            onClick={() => setShowFullPreviewModal(true)}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/60 hidden sm:inline-flex items-center gap-1"
            title="Abrir prévia em tela cheia"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Preview</span>
          </button>

          {/* Device Toggle */}
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

          {/* Primary Action Button: Publicar */}
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
        {/* LEFT SIDEBAR matching x09-studio-reference.png */}
        <aside className="w-56 bg-[#090c0b] border-r border-zinc-800/80 flex flex-col justify-between p-3 hidden md:flex shrink-0">
          <div>
            {/* New Project Button */}
            <button
              onClick={onOpenPublish}
              className="w-full py-2 px-3 rounded-full text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/40 transition-all flex items-center justify-center gap-2 mb-4 shadow-sm"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Novo projeto</span>
            </button>

            {/* Navigation links */}
            <nav className="space-y-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveSidebarNav('projetos')}
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
                onClick={() => setActiveSidebarNav('templates')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'templates'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <LayoutTemplate className="w-4 h-4 text-zinc-400" />
                <span>Templates</span>
              </button>

              <button
                onClick={() => setActiveSidebarNav('assets')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'assets'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span>Biblioteca de assets</span>
              </button>

              <button
                onClick={() => setActiveSidebarNav('integracoes')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'integracoes'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Cable className="w-4 h-4 text-zinc-400" />
                <span>Integrações</span>
              </button>

              <button
                onClick={() => setActiveSidebarNav('dominios')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'dominios'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Globe className="w-4 h-4 text-zinc-400" />
                <span>Domínios</span>
              </button>

              <button
                onClick={onOpenPublish}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'publicar'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Rocket className="w-4 h-4 text-purple-400" />
                <span>Publicar</span>
              </button>

              <button
                onClick={() => setActiveSidebarNav('equipe')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'equipe'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Users className="w-4 h-4 text-zinc-400" />
                <span>Equipe</span>
              </button>

              <button
                onClick={() => setActiveSidebarNav('planos')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'planos'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-zinc-400" />
                <span>Planos</span>
              </button>

              <button
                onClick={() => setActiveSidebarNav('ajuda')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSidebarNav === 'ajuda'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-zinc-400" />
                <span>Ajuda</span>
              </button>
            </nav>
          </div>

          {/* Bottom Plan Widget & User Profile */}
          <div className="space-y-3 pt-3 border-t border-zinc-900">
            {/* Plan Card */}
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

            {/* User Profile */}
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

        {/* MAIN SPLIT VIEW: CHAT INTERVIEW (LEFT) + LIVE PREVIEW (RIGHT) */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#070908]">
          <div className="flex-1 grid lg:grid-cols-12 gap-0 overflow-hidden">
            {/* LEFT COLUMN: CONVERSA COM O X09 matching reference */}
            <section className="lg:col-span-5 border-r border-zinc-800/80 flex flex-col bg-[#080a09] overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Conversa com o X09</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h2>
                  <p className="text-xs text-zinc-400">Vamos criar algo incrível juntos.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Etapa 1 de 6
                </span>
              </div>

              {/* Chat Message Stream */}
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

                      {/* Quick Reply Pills (as seen in the reference screenshot) */}
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

              {/* Chat Auxiliary Helper Chips matching reference */}
              <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950/20 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                <button
                  onClick={() => handleSendMessage('Pular esta pergunta')}
                  className="hover:text-zinc-200 transition-colors"
                >
                  › Pular esta pergunta
                </button>
                <span className="text-zinc-700">•</span>
                <button
                  onClick={() => handleSendMessage('Por que você pergunta isso?')}
                  className="hover:text-zinc-200 transition-colors"
                >
                  Por que você pergunta isso?
                </button>
                <span className="text-zinc-700">•</span>
                <button
                  onClick={() => handleSendMessage('Posso responder mais tarde?')}
                  className="hover:text-zinc-200 transition-colors"
                >
                  Posso responder mais tarde?
                </button>
              </div>

              {/* Input Area matching reference */}
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
                    className="text-zinc-500 hover:text-zinc-300 p-1"
                    title="Anexar referência de design"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />

                  <button
                    type="button"
                    className="text-zinc-500 hover:text-zinc-300 p-1"
                    title="Gravar áudio com sua ideia"
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
            </section>

            {/* RIGHT COLUMN: PRÉ-VISUALIZAÇÃO EM TEMPO REAL matching reference */}
            <section className="lg:col-span-7 flex flex-col bg-[#050706] overflow-hidden">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-950/50 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Pré-visualização em tempo real</span>
                    <span className="text-[10px] font-normal text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Atualizado agora
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Conforme você responde, o X09 já constrói o seu projeto.
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

          {/* 3. BOTTOM PIPELINE STATUS BAR matching x09-studio-reference.png */}
          <footer className="border-t border-zinc-800/80 bg-[#090b0a] p-3 sm:p-4 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Card 1: Progresso do projeto */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-[11px]">Progresso do projeto</span>
                  <span className="text-[10px] text-purple-400 font-medium">Etapa 3 de 7</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 overflow-x-auto pb-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Entrevista
                  </span>
                  <span>›</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Conteúdo
                  </span>
                  <span>›</span>
                  <span className="text-purple-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                    Design
                  </span>
                  <span>›</span>
                  <span className="text-zinc-600">Assets</span>
                  <span>›</span>
                  <span className="text-zinc-600">Páginas</span>
                </div>
              </div>

              {/* Card 2: Assets sendo selecionados */}
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

              {/* Card 3: Design em construção */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-[11px]">Design & Código</span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Responsivo</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                    React 19 + Tailwind v4
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                    Vite SPA
                  </span>
                </div>
              </div>

              {/* Card 4: Qualidade estimada */}
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
                  78%
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Fullscreen Preview Modal */}
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
    </div>
  );
};
