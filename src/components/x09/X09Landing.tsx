import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Layers,
  Zap,
  Globe,
  Smartphone,
  Palette,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageSquare,
  Flame,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SHOWCASE_PROJECTS } from '../../data/mockX09';
import { FitLifeLivePreview } from './FitLifeLivePreview';
import { INITIAL_FITLIFE_DATA } from '../../data/mockX09';

interface X09LandingProps {
  onOpenStudio: () => void;
  onOpenDeployGuide: () => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: () => void;
}

export const X09Landing: React.FC<X09LandingProps> = ({
  onOpenStudio,
  onOpenDeployGuide,
  onOpenDashboard,
  onOpenAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);

  const categories = ['Todos', 'Sites', 'SaaS', 'Apps', 'E-commerces'];

  const filteredProjects =
    selectedCategory === 'Todos'
      ? SHOWCASE_PROJECTS
      : SHOWCASE_PROJECTS.filter((p) => p.category === selectedCategory);

  const currentProject = filteredProjects[activeProjectIndex % filteredProjects.length] || filteredProjects[0];

  const handleNextProject = () => {
    setActiveProjectIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrevProject = () => {
    setActiveProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  return (
    <div className="min-h-screen bg-[#060809] text-white font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      {/* Background Ambient Cosmic Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-purple-700/25 via-blue-600/15 to-transparent blur-[140px] rounded-full"></div>
        <div className="absolute top-[800px] left-[-100px] w-[500px] h-[500px] bg-purple-900/15 blur-[160px] rounded-full"></div>
        <div className="absolute top-[1400px] right-[-100px] w-[600px] h-[600px] bg-blue-900/15 blur-[160px] rounded-full"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Top Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#060809]/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-purple-600/30">
              X
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-white text-lg">
                X09
              </span>
              <span className="font-light tracking-widest text-purple-400 text-xs uppercase px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                STUDIO 2.0
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-zinc-300">
            <a href="#inicio" className="text-white hover:text-purple-400 transition-colors">Início</a>
            <a href="#como-funciona" className="hover:text-purple-400 transition-colors">Como funciona</a>
            <a href="#exemplos" className="hover:text-purple-400 transition-colors">Exemplos</a>
            <a href="#recursos" className="hover:text-purple-400 transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-purple-400 transition-colors">Planos</a>
            <button
              onClick={onOpenDeployGuide}
              className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>VPS & Git</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
                else if (onOpenDashboard) onOpenDashboard();
                else onOpenStudio();
              }}
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              Entrar
            </button>
            {onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white px-3 py-1.5 rounded-lg bg-purple-950/50 border border-purple-800/50 hover:bg-purple-900/60 transition-colors"
              >
                <span>Painel Studio</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">.x09</span>
              </button>
            )}
            <button
              onClick={onOpenStudio}
              className="px-4 sm:px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-600/25 active:scale-95 flex items-center gap-1.5"
            >
              <span>Começar agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION matching x09-landing-reference.png */}
        <section id="inicio" className="pt-12 sm:pt-20 pb-16 px-4 sm:px-8 text-center max-w-5xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-8 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>✦ SUA IDEIA. EM ALTO NÍVEL.</span>
          </div>

          {/* Main Massive Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Descreva.<br />
            A gente cria.<br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Você se impressiona.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            O X09 Studio transforma suas ideias em sites, SaaS, apps e sistemas com qualidade premium, usando apenas uma conversa. Sem código. Sem complicação. Apenas resultados extraordinários.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={onOpenStudio}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-xl shadow-purple-600/30 hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Começar agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#exemplos"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current text-zinc-300" />
              <span>Ver exemplos</span>
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-zinc-400">
            <div className="flex items-center -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                alt="Usuário"
                className="w-7 h-7 rounded-full border-2 border-zinc-950 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="Usuário"
                className="w-7 h-7 rounded-full border-2 border-zinc-950 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                alt="Usuário"
                className="w-7 h-7 rounded-full border-2 border-zinc-950 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                alt="Usuário"
                className="w-7 h-7 rounded-full border-2 border-zinc-950 object-cover"
              />
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-zinc-300 font-medium">
              Mais de 10.000 pessoas já criaram o futuro com o X09 Studio.
            </span>
          </div>

          {/* HERO VISUAL MOCKUP (Floating Chat & Live Result Tablet from Reference) */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            {/* Annotation Arrow 1 (Da sua ideia para a realidade) */}
            <div className="hidden lg:flex absolute -left-12 top-10 flex-col items-center z-30 pointer-events-none">
              <span className="font-mono text-[11px] text-purple-300 italic px-2 py-1 rounded bg-zinc-900/90 border border-purple-800/40">
                Da sua ideia para a realidade
              </span>
              <span className="text-purple-400 text-xs">⤵</span>
            </div>

            {/* Annotation Arrow 2 (Resultado real. Pronto para usar.) */}
            <div className="hidden lg:flex absolute right-4 -top-6 flex-col items-center z-30 pointer-events-none">
              <span className="font-mono text-[11px] text-lime-300 italic px-2 py-1 rounded bg-zinc-900/90 border border-lime-800/40">
                Resultado real. Pronto para usar.
              </span>
              <span className="text-lime-400 text-xs">⤵</span>
            </div>

            <div className="relative rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-zinc-800/60 via-zinc-900/40 to-transparent border border-zinc-800 shadow-2xl backdrop-blur-md">
              {/* Dual presentation: Left interactive dialog, Right live tablet preview */}
              <div className="grid lg:grid-cols-12 gap-4 items-center">
                {/* Floating Chat Bubble Simulation */}
                <div className="lg:col-span-4 rounded-xl bg-zinc-950/90 border border-zinc-800 p-4 text-left shadow-xl">
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-900 mb-3">
                    <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                      X09
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none">X09 Studio</h4>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Online agora
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* User Prompt */}
                    <div className="flex justify-end">
                      <div className="bg-purple-600/30 border border-purple-500/40 text-purple-200 px-3 py-2 rounded-xl rounded-tr-none max-w-[88%]">
                        Crie um SaaS moderno para academia
                      </div>
                    </div>

                    {/* Bot Answer */}
                    <div className="flex justify-start">
                      <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-2 rounded-xl rounded-tl-none max-w-[92%] leading-relaxed">
                        Vou te fazer algumas perguntas para criar o projeto perfeito... Qual o nome do seu SaaS?
                      </div>
                    </div>

                    {/* User Answer */}
                    <div className="flex justify-end">
                      <div className="bg-purple-600/30 border border-purple-500/40 text-purple-200 px-3 py-1.5 rounded-xl rounded-tr-none text-[11px]">
                        FitLife
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center gap-2">
                    <div className="flex-1 bg-zinc-900 px-3 py-1.5 rounded-lg text-xs text-zinc-500 border border-zinc-800">
                      Digite sua resposta...
                    </div>
                    <button
                      onClick={onOpenStudio}
                      className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Tablet Preview (FITLIFE) */}
                <div className="lg:col-span-8 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                  <FitLifeLivePreview
                    data={INITIAL_FITLIFE_DATA}
                    deviceMode="desktop"
                    showDualPreview={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE BADGES ROW matching x09-landing-reference.png */}
        <section className="py-6 border-y border-zinc-800/80 bg-zinc-950/60 overflow-x-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between min-w-[760px] gap-6 text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span><strong>Sites incríveis</strong> (com efeitos avançados)</span>
            </div>
            <div className="text-zinc-700">•</div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span><strong>SaaS completos</strong> (prontos para escalar)</span>
            </div>
            <div className="text-zinc-700">•</div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span><strong>Apps modernos</strong> (iOS e Android)</span>
            </div>
            <div className="text-zinc-700">•</div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-400" />
              <span><strong>Design premium</strong> (que impressiona)</span>
            </div>
            <div className="text-zinc-700">•</div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span><strong>100% por IA</strong> (você só conversa)</span>
            </div>
          </div>
        </section>

        {/* THREE BENTO SHOWCASE CARDS matching x09-landing-reference.png */}
        <section id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Card 1: MAIS QUE UMA FERRAMENTA */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col justify-between p-6 sm:p-8 min-h-[440px] group hover:border-purple-500/50 transition-all">
              {/* Background atmospheric photo */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80"
                  alt="Atmosphere"
                  className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <span className="text-[11px] font-bold text-purple-400 tracking-wider uppercase block mb-3">
                  ✦ MAIS QUE UMA FERRAMENTA
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                  Imagine o que você pode construir hoje.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xs">
                  Do simples ao extraordinário. O X09 Studio está aqui para transformar qualquer ideia em realidade digital.
                </p>
              </div>

              <div className="relative z-10 pt-8">
                <button
                  onClick={onOpenStudio}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md transition-all active:scale-95 flex items-center gap-2 mb-6"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-4 text-center">
                  <div>
                    <div className="text-base font-black text-white">10X</div>
                    <div className="text-[10px] text-zinc-400">mais rápido</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-white">0</div>
                    <div className="text-[10px] text-zinc-400">código necessário</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-white">100%</div>
                    <div className="text-[10px] text-zinc-400">na sua ideia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: EXEMPLOS REAIS (Interactive Project Showcase) */}
            <div id="exemplos" className="relative rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between p-6 sm:p-8 min-h-[440px] hover:border-indigo-500/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">
                    ✦ EXEMPLOS REAIS
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevProject}
                      className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextProject}
                      className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-4">
                  Projetos que falam por si só.
                </h3>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveProjectIndex(0);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Active Project Spotlight */}
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 p-3">
                  <div className="h-32 rounded-lg overflow-hidden relative mb-3">
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                      {currentProject.category}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white mb-0.5">
                    {currentProject.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                    {currentProject.subtitle}
                  </p>
                  <span className="text-[10px] font-mono text-indigo-300">
                    {currentProject.metrics}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <button
                  onClick={onOpenStudio}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <span>Criar projeto como este</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {activeProjectIndex + 1} de {filteredProjects.length}
                </span>
              </div>
            </div>

            {/* Card 3: SEM COMPLICAÇÃO (Step by Step Pipeline) */}
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between p-6 sm:p-8 min-h-[440px] hover:border-emerald-500/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
                    SEM COMPLICAÇÃO
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300 italic">
                    Simples assim.
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-5">
                  Você sonha. A IA constrói.
                </h3>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">1. Converse</h4>
                      <p className="text-[11px] text-zinc-400">Diga o que você quer criar com suas próprias palavras.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">2. Responda</h4>
                      <p className="text-[11px] text-zinc-400">A IA faz as perguntas certas e ajusta cada detalhe visual.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">3. Receba</h4>
                      <p className="text-[11px] text-zinc-400">Seu projeto pronto, responsivo e publicado na sua VPS ou GitHub.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={onOpenStudio}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER matching x09-landing-reference.png */}
        <section className="pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-blue-900/60 border border-purple-500/30 text-center shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                O futuro da criação digital já começou.
              </h2>
              <p className="text-sm sm:text-base text-purple-200/90 mb-8 leading-relaxed">
                Junte-se a milhares de pessoas que já estão construindo o extraordinário com o X09 Studio.
              </p>
              <button
                onClick={onOpenStudio}
                className="px-8 py-3.5 rounded-full text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-100 transition-all shadow-xl hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                <span>Quero criar agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#040607] px-4 sm:px-8 py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">X09 STUDIO 2.0</span>
            <span>•</span>
            <span>Descreva. A gente cria. Você se impressiona.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenDeployGuide} className="hover:text-zinc-300 transition-colors">
              Deploy Hostinger VPS & GitHub
            </button>
            <span>•</span>
            <button onClick={onOpenStudio} className="hover:text-zinc-300 transition-colors">
              Abrir Studio Workspace
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
