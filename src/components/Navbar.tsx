import { useState } from 'react';
import { Terminal, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenDeployGuide: () => void;
  onOpenQuote: () => void;
}

export function Navbar({ onOpenDeployGuide, onOpenQuote }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800 to-zinc-900 font-mono text-sm font-bold text-cyan-400 shadow-inner group-hover:border-cyan-500/50">
              x09
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-white">
                STUDIO <span className="text-cyan-400">X09</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
                Digital & Tech Lab
              </span>
            </div>
          </a>

          {/* Availability pill */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Disponível para projetos</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 lg:flex">
          <button
            onClick={() => scrollToSection('projetos')}
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Projetos
          </button>
          <button
            onClick={() => scrollToSection('servicos')}
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Serviços
          </button>
          <button
            onClick={() => scrollToSection('sobre')}
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Manifesto
          </button>
          <button
            onClick={() => scrollToSection('simulador')}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Simulador
          </button>
          <button
            onClick={() => scrollToSection('contato')}
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Contato
          </button>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 sm:flex">
          <button
            id="nav-btn-vps-guide"
            onClick={onOpenDeployGuide}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition-all hover:border-cyan-500/50 hover:bg-zinc-800 hover:text-white"
            title="Ver guia completo de GitHub + Hostinger VPS"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span>Guia VPS & Git</span>
          </button>

          <button
            id="nav-btn-quote"
            onClick={onOpenQuote}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-95"
          >
            <span>Iniciar Projeto</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:text-white"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('projetos')}
              className="text-left text-base font-medium text-zinc-200 hover:text-cyan-400"
            >
              Projetos
            </button>
            <button
              onClick={() => scrollToSection('servicos')}
              className="text-left text-base font-medium text-zinc-200 hover:text-cyan-400"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className="text-left text-base font-medium text-zinc-200 hover:text-cyan-400"
            >
              Manifesto
            </button>
            <button
              onClick={() => scrollToSection('simulador')}
              className="text-left text-base font-medium text-cyan-400"
            >
              Simulador de Projeto
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="text-left text-base font-medium text-zinc-200 hover:text-cyan-400"
            >
              Contato
            </button>

            <div className="mt-4 flex flex-col gap-2 border-t border-zinc-800 pt-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenDeployGuide();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 text-sm font-semibold text-zinc-200"
              >
                <Terminal className="h-4 w-4 text-cyan-400" />
                Guia VPS & GitHub
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-sm font-bold text-zinc-950"
              >
                Fazer Orçamento
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
