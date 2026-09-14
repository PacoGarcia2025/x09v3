import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles, Database, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'supabase';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, register, integrations, updateIntegrations } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'supabase'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState(integrations.supabaseUrl);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(integrations.supabaseAnonKey);
  const [savedSupabase, setSavedSupabase] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    register(name, email);
    onClose();
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntegrations({
      supabaseUrl,
      supabaseAnonKey,
    });
    setSavedSupabase(true);
    setTimeout(() => {
      setSavedSupabase(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
              X09
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {tab === 'login' ? 'Acessar Studio x09' : tab === 'register' ? 'Criar sua Conta' : 'Conexão Supabase'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                studio.x09.com.br • Seu painel de criação
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/20 px-6 pt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => setTab('login')}
            className={`pb-2 border-b-2 transition-colors ${
              tab === 'login' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab('register')}
            className={`pb-2 border-b-2 transition-colors ${
              tab === 'register' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cadastrar
          </button>
          <button
            onClick={() => setTab('supabase')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
              tab === 'supabase' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  login('sgoliveira16@gmail.com', 'Sérgio Garcia');
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-medium flex items-center justify-center gap-2 hover:bg-zinc-800/80 transition-all shadow-sm"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>Entrar como Sérgio Garcia (Google)</span>
              </button>

              <div className="flex items-center gap-2 my-2 text-[11px] text-zinc-500">
                <div className="flex-1 h-px bg-zinc-800"></div>
                <span>ou com seu e-mail</span>
                <div className="flex-1 h-px bg-zinc-800"></div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">E-mail de acesso:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@x09.com.br"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Senha:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Acessar Meu Painel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Seu Nome Completo:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Mendes"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Seu E-mail:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@empresa.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Criar Senha:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
                ✨ Seu painel próprio será ativado imediatamente com subdomínio <strong className="text-white">seunome.x09.com.br</strong> gratuito!
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md active:scale-95"
              >
                Criar Conta & Acessar Studio
              </button>
            </form>
          )}

          {tab === 'supabase' && (
            <form onSubmit={handleSaveSupabase} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300">
                O Studio x09 salva os projetos na sua instância do <strong>Supabase</strong> (PostgreSQL + Auth).
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Supabase Project URL:</label>
                <input
                  type="text"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://seu-projeto.supabase.co"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Supabase Anon Key:</label>
                <input
                  type="password"
                  required
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {savedSupabase ? <Check className="w-4 h-4 text-zinc-950" /> : <Database className="w-4 h-4" />}
                <span>{savedSupabase ? 'Conexão Salva!' : 'Salvar Conexão Supabase'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
