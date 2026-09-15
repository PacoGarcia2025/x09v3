-- Seed file for Official X09 Templates
-- Run this in your Supabase SQL Editor to populate public.templates table

INSERT INTO public.templates (id, title, slug, category, badge, description, thumbnail, suggested_subdomain, features, data, is_active)
VALUES
(
  'tpl_fitlife',
  'FitLife Pro',
  'fitlife-pro',
  'Sites',
  'Mais Vendido',
  'Template completo para academias, estúdios fitness e personal trainers de alto padrão.',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
  'fitlife',
  '["Hero cinemático com vídeo/imagem", "Grade de modalidades", "Planos e Checkout", "Agendamento WhatsApp", "Design System escuro"]'::jsonb,
  '{
    "name": "FitLife",
    "slogan": "Academia & Performance",
    "headline": "TRANSFORME SEU CORPO. ELEVE SUA MENTE.",
    "subheadline": "A experiência definitiva em treino de alta performance, musculação avançada e bem-estar em um espaço exclusivo.",
    "phone": "(19) 99999-9999",
    "whatsapp": "(19) 99999-9999",
    "accentColor": "#c4f039",
    "activeStudents": "1.250+",
    "trainersCount": "18",
    "satisfactionRate": "99.4%",
    "yearsHistory": "8 Anos",
    "modalities": [
      {
        "id": "mod-1",
        "title": "Musculação & Hipertrofia",
        "description": "Equipamentos biomecânicos de ponta com acompanhamento de treinadores certificados.",
        "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-2",
        "title": "Cross & Funcional Pro",
        "description": "Treinos dinâmicos de alta intensidade para resistência cardiovascular e queima calórica extrema.",
        "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-3",
        "title": "Spinning Imersivo",
        "description": "Salas acústicas com iluminação inteligente e trilhas sonoras selecionadas por DJs.",
        "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-4",
        "title": "Recovery & Spa Lounge",
        "description": "Banheiras de gelo, sauna seca e massoterapia esportiva para aceleração de recuperação muscular.",
        "image": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }'::jsonb,
  true
),
(
  'tpl_nexus',
  'Nexus SaaS',
  'nexus-saas',
  'SaaS',
  'Alta Conversão',
  'Landing page e painel moderno para produtos de software como serviço e inteligência de dados.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
  'nexus',
  '["Dashboard interativo com gráficos", "Tabela de preços mensal/anual", "Depoimentos em carrossel", "Integração via Webhook"]'::jsonb,
  '{
    "name": "Nexus SaaS",
    "slogan": "Inteligência Operacional",
    "headline": "O MOTOR DE DADOS QUE ACELERA SEU NEGÓCIO.",
    "subheadline": "Monitore métricas em tempo real, automatize fluxos e unifique toda sua operação em uma única tela.",
    "phone": "(11) 3000-0000",
    "whatsapp": "(11) 98888-7777",
    "accentColor": "#38bdf8",
    "activeStudents": "12.4k",
    "trainersCount": "99.99%",
    "satisfactionRate": "4.9/5",
    "yearsHistory": "5 Anos",
    "modalities": [
      {
        "id": "mod-saas-1",
        "title": "Analytics em Tempo Real",
        "description": "Acompanhe funis de venda, churn e receita recorrente com atualização segundo a segundo.",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-saas-2",
        "title": "Automações Sem Código",
        "description": "Conecte webhooks, envie alertas no Slack e sincronize leads com seu CRM automaticamente.",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }'::jsonb,
  true
),
(
  'tpl_barber',
  'Barber King Club',
  'barber-king-club',
  'Sites',
  'Agendamento',
  'Site institucional e agendador para barbearias premium com escolha de profissional.',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  'barberking',
  '["Agendamento com horário e barbeiro", "Catálogo de cortes e barba", "Integração direta com WhatsApp", "Localização e horários"]'::jsonb,
  '{
    "name": "Barber King Club",
    "slogan": "Cortes Clássicos & Barba Terapia",
    "headline": "ESTILO, PRECISÃO E RESPEITO À TRADIÇÃO.",
    "subheadline": "Agende seu corte com os melhores mestres barbeiros em um ambiente com chopp artesanal e sinuca.",
    "phone": "(19) 98765-4321",
    "whatsapp": "(19) 98765-4321",
    "accentColor": "#eab308",
    "activeStudents": "850+",
    "trainersCount": "6",
    "satisfactionRate": "99.8%",
    "yearsHistory": "4 Anos",
    "modalities": [
      {
        "id": "mod-b1",
        "title": "Corte Signature Fade",
        "description": "Degradê navalhado com acabamento milimétrico e lavagem com massagem capilar relaxante.",
        "image": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-b2",
        "title": "Barba Terapia com Toalha Quente",
        "description": "Esfoliação facial, hidratação profunda com óleos essenciais e alinhamento com lâmina tradicional.",
        "image": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }'::jsonb,
  true
),
(
  'tpl_cyberstore',
  'CyberStore 2.0',
  'cyberstore-2',
  'E-commerces',
  'Checkout PIX',
  'Loja virtual de alta velocidade otimizada para smartphones com carrinho dinâmico.',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  'cyberstore',
  '["Carrinho lateral interativo", "Cálculo de frete em tempo real", "Checkout com PIX com desconto", "Grid responsivo de produtos"]'::jsonb,
  '{
    "name": "CyberStore 2.0",
    "slogan": "Hardware & Periféricos Premium",
    "headline": "O ARSENAL DEFINITIVO PARA SUA PERFORMANCE.",
    "subheadline": "Monitores OLED, teclados magnéticos e componentes de última geração com entrega expressa para todo o Brasil.",
    "phone": "(11) 4004-9090",
    "whatsapp": "(11) 97777-6666",
    "accentColor": "#a855f7",
    "activeStudents": "45.000+",
    "trainersCount": "120k",
    "satisfactionRate": "98.9%",
    "yearsHistory": "6 Anos",
    "modalities": [
      {
        "id": "mod-e1",
        "title": "Setup Gamer Pro",
        "description": "Periféricos mecânicos com switches ópticos de 8000Hz para tempo de resposta nulo em partidas competitivas.",
        "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-e2",
        "title": "Áudio Espacial Hi-Res",
        "description": "Headsets planares magnéticos com cancelamento de ruído e microfones broadcast certificados.",
        "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }'::jsonb,
  true
),
(
  'tpl_prime',
  'Prime Imóveis',
  'prime-imoveis',
  'Sites',
  'Filtro Avançado',
  'Portal imobiliário para corretoras e consultores com busca por bairro, quartos e valor.',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
  'primeimoveis',
  '["Filtros dinâmicos por categoria", "Tour virtual em fotos e vídeo", "Formulário de proposta direta", "Mapa de localização integrado"]'::jsonb,
  '{
    "name": "Prime Imóveis",
    "slogan": "Empreendimentos de Alto Padrão",
    "headline": "O ENDEREÇO DOS SEUS SONHOS ESPERA POR VOCÊ.",
    "subheadline": "Casas em condomínio fechado, coberturas duplex e salas comerciais nas regiões mais valorizadas da cidade.",
    "phone": "(19) 3210-9000",
    "whatsapp": "(19) 99123-4567",
    "accentColor": "#10b981",
    "activeStudents": "1.400+",
    "trainersCount": "42",
    "satisfactionRate": "99.1%",
    "yearsHistory": "12 Anos",
    "modalities": [
      {
        "id": "mod-p1",
        "title": "Residências em Condomínio",
        "description": "Projetos arquitetônicos contemporâneos com piscina privativa, automação e segurança 24 horas.",
        "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-p2",
        "title": "Coberturas Duplex & Penthouses",
        "description": "Vista panorâmica de 360 graus com acabamentos em mármore importado e elevador privativo codificado.",
        "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }'::jsonb,
  true
),
(
  'tpl_aura',
  'Aura Health',
  'aura-health',
  'Apps',
  'Telemedicina',
  'Portal médico e clínica multidisciplinar com agendamento online e prontuário integrado.',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  'aurahealth',
  '["Triagem interativa de especialidades", "Agendamento de consultas presenciais e online", "Área do paciente segura", "Certificação de privacidade"]'::jsonb,
  '{
    "name": "Aura Health",
    "slogan": "Medicina Integrativa & Diagnóstico",
    "headline": "CUIDADO INTEGRAL, HUMANO E BASEADO EM EVIDÊNCIAS.",
    "subheadline": "Conectamos você aos especialistas mais renomados com atendimento humanizado, pontual e integrado.",
    "phone": "(11) 4002-8922",
    "whatsapp": "(11) 98111-2222",
    "accentColor": "#06b6d4",
    "activeStudents": "8.900+",
    "trainersCount": "34",
    "satisfactionRate": "99.7%",
    "yearsHistory": "7 Anos",
    "modalities": [
      {
        "id": "mod-m1",
        "title": "Cardiologia & Check-up Preventivo",
        "description": "Avaliação detalhada com ecocardiograma, teste ergométrico e acompanhamento nutricional personalizado.",
        "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": "mod-m2",
        "title": "Dermatologia Avançada & Estética",
        "description": "Procedimentos dermatológicos a laser com precisão microscópica e tratamentos de rejuvenescimento.",
        "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }'::jsonb,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  thumbnail = EXCLUDED.thumbnail,
  features = EXCLUDED.features,
  data = EXCLUDED.data,
  is_active = EXCLUDED.is_active;
