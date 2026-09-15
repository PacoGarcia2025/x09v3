import React, { useState } from 'react';
import {
  Dumbbell,
  ArrowRight,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Trophy,
  Calendar,
  Clock,
  Check,
  Calculator,
  Flame,
  Award,
  ChevronRight,
  MessageCircle,
  X,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
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

  // Navigation state
  const [activeTab, setActiveTab] = useState<'inicio' | 'modalidades' | 'planos' | 'agendamento' | 'calculadora'>('inicio');

  // Plan billing state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Selected plan for checkout modal
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; period: string } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', email: '', payment: 'pix' });

  // Selected modality for details modal
  const [selectedModality, setSelectedModality] = useState<any | null>(null);

  // Booking state
  const [bookingModality, setBookingModality] = useState('Musculação');
  const [bookingTime, setBookingTime] = useState('18:30');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');

  // IMC Calculator state
  const [calcWeight, setCalcWeight] = useState<number>(75);
  const [calcHeight, setCalcHeight] = useState<number>(178);
  const [calcGoal, setCalcGoal] = useState<'hipertrofia' | 'emagrecimento' | 'condicionamento'>('hipertrofia');

  const imc = (calcWeight / ((calcHeight / 100) * (calcHeight / 100))).toFixed(1);
  const getImcStatus = () => {
    const val = parseFloat(imc);
    if (val < 18.5) return { text: 'Abaixo do peso', color: 'text-amber-400' };
    if (val < 24.9) return { text: 'Peso ideal e saudável', color: 'text-emerald-400' };
    if (val < 29.9) return { text: 'Sobrepeso leve', color: 'text-amber-400' };
    return { text: 'Atenção para saúde metabólica', color: 'text-rose-400' };
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.phone) return;
    setCheckoutStep('success');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) return;
    setBookingSuccess(true);
  };

  const renderContent = (isMobileLayout: boolean) => (
    <div className={`w-full bg-zinc-950 text-white font-sans overflow-x-hidden ${isMobileLayout ? 'text-xs' : 'text-sm'}`}>
      {/* Top Notification Bar */}
      <div className="bg-zinc-900/95 border-b border-zinc-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}></span>
          <span>Matrículas abertas • 1 mês de consultoria nutricional grátis na assinatura anual</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`https://wa.me/55${data.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20planos%20da%20${encodeURIComponent(data.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" style={{ color: accent }} />
            {data.phone}
          </a>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">Seg - Sex: 05h às 23h • Sáb/Dom: 08h às 18h</span>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div
          onClick={() => setActiveTab('inicio')}
          className="flex items-center gap-2 cursor-pointer"
        >
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
          <nav className="hidden md:flex items-center gap-5 text-xs text-zinc-300 font-medium">
            <button
              onClick={() => setActiveTab('inicio')}
              className={`transition-colors ${activeTab === 'inicio' ? 'text-white font-bold' : 'hover:text-white'}`}
              style={activeTab === 'inicio' ? { color: accent } : {}}
            >
              Início
            </button>
            <button
              onClick={() => setActiveTab('modalidades')}
              className={`transition-colors ${activeTab === 'modalidades' ? 'text-white font-bold' : 'hover:text-white'}`}
              style={activeTab === 'modalidades' ? { color: accent } : {}}
            >
              Modalidades
            </button>
            <button
              onClick={() => setActiveTab('planos')}
              className={`transition-colors ${activeTab === 'planos' ? 'text-white font-bold' : 'hover:text-white'}`}
              style={activeTab === 'planos' ? { color: accent } : {}}
            >
              Planos & Valores
            </button>
            <button
              onClick={() => setActiveTab('agendamento')}
              className={`transition-colors ${activeTab === 'agendamento' ? 'text-white font-bold' : 'hover:text-white'}`}
              style={activeTab === 'agendamento' ? { color: accent } : {}}
            >
              Aula Experimental
            </button>
            <button
              onClick={() => setActiveTab('calculadora')}
              className={`transition-colors ${activeTab === 'calculadora' ? 'text-white font-bold' : 'hover:text-white'}`}
              style={activeTab === 'calculadora' ? { color: accent } : {}}
            >
              Calculadora IMC
            </button>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('planos')}
            className="px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 text-zinc-950"
            style={{ backgroundColor: accent }}
          >
            <span>Quero treinar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      {activeTab === 'inicio' && (
        <>
          {/* Hero Section with dark fitness background */}
          <section className="relative min-h-[420px] flex items-center px-4 sm:px-8 py-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
                alt="Atleta Treinando FitLife"
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
                  onClick={() => setActiveTab('planos')}
                  className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-zinc-950 flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                  style={{ backgroundColor: accent }}
                >
                  <span>Comece agora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('agendamento')}
                  className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span>Agendar aula grátis</span>
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

          {/* Modalities Preview */}
          <section className="px-4 sm:px-8 py-10 bg-zinc-950">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
                  PROGRAMAS EXCLUSIVOS
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white uppercase">
                  Modalidades de Alta Performance
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('modalidades')}
                className="text-xs font-semibold hover:underline flex items-center gap-1"
                style={{ color: accent }}
              >
                <span>Ver todas as modalidades</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {data.modalities.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">
                  Tela em Branco • {data.name}
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mb-4 leading-relaxed">
                  Este projeto foi iniciado 100% do zero. Converse com o Assistente de IA no chat ao lado para gerar novas seções, catálogo de produtos, páginas ou integrações.
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-300 font-mono bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-800/40">
                  <span>Dica: "Crie uma seção de serviços em 3 colunas com botões de contato"</span>
                </div>
              </div>
            ) : (
              <div className={`grid gap-4 ${isMobileLayout ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
                {data.modalities.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedModality(item)}
                    className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-md"
                  >
                    <div className="h-32 sm:h-40 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-3.5">
                      <h3 className="font-black text-white text-xs sm:text-sm tracking-wide mb-1 flex items-center justify-between">
                        <span>{item.title}</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }}></span>
                      </h3>
                      <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <span className="text-[10px] font-bold flex items-center gap-1 text-zinc-300 group-hover:text-white">
                        <span>Ver detalhes</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Highlights & Quick CTA */}
          <section className="px-4 sm:px-8 py-6 bg-zinc-900/50 border-t border-zinc-900">
            <div className="rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-4 sm:p-6 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Treine sem taxa de matrícula</h4>
                  <p className="text-xs text-zinc-400">Assine online agora e receba acesso biométrico imediato via App.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('agendamento')}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors"
                >
                  Agendar Visita
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('planos')}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-950 transition-all shadow"
                  style={{ backgroundColor: accent }}
                >
                  Ver Planos
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* MODALIDADES TAB */}
      {activeTab === 'modalidades' && (
        <section className="px-4 sm:px-8 py-8 bg-zinc-950 min-h-[500px]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                GRADE DE ATIVIDADES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
                Modalidades & Metodologia
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                Treinos formulados por fisiologistas e especialistas para que cada minuto na academia gere resultados mensuráveis.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {data.modalities.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 p-4 flex gap-4 items-center hover:border-zinc-700 transition-all"
                >
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-24 h-24 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm mb-1">{m.title}</h3>
                    <p className="text-xs text-zinc-400 mb-3">{m.description}</p>
                    <button
                      onClick={() => setSelectedModality(m)}
                      className="text-xs font-bold px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    >
                      Ver horários e instrutores ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PLANOS & VALORES TAB */}
      {activeTab === 'planos' && (
        <section className="px-4 sm:px-8 py-8 bg-zinc-950 min-h-[500px]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                SEU INVESTIMENTO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
                Planos Transparentes Sem Surpresas
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2">
                Cancele quando quiser. Sem multas abusivas e sem taxa de adesão.
              </p>

              {/* Billing toggle */}
              <div className="mt-6 inline-flex items-center p-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    billingCycle === 'monthly' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    billingCycle === 'annual' ? 'text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                  style={billingCycle === 'annual' ? { backgroundColor: accent } : {}}
                >
                  <span>Anual</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black text-white font-bold">
                    -20% OFF
                  </span>
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Plano Básico */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Plano Smart</h3>
                  <p className="text-xs text-zinc-400 mb-4">Ideal para quem foca puramente em musculação.</p>
                  <div className="mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      R$ {billingCycle === 'annual' ? '79' : '99'}
                    </span>
                    <span className="text-xs text-zinc-400">/mês</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Área de musculação completa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Acesso em horário livre</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Zero taxa de matrícula</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedPlan({ name: 'Plano Smart', price: billingCycle === 'annual' ? 79 : 99, period: 'mensal' })}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors"
                >
                  Matricular Agora
                </button>
              </div>

              {/* Plano Black VIP (Destaque) */}
              <div
                className="rounded-2xl bg-zinc-900 border-2 p-5 flex flex-col justify-between relative shadow-xl"
                style={{ borderColor: accent }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black text-zinc-950 uppercase tracking-wide"
                  style={{ backgroundColor: accent }}
                >
                  MAIS POPULAR
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Plano Black VIP</h3>
                  <p className="text-xs text-zinc-400 mb-4">Experiência completa com todas as modalidades inclusas.</p>
                  <div className="mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      R$ {billingCycle === 'annual' ? '129' : '159'}
                    </span>
                    <span className="text-xs text-zinc-400">/mês</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Musculação + Aulas Coletivas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>App FitLife com treinos guiados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Cadeira de massagem pós-treino</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Leve 1 amigo para treinar 4x/mês</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedPlan({ name: 'Plano Black VIP', price: billingCycle === 'annual' ? 129 : 159, period: 'mensal' })}
                  className="w-full py-2.5 rounded-xl text-xs font-black text-zinc-950 shadow-md transition-transform active:scale-95"
                  style={{ backgroundColor: accent }}
                >
                  Assinar Black VIP
                </button>
              </div>

              {/* Plano Diamond Total */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Plano Diamond</h3>
                  <p className="text-xs text-zinc-400 mb-4">Nutricionista dedicado, bioimpedância e acompanhamento 1 a 1.</p>
                  <div className="mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      R$ {billingCycle === 'annual' ? '189' : '229'}
                    </span>
                    <span className="text-xs text-zinc-400">/mês</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Tudo do Plano Black VIP</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Consulta nutricional mensal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Bioimpedância médica periódica</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Acesso à Área VIP & Recovery Spa</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedPlan({ name: 'Plano Diamond', price: billingCycle === 'annual' ? 189 : 229, period: 'mensal' })}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors"
                >
                  Matricular Agora
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AULA EXPERIMENTAL TAB */}
      {activeTab === 'agendamento' && (
        <section className="px-4 sm:px-8 py-8 bg-zinc-950 min-h-[500px]">
          <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                PASSE VIP 100% GRATUITO
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                Agende sua Aula Experimental
              </h2>
              <p className="text-zinc-400 text-xs mt-1">
                Conheça a estrutura do {data.name} e treine com acompanhamento sem compromisso.
              </p>
            </div>

            {bookingSuccess ? (
              <div className="text-center p-6 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Aula Confirmada com Sucesso!</h3>
                <p className="text-xs text-zinc-300">
                  Parabéns, {bookingName}! Seu passe para a aula de <strong>{bookingModality}</strong> às <strong>{bookingTime}</strong> foi emitido.
                </p>
                <div className="p-3 bg-zinc-950 rounded-lg text-xs font-mono text-zinc-400">
                  Código de entrada: FIT-{Math.floor(100000 + Math.random() * 900000)}
                </div>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="text-xs text-purple-400 hover:underline pt-2 inline-block"
                >
                  Agendar outro horário
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Escolha a Modalidade:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Musculação', 'Funcional', 'Personal 1x1', 'Cross Training'].map((mod) => (
                      <button
                        type="button"
                        key={mod}
                        onClick={() => setBookingModality(mod)}
                        className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                          bookingModality === mod
                            ? 'bg-zinc-800 text-white border-zinc-600'
                            : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                        style={bookingModality === mod ? { borderColor: accent } : {}}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Horário de Preferência:</label>
                  <div className="flex flex-wrap gap-2">
                    {['06:00', '08:30', '12:00', '17:00', '18:30', '20:00'].map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setBookingTime(time)}
                        className={`px-3 py-1.5 rounded-lg border font-mono transition-all ${
                          bookingTime === time
                            ? 'bg-zinc-800 text-white border-zinc-600'
                            : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                        style={bookingTime === time ? { borderColor: accent } : {}}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Seu Nome Completo:</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">WhatsApp para Confirmação:</label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="(XX) 9XXXX-XXXX"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-black text-xs text-zinc-950 transition-all shadow-md active:scale-95"
                  style={{ backgroundColor: accent }}
                >
                  Confirmar Agendamento Gratuito
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* CALCULADORA FITNESS TAB */}
      {activeTab === 'calculadora' && (
        <section className="px-4 sm:px-8 py-8 bg-zinc-950 min-h-[500px]">
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                FERRAMENTA INTERATIVA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" style={{ color: accent }} />
                Calculadora de IMC & Biofísica
              </h2>
              <p className="text-zinc-400 text-xs mt-1">
                Calcule seus índices corporais e veja a recomendação de treinos do {data.name}.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-zinc-300 font-semibold mb-1">
                    <span>Peso Corporal:</span>
                    <span className="font-mono text-white">{calcWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="160"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full accent-lime-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 font-semibold mb-1">
                    <span>Altura:</span>
                    <span className="font-mono text-white">{calcHeight} cm</span>
                  </div>
                  <input
                    type="range"
                    min="130"
                    max="220"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value))}
                    className="w-full accent-lime-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Objetivo Principal:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'hipertrofia', label: 'Ganho Massa' },
                      { id: 'emagrecimento', label: 'Emagrecer' },
                      { id: 'condicionamento', label: 'Saúde & Foco' },
                    ].map((g) => (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setCalcGoal(g.id as any)}
                        className={`p-2 rounded-lg border text-[11px] font-semibold transition-all ${
                          calcGoal === g.id
                            ? 'bg-zinc-800 text-white'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                        }`}
                        style={calcGoal === g.id ? { borderColor: accent } : {}}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result card */}
              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 text-center space-y-3">
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                  Seu Índice de Massa Corporal
                </div>
                <div className="text-4xl font-black font-mono tracking-tight" style={{ color: accent }}>
                  {imc}
                </div>
                <div className={`text-xs font-bold ${getImcStatus().color}`}>
                  {getImcStatus().text}
                </div>
                <div className="border-t border-zinc-900 pt-3 text-[11px] text-zinc-400 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>Frequência sugerida:</span>
                    <span className="text-white font-bold">4x a 5x / semana</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meta de hidratação:</span>
                    <span className="text-white font-bold">{(calcWeight * 35 / 1000).toFixed(1)}L / dia</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modalidade indicada:</span>
                    <span className="text-lime-300 font-bold">
                      {calcGoal === 'hipertrofia' ? 'Musculação Hipertrófica' : calcGoal === 'emagrecimento' ? 'Funcional + Cardio HIIT' : 'Treino Híbrido'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('planos')}
                  className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-zinc-950 shadow"
                  style={{ backgroundColor: accent }}
                >
                  Ver Planos Recomendados
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 px-4 sm:px-8 py-5 text-center text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} {data.name} {data.slogan}. Todos os direitos reservados.</span>
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/55${data.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20${encodeURIComponent(data.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3 text-emerald-400" />
            <span>Falar no WhatsApp: {data.whatsapp}</span>
          </a>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-400">Criado com X09 Studio</span>
        </div>
      </footer>

      {/* MODAL DE CHECKOUT / MATRÍCULA EM TEMPO REAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => {
                setSelectedPlan(null);
                setCheckoutStep('form');
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutStep === 'form' ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    MATRÍCULA ONLINE INSTANTÂNEA
                  </span>
                  <h3 className="text-lg font-black text-white">{selectedPlan.name}</h3>
                  <div className="text-zinc-300 font-mono text-sm mt-0.5">
                    R$ {selectedPlan.price},00 / {selectedPlan.period}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Nome Completo:</label>
                    <input
                      type="text"
                      required
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">WhatsApp:</label>
                    <input
                      type="tel"
                      required
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                      placeholder="(XX) 9XXXX-XXXX"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Forma de Pagamento:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutData({ ...checkoutData, payment: 'pix' })}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold ${
                          checkoutData.payment === 'pix' ? 'bg-zinc-800 border-lime-400 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <span>PIX Instantâneo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutData({ ...checkoutData, payment: 'cartao' })}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold ${
                          checkoutData.payment === 'cartao' ? 'bg-zinc-800 border-lime-400 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-blue-400" />
                        <span>Cartão de Crédito</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-black text-xs text-zinc-950 shadow-lg active:scale-95 transition-all"
                    style={{ backgroundColor: accent }}
                  >
                    Confirmar Matrícula e Ativar Acesso
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center mt-2">
                    🔒 Ambiente 100% Criptografado & Sem Taxa de Adesão
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-white">Matrícula Confirmada!</h3>
                <p className="text-xs text-zinc-300">
                  Bem-vindo(a) à família {data.name}, {checkoutData.name}! Seu acesso biométrico e login no App foram gerados.
                </p>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 text-left space-y-1">
                  <div>Status: <span className="text-emerald-400 font-bold">ATIVO</span></div>
                  <div>Plano: <span className="text-white">{selectedPlan.name}</span></div>
                  <div>Chave do Aluno: <span className="text-purple-300">FL-2026-9821</span></div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlan(null);
                    setCheckoutStep('form');
                  }}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DA MODALIDADE */}
      {selectedModality && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedModality(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedModality.image}
              alt={selectedModality.title}
              className="w-full h-40 rounded-xl object-cover mb-4"
            />

            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              DETALHES DO TREINO
            </span>
            <h3 className="text-lg font-black text-white mb-2">{selectedModality.title}</h3>
            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              {selectedModality.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-4">
              <div>
                <span className="text-zinc-500 block text-[10px]">Duração:</span>
                <span className="font-bold text-white">50 a 60 min</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Gasto Calórico Médio:</span>
                <span className="font-bold text-lime-400">450 a 700 kcal</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedModality(null);
                setActiveTab('agendamento');
                setBookingModality(selectedModality.title);
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-zinc-950"
              style={{ backgroundColor: accent }}
            >
              Agendar Aula Desta Modalidade
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (deviceMode === 'mobile') {
    return (
      <div className="flex justify-center p-2 sm:p-4">
        <div className="w-[340px] sm:w-[380px] rounded-[40px] p-3 bg-zinc-900 border-4 border-zinc-800 shadow-2xl relative">
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
      <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-950">
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

        <div className="max-h-[640px] overflow-y-auto custom-scrollbar">
          {renderContent(false)}
        </div>
      </div>

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
