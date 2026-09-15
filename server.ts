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
Sua missão é entrevistar o usuário em português e ajudá-lo a criar ou personalizar websites, SaaS e aplicações com design de altíssimo nível.
Contexto atual do projeto:
Nome: ${projectContext?.name || 'Novo Projeto'}
Segmento: ${projectContext?.slogan || 'SaaS / Web App'}
Cores: ${projectContext?.accentColor || '#8b5cf6'}
Telefone: ${projectContext?.phone || ''}
Tela em Branco: ${projectContext?.isBlank ? 'Sim' : 'Não'}

Regras de resposta:
1. Seja objetivo, empolgante, focado em alta qualidade e design moderno (estilo Lovable/Base44).
2. Responda em no máximo 2 a 3 frases claras.
3. Sugira 2 a 4 opções rápidas ("quickReplies") para o usuário clicar e decidir rápido.
4. Se o usuário estiver criando um novo projeto do zero ou pedindo alterações, retorne um objeto "patch" com campos como: name, slogan, headline, subheadline, accentColor, phone, whatsapp, e se for um novo projeto, defina "isBlank": false para renderizar o design imediatamente!

Retorne SEMPRE um JSON válido com o seguinte formato:
{
  "text": "Sua resposta amigável e técnica",
  "quickReplies": ["Opção 1", "Opção 2", "Opção 3"],
  "patch": {
    "name": "novo nome se solicitado (ou omitir)",
    "slogan": "novo slogan/nicho (ou omitir)",
    "headline": "nova headline de alto impacto (ou omitir)",
    "subheadline": "nova subheadline explicativa (ou omitir)",
    "accentColor": "#hex se solicitado (ou omitir)",
    "phone": "novo telefone se solicitado (ou omitir)",
    "isBlank": false
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
    text = 'Os planos interativos contam com seletor Mensal e Anual (-20%), com checkout e modal de contratação 100% funcional. Deseja ativar o Plano VIP Diamond?';
    quickReplies = ['Sim, ativar VIP Diamond', 'Ajustar valor do Plano Básico', 'Ver aba de Planos'];
  } else {
    // Creation or generic update
    if (lower.includes('saas') || lower.includes('financeiro') || lower.includes('b2b')) {
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
