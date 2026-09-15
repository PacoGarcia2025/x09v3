import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Globe,
  Server,
  LogOut,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Sliders,
  Copy,
  Check,
  Zap,
  Flame,
  CreditCard,
  Layers,
  ArrowRight,
  ShieldCheck,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserProject, X09Template } from '../../types/x09';
import { X09Logo } from './X09Logo';
import { MercadoPagoModal } from './MercadoPagoModal';
import { MERCADO_PAGO_PLANS, CREDIT_PACKAGES } from '../../data/mockX09';

interface UserDashboardProps {
  onOpenStudio: (project?: UserProject) => void;
  onOpenPublishModal: (projectName?: string) => void;
  onOpenAuthModal: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenStudio,
  onOpenPublishModal,
  onOpenAuthModal,
}) => {
  const {
    user,
    projects,
    templates,
    logout,
    login,
    createProject,
    cloneTemplate,
    deleteProject,
    updateProject,
    checkSubdomainAvailable,
    integrations,
    creditTransactions,
    creditEconomy,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'projetos' | 'templates' | 'planos' | 'subdominios' | 'infra'>('projetos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [copiedSubdomain, setCopiedSubdomain] = useState<string | null>(null);

  // Mercado Pago Modal State
  const [showMercadoPago, setShowMercadoPago] = useState(false);
  const [mercadoPagoTab, setMercadoPagoTab] = useState<'plans' | 'packages'>('plans');

  // New Blank project creation state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<UserProject['category']>('Sites');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [subdomainError, setSubdomainError] = useState<string | null>(null);

  // Template clone modal state
  const [cloningTemplate, setCloningTemplate] = useState<X09Template | null>(null);
  const [cloneTitle, setCloneTitle] = useState('');
  const [cloneSubdomain, setCloneSubdomain] = useState('');
  const [cloneSubdomainError, setCloneSubdomainError] = useState<string | null>(null);

  // Edit subdomain modal
  const [editingProject, setEditingProject] = useState<UserProject | null>(null);
  const [editSubdomainVal, setEditSubdomainVal] = useState('');
  const [editCustomDomainVal, setEditCustomDomainVal] = useState('');

  // 1. LOGIN GATE: Se o usuário não estiver logado, bloqueia acesso e exige autenticação!
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060809] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-purple-500/30 selection:text-purple-200">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl text-center relative overflow-hidden">
          {/* Subtle neon aura */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-center mb-5 relative z-10">
            <X09Logo variant="circular" size="lg" withGlow={true} />
          </div>

          <h2 className="text-2xl font-black text-white mb-2 relative z-10">
            Acesso ao Painel Studio X09
          </h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed relative z-10">
            O painel exclusivo <strong className="text-purple-300">studio.x09.com.br</strong> requer autenticação para proteger seus projetos, subdomínios e saldo de créditos.
          </p>

          <div className="flex flex-col gap-3 relative z-10">
            <button
              onClick={onOpenAuthModal}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar / Criar Conta</span>
            </button>

            <button
              onClick={() => {
                login('sgoliveira16@gmail.com', 'Sérgio Garcia');
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-3.5 h-3.5"
              />
              <span>Entrar como Sérgio Garcia (Google)</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autenticação Segura • Supabase PostgreSQL</span>
          </div>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subdomain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (subdomain: string) => {
    const fullUrl = `https://${subdomain}.${integrations.domainBase}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSubdomain(subdomain);
    setTimeout(() => setCopiedSubdomain(null), 2000);
  };

  const handleSubdomainInput = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setNewSubdomain(clean);
    if (!clean) {
      setSubdomainError(null);
      return;
    }
    if (clean.length < 3) {
      setSubdomainError('Mínimo de 3 caracteres');
      return;
    }
    const isAvail = checkSubdomainAvailable(clean);
    if (!isAvail) {
      setSubdomainError('Este subdomínio já está em uso ou é reservado pelo sistema');
    } else {
      setSubdomainError(null);
    }
  };

  // Submit New Blank Project (consome 5 créditos)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (user.credits < 5) {
      alert('Você precisa de pelo menos 5 créditos para criar um novo projeto. Recarregue no Mercado Pago!');
      setShowNewModal(false);
      setMercadoPagoTab('packages');
      setShowMercadoPago(true);
      return;
    }

    const finalSub = newSubdomain.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    if (!checkSubdomainAvailable(finalSub)) {
      setSubdomainError('Subdomínio indisponível. Escolha outro nome.');
      return;
    }

    const created = await createProject(newTitle, newCategory, finalSub);
    if (created) {
      setShowNewModal(false);
      setNewTitle('');
      setNewSubdomain('');
      onOpenStudio(created);
    }
  };

  // Start cloning a template
  const handleOpenCloneModal = (template: X09Template) => {
    if (user.credits < 5) {
      alert('Você precisa de pelo menos 5 créditos para clonar um modelo. Recarregue no Mercado Pago!');
      setMercadoPagoTab('packages');
      setShowMercadoPago(true);
      return;
    }
    setCloningTemplate(template);
    setCloneTitle(`${template.title} (Cópia)`);
    setCloneSubdomain(`${template.suggestedSubdomain}-${Math.floor(100 + Math.random() * 900)}`);
    setCloneSubdomainError(null);
  };

  const handleConfirmClone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloningTemplate) return;

    const finalSub = cloneSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!checkSubdomainAvailable(finalSub)) {
      setCloneSubdomainError('Subdomínio indisponível. Escolha outro nome.');
      return;
    }

    const cloned = await cloneTemplate(cloningTemplate, cloneTitle, finalSub);
    if (cloned) {
      setCloningTemplate(null);
      onOpenStudio(cloned);
    }
  };

  const handleSaveSubdomainEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const clean = editSubdomainVal.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!checkSubdomainAvailable(clean, editingProject.id)) {
      alert('Este subdomínio já está em uso!');
      return;
    }

    updateProject(editingProject.id, {
      subdomain: clean,
      customDomain: editCustomDomainVal.trim() || undefined,
    });
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-[#070908] text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* 1. TOP GLOBAL NAVIGATION */}
      <header className="h-16 bg-[#0a0d0c] border-b border-zinc-800/80 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <X09Logo variant="circular" size="sm" withGlow={true} />
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-wider text-white text-sm">
                  X09 STUDIO
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold">
                  studio.x09.com.br
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block mt-0.5 font-medium">
                Ideias em Aplicações Reais • Painel do Criador
              </span>
            </div>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('projetos')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'projetos'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
            <span>Meus Projetos</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-700 text-[10px] text-zinc-300 font-mono">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modelos X09</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
              {templates.length} Prontos
            </span>
          </button>

          <button
            onClick={() => setActiveTab('planos')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'planos'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
            <span>Planos & Mercado Pago</span>
          </button>

          <button
            onClick={() => setActiveTab('subdominios')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'subdominios'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Subdomínios (.x09)</span>
          </button>

          <button
            onClick={() => setActiveTab('infra')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'infra'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>VPS Hostinger</span>
          </button>
        </nav>

        {/* Right User & CTA with Credits */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Credits Balance Pill with Mercado Pago Direct Link */}
          <button
            onClick={() => {
              setMercadoPagoTab('packages');
              setShowMercadoPago(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/40 hover:border-purple-400 text-xs font-bold text-purple-200 flex items-center gap-1.5 transition-all shadow-sm group"
            title="Clique para comprar créditos via Mercado Pago (PIX ou Cartão)"
          >
            <Flame className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>{user.credits} Créditos</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 font-semibold group-hover:bg-purple-500 group-hover:text-white transition-colors">
              + Comprar
            </span>
          </button>

          {/* New Blank Project Button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md shadow-purple-600/20 active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Projeto</span>
            <span className="sm:hidden">Novo</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-purple-600 overflow-hidden border border-purple-400/40 flex items-center justify-center font-bold text-xs text-white">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                <span>{user.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono">
                  Plano {user.plan}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 truncate max-w-[140px]">{user.email}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-HEADER METRICS & STATUS BANNER */}
      <div className="bg-[#080b0a] border-b border-zinc-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-black text-white">{projects.length}</div>
                <div className="text-[11px] text-zinc-400">Projetos Ativos</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-black text-white font-mono">{user.credits}</div>
                <div className="text-[11px] text-zinc-400">Créditos Disponíveis</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white truncate">*.{integrations.domainBase}</div>
                <div className="text-[11px] text-zinc-400">DNS Wildcard Cloudflare</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{integrations.hostingerVpsIp}</div>
                <div className="text-[11px] text-zinc-400">Hostinger VPS Nginx</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {/* TAB 1: MEUS PROJETOS */}
        {activeTab === 'projetos' && (
          <div>
            {/* Header / Search Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-white">Meus Projetos</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Projetos criados por você no Studio X09 com subdomínio próprio em tempo real.
                </p>
              </div>

              {projects.length > 0 && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por título ou subdomínio..."
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-2 pl-8 pr-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo em Branco</span>
                  </button>
                </div>
              )}
            </div>

            {/* EMPTY STATE PARA NOVO USUÁRIO: ZERO PROJETOS SALVOS */}
            {projects.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  Você ainda não possui nenhum projeto criado
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
                  Bem-vindo ao Studio X09! Sua conta possui <strong className="text-purple-300 font-mono">{user.credits} créditos</strong> disponíveis. Comece do zero com tela em branco ou use um modelo pronto da nossa galeria.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Projeto do Zero (Em Branco)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('templates')}
                    className="w-full py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Ver Modelos Prontos</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Projects Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group bg-zinc-950/80 border border-zinc-800/90 hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-44 overflow-hidden bg-zinc-900">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30">
                          {project.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 ${
                            project.status === 'published'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              project.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                          ></span>
                          <span>{project.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                        </span>
                      </div>

                      {/* Subdomain Pill on Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="font-mono text-purple-300 font-semibold bg-zinc-950/90 px-2 py-0.5 rounded border border-purple-500/30 truncate max-w-[200px]">
                          {project.subdomain}.{integrations.domainBase}
                        </span>
                        <button
                          onClick={() => handleCopyLink(project.subdomain)}
                          className="p-1 rounded bg-zinc-950/80 text-zinc-400 hover:text-white transition-colors"
                          title="Copiar URL"
                        >
                          {copiedSubdomain === project.subdomain ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                          {project.data.subheadline || 'Projeto construído no X09 Studio'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{project.lastEdited}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setEditSubdomainVal(project.subdomain);
                              setEditCustomDomainVal(project.customDomain || '');
                            }}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Configurar Subdomínio"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir o projeto "${project.title}"?`)) {
                                deleteProject(project.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                            title="Excluir projeto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenStudio(project)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1"
                          >
                            <span>Abrir Studio</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MODELOS PRONTOS DO STUDIO X09 (TEMPLATES PARA CLONAR) */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Modelos Prontos do X09 Studio</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    6 Templates Oficiais
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Projetos completos com design de alto padrão, prontos para você clonar e editar com seu subdomínio.
                </p>
              </div>

              <div className="text-xs text-purple-300 font-semibold flex items-center gap-1.5 bg-purple-950/40 border border-purple-800/50 px-3 py-1.5 rounded-xl">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>Clonar modelo consome 5 créditos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-zinc-950/80 border border-zinc-800/90 hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-zinc-900">
                      <img
                        src={tpl.thumbnail}
                        alt={tpl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {tpl.badge}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-zinc-300">
                          {tpl.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-white text-base mb-1.5">
                        {tpl.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        {tpl.description}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 mb-4 text-[11px] text-zinc-300">
                        {tpl.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleOpenCloneModal(tpl)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Usar este Modelo (5 Créditos)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLANOS & MERCADO PAGO (LOVABLE / BASE44 STYLE) */}
        {activeTab === 'planos' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="text-xl font-bold text-white">Planos Mensais & Mercado Pago</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Studio X09 construído para concorrer com Lovable e Base44, com planos mensais em Real (BRL) e PIX instantâneo.
                </p>
              </div>

              <button
                onClick={() => {
                  setMercadoPagoTab('plans');
                  setShowMercadoPago(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Abrir Checkout Mercado Pago</span>
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {MERCADO_PAGO_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between relative ${
                    plan.popular
                      ? 'bg-gradient-to-b from-purple-950/40 via-zinc-950 to-zinc-950 border-purple-500 shadow-2xl shadow-purple-900/30'
                      : 'bg-zinc-950/80 border-zinc-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                      Mais Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-extrabold text-white text-lg">{plan.name}</h3>
                      <span className="text-xs font-mono text-purple-400 font-bold">
                        {plan.creditsMonthly} créditos/mês
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-3xl font-black text-white">
                        R$ {plan.priceMonthly.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-xs text-zinc-400"> /mês</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-zinc-300 mb-8">
                      {plan.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMercadoPagoTab('plans');
                      setShowMercadoPago(true);
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-600/30'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                    }`}
                  >
                    Assinar via Mercado Pago
                  </button>
                </div>
              ))}
            </div>

            {/* Credit Packages Section */}
            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Recargas Avulsas de Créditos</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Precisa de créditos imediatos sem mudar de plano? Compre pacotes com ativação instantânea no PIX.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CREDIT_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/40 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm">{pkg.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {pkg.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{pkg.description}</p>
                      <div className="text-lg font-black text-emerald-400 mb-3">
                        R$ {pkg.priceBrl.toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setMercadoPagoTab('packages');
                        setShowMercadoPago(true);
                      }}
                      className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
                    >
                      Comprar +{pkg.credits} Créditos
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Transaction Ledger (Extrato de Transações de Créditos) */}
            <div className="mt-8 p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>Extrato de Consumo e Recarga de Créditos</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Transações atômicas rastreadas com isolamento por usuário.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                    Custo Projeto: <strong className="text-white">{creditEconomy.projectCreationCost} cr</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                    Custo Modelo: <strong className="text-white">{creditEconomy.templateCloneCost} cr</strong>
                  </span>
                </div>
              </div>

              {creditTransactions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 text-center text-xs text-zinc-500">
                  Nenhuma movimentação de créditos registrada ainda nesta conta.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800/80 text-zinc-400">
                        <th className="pb-2 font-semibold">Data / Hora</th>
                        <th className="pb-2 font-semibold">Descrição</th>
                        <th className="pb-2 font-semibold">Tipo</th>
                        <th className="pb-2 font-semibold text-right">Valor</th>
                        <th className="pb-2 font-semibold text-right">Saldo Resultante</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300">
                      {creditTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-2.5 font-mono text-[11px] text-zinc-400">
                            {new Date(tx.createdAt).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-2.5 font-medium text-white">{tx.description}</td>
                          <td className="py-2.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                tx.type === 'purchase'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                  : tx.type === 'project_creation'
                                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td
                            className={`py-2.5 font-mono font-bold text-right ${
                              tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} cr
                          </td>
                          <td className="py-2.5 font-mono text-right text-zinc-400">
                            {tx.balanceAfter} cr
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SUBDOMÍNIOS */}
        {activeTab === 'subdominios' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-white">Gerenciador de Subdomínios</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Subdomínios ativos e configurados automaticamente no wildcard <strong className="text-purple-300">*.x09.com.br</strong>.
                </p>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-400">
                Você ainda não tem nenhum subdomínio alocado. Crie seu primeiro projeto para reservar seu subdomínio!
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{proj.title}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Ativo
                          </span>
                        </div>
                        <span className="font-mono text-xs text-purple-300">
                          https://{proj.subdomain}.{integrations.domainBase}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(proj.subdomain)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-200 transition-colors flex items-center gap-1.5"
                      >
                        {copiedSubdomain === proj.subdomain ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedSubdomain === proj.subdomain ? 'Copiado' : 'Copiar URL'}</span>
                      </button>
                      <button
                        onClick={() => onOpenStudio(proj)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INFRA & VPS */}
        {activeTab === 'infra' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-white">Infraestrutura VPS Hostinger & Cloudflare</h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Topologia de rede do Studio X09 operando em produção com roteamento wildcard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-2.5 mb-4">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Hostinger VPS Nginx</h3>
                </div>
                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex justify-between py-2 border-b border-zinc-900">
                    <span className="text-zinc-500">IP Dedicado VPS:</span>
                    <span className="font-mono text-white font-bold">{integrations.hostingerVpsIp}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-900">
                    <span className="text-zinc-500">Regra Nginx Wildcard:</span>
                    <span className="font-mono text-purple-300">~^(?&lt;subdomain&gt;.+)\.x09\.com\.br$</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-900">
                    <span className="text-zinc-500">Porta Interna Node:</span>
                    <span className="font-mono text-emerald-400">3000</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-2.5 mb-4">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white text-base">Cloudflare DNS & SSL</h3>
                </div>
                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex justify-between py-2 border-b border-zinc-900">
                    <span className="text-zinc-500">Zona Cloudflare:</span>
                    <span className="font-mono text-white">x09.com.br</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-900">
                    <span className="text-zinc-500">Registro Wildcard:</span>
                    <span className="font-mono text-blue-400">A * → {integrations.hostingerVpsIp}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-900">
                    <span className="text-zinc-500">SSL / TLS Mode:</span>
                    <span className="text-emerald-400 font-bold">Full (Strict) Automatizado</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenPublishModal()}
              className="px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Abrir Guia de Configuração Nginx & Deploy</span>
            </button>
          </div>
        )}
      </main>

      {/* MODAL 1: CRIAR PROJETO DO ZERO (TELA 100% EM BRANCO) */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Novo Projeto do Zero (Em Branco)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Comece com uma tela totalmente limpa e construa qualquer ideia usando o X09 Studio.
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Credits notification */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 mb-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-purple-300">
                <Flame className="w-4 h-4 text-purple-400" />
                <span>Custo de criação: <strong>5 Créditos</strong></span>
              </div>
              <span className="font-mono text-zinc-400 font-semibold">
                Seu saldo: <strong className="text-white">{user.credits}</strong>
              </span>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Título do Projeto:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSubdomain) {
                      const auto = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
                      setNewSubdomain(auto);
                    }
                  }}
                  placeholder="Ex: Minha Nova Startup"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Categoria:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as UserProject['category'])}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Sites">Sites & Landing Pages</option>
                  <option value="SaaS">SaaS & Software</option>
                  <option value="Apps">Aplicativos Web</option>
                  <option value="E-commerces">E-commerces & Lojas</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Subdomínio Desejado (.x09.com.br):
                </label>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    required
                    value={newSubdomain}
                    onChange={(e) => handleSubdomainInput(e.target.value)}
                    placeholder="meusite"
                    className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs">.{integrations.domainBase}</span>
                </div>
                {subdomainError && (
                  <p className="text-rose-400 text-[11px] mt-1">{subdomainError}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!!subdomainError || user.credits < 5}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  Criar Projeto em Branco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CLONAR MODELO PRONTO */}
      {cloningTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Clonar Modelo: {cloningTemplate.title}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Uma cópia independente deste modelo será adicionada aos seus projetos.
                </p>
              </div>
              <button
                onClick={() => setCloningTemplate(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="h-32 rounded-xl overflow-hidden mb-4 relative bg-zinc-900">
              <img
                src={cloningTemplate.thumbnail}
                alt={cloningTemplate.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-3 text-xs font-bold text-white">
                {cloningTemplate.title}
              </div>
            </div>

            <form onSubmit={handleConfirmClone} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome para o seu Projeto:</label>
                <input
                  type="text"
                  required
                  value={cloneTitle}
                  onChange={(e) => setCloneTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Seu Subdomínio (.x09.com.br):
                </label>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    required
                    value={cloneSubdomain}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setCloneSubdomain(clean);
                      if (!checkSubdomainAvailable(clean)) {
                        setCloneSubdomainError('Subdomínio indisponível');
                      } else {
                        setCloneSubdomainError(null);
                      }
                    }}
                    className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs">.{integrations.domainBase}</span>
                </div>
                {cloneSubdomainError && (
                  <p className="text-rose-400 text-[11px] mt-1">{cloneSubdomainError}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between text-xs">
                <span>Custo de clonagem: <strong>5 Créditos</strong></span>
                <span className="font-mono">Saldo: <strong>{user.credits}</strong></span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCloningTemplate(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!!cloneSubdomainError || user.credits < 5}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  Clonar e Abrir no Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDITAR SUBDOMÍNIO EXISTENTE */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Configurar Subdomínio: {editingProject.title}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Altere o subdomínio ou aponte seu próprio domínio personalizado.
            </p>

            <form onSubmit={handleSaveSubdomainEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Subdomínio (.x09.com.br):</label>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    required
                    value={editSubdomainVal}
                    onChange={(e) => setEditSubdomainVal(e.target.value)}
                    className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs">.{integrations.domainBase}</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Domínio Personalizado (Opcional):</label>
                <input
                  type="text"
                  value={editCustomDomainVal}
                  onChange={(e) => setEditCustomDomainVal(e.target.value)}
                  placeholder="ex: meudominio.com.br"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Requer apontamento CNAME para <strong>{integrations.studioSubdomain}</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MERCADO PAGO MODAL */}
      <MercadoPagoModal
        isOpen={showMercadoPago}
        onClose={() => setShowMercadoPago(false)}
        defaultTab={mercadoPagoTab}
      />
    </div>
  );
};
