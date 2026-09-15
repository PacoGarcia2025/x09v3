import React, { useState } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Check,
  Globe,
  Server,
  Database,
  Cloud,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MoreVertical,
  LogOut,
  FolderKanban,
  CheckCircle2,
  Clock,
  Cpu,
  RefreshCw,
  Sliders,
  Share2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserProject } from '../../types/x09';
import { X09Logo } from './X09Logo';

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
    logout,
    createProject,
    deleteProject,
    updateProject,
    checkSubdomainAvailable,
    integrations,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'projetos' | 'subdominios' | 'infra' | 'config'>('projetos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [copiedSubdomain, setCopiedSubdomain] = useState<string | null>(null);

  // New project creation state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<UserProject['category']>('Sites');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [subdomainError, setSubdomainError] = useState<string | null>(null);

  // Edit subdomain modal
  const [editingProject, setEditingProject] = useState<UserProject | null>(null);
  const [editSubdomainVal, setEditSubdomainVal] = useState('');
  const [editCustomDomainVal, setEditCustomDomainVal] = useState('');

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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const finalSub = newSubdomain.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    if (!checkSubdomainAvailable(finalSub)) {
      setSubdomainError('Subdomínio indisponível. Escolha outro nome.');
      return;
    }

    const created = createProject(newTitle, newCategory, finalSub);
    setShowNewModal(false);
    setNewTitle('');
    setNewSubdomain('');
    onOpenStudio(created);
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
        <nav className="hidden md:flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('projetos')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'projetos'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
            <span>Meus Projetos</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-700 text-[10px] text-zinc-300">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subdominios')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'subdominios'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Subdomínios (.x09.com.br)</span>
          </button>

          <button
            onClick={() => setActiveTab('infra')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'infra'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>VPS & Cloudflare</span>
          </button>
        </nav>

        {/* Right User & CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md shadow-purple-600/20 active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-purple-600 overflow-hidden border border-purple-400/40">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                  <span>{user.name}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-950 text-purple-300 font-mono">
                    {user.plan}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">{user.email}</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
                title="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
            >
              Fazer Login
            </button>
          )}
        </div>
      </header>

      {/* 2. SUB-HEADER METRICS BANNER */}
      <div className="bg-[#080b0a] border-b border-zinc-800/80 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{projects.length} / 50</div>
                <div className="text-[11px] text-zinc-400">Projetos Ativos</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-blue-400">
                  {projects.filter((p) => p.status === 'published').length}
                </div>
                <div className="text-[11px] text-zinc-400">Subdomínios *.x09.com.br</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>VPS Hostinger</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">IP: {integrations.hostingerVpsIp}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Cloudflare DNS</span>
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-[11px] text-zinc-400">Wildcard *.x09.com.br Ativo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* TAB 1: MEUS PROJETOS */}
        {activeTab === 'projetos' && (
          <div className="space-y-6">
            {/* Search and Category filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome ou subdomínio..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['Todos', 'Sites', 'SaaS', 'Apps', 'E-commerces'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-sm font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-2xl bg-zinc-900/70 border border-zinc-800/90 hover:border-zinc-700 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-purple-900/10"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 overflow-hidden bg-zinc-950">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-[10px] font-bold">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          project.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      ></span>
                      <span className={project.status === 'published' ? 'text-emerald-400' : 'text-amber-400'}>
                        {project.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>

                    {/* Category pill */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-950/80 backdrop-blur-md border border-purple-700/40 text-[10px] text-purple-300 font-semibold">
                      {project.category}
                    </div>

                    {/* Subdomain pill directly over image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md border border-zinc-800/80 rounded-xl px-2.5 py-1.5 text-[11px]">
                      <a
                        href={`https://${project.subdomain}.${integrations.domainBase}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-zinc-300 hover:text-white flex items-center gap-1 truncate"
                      >
                        <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-purple-300 font-bold">{project.subdomain}</span>
                        <span className="text-zinc-500">.{integrations.domainBase}</span>
                      </a>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopyLink(project.subdomain)}
                          className="p-1 text-zinc-400 hover:text-white rounded"
                          title="Copiar URL"
                        >
                          {copiedSubdomain === project.subdomain ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setEditSubdomainVal(project.subdomain);
                            setEditCustomDomainVal(project.customDomain || '');
                          }}
                          className="p-1 text-zinc-400 hover:text-white rounded"
                          title="Alterar subdomínio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Project Info & Controls */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-sm tracking-wide mb-1 flex items-center justify-between">
                        <span>{project.title}</span>
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                        <span>Editado: {project.lastEdited}</span>
                        <span>•</span>
                        <span>{project.views.toLocaleString()} visitas</span>
                      </div>
                      {project.customDomain && (
                        <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Domínio próprio: {project.customDomain}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                      <button
                        onClick={() => onOpenStudio(project)}
                        className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <span>Abrir no Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenPublishModal(project.title)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Deploy VPS Hostinger / Git"
                      >
                        <Server className="w-4 h-4 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir o projeto "${project.title}"?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-zinc-800/60 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Excluir projeto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Project Card */}
              <button
                onClick={() => setShowNewModal(true)}
                className="rounded-2xl border-2 border-dashed border-zinc-800 hover:border-purple-500/60 bg-zinc-900/20 hover:bg-purple-950/10 transition-all p-8 flex flex-col items-center justify-center text-center group min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white text-purple-400 flex items-center justify-center mb-3 transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Criar Novo Projeto</h4>
                <p className="text-xs text-zinc-500 max-w-[200px]">
                  Crie um site, SaaS ou App e publique com subdomínio .x09.com.br instantâneo.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: GERENCIADOR DE SUBDOMÍNIOS */}
        {activeTab === 'subdominios' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  SISTEMA DE SUBDOMÍNIOS AUTOMÁTICOS
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Roteamento de Subdomínios *.x09.com.br
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Cada projeto publicado recebe um subdomínio dinâmico. O Cloudflare encaminha todas as requisições wildcard <code className="text-purple-300">*.x09.com.br</code> para sua VPS Hostinger, onde o Nginx entrega a versão de produção instantaneamente.
                </p>
              </div>

              <button
                onClick={() => setShowNewModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Reservar Novo Subdomínio</span>
              </button>
            </div>

            {/* Subdomains Table */}
            <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Subdomínio Completo</th>
                    <th className="p-4">Projeto Vinculado</th>
                    <th className="p-4">Status DNS Cloudflare</th>
                    <th className="p-4">Destino VPS Hostinger</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">
                        <span className="text-purple-400">{p.subdomain}</span>.{integrations.domainBase}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white">{p.title}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          SSL Ativo (Cloudflare Edge)
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-zinc-400">
                        {integrations.hostingerVpsIp}:3000
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(p.subdomain)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            title="Copiar Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setEditSubdomainVal(p.subdomain);
                              setEditCustomDomainVal(p.customDomain || '');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px]"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INFRAESTRUTURA (SUPABASE + CLOUDFLARE + HOSTINGER) */}
        {activeTab === 'infra' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Supabase Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-white text-sm">Supabase</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    Conectado
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Banco de dados PostgreSQL e autenticação de usuários para o Studio x09.
                </p>
                <div className="p-3 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-400 truncate">
                  {integrations.supabaseUrl}
                </div>
              </div>

              {/* Cloudflare Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-white text-sm">Cloudflare</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                    DNS Wildcard
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Roteamento de <code className="text-purple-300">*.x09.com.br</code> com SSL Full (Strict) e proteção contra DDoS.
                </p>
                <div className="p-3 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-400 truncate">
                  Zona: {integrations.domainBase}
                </div>
              </div>

              {/* Hostinger VPS Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-white text-sm">VPS Hostinger</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">
                    Nginx + Ubuntu
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Servidor que roda o Studio x09 e hospeda os builds estáticos dos clientes.
                </p>
                <div className="p-3 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-400 truncate">
                  IP: {integrations.hostingerVpsIp}
                </div>
              </div>
            </div>

            {/* Configuração Recomendada Nginx Wildcard */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Configuração Nginx na VPS para Roteamento Automático de Subdomínios</span>
                <span className="text-xs text-emerald-400 font-mono">/etc/nginx/sites-available/x09-wildcard</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Adicione este bloco no seu Nginx para que qualquer novo subdomínio criado por você ou por usuários funcione sem precisar reiniciar o servidor!
              </p>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`# 1. Roteamento do Studio Oficial
server {
    listen 80;
    server_name studio.x09.com.br;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 2. Roteamento Dinâmico de Projetos (*.x09.com.br)
server {
    listen 80;
    server_name ~^(?<subdomain>.+)\\.x09\\.com\\.br$;

    root /var/www/projects/$subdomain/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* NEW PROJECT MODAL WITH INSTANT SUBDOMAIN CHOOSER */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full relative shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Criar Novo Projeto com Subdomínio</h3>
                <p className="text-xs text-zinc-400">Escolha o nome e o subdomínio que ficará no ar em *.x09.com.br</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome do Projeto:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSubdomain) {
                      const autoSlug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                      setNewSubdomain(autoSlug);
                    }
                  }}
                  placeholder="Ex: Iron Peak Fitness, Pizzaria Don Vito, Gestão SaaS..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Categoria:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Sites">Site Institucional / Empresa</option>
                  <option value="SaaS">SaaS / Plataforma Web</option>
                  <option value="Apps">Aplicativo Web Interativo</option>
                  <option value="E-commerces">E-commerce / Catálogo Virtual</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Subdomínio Desejado (.x09.com.br):
                </label>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-purple-500">
                  <span className="pl-3 text-zinc-500 font-mono">https://</span>
                  <input
                    type="text"
                    required
                    value={newSubdomain}
                    onChange={(e) => handleSubdomainInput(e.target.value)}
                    placeholder="meu-site"
                    className="flex-1 bg-transparent p-3 text-purple-300 font-mono font-bold focus:outline-none"
                  />
                  <span className="pr-3 text-zinc-400 font-mono font-semibold">
                    .{integrations.domainBase}
                  </span>
                </div>

                {subdomainError ? (
                  <p className="text-[11px] text-rose-400 mt-1 font-semibold">{subdomainError}</p>
                ) : newSubdomain.length >= 3 ? (
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Subdomínio disponível!</span>
                  </p>
                ) : null}
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
                🚀 Após criar, o site será aberto no Studio para você editar com IA e publicar na VPS Hostinger.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!!subdomainError}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md active:scale-95 disabled:opacity-50"
                >
                  Criar e Abrir no Studio ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SUBDOMAIN MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Configurar Domínio: {editingProject.title}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Altere o subdomínio ou conecte um domínio próprio registrado.
            </p>

            <form onSubmit={handleSaveSubdomainEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Subdomínio .x09.com.br:</label>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <input
                    type="text"
                    required
                    value={editSubdomainVal}
                    onChange={(e) => setEditSubdomainVal(e.target.value)}
                    className="flex-1 bg-transparent p-2.5 text-purple-300 font-mono font-bold focus:outline-none"
                  />
                  <span className="pr-3 text-zinc-500 font-mono">.{integrations.domainBase}</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Domínio Próprio (Opcional):
                </label>
                <input
                  type="text"
                  value={editCustomDomainVal}
                  onChange={(e) => setEditCustomDomainVal(e.target.value)}
                  placeholder="Ex: meusite.com.br"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Basta apontar o CNAME do seu domínio para <code className="text-zinc-300">{editSubdomainVal}.x09.com.br</code>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
