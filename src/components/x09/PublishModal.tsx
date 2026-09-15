import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Terminal,
  Globe,
  Github,
  Server,
  Shield,
  Sparkles,
  Database,
  Cloud,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  projectName = 'Studio x09',
}) => {
  const { activeProject, updateProject, checkSubdomainAvailable, integrations } = useAuth();

  const [activeTab, setActiveTab] = useState<'subdomain' | 'vps' | 'cloudflare' | 'supabase' | 'github'>('subdomain');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Subdomain chooser state
  const initialSub = activeProject?.subdomain || 'meu-site';
  const [chosenSubdomain, setChosenSubdomain] = useState<string>(initialSub);
  const [subdomainSaved, setSubdomainSaved] = useState<boolean>(false);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubdomainChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setChosenSubdomain(clean);
    if (!clean || clean.length < 3) {
      setSubdomainError('Mínimo 3 caracteres alfanuméricos');
      return;
    }
    const isAvail = checkSubdomainAvailable(clean, activeProject?.id);
    if (!isAvail) {
      setSubdomainError('Este subdomínio já está reservado');
    } else {
      setSubdomainError(null);
    }
  };

  const handleConfirmSubdomain = () => {
    if (subdomainError || !chosenSubdomain) return;
    if (activeProject) {
      updateProject(activeProject.id, {
        subdomain: chosenSubdomain,
        status: 'published',
      });
    }
    setSubdomainSaved(true);
    setTimeout(() => setSubdomainSaved(false), 2500);
  };

  const gitCommands = `# 1. Inicialize ou conecte ao seu repositório no GitHub
git init
git add .
git commit -m "feat: X09 Studio 2.0 publish ${chosenSubdomain}.x09.com.br"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/studio-x09.git
git push -u origin main --force`;

  const vpsWildcardNginx = `# Arquivo: /etc/nginx/sites-available/x09-subdomains
# Permite que QUALQUER subdomínio criado no X09 funcione instantaneamente!

server {
    listen 80;
    server_name ~^(?<subdomain>.+)\\.x09\\.com\\.br$;

    root /var/www/projects/$subdomain/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de alta performance para CSS, JS e Imagens
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}`;

  const vpsDeployScript = `# Conectar via SSH na sua VPS Hostinger:
ssh root@${integrations.hostingerVpsIp}

# 1. Criar diretório para o subdomínio ${chosenSubdomain}
mkdir -p /var/www/projects/${chosenSubdomain}
cd /var/www/projects/${chosenSubdomain}

# 2. Clonar ou copiar os arquivos compilados da dist/
git clone https://github.com/SEU-USUARIO/studio-x09.git .
npm install
npm run build

# 3. Testar Nginx e aplicar
sudo nginx -t && sudo systemctl reload nginx

# O site já está disponível em:
# https://${chosenSubdomain}.x09.com.br`;

  const supabaseSqlSchema = `-- Schema Supabase para o Studio x09 (studio.x09.com.br)

CREATE TABLE IF NOT EXISTS public.users_x09 (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  plan TEXT DEFAULT 'Pro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.projects_x09 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users_x09(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  custom_domain TEXT,
  category TEXT DEFAULT 'Sites',
  status TEXT DEFAULT 'published',
  site_data JSONB NOT NULL,
  views_count INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar Row Level Security
ALTER TABLE public.projects_x09 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários acessam apenas seus próprios projetos"
ON public.projects_x09 FOR ALL
USING (auth.uid() = user_id);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 font-bold text-sm">
              X09
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Publicar Projeto: {activeProject?.title || projectName}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  studio.x09.com.br
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Configure o subdomínio .x09.com.br, Cloudflare, VPS Hostinger e Supabase.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/20 px-6 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('subdomain')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'subdomain'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-4 h-4 text-purple-400" />
            1. Subdomínio .x09.com.br
          </button>

          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'cloudflare'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cloud className="w-4 h-4 text-amber-400" />
            2. Cloudflare (Wildcard)
          </button>

          <button
            onClick={() => setActiveTab('vps')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'vps'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Server className="w-4 h-4 text-emerald-400" />
            3. VPS Hostinger (Nginx)
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'supabase'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4 text-blue-400" />
            4. Banco Supabase
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'github'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Github className="w-4 h-4" />
            5. Repositório GitHub
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-xs">
          {/* TAB 1: SUBDOMÍNIO .X09.COM.BR */}
          {activeTab === 'subdomain' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-purple-200 leading-relaxed">
                <span className="font-bold text-white block mb-1">Escolha o subdomínio deste projeto:</span>
                O usuário e seus clientes poderão acessar este site imediatamente no endereço escolhido abaixo.
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <label className="block font-semibold text-zinc-300">
                  Defina o Subdomínio Oficial:
                </label>

                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-purple-500">
                  <span className="pl-4 text-zinc-500 font-mono text-sm">https://</span>
                  <input
                    type="text"
                    value={chosenSubdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    placeholder="nome-do-cliente"
                    className="flex-1 bg-transparent p-3.5 text-purple-300 font-mono text-sm font-bold focus:outline-none"
                  />
                  <span className="pr-4 text-zinc-400 font-mono text-sm font-bold">
                    .{integrations.domainBase}
                  </span>
                </div>

                {subdomainError ? (
                  <p className="text-rose-400 font-semibold">{subdomainError}</p>
                ) : (
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      https://{chosenSubdomain}.{integrations.domainBase} está disponível para publicação!
                    </span>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleConfirmSubdomain}
                    disabled={!!subdomainError}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {subdomainSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
                    <span>{subdomainSaved ? 'Subdomínio Vinculado!' : 'Salvar e Ativar Subdomínio'}</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(`https://${chosenSubdomain}.${integrations.domainBase}`, 'copy-url')}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium flex items-center gap-1.5"
                  >
                    {copiedKey === 'copy-url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copiar Link</span>
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-zinc-400">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="font-bold text-white block mb-1">Roteamento Cloudflare</span>
                  <span>O wildcard *.x09.com.br encaminha os acessos diretamente para a VPS Hostinger.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="font-bold text-white block mb-1">Certificado SSL Automático</span>
                  <span>Proteção HTTPS ativa por padrão via Cloudflare Edge sem custo adicional.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="font-bold text-white block mb-1">Build Isolado</span>
                  <span>Cada projeto é compilado em sua própria pasta estática otimizada para o Nginx.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLOUDFLARE WILDCARD DNS */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                <span className="font-bold text-white block mb-1">Configuração no painel Cloudflare (x09.com.br):</span>
                Adicione estes registros DNS na sua conta do Cloudflare com o Proxy Laranja (Orange Cloud) ativado para proteger e acelerar todos os subdomínios.
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Nome</th>
                      <th className="p-3">Destino (Hostinger VPS)</th>
                      <th className="p-3">Proxy</th>
                      <th className="p-3">Finalidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300">
                    <tr>
                      <td className="p-3 font-mono text-purple-400">A</td>
                      <td className="p-3 font-mono font-bold text-white">studio</td>
                      <td className="p-3 font-mono">{integrations.hostingerVpsIp}</td>
                      <td className="p-3 text-amber-400 font-bold">Proxied (Laranja)</td>
                      <td className="p-3">Plataforma X09 Studio</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-purple-400">A</td>
                      <td className="p-3 font-mono font-bold text-purple-300">* (Wildcard)</td>
                      <td className="p-3 font-mono">{integrations.hostingerVpsIp}</td>
                      <td className="p-3 text-amber-400 font-bold">Proxied (Laranja)</td>
                      <td className="p-3">Todos os sites dos usuários (*.x09.com.br)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 space-y-1">
                <span className="font-bold text-white block">Configuração SSL/TLS no Cloudflare:</span>
                <p>
                  No menu <strong>SSL/TLS</strong> do Cloudflare, defina a criptografia como <strong>Full (Strict)</strong> para garantir segurança de ponta a ponta entre o navegador e sua VPS Hostinger.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: HOSTINGER VPS */}
          {activeTab === 'vps' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white mb-1 flex items-center justify-between">
                  <span>1. Bloco Nginx Wildcard (/etc/nginx/sites-available/x09-subdomains)</span>
                  <button
                    onClick={() => copyToClipboard(vpsWildcardNginx, 'copy-nginx')}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'copy-nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Nginx Wildcard</span>
                  </button>
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                  {vpsWildcardNginx}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1 flex items-center justify-between">
                  <span>2. Script SSH para o Projeto Atual ({chosenSubdomain})</span>
                  <button
                    onClick={() => copyToClipboard(vpsDeployScript, 'copy-vps')}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'copy-vps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Script de Deploy</span>
                  </button>
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono overflow-x-auto leading-relaxed">
                  {vpsDeployScript}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: BANCO SUPABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-blue-200">
                <span className="font-bold text-white block mb-1">Schema SQL para sua instância Supabase:</span>
                Execute este script no <strong>SQL Editor</strong> do seu dashboard do Supabase para criar as tabelas de usuários, projetos e subdomínios vinculados ao Studio x09.
              </div>

              <div>
                <h4 className="font-bold text-white mb-1 flex items-center justify-between">
                  <span>Script SQL (Tabelas de Usuários e Projetos)</span>
                  <button
                    onClick={() => copyToClipboard(supabaseSqlSchema, 'copy-sql')}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'copy-sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar SQL Supabase</span>
                  </button>
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-purple-300 font-mono overflow-x-auto leading-relaxed">
                  {supabaseSqlSchema}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: REPOSITÓRIO GITHUB COM FILTRO DE SEGREDOS ATIVO */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 text-xs">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 flex items-center gap-2">
                    <span>Proteção de Segredos Ativa (secrets-filter)</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-[10px] text-emerald-300 border border-emerald-700/50">
                      Auditado
                    </span>
                  </div>
                  <p className="text-zinc-300 mt-0.5 leading-relaxed">
                    Arquivos como <code className="text-rose-300 font-mono">.env</code>, <code className="text-rose-300 font-mono">credentials.json</code>, chaves privadas e pastas de build (<code className="text-zinc-400 font-mono">dist/</code>, <code className="text-zinc-400 font-mono">node_modules/</code>) são automaticamente excluídos de commits e pushes para proteger suas chaves do Supabase, Mercado Pago e Gemini.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1 flex items-center justify-between text-xs">
                  <span>Comandos para enviar ao seu GitHub</span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'copy-git')}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'copy-git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Comandos Git</span>
                  </button>
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed">
                  {gitCommands}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-white" />
                  <span className="text-zinc-300">Repositório sugerido:</span>
                  <strong className="text-white font-mono">{chosenSubdomain}-x09</strong>
                </div>
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Higiene de código validada
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-zinc-400">
            Endereço ativo: <strong className="text-white font-mono">https://{chosenSubdomain}.{integrations.domainBase}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                copyToClipboard(`https://${chosenSubdomain}.${integrations.domainBase}`, 'footer-copy');
              }}
              className="px-4 py-2 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-500 shadow flex items-center gap-1.5"
            >
              {copiedKey === 'footer-copy' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>Copiar URL do Site</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
