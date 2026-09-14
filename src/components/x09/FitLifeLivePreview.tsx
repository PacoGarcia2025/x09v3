import React from 'react';
import { Dumbbell, ArrowRight, Phone, CheckCircle2, ShieldCheck, Zap, Users, Trophy } from 'lucide-react';
import { FitLifeState } from '../../types/x09';

interface FitLifeLivePreviewProps {
  data: FitLifeState;
  deviceMode?: 'desktop' | 'mobile';
  showDualPreview?: boolean;
}

export const FitLifeLivePreview: React.FC<FitLifeLivePreviewProps> = ({
  data,
  deviceMode = 'desktop',
  showDualPreview = false,
}) => {
  const accent = data.accentColor || '#c4f039';

  const renderContent = (isMobileLayout: boolean) => (
    <div className={`w-full bg-zinc-950 text-white font-sans overflow-x-hidden ${isMobileLayout ? 'text-xs' : 'text-sm'}`}>
      {/* Top Notification Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Matrículas abertas para a temporada • Ganhe 1 mês de consultoria nutricional</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-lime-400" />
            {data.phone}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">Seg - Sex: 05h às 23h • Sáb/Dom: 08h às 18h</span>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-base shadow-sm"
            style={{ backgroundColor: accent }}
          >
            <Dumbbell className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-white text-base block leading-none">
              {data.name.toUpperCase()}
            </span>
            <span className="text-[9px] tracking-widest text-zinc-400 font-semibold uppercase">
              {data.slogan}
            </span>
          </div>
        </div>

        {!isMobileLayout && (
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-300 font-medium">
            <a href="#inicio" className="text-white hover:text-lime-300 transition-colors">Início</a>
            <a href="#modalidades" className="hover:text-lime-300 transition-colors">Modalidades</a>
            <a href="#planos" className="hover:text-lime-300 transition-colors">Planos</a>
            <a href="#estrutura" className="hover:text-lime-300 transition-colors">Estrutura</a>
            <a href="#app" className="hover:text-lime-300 transition-colors">App</a>
            <a href="#contato" className="hover:text-lime-300 transition-colors">Contato</a>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 text-zinc-950"
            style={{ backgroundColor: accent }}
          >
            <span>Quero treinar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section with dark fitness background */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex items-center px-4 sm:px-8 py-12 overflow-hidden">
        {/* Background Image with overlay gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
            alt="Atleta Treinando FitLife"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/50"></div>
          <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/60 to-zinc-950"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-xs font-semibold mb-4 text-zinc-300">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
            <span>EXPERIÊNCIA FITNESS ULTRA-PREMIUM</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-3">
            {data.headline}
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-lg mb-6 leading-relaxed">
            {data.subheadline} Equipamentos de padrão internacional, planos personalizados com IA e infraestrutura completa para você superar qualquer limite.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-zinc-950 flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: accent }}
            >
              <span>Comece agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 transition-colors"
            >
              Conheça nossos planos
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-zinc-900 border-y border-zinc-800 px-4 sm:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-zinc-800 sm:divide-x divide-y sm:divide-y-0">
          <div className="pt-2 sm:pt-0">
            <div className="text-lg sm:text-2xl font-black tracking-tight" style={{ color: accent }}>
              {data.activeStudents}
            </div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Alunos ativos</div>
          </div>
          <div className="pt-2 sm:pt-0">
            <div className="text-lg sm:text-2xl font-black tracking-tight text-white">
              {data.trainersCount}
            </div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Treinadores</div>
          </div>
          <div className="pt-2 sm:pt-0">
            <div className="text-lg sm:text-2xl font-black tracking-tight" style={{ color: accent }}>
              {data.satisfactionRate}
            </div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Satisfação</div>
          </div>
          <div className="pt-2 sm:pt-0">
            <div className="text-lg sm:text-2xl font-black tracking-tight text-white">
              {data.yearsHistory}
            </div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">De história</div>
          </div>
          <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
              DISCIPLINA TRANSFORMA
            </span>
          </div>
        </div>
      </section>

      {/* Modalities Cards */}
      <section id="modalidades" className="px-4 sm:px-8 py-8 bg-zinc-950">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
              PROGRAMAS DE ALTA INTENSIDADE
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase">
              Modalidades Exclusivas
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Treinos para todos os objetivos
          </span>
        </div>

        <div className={`grid gap-3 sm:gap-4 ${isMobileLayout ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {data.modalities.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <div className="h-28 sm:h-36 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              </div>
              <div className="p-3">
                <h3 className="font-black text-white text-xs sm:text-sm tracking-wide mb-1 flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }}></span>
                </h3>
                <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member App & Benefits */}
      <section className="px-4 sm:px-8 py-6 bg-zinc-900/50 border-t border-zinc-900">
        <div className="rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-4 sm:p-6 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" style={{ color: accent }} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">App FitLife incluso na sua assinatura</h4>
              <p className="text-xs text-zinc-400">Acompanhamento de séries, check-in facial e evolução biomecânica 24/7.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors"
            >
              Conhecer o App
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-950 transition-all shadow"
              style={{ backgroundColor: accent }}
            >
              Matricule-se
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 px-4 sm:px-8 py-4 text-center text-[10px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} {data.name} {data.slogan}. Todos os direitos reservados.</span>
        <span className="flex items-center gap-2">
          <span>WhatsApp de atendimento: {data.whatsapp}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
          <span className="text-zinc-400">Desenvolvido via X09 Studio</span>
        </span>
      </footer>
    </div>
  );

  if (deviceMode === 'mobile') {
    return (
      <div className="flex justify-center p-4">
        <div className="w-[340px] sm:w-[380px] rounded-[40px] p-3 bg-zinc-900 border-4 border-zinc-800 shadow-2xl relative">
          {/* Speaker / Camera pill */}
          <div className="w-28 h-4 bg-zinc-950 rounded-full mx-auto mb-2 border border-zinc-800 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 mr-2"></div>
            <div className="w-10 h-1 bg-zinc-800 rounded-full"></div>
          </div>
          <div className="rounded-[28px] overflow-hidden border border-zinc-800 max-h-[640px] overflow-y-auto">
            {renderContent(true)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Desktop Main view */}
      <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-950">
        {/* Browser Mockup Top Bar */}
        <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            <span className="ml-3 font-mono text-[11px] text-zinc-500">https://fitlife.x09.app</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SSL Ativo
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[620px] overflow-y-auto custom-scrollbar">
          {renderContent(false)}
        </div>
      </div>

      {/* Floating Smartphone Mockup (exact composition from reference image) */}
      {showDualPreview && (
        <div className="hidden xl:block absolute -right-6 -bottom-6 w-[230px] rounded-[32px] p-2 bg-zinc-900/95 border-2 border-zinc-700 shadow-2xl backdrop-blur-md z-20 transition-transform hover:-translate-y-2">
          <div className="w-16 h-3 bg-zinc-950 rounded-full mx-auto mb-1 border border-zinc-800"></div>
          <div className="rounded-[22px] overflow-hidden border border-zinc-800 max-h-[360px] overflow-y-auto text-[10px]">
            {renderContent(true)}
          </div>
        </div>
      )}
    </div>
  );
};
