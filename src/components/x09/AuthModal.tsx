import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles, Database, Check, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'forgot' | 'supabase';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, register, resetPassword, integrations, updateIntegrations, supabaseActive } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot' | 'supabase'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Supabase connection config
  const [supabaseUrl, setSupabaseUrl] = useState(integrations.supabaseUrl);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(integrations.supabaseAnonKey);
  const [savedSupabase, setSavedSupabase] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMessage(null);
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Falha ao autenticar. Verifique suas credenciais.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setErrorMessage(null);
    setSubmitting(true);

    const result = await register(name, email, password);
    setSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Falha ao criar conta. Tente novamente.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    const result = await resetPassword(email);
    setSubmitting(false);

    if (result.success) {
      setSuccessMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
    } else {
      setErrorMessage(result.error || 'Não foi possível enviar o e-mail de recuperação.');
    }
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
                {tab === 'login'
                  ? 'Acessar Studio X09'
                  : tab === 'register'
                  ? 'Criar sua Conta'
                  : tab === 'forgot'
                  ? 'Recuperar Senha'
                  : 'Conexão Supabase'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                studio.x09.com.br • SaaS Multi-inquilino Isolado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/20 px-6 pt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`pb-2 border-b-2 transition-colors ${
              tab === 'login' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
            }}
            className={`pb-2 border-b-2 transition-colors ${
              tab === 'register' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cadastrar
          </button>
          <button
            onClick={() => {
              setTab('supabase');
              setErrorMessage(null);
            }}
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
          {/* Error & Success alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <button
                type="button"
                onClick={async () => {
                  setSubmitting(true);
                  await login('sgoliveira16@gmail.com', 'demo123456');
                  setSubmitting(false);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-medium flex items-center justify-center gap-2 hover:bg-zinc-800/80 transition-all shadow-sm"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>Entrar como Sérgio Garcia (sgoliveira16@gmail.com)</span>
              </button>

              <div className="flex items-center gap-2 my-2 text-[11px] text-zinc-500">
                <div className="flex-1 h-px bg-zinc-800"></div>
                <span>ou com seu e-mail e senha</span>
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-400 font-semibold">Senha:</label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
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
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{submitting ? 'Verificando...' : 'Acessar Meu Painel'}</span>
                {!submitting && <ArrowRight className="w-4 h-4" />}
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
                ✨ <strong>15 Créditos de Cortesia</strong> incluídos imediatamente na criação da conta!
                Seus dados são 100% isolados por Row Level Security (RLS).
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{submitting ? 'Criando Conta...' : 'Criar Conta & Receber 15 Créditos'}</span>
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <p className="text-zinc-400 text-xs leading-relaxed">
                Digite o e-mail cadastrado na sua conta X09 Studio. Enviaremos um link de redefinição de senha seguro através do Supabase Auth.
              </p>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Seu E-mail:</label>
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{submitting ? 'Enviando...' : 'Enviar Link de Recuperação'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  ← Voltar para o Login
                </button>
              </div>
            </form>
          )}

          {tab === 'supabase' && (
            <form onSubmit={handleSaveSupabase} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300">
                O Studio x09 conecta ao seu PostgreSQL com <strong>Row Level Security (RLS)</strong> e <strong>Supabase Auth</strong>.
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
