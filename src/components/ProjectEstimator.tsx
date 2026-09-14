import { useState } from 'react';
import { Sparkles, Check, MessageSquare, Copy, ArrowRight, Calculator } from 'lucide-react';

interface ProjectEstimatorProps {
  onSendToContact: (scopeSummary: string) => void;
}

interface ProjectTypeOption {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
}

interface AddonOption {
  id: string;
  name: string;
  desc: string;
  price: number;
}

export function ProjectEstimator({ onSendToContact }: ProjectEstimatorProps) {
  const [selectedType, setSelectedType] = useState<string>('webapp');
  const [designLevel, setDesignLevel] = useState<'standard' | 'premium'>('premium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'vps',
    'database',
  ]);
  const [urgency, setUrgency] = useState<'normal' | 'express'>('normal');
  const [copied, setCopied] = useState(false);

  const projectTypes: ProjectTypeOption[] = [
    {
      id: 'landing',
      name: 'Landing Page de Alta Conversão',
      desc: 'Página única ultrarrápida, design exclusivo e SEO otimizado.',
      basePrice: 1800,
    },
    {
      id: 'webapp',
      name: 'Web Application / SaaS',
      desc: 'Plataforma completa com painel, rotas, lógica e interatividade.',
      basePrice: 3800,
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Headless',
      desc: 'Loja virtual sob medida com catálogo, carrinho e checkout veloz.',
      basePrice: 4600,
    },
    {
      id: 'redesign',
      name: 'Reconstrução & Refatoração Total',
      desc: 'Modernizar site legado do zero com React, Vite e Tailwind.',
      basePrice: 2900,
    },
  ];

  const addons: AddonOption[] = [
    {
      id: 'vps',
      name: 'Configuração Hostinger VPS + Nginx + SSL',
      desc: 'Servidor Linux provisionado com segurança e pipeline Git.',
      price: 650,
    },
    {
      id: 'database',
      name: 'Banco de Dados Relacional (PostgreSQL)',
      desc: 'Modelagem de dados, migrations e queries otimizadas.',
      price: 800,
    },
    {
      id: 'auth',
      name: 'Módulo de Usuários & Autenticação',
      desc: 'Login seguro, controle de permissões e perfis.',
      price: 700,
    },
    {
      id: 'payments',
      name: 'Gateway de Pagamento (Stripe / PIX)',
      desc: 'Checkout transparente e webhooks de confirmação.',
      price: 750,
    },
    {
      id: 'ai',
      name: 'Integração com IA (Gemini API)',
      desc: 'Geração inteligente, assistentes ou análises automatizadas.',
      price: 900,
    },
  ];

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Calculations
  const currentTypeObj = projectTypes.find((t) => t.id === selectedType) || projectTypes[0];
  const designMultiplier = designLevel === 'premium' ? 1.25 : 1.0;
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = addons.find((a) => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  const urgencyMultiplier = urgency === 'express' ? 1.2 : 1.0;
  const totalEstimated = Math.round(
    (currentTypeObj.basePrice * designMultiplier + addonsTotal) * urgencyMultiplier
  );

  const summaryText = `*Orçamento Studio x09*\n• Tipo de Projeto: ${currentTypeObj.name}\n• Nível de Design: ${
    designLevel === 'premium' ? 'Design System Exclusivo & Micro-animações' : 'Essencial Limpo'
  }\n• Módulos Selecionados: ${
    selectedAddons.length > 0
      ? selectedAddons.map((id) => addons.find((a) => a.id === id)?.name).join(', ')
      : 'Nenhum'
  }\n• Prazo de Entrega: ${urgency === 'express' ? 'Acelerado / Prioritário' : 'Cronograma Padrão'}\n• Estimativa: ~ R$ ${totalEstimated.toLocaleString('pt-BR')},00`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(
      `Olá Studio x09! Montei uma prévia de projeto no site:\n\n${summaryText}\n\nGostaria de agendar uma conversa para alinhar detalhes!`
    );
    window.open(`https://wa.me/5511999999999?text=${encoded}`, '_blank');
  };

  return (
    <section id="simulador" className="scroll-mt-24 border-t border-zinc-800/80 py-20 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            <Calculator className="h-3.5 w-3.5" />
            <span>03 // Estimador Interativo</span>
          </div>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simulador de Escopo & Investimento
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Configure as necessidades exatas do seu projeto e veja a estimativa transparente de investimento e prazos em tempo real.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Configuration Controls */}
          <div className="space-y-8 lg:col-span-8">
            {/* Step 1: Project Type */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                1. Tipo de Aplicação
              </label>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col text-left rounded-xl p-4 transition-all ${
                      selectedType === type.id
                        ? 'border-2 border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                        : 'border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['Space_Grotesk'] text-sm font-bold text-white">
                        {type.name}
                      </span>
                      {selectedType === type.id && (
                        <Check className="h-4 w-4 text-cyan-400" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">{type.desc}</p>
                    <span className="mt-3 font-mono text-xs font-semibold text-cyan-400">
                      a partir de R$ {type.basePrice.toLocaleString('pt-BR')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Design Level */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                2. Nível de Rigor Visual & UI/UX
              </label>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setDesignLevel('standard')}
                  className={`flex flex-col text-left rounded-xl p-4 transition-all ${
                    designLevel === 'standard'
                      ? 'border-2 border-cyan-500 bg-cyan-950/20'
                      : 'border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <span className="font-['Space_Grotesk'] text-sm font-bold text-white">
                    Design Limpo Essencial
                  </span>
                  <p className="mt-1 text-xs text-zinc-400">
                    Estrutura responsiva elegante, padrões modernos e foco em leitura clara.
                  </p>
                </button>

                <button
                  onClick={() => setDesignLevel('premium')}
                  className={`flex flex-col text-left rounded-xl p-4 transition-all ${
                    designLevel === 'premium'
                      ? 'border-2 border-cyan-500 bg-cyan-950/20'
                      : 'border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Space_Grotesk'] text-sm font-bold text-white">
                      Design System Exclusivo & Micro-animações
                    </span>
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Tipografia com proporção matemática, dark mode refinado e transições fluidas.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 3: Addons & Infrastructure */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                3. Recursos, Infraestrutura & Integrações
              </label>
              <div className="mt-3 space-y-2.5">
                {addons.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                        isChecked
                          ? 'border-cyan-500/80 bg-cyan-950/20'
                          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                            isChecked
                              ? 'border-cyan-500 bg-cyan-500 text-zinc-950'
                              : 'border-zinc-700 bg-zinc-800'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {addon.name}
                          </div>
                          <div className="text-xs text-zinc-400">{addon.desc}</div>
                        </div>
                      </div>

                      <div className="font-mono text-xs font-bold text-zinc-300">
                        + R$ {addon.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Urgency */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                4. Prazo de Entrega Desejado
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUrgency('normal')}
                  className={`rounded-xl p-3 text-center text-xs font-semibold transition-all ${
                    urgency === 'normal'
                      ? 'border-2 border-cyan-500 bg-cyan-950/20 text-white'
                      : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                  }`}
                >
                  Cronograma Padrão (2 a 4 semanas)
                </button>
                <button
                  onClick={() => setUrgency('express')}
                  className={`rounded-xl p-3 text-center text-xs font-semibold transition-all ${
                    urgency === 'express'
                      ? 'border-2 border-cyan-500 bg-cyan-950/20 text-white'
                      : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                  }`}
                >
                  Entrega Prioritária / Express (+20%)
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Summary Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                Resumo da Estimativa
              </h3>
              <p className="text-xs text-zinc-400">
                Proposta calculada em tempo real com base no escopo técnico.
              </p>

              <div className="mt-6 space-y-3 border-y border-zinc-800 py-4 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Base: {currentTypeObj.name}</span>
                  <span className="font-mono">R$ {currentTypeObj.basePrice}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Design: {designLevel === 'premium' ? 'Design System (+25%)' : 'Padrão'}</span>
                  <span className="font-mono">{designLevel === 'premium' ? '+25%' : 'Incluso'}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Módulos ({selectedAddons.length})</span>
                  <span className="font-mono">R$ {addonsTotal}</span>
                </div>
                {urgency === 'express' && (
                  <div className="flex justify-between text-amber-400">
                    <span>Taxa Express (+20%)</span>
                    <span className="font-mono">Sim</span>
                  </div>
                )}
              </div>

              {/* Total display */}
              <div className="mt-6">
                <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  Investimento Estimado
                </div>
                <div className="mt-1 font-['Space_Grotesk'] text-3xl font-extrabold text-cyan-400">
                  R$ {totalEstimated.toLocaleString('pt-BR')},00
                </div>
                <p className="mt-1 text-[11px] text-zinc-400">
                  *Valores orientativos. Faturado em parcelas ou marco de entrega.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={handleWhatsApp}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-zinc-950 transition-all hover:bg-emerald-400 active:scale-95"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Enviar no WhatsApp</span>
                </button>

                <button
                  onClick={() => onSendToContact(summaryText)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-zinc-950 transition-all hover:bg-cyan-400 active:scale-95"
                >
                  <span>Preencher Formulário</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={handleCopy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-750 hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? 'Copiado para a área de transferência!' : 'Copiar Especificação'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
