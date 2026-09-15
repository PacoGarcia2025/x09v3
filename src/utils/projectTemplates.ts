import { FitLifeState } from '../types/x09';

export function createSegmentData(name: string, segment: string): FitLifeState {
  const brand = name.trim() || 'Novo Projeto';
  const segLower = segment.toLowerCase();

  // 1. Catálogo / Encomendas / Coloniais / Delivery artesanal
  if (segLower.includes('catálogo') || segLower.includes('catalogo') || segLower.includes('encomenda') || segLower.includes('colonial') || segLower.includes('artesanal')) {
    return {
      name: brand,
      slogan: 'Catálogo Artesanal & Encomendas',
      headline: `${brand.toUpperCase()} • SABORES DA ROÇA & PRODUTOS COLONIAIS`,
      subheadline: 'Cestas coloniais selecionadas, queijos curados, doces caseiros e pães artesanais com entrega programada.',
      phone: '(19) 99876-5432',
      whatsapp: '(19) 99876-5432',
      accentColor: '#10b981',
      activeStudents: '850+ Pedidos',
      trainersCount: '48h Entrega',
      satisfactionRate: '99.8%',
      yearsHistory: '100% Colonial',
      productType: 'catalog',
      modalities: [
        {
          id: '1',
          title: 'Cesta Café Colonial Especial',
          description: 'Pães artesanais, broa de milho, geléia de frutas vermelhas e queijo meia cura.',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Queijos Artesanais Maturados',
          description: 'Queijo canastra, provolone defumado e queijo trançado temperado na conserva.',
          image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Doces & Compotas Caseiras',
          description: 'Doce de leite na palha, compota de figo e goiabada cascão artesanal.',
          image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '4',
          title: 'Cesta Especial de Presente',
          description: 'Cesta rústica montada com mix de queijos, vinhos artesanais e doces nobres.',
          image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 2. SaaS / Tecnologia / Finanças / Software
  if (segLower.includes('saas') || segLower.includes('tecnologia') || segLower.includes('financeir') || segLower.includes('software') || segLower.includes('startup')) {
    return {
      name: brand,
      slogan: 'Gestão Inteligente em Nuvem',
      headline: `${brand.toUpperCase()} • CONTROLE FINANCEIRO INTELIGENTE`,
      subheadline: 'Automatize cobranças, conciliação bancária e relatórios com inteligência analítica em tempo real.',
      phone: '(11) 3300-4400',
      whatsapp: '(11) 98888-2222',
      accentColor: '#38bdf8',
      activeStudents: '10k+ Empresas',
      trainersCount: '99.9% Uptime',
      satisfactionRate: '0ms Latência',
      yearsHistory: '24/7 Ativo',
      productType: 'saas',
      modalities: [
        {
          id: '1',
          title: 'Automação de Fluxo de Caixa',
          description: 'Conciliação bancária instantânea com alertas inteligentes de contas e saldo.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Emissão PIX & Boletos em Lote',
          description: 'Split de pagamentos automático, liquidação em D+0 e checkout transparente.',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Relatórios Gerenciais em Tempo Real',
          description: 'Gráficos preditivos de DRE, margem de contribuição e ponto de equilíbrio.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 3. Barbearia / Estética Masculina
  if (segLower.includes('barbearia') || segLower.includes('barba') || segLower.includes('estética masculina') || segLower.includes('salao')) {
    return {
      name: brand,
      slogan: 'Cortes Clássicos & Barba',
      headline: `${brand.toUpperCase()} • TRADIÇÃO & ESTILO PARA O HOMEM MODERNO`,
      subheadline: 'Agende seu horário online sem espera com os melhores barbeiros da cidade.',
      phone: '(11) 97777-6666',
      whatsapp: '(11) 97777-6666',
      accentColor: '#eab308',
      activeStudents: '3.2k Clientes',
      trainersCount: '6 Barbeiros',
      satisfactionRate: '99.5%',
      yearsHistory: '+4 Anos',
      productType: 'barber',
      modalities: [
        {
          id: '1',
          title: 'Corte Tradicional & Degradê',
          description: 'Corte estilizado com tesoura ou máquina, visagismo e finalização premium.',
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Barba Terapia com Toalha Quente',
          description: 'Alinhamento na navalha, massagem facial relaxante e óleos importados.',
          image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Combo Cabelo + Barba + Bebida',
          description: 'Experiência completa com direito a cerveja artesanal ou café expresso.',
          image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 4. Restaurante / Gastronomia / Hamburgueria / Pizzaria / Cafeteria
  if (segLower.includes('restaurante') || segLower.includes('gastronomia') || segLower.includes('hamburg') || segLower.includes('pizza') || segLower.includes('café') || segLower.includes('cafe')) {
    return {
      name: brand,
      slogan: 'Gastronomia & Sabor Artesanal',
      headline: `${brand.toUpperCase()} • EXPERIÊNCIA GASTRONÔMICA ÚNICA`,
      subheadline: 'Ingredientes selecionados, receitas exclusivas e entrega ágil para o seu melhor momento.',
      phone: '(11) 98765-4321',
      whatsapp: '(11) 98765-4321',
      accentColor: '#f59e0b',
      activeStudents: '1.4k+ Pedidos/mês',
      trainersCount: '30 min Médio',
      satisfactionRate: '4.9★ Google',
      yearsHistory: 'Desde 2021',
      productType: 'service',
      modalities: [
        {
          id: '1',
          title: 'Pratos Especiais do Chef',
          description: 'Receitas contemporâneas preparadas na hora com guarnições frescas.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Hambúrgueres Artesanais na Brasa',
          description: 'Blend de carne nobre, queijo derretido e pão brioche selado na manteiga.',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Sobremesas & Cafés Gourmet',
          description: 'Sobremesas da casa acompanhadas de grãos de café moídos na hora.',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 5. E-commerce / Moda / Loja Virtual
  if (segLower.includes('e-commerce') || segLower.includes('ecommerce') || segLower.includes('loja') || segLower.includes('moda')) {
    return {
      name: brand,
      slogan: 'Moda & Conceito Exclusivo',
      headline: `${brand.toUpperCase()} • DESIGN ATEMPORAL & CONFORTO`,
      subheadline: 'Coleções exclusivas com design contemporâneo, tecidos nobres e entrega expressa para todo o Brasil.',
      phone: '(11) 94444-1111',
      whatsapp: '(11) 94444-1111',
      accentColor: '#ec4899',
      activeStudents: '5.4k Vendas',
      trainersCount: '24h Envio',
      satisfactionRate: '99.2%',
      yearsHistory: '100% Seguro',
      productType: 'ecommerce',
      modalities: [
        {
          id: '1',
          title: 'Coleção Alfaiataria Moderna',
          description: 'Peças com corte impecável, elegância e versatilidade para o dia a dia.',
          image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Acessórios & Bolsas em Couro',
          description: 'Acabamento feito à mão com ferragens nobres e durabilidade extrema.',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Linha Casual Minimalista',
          description: 'Algodão peruano e modelagem pensada no conforto absoluto.',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 6. Imobiliária / Corretores / Imóveis
  if (segLower.includes('imóvel') || segLower.includes('imovel') || segLower.includes('imobiliária') || segLower.includes('corretor')) {
    return {
      name: brand,
      slogan: 'Imóveis de Alto Padrão',
      headline: `${brand.toUpperCase()} • SEU PRÓXIMO ENDEREÇO DE LUXO`,
      subheadline: 'Apartamentos e casas exclusivas nas melhores localizações com atendimento personalizado.',
      phone: '(11) 93333-8888',
      whatsapp: '(11) 93333-8888',
      accentColor: '#10b981',
      activeStudents: '250+ Imóveis',
      trainersCount: '15 Corretores',
      satisfactionRate: '100%',
      yearsHistory: '+8 Anos',
      productType: 'service',
      modalities: [
        {
          id: '1',
          title: 'Apartamentos & Penthouses',
          description: 'Plantas com varanda gourmet integrada e vista panorâmica da cidade.',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Casas em Condomínio Fechado',
          description: 'Segurança 24 horas, área verde preservada e lazer completo para sua família.',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Lançamentos na Planta',
          description: 'Oportunidades exclusivas com fluxo de pagamento flexível.',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 7. Clínica / Odontologia / Saúde
  if (segLower.includes('clínica') || segLower.includes('clinica') || segLower.includes('médic') || segLower.includes('odonto') || segLower.includes('saúde')) {
    return {
      name: brand,
      slogan: 'Saúde Integrada & Estética',
      headline: `${brand.toUpperCase()} • CUIDADO MÉDICO COMPLETO E HUMANIZADO`,
      subheadline: 'Consultas especializadas, tecnologia diagnóstica de ponta e agendamento online rápido.',
      phone: '(11) 92222-3333',
      whatsapp: '(11) 92222-3333',
      accentColor: '#06b6d4',
      activeStudents: '12k+ Pacientes',
      trainersCount: '14 Especialistas',
      satisfactionRate: '4.9★ Avaliações',
      yearsHistory: 'CRM Válido',
      productType: 'health',
      modalities: [
        {
          id: '1',
          title: 'Consultas Médicas Especializadas',
          description: 'Diagnóstico aprofundado com médicos certificados e atendimento pontual.',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Procedimentos & Tratamentos',
          description: 'Protocolos modernos com equipamentos certificados pela Anvisa.',
          image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Check-up Preventivo 360',
          description: 'Acompanhamento preventivo com exames integrados em uma única visita.',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 8. Academia / Fitness / Esporte (apenas se solicitado)
  if (segLower.includes('academia') || segLower.includes('esporte') || segLower.includes('fitness') || segLower.includes('crossfit')) {
    return {
      name: brand,
      slogan: 'Treinamento & Performance',
      headline: `${brand.toUpperCase()} • O PADRÃO MÁXIMO EM EXCELÊNCIA FITNESS`,
      subheadline: 'Treinos sob medida, maquinário biomecânico de ponta e metodologia validada.',
      phone: '(19) 99999-9999',
      whatsapp: '(19) 99999-9999',
      accentColor: '#c4f039',
      activeStudents: '+2.500 Alunos',
      trainersCount: '12 Coaches',
      satisfactionRate: '98%',
      yearsHistory: '+5 Anos',
      productType: 'gym',
      modalities: [
        {
          id: '1',
          title: 'Musculação & Biofísica',
          description: 'Força e resultado com maquinário de última geração.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '2',
          title: 'Treino Funcional & HIIT',
          description: 'Movimento, agilidade e condicionamento cardiovascular.',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: '3',
          title: 'Acompanhamento Personal 1 a 1',
          description: 'Orientação postural e planejamento sob medida para seus objetivos.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // 9. Projeto em Branco (Default)
  return {
    name: brand,
    slogan: segment,
    headline: `${brand.toUpperCase()} • DESIGN & CONVERSÃO DIGITAL`,
    subheadline: `Plataforma profissional personalizada para ${segment}. Atendimento e qualidade garantidos.`,
    phone: '(11) 98888-0000',
    whatsapp: '(11) 98888-0000',
    accentColor: '#8b5cf6',
    activeStudents: '100+',
    trainersCount: '24h',
    satisfactionRate: '100%',
    yearsHistory: '2026',
    productType: 'blank',
    isBlank: true,
    modalities: [],
  };
}
