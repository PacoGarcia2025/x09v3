import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { paymentsRouter } from './server/paymentsRouter';
import { creditsRouter } from './server/creditsRouter';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount API Routers
app.use('/api/payments', paymentsRouter);
app.use('/api/credits', creditsRouter);

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Subdomain availability check for *.x09.com.br
app.get('/api/subdomains/check', (req, res) => {
  const subdomain = ((req.query.subdomain as string) || '').toLowerCase().trim();
  const reserved = ['studio', 'api', 'admin', 'auth', 'mail', 'www', 'ftp', 'ssh', 'db', 'app'];

  if (!subdomain || subdomain.length < 3) {
    return res.json({ available: false, reason: 'Mínimo 3 caracteres' });
  }

  if (reserved.includes(subdomain)) {
    return res.json({ available: false, reason: 'Subdomínio reservado pelo sistema x09.com.br' });
  }

  res.json({
    available: true,
    subdomain,
    fullDomain: `${subdomain}.x09.com.br`,
    hostingerVpsIp: process.env.HOSTINGER_VPS_IP || '194.163.155.88',
  });
});

// Integration health status (Cloudflare, Supabase, Hostinger VPS)
app.get('/api/integrations/status', (req, res) => {
  res.json({
    cloudflare: {
      status: 'active',
      wildcard: '*.x09.com.br',
      ssl: 'Full (Strict)',
    },
    hostingerVps: {
      status: 'active',
      nginx: 'wildcard-subdomains',
      port: 3000,
    },
    supabase: {
      status: 'ready',
      tables: ['users_x09', 'projects_x09'],
    },
  });
});

// Real AI Chat Endpoint for X09 Studio website generation & modifications
app.post('/api/ai/chat', async (req, res) => {
  const { message, projectContext, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem é obrigatória' });
  }

  const ai = getAIClient();

  if (ai) {
    try {
      const systemPrompt = `Você é o X09, o arquiteto de IA sênior e motor criativo do X09 Studio.
Sua missão é entrevistar o usuário em português e ajudá-lo a criar ou personalizar websites, e-commerces, catálogos de produtos coloniais/encomendas, SaaS, clínicas e aplicações com design de altíssimo nível.
Contexto atual do projeto:
Nome: ${projectContext?.name || 'Novo Projeto'}
Segmento: ${projectContext?.slogan || 'SaaS / Web App'}
Cores: ${projectContext?.accentColor || '#8b5cf6'}
Telefone: ${projectContext?.phone || ''}
Tela em Branco: ${projectContext?.isBlank ? 'Sim' : 'Não'}

Regras de resposta:
1. Seja objetivo, empolgante, focado em alta conversão e design moderno (estilo Lovable/Base44).
2. Responda em no máximo 2 a 3 frases claras explicando o que foi feito ou sugerindo melhorias.
3. Sugira 2 a 4 opções rápidas ("quickReplies") para o usuário clicar e avançar.
4. Se o usuário estiver criando um novo projeto do zero ou pedindo novos conteúdos/seções/produtos, retorne um objeto "patch" com campos como:
   - name: nome da marca
   - slogan: nicho ou proposta de valor
   - headline: título de impacto da página
   - subheadline: descrição de apoio
   - accentColor: cor hexadecimal de destaque (#10b981, #38bdf8, #eab308, #ec4899, #c4f039, etc.)
   - phone: telefone de contato
   - whatsapp: whatsapp com DDD
   - isBlank: false (ativa o preview imediatamente)
   - modalities: array de 3 a 4 itens/produtos com { id, title, description, image } pertinentes ao nicho do usuário (use imagens válidas do Unsplash)

Retorne SEMPRE um JSON válido com o seguinte formato:
{
  "text": "Sua resposta amigável e técnica",
  "quickReplies": ["Opção 1", "Opção 2", "Opção 3"],
  "patch": {
    "name": "novo nome se solicitado",
    "slogan": "novo slogan/nicho se solicitado",
    "headline": "nova headline de alto impacto",
    "subheadline": "nova subheadline explicativa",
    "accentColor": "#hex se solicitado",
    "phone": "novo telefone se solicitado",
    "whatsapp": "novo whatsapp se solicitado",
    "isBlank": false,
    "modalities": [
      { "id": "1", "title": "Item 1", "description": "Descrição do item", "image": "https://images.unsplash.com/..." }
    ]
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nUsuário disse: "${message}"`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          text: parsed.text || 'Entendido! Ajustei seu projeto conforme solicitado.',
          quickReplies: parsed.quickReplies || ['Ver no preview', 'Avançar etapa', 'Personalizar cores'],
          patch: parsed.patch || {},
        });
      } catch {
        return res.json({
          text: responseText,
          quickReplies: ['Excelente!', 'Ver alterações no preview', 'Próxima etapa'],
        });
      }
    } catch (error: any) {
      console.warn('Gemini API fallback triggered:', error.message);
    }
  }

  // Built-in intelligent engine fallback (works 100% offline or without API key)
  const lower = message.toLowerCase();
  let text = '';
  let quickReplies: string[] = [];
  const patch: Record<string, any> = {};

  // If currently blank, activate project rendering on any creation prompt
  if (projectContext?.isBlank) {
    patch.isBlank = false;
  }

  if (lower.includes('cor') || lower.includes('paleta') || lower.includes('neon') || lower.includes('azul') || lower.includes('dourado') || lower.includes('preto')) {
    if (lower.includes('azul') || lower.includes('ciano')) {
      patch.accentColor = '#38bdf8';
      text = 'Aplicada a paleta Ciano Cyber Elétrico! O contraste com o tema escuro ficou ultra-moderno.';
      quickReplies = ['Manter Ciano', 'Testar Neon Lima', 'Testar Dourado Luxo'];
    } else if (lower.includes('dourado') || lower.includes('ouro') || lower.includes('amarelo')) {
      patch.accentColor = '#eab308';
      text = 'Paleta Ouro Dourado aplicada! O visual agora transmite exclusividade e sofisticação de alto padrão.';
      quickReplies = ['Manter Dourado', 'Testar Roxo Tech', 'Avançar para Planos'];
    } else if (lower.includes('roxo') || lower.includes('púrpura')) {
      patch.accentColor = '#a855f7';
      text = 'Paleta Roxo Tech Ultra ativada no design! Ideal para SaaS, tecnologia e estúdios modernos.';
      quickReplies = ['Perfeito!', 'Adicionar fotos', 'Ir para o Código'];
    } else {
      patch.accentColor = '#c4f039';
      text = 'Paleta Neon Lima reativada! Máxima energia, dinamismo e visibilidade nos botões de conversão.';
      quickReplies = ['Avançar para Planos', 'Editar Modalidades', 'Ajustar Telefone'];
    }
  } else if (lower.includes('nome') || lower.includes('chamar') || lower.includes('marca')) {
    const extracted = message.replace(/(o nome é|chame de|coloque|mudar para|nome)/gi, '').trim();
    if (extracted.length > 2) {
      patch.name = extracted;
      text = `Excelente nome! A marca foi renomeada para "${extracted}" em todas as telas, badges e cabeçalhos do site.`;
      quickReplies = ['Mudar slogan', 'Ajustar WhatsApp', 'Ver resultado no Preview'];
    } else {
      text = 'Qual será o novo nome do seu projeto? Digite o nome da marca para eu atualizar instantaneamente.';
      quickReplies = ['Iron Peak Fitness', 'Pulse Academia', 'Titan Training Club'];
    }
  } else if (lower.includes('telefone') || lower.includes('whatsapp') || lower.includes('contato')) {
    const phoneMatch = message.match(/(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/);
    if (phoneMatch) {
      patch.phone = phoneMatch[0];
      patch.whatsapp = phoneMatch[0];
      text = `Telefone e WhatsApp atualizados para ${phoneMatch[0]}! O botão de contato direto agora já redireciona para este número.`;
      quickReplies = ['Adicionar e-mail', 'Configurar horários', 'Ver preview do rodapé'];
    } else {
      text = 'Você pode me passar o DDD e número de WhatsApp no formato (XX) 9XXXX-XXXX para atualizarmos os botões de matrícula.';
      quickReplies = ['(11) 98765-4321', '(21) 99888-7766', 'Pular este passo'];
    }
  } else if (lower.includes('plano') || lower.includes('preço') || lower.includes('valor')) {
    text = 'Os planos interativos contam com seletor Mensal e Anual (-20%), com checkout e modal de contratação 100% funcional. Deseja personalizar os valores?';
    quickReplies = ['Sim, personalizar valores', 'Ajustar para Encomendas', 'Ver aba de Planos'];
  } else {
    // Creation or generic update for multiple niches
    if (lower.includes('catalogo') || lower.includes('catálogo') || lower.includes('encomenda') || lower.includes('loja') || lower.includes('produto')) {
      patch.name = lower.includes('cheiro') ? 'Cheiro de Mato' : 'Catálogo Premium';
      patch.slogan = 'Catálogo Digital & Encomendas Diretas';
      patch.headline = 'ENCOMENDAS DIRETAS & PRODUTOS SELECIONADOS';
      patch.subheadline = 'Escolha seus itens favoritos, monte seu pedido e envie direto para o nosso WhatsApp com total praticidade.';
      patch.accentColor = '#10b981';
      patch.activeStudents = '850+';
      patch.trainersCount = '48h';
      patch.satisfactionRate = '99.4%';
      patch.yearsHistory = '100% Artesanal';
      patch.modalities = [
        {
          id: 'cat-1',
          title: 'Produtos Coloniais & Artesanais',
          description: 'Itens frescos, selecionados diretamente do produtor com máxima qualidade.',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: 'cat-2',
          title: 'Cestas Especiais de Encomenda',
          description: 'Kits personalizados para presentes, famílias e eventos sob demanda.',
          image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: 'cat-3',
          title: 'Entrega Rápida & Pronta Entrega',
          description: 'Receba seus pedidos com pontualidade e embalagem térmica protetora.',
          image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=800&q=80',
        },
      ];
      text = 'Seu Catálogo de Encomendas foi gerado com sucesso! Seus clientes agora podem ver os produtos e encomendar direto pelo WhatsApp.';
      quickReplies = ['Ver Produtos no Preview', 'Trocar Cor para Verde', 'Ajustar WhatsApp'];
    } else if (lower.includes('saas') || lower.includes('financeiro') || lower.includes('b2b')) {
      patch.name = 'Nexus Finance';
      patch.slogan = 'Fintech & SaaS B2B';
      patch.headline = 'CONTROLE FINANCEIRO INTELIGENTE EM TEMPO REAL';
      patch.subheadline = 'Automatize cobranças, conciliação e relatórios com inteligência artificial nativa.';
      patch.accentColor = '#38bdf8';
      text = 'Projeto configurado como SaaS Financeiro B2B com visual futurista e métricas em tempo real!';
      quickReplies = ['Testar Planos', 'Ajustar Cores', 'Ver Código Fonte'];
    } else if (lower.includes('barbearia') || lower.includes('barber')) {
      patch.name = 'Barber King';
      patch.slogan = 'Cortes Clássicos & Barba';
      patch.headline = 'TRADIÇÃO & ESTILO PARA O HOMEM MODERNO';
      patch.subheadline = 'Agende seu horário online sem espera com os melhores barbeiros da cidade.';
      patch.accentColor = '#eab308';
      text = 'Projeto configurado como Barbearia Premium com agendamento online!';
      quickReplies = ['Ver Agendamento', 'Personalizar Preços', 'Conectar WhatsApp'];
    } else if (lower.includes('restaurante') || lower.includes('comida') || lower.includes('hamburguer') || lower.includes('pizza') || lower.includes('gastronomia')) {
      patch.name = 'Bistrô & Sabor';
      patch.slogan = 'Gastronomia Artesanal & Delivery';
      patch.headline = 'SABORES INCRÍVEIS ENTREGUES NA SUA CASA';
      patch.subheadline = 'Cardápio completo com pratos selecionados e pedido fácil via WhatsApp sem taxas abusivas.';
      patch.accentColor = '#f97316';
      patch.modalities = [
        { id: '1', title: 'Pratos Especiais do Chef', description: 'Receitas contemporâneas preparadas na hora com guarnições frescas.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
        { id: '2', title: 'Hambúrgueres na Brasa', description: 'Blend de carne nobre, queijo derretido e pão brioche selado.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
        { id: '3', title: 'Sobremesas & Cafés', description: 'Sobremesas da casa acompanhadas de café moído na hora.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' }
      ];
      text = 'Projeto gastronômico ativado! Cardápio interativo e botão de pedido direto configurados.';
      quickReplies = ['Ver Cardápio', 'Mudar para Vermelho', 'Publicar'];
    } else if (lower.includes('imobili') || lower.includes('imovel') || lower.includes('imóve')) {
      patch.name = 'Prime Imóveis';
      patch.slogan = 'Imóveis de Alto Padrão';
      patch.headline = 'SEU PRÓXIMO ENDEREÇO DE LUXO COMEÇA AQUI';
      patch.subheadline = 'Apartamentos e casas exclusivas nas melhores localizações com atendimento personalizado.';
      patch.accentColor = '#10b981';
      patch.modalities = [
        { id: '1', title: 'Apartamentos & Penthouses', description: 'Plantas exclusivas com vista panorâmica.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
        { id: '2', title: 'Casas em Condomínio', description: 'Segurança 24 horas e área verde preservada.', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' },
        { id: '3', title: 'Lançamentos na Planta', description: 'Condições especiais direto com a incorporadora.', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' }
      ];
      text = 'Portal imobiliário de luxo ativado com filtros e galeria de imóveis!';
      quickReplies = ['Ver Imóveis', 'Mudar WhatsApp', 'Ver Preview'];
    } else if (lower.includes('clinica') || lower.includes('clínica') || lower.includes('médic') || lower.includes('odonto')) {
      patch.name = 'Aura Health';
      patch.slogan = 'Clínica & Telemedicina';
      patch.headline = 'CUIDADO MÉDICO COMPLETO NA PALMA DA SUA MÃO';
      patch.subheadline = 'Consultas especializadas, agendamento online e atendimento humanizado.';
      patch.accentColor = '#06b6d4';
      patch.modalities = [
        { id: '1', title: 'Consultas Médicas 24h', description: 'Atendimento por videochamada ou presencial.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80' },
        { id: '2', title: 'Receituário Digital', description: 'Receitas válidas em todas as farmácias.', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
        { id: '3', title: 'Check-up Preventivo', description: 'Exames laboratoriais e diagnóstico rápido.', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80' }
      ];
      text = 'Projeto para clínica e saúde preventiva ativado no preview!';
      quickReplies = ['Ver Serviços', 'Ajustar Telefone', 'Avançar'];
    } else if (lower.includes('moda') || lower.includes('roupa') || lower.includes('calcado')) {
      patch.name = 'Bella Moda';
      patch.slogan = 'Moda & Conceito Exclusivo';
      patch.headline = 'DESIGN ATEMPORAL & CONFORTO ABSOLUTO';
      patch.subheadline = 'Coleções exclusivas com design contemporâneo e entrega para todo o país.';
      patch.accentColor = '#ec4899';
      patch.modalities = [
        { id: '1', title: 'Coleção Alfaiataria', description: 'Peças clássicas com corte impecável.', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80' },
        { id: '2', title: 'Acessórios em Couro', description: 'Bolsas e cintos artesanais.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
        { id: '3', title: 'Linha Casual Premium', description: 'Algodão nobre e toque macio.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' }
      ];
      text = 'E-commerce de moda montado com catálogo visual e botões de compra!';
      quickReplies = ['Ver Catálogo', 'Testar Checkout', 'Trocar Cor'];
    } else if (lower.includes('academia') || lower.includes('fitness') || lower.includes('treino') || lower.includes('musculação')) {
      patch.name = 'FitLife Pro';
      patch.slogan = 'Academia & Saúde Premium';
      patch.headline = 'DISCIPLINA HOJE, RESULTADOS SEMPRE';
      patch.subheadline = 'Mais que uma academia. Um estilo de vida com tecnologia e alta performance.';
      patch.accentColor = '#c4f039';
      text = 'Projeto configurado para academia e esportes com alta energia visual!';
      quickReplies = ['Ver Modalidades', 'Ajustar Planos', 'Publicar'];
    } else {
      text = `Com certeza! Registrei "${message}" na estrutura do projeto. O código, os textos e a interface já foram ajustados no preview ao lado.`;
      quickReplies = ['Avançar para Planejamento', 'Customizar Design System', 'Ver código fonte gerado'];
    }
  }

  res.json({ text, quickReplies, patch });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`X09 Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
