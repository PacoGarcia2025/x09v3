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
  Edit3,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Scissors,
  HeartPulse,
  Package,
  Store,
  Star,
  MapPin,
  Mail,
  Send,
} from 'lucide-react';
import { FitLifeState } from '../../types/x09';

interface FitLifeLivePreviewProps {
  data: FitLifeState;
  deviceMode?: 'desktop' | 'mobile';
  showDualPreview?: boolean;
  onSelectElement?: (elementName: string, currentValue: string) => void;
}

type NicheType = 'catalog' | 'food' | 'saas' | 'barber' | 'health' | 'fitness' | 'general';

function detectNiche(data: FitLifeState): NicheType {
  const text = `${data.name} ${data.slogan} ${data.headline} ${data.subheadline} ${data.productType || ''}`.toLowerCase();
  if (
    text.includes('catalogo') ||
    text.includes('catálogo') ||
    text.includes('encomenda') ||
    text.includes('mato') ||
    text.includes('cheiro') ||
    text.includes('loja') ||
    text.includes('artesanal') ||
    text.includes('colonial') ||
    text.includes('produto') ||
    text.includes('cesta') ||
    text.includes('artesanato')
  ) {
    return 'catalog';
  }
  if (
    text.includes('comida') ||
    text.includes('restaurante') ||
    text.includes('gourmet') ||
    text.includes('delivery') ||
    text.includes('pizza') ||
    text.includes('bistrô') ||
    text.includes('lanche') ||
    text.includes('hamburguer') ||
    text.includes('café') ||
    text.includes('sabor')
  ) {
    return 'food';
  }
  if (
    text.includes('saas') ||
    text.includes('software') ||
    text.includes('finance') ||
    text.includes('fintech') ||
    text.includes('dashboard') ||
    text.includes('b2b') ||
    text.includes('app') ||
    text.includes('gestão') ||
    text.includes('tecnologia') ||
    text.includes('startup')
  ) {
    return 'saas';
  }
  if (
    text.includes('barber') ||
    text.includes('barbearia') ||
    text.includes('corte') ||
    text.includes('cabelo') ||
    text.includes('barba')
  ) {
    return 'barber';
  }
  if (
    text.includes('clínica') ||
    text.includes('clinica') ||
    text.includes('médic') ||
    text.includes('saúde') ||
    text.includes('odonto') ||
    text.includes('estética')
  ) {
    return 'health';
  }
  if (
    text.includes('academia') ||
    text.includes('treino') ||
    text.includes('musculação') ||
    text.includes('fitness') ||
    text.includes('crossfit') ||
    text.includes('fitlife')
  ) {
    return 'fitness';
  }
  return 'general';
}

export const FitLifeLivePreview: React.FC<FitLifeLivePreviewProps> = ({
  data,
  deviceMode = 'desktop',
  showDualPreview = false,
  onSelectElement,
}) => {
  const accent = data.accentColor || '#c4f039';
  const niche = detectNiche(data);

  // Navigation state
  const [activeTab, setActiveTab] = useState<'inicio' | 'itens' | 'planos' | 'acao' | 'calculadora'>('inicio');

  // Plan billing state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Selected plan for checkout modal
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; period: string; description?: string } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', email: '', payment: 'pix', address: '' });

  // Selected modality / product for details modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Booking / Order form state
  const [actionOption, setActionOption] = useState(() => {
    if (niche === 'catalog') return 'Cesta Especial de Produtos';
    if (niche === 'food') return 'Combo Artesanal da Casa';
    if (niche === 'saas') return 'Demonstração Corporativa';
    if (niche === 'barber') return 'Corte & Barba Terapia';
    if (niche === 'fitness') return 'Musculação';
    return 'Atendimento VIP';
  });
  const [actionTime, setActionTime] = useState('14:00');
  const [actionName, setActionName] = useState('');
  const [actionPhone, setActionPhone] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  // IMC Calculator state (only used when niche === 'fitness')
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

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionName || !actionPhone) return;
    setActionSuccess(true);
  };

  // Niche Configurations
  const getNicheConfig = () => {
    switch (niche) {
      case 'catalog':
        return {
          icon: <ShoppingBag className="w-5 h-5 text-zinc-950" />,
          topAnnouncement: 'Catálogo Online Ativo • Faça seu pedido e receba atendimento direto pelo WhatsApp',
          tabItemsLabel: 'Produtos & Encomendas',
          tabPlansLabel: 'Kits & Cestas',
          tabActionLabel: 'Fazer Encomenda',
          heroImg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
          heroBadge: 'PRODUTOS SELECIONADOS & ARTESANAIS',
          heroPrimaryCta: 'Fazer Encomenda',
          heroSecondaryCta: 'Ver Catálogo',
          metrics: [
            { val: data.activeStudents && data.activeStudents !== '+2.500' ? data.activeStudents : '850+', label: 'Pedidos Entregues' },
            { val: data.trainersCount && data.trainersCount !== '12' ? data.trainersCount : '48h', label: 'Prazo Médio' },
            { val: data.satisfactionRate || '99.8%', label: 'Satisfação' },
            { val: data.yearsHistory && data.yearsHistory !== '+5 Anos' ? data.yearsHistory : '100% Natural', label: 'Procedência' },
            { val: 'SELECIONADO', label: 'QUALIDADE GARANTIDA' },
          ],
          sectionTitle: 'Produtos & Encomendas em Destaque',
          sectionSub: 'Itens frescos, artesanais e selecionados direto para o seu dia a dia.',
          quickBannerTitle: 'Encomendas Diretas Sem Complicação',
          quickBannerSub: 'Escolha seus produtos e envie sua lista personalizada direto no WhatsApp.',
          plans: [
            { name: 'Cesta Básica Familiar', priceMonthly: 89, priceAnnual: 75, desc: 'Itens essenciais para a semana com qualidade garantida.', features: ['Seleção de produtos frescos', 'Embalagem protetora ecológica', 'Atendimento direto via WhatsApp'] },
            { name: 'Cesta Especial Colonial', priceMonthly: 159, priceAnnual: 129, isPopular: true, desc: 'Nossa seleção mais pedida com delícias artesanais selecionadas.', features: ['Mix completo de produtos artesanais', 'Brinde especial da estação', 'Entrega prioritária agendada', 'Suporte dedicado no WhatsApp'] },
            { name: 'Cesta Premium Degustação', priceMonthly: 249, priceAnnual: 199, desc: 'Experiência máxima de sabores nobres e produtos selecionados.', features: ['Tudo da Cesta Especial', 'Itens nobres de edição limitada', 'Embalagem especial para presentes', 'Frete grátis na primeira entrega'] },
          ],
          actionTitle: 'Faça seu Pedido de Encomenda',
          actionSubtitle: 'Preencha seus dados para receber o orçamento e confirmação direto no WhatsApp.',
          actionOptions: ['Cesta Básica Familiar', 'Cesta Especial Colonial', 'Cesta Premium Degustação', 'Itens Avulsos Personalizados'],
          checkoutTitle: 'CONFIRMAÇÃO DE ENCOMENDA',
          checkoutSuccessTitle: 'Encomenda Registrada com Sucesso!',
          checkoutSuccessMsg: `Obrigado, ${checkoutData.name}! Sua solicitação foi recebida e nosso time já está preparando os detalhes no WhatsApp.`,
        };

      case 'food':
        return {
          icon: <UtensilsCrossed className="w-5 h-5 text-zinc-950" />,
          topAnnouncement: 'Cozinha & Delivery Ativos • Faça seu pedido online com entrega rápida',
          tabItemsLabel: 'Cardápio & Pratos',
          tabPlansLabel: 'Combos & Ofertas',
          tabActionLabel: 'Fazer Pedido',
          heroImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
          heroBadge: 'GASTRONOMIA & SABOR ARTESANAL',
          heroPrimaryCta: 'Fazer Pedido Online',
          heroSecondaryCta: 'Ver Cardápio',
          metrics: [
            { val: data.activeStudents && data.activeStudents !== '+2.500' ? data.activeStudents : '1.5k+', label: 'Pedidos Mês' },
            { val: data.trainersCount && data.trainersCount !== '12' ? data.trainersCount : '35min', label: 'Tempo Entrega' },
            { val: data.satisfactionRate || '4.9★', label: 'Avaliação' },
            { val: data.yearsHistory && data.yearsHistory !== '+5 Anos' ? data.yearsHistory : 'Artesanal', label: 'Ingredientes' },
            { val: 'IRRESISTÍVEL', label: 'SABOR INCOMPARÁVEL' },
          ],
          sectionTitle: 'Cardápio & Pratos Especiais',
          sectionSub: 'Receitas exclusivas preparadas na hora com ingredientes nobres.',
          quickBannerTitle: 'Peça Online com Entrega Quentinha',
          quickBannerSub: 'Seu pedido chega rápido na sua casa com embalagem térmica inviolável.',
          plans: [
            { name: 'Combo Individual', priceMonthly: 42, priceAnnual: 35, desc: 'Refeição completa individual com bebida inclusa.', features: ['Prato principal à sua escolha', 'Acompanhamento artesanal', 'Bebida gelada inclusa'] },
            { name: 'Combo Casal Especial', priceMonthly: 79, priceAnnual: 65, isPopular: true, desc: 'A combinação favorita para duas pessoas curtirem juntas.', features: ['2 Pratos especiais', 'Porção dupla de acompanhamento', 'Sobremesa da casa inclusa', 'Molhos artesanais da casa'] },
            { name: 'Combo Família Fest', priceMonthly: 139, priceAnnual: 115, desc: 'Banquete completo para até 4 pessoas.', features: ['Tudo em dose família', 'Mix completo de acompanhamentos', '2 Sobremesas especiais', 'Entrega grátis na sua região'] },
          ],
          actionTitle: 'Faça seu Pedido Online',
          actionSubtitle: 'Selecione o combo ou prato desejado e enviaremos o pedido para a cozinha.',
          actionOptions: ['Combo Individual', 'Combo Casal Especial', 'Combo Família Fest', 'Prato Executivo do Chef'],
          checkoutTitle: 'FINALIZAÇÃO DO PEDIDO',
          checkoutSuccessTitle: 'Pedido Enviado para a Cozinha!',
          checkoutSuccessMsg: `Show, ${checkoutData.name}! Seu pedido foi recebido e já está em preparo. Acompanhe pelo WhatsApp.`,
        };

      case 'saas':
        return {
          icon: <Layers className="w-5 h-5 text-zinc-950" />,
          topAnnouncement: 'Plataforma em Nuvem Ativa • Teste grátis por 14 dias sem cartão de crédito',
          tabItemsLabel: 'Recursos do Sistema',
          tabPlansLabel: 'Planos & Assinaturas',
          tabActionLabel: 'Agendar Demo',
          heroImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
          heroBadge: 'SOFTWARE & INTELIGÊNCIA EM NUVEM',
          heroPrimaryCta: 'Começar Agora',
          heroSecondaryCta: 'Ver Recursos',
          metrics: [
            { val: data.activeStudents && data.activeStudents !== '+2.500' ? data.activeStudents : '10k+', label: 'Usuários Ativos' },
            { val: data.trainersCount && data.trainersCount !== '12' ? data.trainersCount : '99.9%', label: 'Uptime SLA' },
            { val: data.satisfactionRate || '0ms', label: 'Latência Média' },
            { val: data.yearsHistory && data.yearsHistory !== '+5 Anos' ? data.yearsHistory : '24/7', label: 'Monitoramento' },
            { val: 'NUVEM SEGURA', label: 'ALTA PERFORMANCE' },
          ],
          sectionTitle: 'Funcionalidades & Módulos da Plataforma',
          sectionSub: 'Automação inteligente, relatórios em tempo real e integração simplificada.',
          quickBannerTitle: 'Escale seu negócio com tecnologia de ponta',
          quickBannerSub: 'Ativação instantânea em minutos com migração assistida sem custo.',
          plans: [
            { name: 'Plano Starter', priceMonthly: 69, priceAnnual: 49, desc: 'Ideal para profissionais autônomos e pequenos projetos.', features: ['Até 3 usuários conectados', 'Dashboard com métricas em tempo real', 'Exportação de relatórios em PDF/Excel', 'Suporte padrão por e-mail'] },
            { name: 'Plano Pro Scale', priceMonthly: 159, priceAnnual: 119, isPopular: true, desc: 'Potência máxima para empresas em crescimento acelerado.', features: ['Usuários ilimitados', 'Integrações via Webhook & API', 'Inteligência Artificial assistiva', 'Suporte prioritário via WhatsApp'] },
            { name: 'Plano Enterprise', priceMonthly: 349, priceAnnual: 279, desc: 'Infraestrutura dedicada com suporte executivo e SLA garantido.', features: ['Instância de banco isolada', 'SLA contratual de 99.99%', 'Gerente de conta dedicado', 'Customizações sob demanda'] },
          ],
          actionTitle: 'Solicite uma Demonstração Guiada',
          actionSubtitle: 'Veja como a plataforma funciona na prática com um especialista do produto.',
          actionOptions: ['Demonstração Completa', 'Migração de Dados', 'Customização B2B', 'Integração de API'],
          checkoutTitle: 'ATIVAÇÃO DA ASSINATURA',
          checkoutSuccessTitle: 'Assinatura Ativada com Sucesso!',
          checkoutSuccessMsg: `Parabéns, ${checkoutData.name}! Sua conta foi configurada e seu link de acesso foi gerado com sucesso.`,
        };

      case 'barber':
        return {
          icon: <Scissors className="w-5 h-5 text-zinc-950" />,
          topAnnouncement: 'Agendamentos Abertos • Reserve seu horário sem filas no melhor estilo',
          tabItemsLabel: 'Cortes & Serviços',
          tabPlansLabel: 'Planos Mensais',
          tabActionLabel: 'Agendar Horário',
          heroImg: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
          heroBadge: 'ESTILO, TRADIÇÃO & CUIDADO MASCULINO',
          heroPrimaryCta: 'Agendar Horário',
          heroSecondaryCta: 'Ver Serviços',
          metrics: [
            { val: data.activeStudents && data.activeStudents !== '+2.500' ? data.activeStudents : '3.2k+', label: 'Clientes Atendidos' },
            { val: data.trainersCount && data.trainersCount !== '12' ? data.trainersCount : '6', label: 'Barbeiros Mestres' },
            { val: data.satisfactionRate || '99.5%', label: 'Satisfação' },
            { val: data.yearsHistory && data.yearsHistory !== '+5 Anos' ? data.yearsHistory : '+4 Anos', label: 'De História' },
            { val: 'ESTILO PURO', label: 'PADRÃO PREMIUM' },
          ],
          sectionTitle: 'Serviços de Corte & Barboterapia',
          sectionSub: 'Cuidado completo com toalha quente, navalha e produtos importados.',
          quickBannerTitle: 'Corte seu cabelo e barba sem esperar',
          quickBannerSub: 'Agende pelo site em segundos e venha tomar um café ou cerveja gelada.',
          plans: [
            { name: 'Corte Tradicional', priceMonthly: 45, priceAnnual: 40, desc: 'Corte personalizado na tesoura ou máquina com lavagem inclusa.', features: ['Corte completo com visagismo', 'Lavagem com shampoo premium', 'Finalização com pomada'] },
            { name: 'Combo Cabelo + Barba', priceMonthly: 85, priceAnnual: 70, isPopular: true, desc: 'O clássico mais pedido: corte de cabelo e barba com toalha quente.', features: ['Corte de cabelo completo', 'Barba terapia com toalha quente', 'Óleo e bálsamo hidratante', 'Bebida de cortesia inclusa'] },
            { name: 'Clube VIP Mensal', priceMonthly: 140, priceAnnual: 110, desc: 'Cortes ilimitados no mês para manter o visual sempre impecável.', features: ['Cortes de cabelo à vontade no mês', 'Barba ilimitada', 'Horário prioritário reservado', 'Desconto em produtos da barbearia'] },
          ],
          actionTitle: 'Agende seu Horário na Barbearia',
          actionSubtitle: 'Escolha o serviço, dia e horário para garantir seu atendimento.',
          actionOptions: ['Corte Tradicional', 'Combo Cabelo + Barba', 'Barba Terapia Completa', 'Tratamento Capilar'],
          checkoutTitle: 'AGENDAMENTO DE SERVIÇO',
          checkoutSuccessTitle: 'Horário Confirmado com Sucesso!',
          checkoutSuccessMsg: `Perfeito, ${checkoutData.name}! Seu agendamento foi salvo na agenda da barbearia. Te esperamos!`,
        };

      case 'fitness':
        return {
          icon: <Dumbbell className="w-5 h-5 text-zinc-950" />,
          topAnnouncement: 'Matrículas abertas • 1 mês de consultoria nutricional grátis na assinatura anual',
          tabItemsLabel: 'Modalidades',
          tabPlansLabel: 'Planos & Valores',
          tabActionLabel: 'Aula Experimental',
          heroImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
          heroBadge: 'EXPERIÊNCIA FITNESS ULTRA-PREMIUM',
          heroPrimaryCta: 'Comece agora',
          heroSecondaryCta: 'Agendar aula grátis',
          metrics: [
            { val: data.activeStudents || '+2.500', label: 'Alunos ativos' },
            { val: data.trainersCount || '12', label: 'Treinadores' },
            { val: data.satisfactionRate || '98%', label: 'Satisfação' },
            { val: data.yearsHistory || '+5 Anos', label: 'De história' },
            { val: 'DISCIPLINA', label: 'TRANSFORMAÇÃO REAL' },
          ],
          sectionTitle: 'Modalidades de Alta Performance',
          sectionSub: 'Treinos formulados por fisiologistas para gerar resultados mensuráveis.',
          quickBannerTitle: 'Treine sem taxa de matrícula',
          quickBannerSub: 'Assine online agora e receba acesso biométrico imediato via App.',
          plans: [
            { name: 'Plano Smart', priceMonthly: 99, priceAnnual: 79, desc: 'Ideal para quem foca puramente em musculação.', features: ['Área de musculação completa', 'Acesso em horário livre', 'Zero taxa de matrícula'] },
            { name: 'Plano Black VIP', priceMonthly: 159, priceAnnual: 129, isPopular: true, desc: 'Experiência completa com todas as modalidades inclusas.', features: ['Musculação + Aulas Coletivas', 'App FitLife com treinos guiados', 'Cadeira de massagem pós-treino', 'Leve 1 amigo para treinar 4x/mês'] },
            { name: 'Plano Diamond', priceMonthly: 229, priceAnnual: 189, desc: 'Nutricionista dedicado, bioimpedância e acompanhamento 1 a 1.', features: ['Tudo do Plano Black VIP', 'Consulta nutricional mensal', 'Bioimpedância periódica', 'Acesso à Área VIP & Recovery Spa'] },
          ],
          actionTitle: 'Agende sua Aula Experimental Gratuita',
          actionSubtitle: 'Conheça a estrutura completa e treine com acompanhamento sem compromisso.',
          actionOptions: ['Musculação', 'Funcional', 'Personal 1x1', 'Cross Training'],
          checkoutTitle: 'MATRÍCULA ONLINE INSTANTÂNEA',
          checkoutSuccessTitle: 'Matrícula Confirmada com Sucesso!',
          checkoutSuccessMsg: `Bem-vindo(a) à família ${data.name}, ${checkoutData.name}! Seu acesso biométrico e login no App foram ativados.`,
        };

      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-zinc-950" />,
          topAnnouncement: 'Atendimento Online Ativo • Fale conosco pelo WhatsApp ou solicite um orçamento',
          tabItemsLabel: 'Destaques & Soluções',
          tabPlansLabel: 'Planos & Valores',
          tabActionLabel: 'Solicitar Contato',
          heroImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
          heroBadge: 'EXCELÊNCIA & QUALIDADE COMPROVADA',
          heroPrimaryCta: 'Falar Conosco',
          heroSecondaryCta: 'Ver Soluções',
          metrics: [
            { val: data.activeStudents && data.activeStudents !== '+2.500' ? data.activeStudents : '+1.200', label: 'Clientes Atendidos' },
            { val: data.trainersCount && data.trainersCount !== '12' ? data.trainersCount : '100%', label: 'Personalizado' },
            { val: data.satisfactionRate || '99%', label: 'Satisfação' },
            { val: data.yearsHistory && data.yearsHistory !== '+5 Anos' ? data.yearsHistory : '5★', label: 'Reputação' },
            { val: 'COMPROVADO', label: 'PADRÃO PREMIUM' },
          ],
          sectionTitle: 'Soluções & Serviços Especializados',
          sectionSub: 'Estrutura completa desenvolvida para oferecer a melhor experiência.',
          quickBannerTitle: 'Atendimento Rápido e Eficiente',
          quickBannerSub: 'Entre em contato direto pelo WhatsApp para tirar dúvidas e fechar negócio.',
          plans: [
            { name: 'Plano Essencial', priceMonthly: 99, priceAnnual: 79, desc: 'O pacote básico completo para atender sua necessidade.', features: ['Atendimento prioritário', 'Garantia de satisfação', 'Suporte direto via WhatsApp'] },
            { name: 'Plano Profissional', priceMonthly: 199, priceAnnual: 159, isPopular: true, desc: 'A solução mais recomendada para resultados consistentes.', features: ['Todos os recursos essenciais', 'Acompanhamento dedicado', 'Relatórios periódicos', 'Canal VIP de comunicação'] },
            { name: 'Plano VIP Completo', priceMonthly: 349, priceAnnual: 279, desc: 'Acesso irrestrito com benefícios exclusivos.', features: ['Tudo do Plano Profissional', 'Consultoria personalizada', 'Atendimento 24 horas', 'Bônus e vantagens exclusivas'] },
          ],
          actionTitle: 'Solicite seu Orçamento Personalizado',
          actionSubtitle: 'Preencha seus dados para receber uma proposta sob medida.',
          actionOptions: ['Atendimento Padrão', 'Pacote Profissional', 'Consultoria VIP', 'Projeto Sob Demanda'],
          checkoutTitle: 'CONFIRMAÇÃO DE PROPOSTA',
          checkoutSuccessTitle: 'Proposta Solicitada com Sucesso!',
          checkoutSuccessMsg: `Obrigado, ${checkoutData.name}! Nossa equipe entrará em contato pelo WhatsApp para prosseguir com seu atendimento.`,
        };
    }
  };

  const cfg = getNicheConfig();

  const renderContent = (isMobileLayout: boolean) => {
    // 1. TELA EM BRANCO (NOVO PROJETO DO ZERO)
    if (data.isBlank) {
      return (
        <div className={`w-full bg-[#07090b] text-white font-sans min-h-[520px] flex flex-col items-center justify-center p-6 sm:p-12 text-center relative overflow-hidden border border-zinc-800/80 rounded-2xl ${isMobileLayout ? 'text-xs' : 'text-sm'}`}>
          {/* Subtle glow background */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: accent }} />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-15 bg-blue-600 pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center mb-6 shadow-xl relative z-10" style={{ borderColor: accent }}>
            <Sparkles className="w-8 h-8" style={{ color: accent }} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-3 text-zinc-400">
            {data.slogan || 'Tela em Branco • Studio X09'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-white max-w-xl mb-3 tracking-tight">
            {data.name || 'Seu Novo Projeto'}
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mb-8 leading-relaxed">
            {data.subheadline || 'Converse com a Inteligência Artificial no chat ao lado para construir seu site, catálogo, e-commerce ou SaaS em tempo real.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all">
              <div className="text-[10px] font-bold uppercase text-purple-400 mb-1">Passo 1</div>
              <div className="text-xs font-semibold text-white">Descreva sua ideia</div>
              <div className="text-[11px] text-zinc-400 mt-1">Ex: "Catálogo de encomendas Cheiro de Mato" ou "SaaS de Gestão".</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all">
              <div className="text-[10px] font-bold uppercase text-blue-400 mb-1">Passo 2</div>
              <div className="text-xs font-semibold text-white">Design em tempo real</div>
              <div className="text-[11px] text-zinc-400 mt-1">O X09 ajusta seções, cores, textos e produtos na hora nesta prévia.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all">
              <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">Passo 3</div>
              <div className="text-xs font-semibold text-white">Deploy 1-Click</div>
              <div className="text-[11px] text-zinc-400 mt-1">Subdomínio ativo em *.x09.com.br na VPS com SSL Cloudflare.</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full bg-zinc-950 text-white font-sans overflow-x-hidden ${isMobileLayout ? 'text-xs' : 'text-sm'}`}>
        {/* Top Notification Bar */}
        <div className="bg-zinc-900/95 border-b border-zinc-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}></span>
            <span>{cfg.topAnnouncement}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {data.whatsapp && (
              <a
                href={`https://wa.me/55${data.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20${encodeURIComponent(data.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3" style={{ color: accent }} />
                {data.phone || data.whatsapp}
              </a>
            )}
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">Atendimento Online</span>
          </div>
        </div>

        {/* Navigation */}
        <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div
            onClick={() => {
              if (onSelectElement) {
                onSelectElement('Nome da Marca', data.name);
              } else {
                setActiveTab('inicio');
              }
            }}
            className="group/brand relative flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-all hover:bg-zinc-900/60"
            title="Clique para editar nome da marca no chat"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-base shadow-sm shrink-0"
              style={{ backgroundColor: accent }}
            >
              {cfg.icon}
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-white text-base block leading-none flex items-center gap-1.5">
                <span>{data.name.toUpperCase()}</span>
                {onSelectElement && (
                  <Edit3 className="w-3 h-3 text-purple-400 opacity-0 group-hover/brand:opacity-100 transition-opacity" />
                )}
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
                onClick={() => setActiveTab('itens')}
                className={`transition-colors ${activeTab === 'itens' ? 'text-white font-bold' : 'hover:text-white'}`}
                style={activeTab === 'itens' ? { color: accent } : {}}
              >
                {cfg.tabItemsLabel}
              </button>
              <button
                onClick={() => setActiveTab('planos')}
                className={`transition-colors ${activeTab === 'planos' ? 'text-white font-bold' : 'hover:text-white'}`}
                style={activeTab === 'planos' ? { color: accent } : {}}
              >
                {cfg.tabPlansLabel}
              </button>
              <button
                onClick={() => setActiveTab('acao')}
                className={`transition-colors ${activeTab === 'acao' ? 'text-white font-bold' : 'hover:text-white'}`}
                style={activeTab === 'acao' ? { color: accent } : {}}
              >
                {cfg.tabActionLabel}
              </button>
              {niche === 'fitness' && (
                <button
                  onClick={() => setActiveTab('calculadora')}
                  className={`transition-colors ${activeTab === 'calculadora' ? 'text-white font-bold' : 'hover:text-white'}`}
                  style={activeTab === 'calculadora' ? { color: accent } : {}}
                >
                  Calculadora IMC
                </button>
              )}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('planos')}
              className="px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 text-zinc-950"
              style={{ backgroundColor: accent }}
            >
              <span>{cfg.heroPrimaryCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Tab Content */}
        {activeTab === 'inicio' && (
          <>
            {/* Hero Section */}
            <section className="relative min-h-[420px] flex items-center px-4 sm:px-8 py-12 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src={cfg.heroImg}
                  alt={data.name}
                  className="w-full h-full object-cover object-center opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/50"></div>
                <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/60 to-zinc-950"></div>
              </div>

              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-xs font-semibold mb-4 text-zinc-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                  <span>{cfg.heroBadge}</span>
                </div>

                <h1
                  onClick={() => onSelectElement && onSelectElement('Título Principal (Headline)', data.headline)}
                  className="group/headline text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-3 cursor-pointer relative"
                  title="Clique para editar este título no chat"
                >
                  <span>{data.headline}</span>
                  {onSelectElement && (
                    <span className="inline-flex items-center gap-1 ml-2 text-[11px] font-normal lowercase tracking-normal text-purple-400 opacity-0 group-hover/headline:opacity-100 transition-opacity bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded-full">
                      <Edit3 className="w-3 h-3" />
                      <span>editar</span>
                    </span>
                  )}
                </h1>

                <p
                  onClick={() => onSelectElement && onSelectElement('Subtítulo Descritivo', data.subheadline)}
                  className="group/subheadline text-zinc-300 text-sm sm:text-base max-w-lg mb-6 leading-relaxed cursor-pointer relative"
                  title="Clique para editar este subtítulo no chat"
                >
                  <span>{data.subheadline}</span>
                  {onSelectElement && (
                    <span className="inline-flex items-center gap-1 ml-2 text-[10px] text-purple-400 opacity-0 group-hover/subheadline:opacity-100 transition-opacity bg-purple-950/60 border border-purple-500/40 px-1.5 py-0.5 rounded-full">
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>editar texto</span>
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('planos')}
                    className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-zinc-950 flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                    style={{ backgroundColor: accent }}
                  >
                    <span>{cfg.heroPrimaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('itens')}
                    className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>{cfg.heroSecondaryCta}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Metrics Bar */}
            <section className="bg-zinc-900 border-y border-zinc-800 px-4 sm:px-8 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-zinc-800 sm:divide-x divide-y sm:divide-y-0">
                {cfg.metrics.slice(0, 4).map((m, idx) => (
                  <div key={idx} className="pt-2 sm:pt-0">
                    <div className="text-lg sm:text-2xl font-black tracking-tight" style={{ color: idx % 2 === 0 ? accent : '#ffffff' }}>
                      {m.val}
                    </div>
                    <div className="text-[11px] text-zinc-400 uppercase font-semibold">{m.label}</div>
                  </div>
                ))}
                <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {cfg.metrics[4]?.label || 'PADRÃO PREMIUM'}
                  </span>
                </div>
              </div>
            </section>

            {/* Modalities / Products / Services Grid */}
            <section className="px-4 sm:px-8 py-10 bg-zinc-950">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
                    DESTAQUES & CATÁLOGO
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase">
                    {cfg.sectionTitle}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('itens')}
                  className="text-xs font-semibold hover:underline flex items-center gap-1"
                  style={{ color: accent }}
                >
                  <span>Ver todos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {data.modalities.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">
                    Adicione Itens ao seu Projeto
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mb-4 leading-relaxed">
                    Diga no chat ao lado os produtos ou serviços que você oferece para a IA criar cartões ilustrados com fotos e descrições automáticas.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-300 font-mono bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-800/40">
                    <span>Ex: "Adicione 3 produtos coloniais artesanais com foto e preço"</span>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-4 ${isMobileLayout ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                  {data.modalities.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-md"
                    >
                      <div className="h-36 sm:h-44 overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-white text-sm tracking-wide mb-1 flex items-center justify-between">
                          <span>{item.title}</span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                        </h3>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-3">
                          {item.description}
                        </p>
                        <span className="text-[11px] font-bold flex items-center gap-1 text-zinc-300 group-hover:text-white">
                          <span>Ver detalhes & encomendar</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Highlights & Quick Banner */}
            <section className="px-4 sm:px-8 py-6 bg-zinc-900/50 border-t border-zinc-900">
              <div className="rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-4 sm:p-6 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{cfg.quickBannerTitle}</h4>
                    <p className="text-xs text-zinc-400">{cfg.quickBannerSub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('acao')}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors"
                  >
                    {cfg.tabActionLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('planos')}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-950 transition-all shadow"
                    style={{ backgroundColor: accent }}
                  >
                    Ver Valores
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ITEMS TAB */}
        {activeTab === 'itens' && (
          <section className="px-4 sm:px-8 py-8 bg-zinc-950 min-h-[500px]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  CATÁLOGO COMPLETO
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
                  {cfg.sectionTitle}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                  {cfg.sectionSub}
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
                      <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{m.description}</p>
                      <button
                        onClick={() => setSelectedItem(m)}
                        className="text-xs font-bold px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1"
                      >
                        <span>Ver detalhes</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PLANS TAB */}
        {activeTab === 'planos' && (
          <section className="px-4 sm:px-8 py-8 bg-zinc-950 min-h-[500px]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  OPÇÕES & INVESTIMENTO
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
                  {cfg.tabPlansLabel}
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mt-2">
                  Escolha a melhor opção com preços transparentes e sem surpresas.
                </p>

                {/* Billing toggle */}
                <div className="mt-6 inline-flex items-center p-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-full transition-all ${
                      billingCycle === 'monthly' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Padrão
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                      billingCycle === 'annual' ? 'text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                    style={billingCycle === 'annual' ? { backgroundColor: accent } : {}}
                  >
                    <span>Fidelidade / Anual</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black text-white font-bold">
                      -20% OFF
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {cfg.plans.map((p, i) => {
                  const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;
                  const isPop = p.isPopular;

                  return (
                    <div
                      key={i}
                      className={`rounded-2xl bg-zinc-900 p-5 flex flex-col justify-between transition-all relative ${
                        isPop ? 'border-2 shadow-xl' : 'border border-zinc-800 hover:border-zinc-700'
                      }`}
                      style={isPop ? { borderColor: accent } : {}}
                    >
                      {isPop && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black text-zinc-950 uppercase tracking-wide"
                          style={{ backgroundColor: accent }}
                        >
                          MAIS POPULAR
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white text-base mb-1">{p.name}</h3>
                        <p className="text-xs text-zinc-400 mb-4">{p.desc}</p>
                        <div className="mb-4">
                          <span className="text-2xl sm:text-3xl font-black text-white">
                            R$ {price}
                          </span>
                          <span className="text-xs text-zinc-400">/unidade ou mês</span>
                        </div>
                        <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                          {p.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedPlan({
                            name: p.name,
                            price,
                            period: billingCycle === 'annual' ? 'anual / promocional' : 'padrão',
                            description: p.desc,
                          })
                        }
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow ${
                          isPop ? 'text-zinc-950' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                        }`}
                        style={isPop ? { backgroundColor: accent } : {}}
                      >
                        {niche === 'catalog' ? 'Encomendar Este' : niche === 'food' ? 'Pedir Este Combo' : 'Selecionar Opção'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ACTION / BOOKING / ORDER TAB */}
        {activeTab === 'acao' && (
          <section className="px-4 sm:px-8 py-8 bg-zinc-950 min-h-[500px]">
            <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  ATENDIMENTO DIRETO
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                  {cfg.actionTitle}
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  {cfg.actionSubtitle}
                </p>
              </div>

              {actionSuccess ? (
                <div className="text-center p-6 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base">Solicitação Enviada com Sucesso!</h3>
                  <p className="text-xs text-zinc-300">
                    Obrigado, {actionName}! Seu pedido de <strong>{actionOption}</strong> foi registrado.
                  </p>
                  <div className="p-3 bg-zinc-950 rounded-lg text-xs font-mono text-zinc-400">
                    Código de rastreio: X09-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                  <button
                    onClick={() => setActionSuccess(false)}
                    className="text-xs text-purple-400 hover:underline pt-2 inline-block"
                  >
                    Fazer outro pedido / contato
                  </button>
                </div>
              ) : (
                <form onSubmit={handleActionSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Escolha o Item ou Serviço:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {cfg.actionOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setActionOption(opt)}
                          className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                            actionOption === opt
                              ? 'bg-zinc-800 text-white border-zinc-600'
                              : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                          style={actionOption === opt ? { borderColor: accent } : {}}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Seu Nome Completo:</label>
                    <input
                      type="text"
                      required
                      value={actionName}
                      onChange={(e) => setActionName(e.target.value)}
                      placeholder="Ex: Ana Maria ou Carlos Silva"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">WhatsApp para Confirmação:</label>
                    <input
                      type="tel"
                      required
                      value={actionPhone}
                      onChange={(e) => setActionPhone(e.target.value)}
                      placeholder="(XX) 9XXXX-XXXX"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Observações ou Endereço de Entrega:</label>
                    <textarea
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      rows={2}
                      placeholder="Ex: Rua das Flores, 123 - entregar na sexta-feira à tarde..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-zinc-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-black text-xs text-zinc-950 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: accent }}
                  >
                    <span>Enviar Solicitação via WhatsApp</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* CALCULADORA FITNESS TAB (Only if niche === 'fitness') */}
        {activeTab === 'calculadora' && niche === 'fitness' && (
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
                      <span className="font-bold text-white font-mono">{calcWeight} kg</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={160}
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-300 font-semibold mb-1">
                      <span>Altura:</span>
                      <span className="font-bold text-white font-mono">{calcHeight} cm</span>
                    </div>
                    <input
                      type="range"
                      min={130}
                      max={220}
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
                  <div className="text-[11px] font-bold uppercase text-zinc-500">Seu IMC Calculado</div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono" style={{ color: accent }}>
                    {imc}
                  </div>
                  <div className={`text-xs font-bold ${getImcStatus().color}`}>
                    {getImcStatus().text}
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
          <span>© {new Date().getFullYear()} {data.name} • {data.slogan}. Todos os direitos reservados.</span>
          <div className="flex items-center gap-3">
            {data.whatsapp && (
              <a
                href={`https://wa.me/55${data.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1!%20Vim%20pelo%20site%20${encodeURIComponent(data.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp: {data.whatsapp}</span>
              </a>
            )}
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400">Desenvolvido com X09 Studio</span>
          </div>
        </footer>

        {/* MODAL DE CHECKOUT / PEDIDO */}
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
                      {cfg.checkoutTitle}
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
                      Confirmar e Ativar Pedido
                    </button>
                    <p className="text-[10px] text-zinc-500 text-center mt-2">
                      🔒 Ambiente 100% Seguro & Atendimento Direto
                    </p>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4 py-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-white">{cfg.checkoutSuccessTitle}</h3>
                  <p className="text-xs text-zinc-300">
                    {cfg.checkoutSuccessMsg}
                  </p>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 text-left space-y-1">
                    <div>Status: <span className="text-emerald-400 font-bold">REGISTRADO</span></div>
                    <div>Item: <span className="text-white">{selectedPlan.name}</span></div>
                    <div>Chave de Atendimento: <span className="text-purple-300">X09-{Math.floor(100000 + Math.random() * 900000)}</span></div>
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

        {/* MODAL DE DETALHES DO ITEM */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-44 rounded-xl object-cover mb-4"
              />

              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                DETALHES DO PRODUTO / SERVIÇO
              </span>
              <h3 className="text-lg font-black text-white mb-2">{selectedItem.title}</h3>
              <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                {selectedItem.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-4">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Disponibilidade:</span>
                  <span className="font-bold text-emerald-400">Pronta Entrega</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Atendimento:</span>
                  <span className="font-bold text-white">Direto no WhatsApp</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setActiveTab('acao');
                  setActionOption(selectedItem.title);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-zinc-950"
                style={{ backgroundColor: accent }}
              >
                Fazer Pedido Deste Item
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const currentDomainSlug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'projeto';

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
            <span className="ml-3 font-mono text-[11px] text-zinc-400">https://{currentDomainSlug}.x09.com.br</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SSL Let's Encrypt Ativo
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
