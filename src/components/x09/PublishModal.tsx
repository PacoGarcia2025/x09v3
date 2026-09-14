import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Github, Server, Shield, Sparkles, Download, ExternalLink } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'vps' | 'github' | 'domain' | 'quick'>('quick');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCommands = `# 1. Inicialize ou conecte ao seu repositório no GitHub
git init
git add .
git commit -m "feat: X09 Studio 2.0 rebuild from scratch"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/studio-x09.git
git push -u origin main --force`;

  const vpsCommands = `# Conecte via SSH na sua VPS Hostinger (Ubuntu 22.04/24.04):
ssh root@SEU_IP_HOSTINGER

# 1. Atualizar pacotes do sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 20+, Nginx e Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx

# 3. Clonar seu repositório oficial do Studio x09
cd /var/www
git clone https://github.com/SEU-USUARIO/studio-x09.git
cd studio-x09

# 4. Instalar dependências e compilar produção
npm install
npm run build

# 5. Configurar Nginx apontando para /var/www/studio-x09/dist
sudo nano /etc/nginx/sites-available/studio-x09
sudo ln -s /etc/nginx/sites-available/studio-x09 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 6. Ativar SSL Grátis Let's Encrypt
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br`;

  const nginxConfig = `server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;

    root /var/www/studio-x09/dist;
    index index.html;

    # Suporte a SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de alta performance para assets estáticos
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|woff)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Publicação & Deploy: {projectName}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Pronto para Produção
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Exporte para seu GitHub e publique na sua VPS Hostinger com SSL e Nginx.
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

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/20 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'quick'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('vps')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'vps'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Server className="w-4 h-4" />
            Hostinger VPS (SSH & Nginx)
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'github'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Github className="w-4 h-4" />
            GitHub Repository
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'domain'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Domínio & DNS
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {activeTab === 'quick' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
                <span className="font-bold text-white block mb-1">Como funciona o fluxo do Studio x09:</span>
                Você cria e edita o site aqui no X09 Studio. Em seguida, exporta para o seu repositório no GitHub. Na sua VPS Hostinger, basta dar um <code className="text-purple-300 font-mono">git pull && npm run build</code> via SSH para que as novidades vão para o ar instantaneamente!
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <Github className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">1. Exportar para GitHub</h4>
                  <p className="text-xs text-zinc-400">Envie o código completo reconstruído do zero direto para seu repo.</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                    <Server className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">2. VPS Hostinger</h4>
                  <p className="text-xs text-zinc-400">Clone via SSH no diretório /var/www e sirva com Nginx ultra-rápido.</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">3. SSL Grátis</h4>
                  <p className="text-xs text-zinc-400">Certbot configura HTTPS e renovação automática em 1 comando.</p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/60">
                <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  Comando rápido de compilação local
                </h4>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 flex items-center justify-between">
                  <code>npm run build</code>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'quick-build')}
                    className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                  >
                    {copiedKey === 'quick-build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Gera a pasta otimizada <span className="font-mono text-zinc-300">dist/</span> pronta para o Nginx.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'vps' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                  <span>Passo a Passo via SSH na Hostinger VPS</span>
                  <button
                    onClick={() => copyToClipboard(vpsCommands, 'vps')}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'vps' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar Script Completo
                  </button>
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  {vpsCommands}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                  <span>Configuração Nginx (/etc/nginx/sites-available/studio-x09)</span>
                  <button
                    onClick={() => copyToClipboard(nginxConfig, 'nginx')}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'nginx' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar Nginx Config
                  </button>
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  {nginxConfig}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                  <span>Comandos para enviar ao seu repositório Studio x09 no GitHub</span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'git' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar Comandos Git
                  </button>
                </h4>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  {gitCommands}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                <span className="font-bold text-white block">Dica para deploys automáticos:</span>
                <p>
                  Você pode criar uma GitHub Action (<code className="text-zinc-200">.github/workflows/deploy.yml</code>) com SSH Key que executa o comando <code className="text-zinc-200">git pull && npm run build</code> na sua Hostinger a cada <code className="text-zinc-200">git push</code>!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-2">
                Registros DNS recomendados para sua Hostinger VPS
              </h4>
              <div className="border border-zinc-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Nome / Host</th>
                      <th className="p-3">Destino / Valor</th>
                      <th className="p-3">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300">
                    <tr>
                      <td className="p-3 font-mono text-purple-400">A</td>
                      <td className="p-3 font-mono">@</td>
                      <td className="p-3 font-mono">SEU_IP_HOSTINGER</td>
                      <td className="p-3">3600 (1 hora)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-purple-400">CNAME</td>
                      <td className="p-3 font-mono">www</td>
                      <td className="p-3 font-mono">seudominio.com.br</td>
                      <td className="p-3">3600 (1 hora)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-zinc-400">
                Após apontar os DNS, aguarde até 30 minutos para propagação e execute o comando <code className="text-purple-300">certbot --nginx</code> para obter seu certificado SSL gratuito.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            Você pode exportar a qualquer momento pelo menu de configurações ou via Git.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                copyToClipboard(vpsCommands, 'footer-copy');
              }}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md flex items-center gap-1.5"
            >
              {copiedKey === 'footer-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>Copiar comandos de Deploy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
