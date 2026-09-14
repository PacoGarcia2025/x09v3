import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Mail, Github, CheckCircle2, Phone, MapPin, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  initialMessage?: string;
}

export function ContactSection({ initialMessage }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Web Application / SaaS');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const handleSendWhatsApp = () => {
    const text = `Olá Studio x09!\n\nNome: ${name || 'Não informado'}\nEmail: ${email || 'Não informado'}\nTipo de Projeto: ${projectType}\nMensagem: ${message || 'Gostaria de saber mais sobre os serviços!'}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contato" className="scroll-mt-24 border-t border-zinc-800/80 py-20 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              <span>05 // Fale Conosco</span>
            </div>
            <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Vamos construir o próximo projeto do Studio x09?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Estamos prontos para transformar sua visão em uma solução digital de referência técnica. Envie sua mensagem ou entre em contato direto pelos canais rápidos.
            </p>

            {/* Direct contact badges */}
            <div className="mt-8 space-y-4">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-emerald-500/50 hover:bg-zinc-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">WhatsApp Comercial</div>
                  <div className="text-sm font-semibold text-white">+55 (11) 99999-9999</div>
                </div>
              </a>

              <a
                href="mailto:sgoliveira16@gmail.com"
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-cyan-500/50 hover:bg-zinc-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">E-mail Direto</div>
                  <div className="text-sm font-semibold text-white">sgoliveira16@gmail.com</div>
                </div>
              </a>

              <a
                href="https://github.com/sgoliveira16"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">GitHub Oficial</div>
                  <div className="text-sm font-semibold text-white">github.com/sgoliveira16</div>
                </div>
              </a>
            </div>

            {/* Availability reminder */}
            <div className="mt-8 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Horário de Atendimento: Seg a Sex, 09:00 às 18:00 (BRT)</span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                Respostas em menos de 2 horas úteis para propostas de projetos.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl">
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-['Space_Grotesk'] text-2xl font-bold text-white">
                    Mensagem Enviada com Sucesso!
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                    Recebemos os detalhes do seu projeto para o Studio x09. Analisaremos o escopo técnico e retornaremos no e-mail informado ({email || 'seu e-mail'}).
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-6 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-700"
                  >
                    Enviar Outra Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        Seu Nome ou Empresa *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Lucas Silva"
                        className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        E-mail de Contato *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nome@empresa.com"
                        className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        Tipo de Demanda
                      </label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="Web Application / SaaS">Web Application / SaaS</option>
                        <option value="Landing Page & Institucional">Landing Page & Institucional</option>
                        <option value="E-commerce Headless">E-commerce Headless</option>
                        <option value="Deploy Hostinger VPS / Nginx">Deploy Hostinger VPS / Nginx</option>
                        <option value="Outro / Consultoria">Outro / Consultoria</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Detalhes do Projeto / Escopo
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Descreva as funcionalidades essenciais, objetivos e expectativas de prazo..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-950/40 px-4 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-900/40 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Enviar no WhatsApp Direto</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Enviando...</span>
                      ) : (
                        <>
                          <span>Enviar Solicitação</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
