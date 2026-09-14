import { Terminal, Github, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenDeployGuide: () => void;
}

export function Footer({ onOpenDeployGuide }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-xs font-bold text-cyan-400">
                x09
              </div>
              <span className="font-['Space_Grotesk'] text-base font-bold text-white">
                STUDIO <span className="text-cyan-400">X09</span>
              </span>
            </div>
            <p className="max-w-sm text-xs text-zinc-400">
              Estúdio de tecnologia de alta performance. Desenvolvido para web moderna, repositórios GitHub e servidores VPS Linux.
            </p>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a href="#projetos" className="hover:text-white transition-colors">
              Projetos
            </a>
            <a href="#servicos" className="hover:text-white transition-colors">
              Serviços
            </a>
            <a href="#simulador" className="hover:text-white transition-colors">
              Simulador
            </a>
            <a href="#sobre" className="hover:text-white transition-colors">
              Manifesto
            </a>
            <button
              onClick={onOpenDeployGuide}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Guia Hostinger VPS</span>
            </button>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sgoliveira16"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
              title="Voltar ao topo"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-zinc-800/80 pt-6 text-[11px] text-zinc-400 sm:flex-row sm:items-center">
          <div>
            © {new Date().getFullYear()} Studio x09. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Servidor: Hostinger VPS Ready (Ubuntu 24.04 LTS / Nginx)</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-mono text-zinc-400">v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
