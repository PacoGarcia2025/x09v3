import { ArrowRight, Terminal, ShieldCheck, Zap, Layers, Sparkles, ExternalLink } from 'lucide-react';

interface HeroProps {
  onExploreProjects: () => void;
  onOpenDeployGuide: () => void;
  onOpenEstimator: () => void;
}

export function Hero({ onExploreProjects, onOpenDeployGuide, onOpenEstimator }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle background ambient gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Main Copy */}
          <div className="lg:col-span-7">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Studio x09 • Reconstrução Completa 2025</span>
            </div>

            <h1 className="mt-6 font-['Space_Grotesk'] text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Engenharia digital e design de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">alto impacto</span>.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Criamos websites, sistemas web de alto desempenho e infraestruturas prontas para escala. 
              Do código limpo ao deploy definitivo na sua VPS Linux via GitHub com máxima velocidade.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="hero-btn-explore"
                onClick={onExploreProjects}
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-white/10 transition-all hover:bg-zinc-200 active:scale-95"
              >
                <span>Ver Portfólio</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="hero-btn-estimator"
                onClick={onOpenEstimator}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition-all hover:border-cyan-500/60 hover:bg-zinc-800 hover:text-white"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Simular Orçamento</span>
              </button>

              <button
                id="hero-btn-vps"
                onClick={onOpenDeployGuide}
                className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-700 px-4 py-3.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
              >
                <Terminal className="h-4 w-4 text-zinc-400" />
                <span>Deploy GitHub & VPS</span>
              </button>
            </div>

            {/* Credibility metrics */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-zinc-800/80 pt-8">
              <div>
                <div className="font-['Space_Grotesk'] text-2xl font-bold text-white sm:text-3xl">100%</div>
                <div className="mt-1 text-xs text-zinc-400">Código Limpo & Tipado</div>
              </div>
              <div>
                <div className="font-['Space_Grotesk'] text-2xl font-bold text-cyan-400 sm:text-3xl">0.3s</div>
                <div className="mt-1 text-xs text-zinc-400">Carregamento Médio</div>
              </div>
              <div>
                <div className="font-['Space_Grotesk'] text-2xl font-bold text-white sm:text-3xl">CI/CD</div>
                <div className="mt-1 text-xs text-zinc-400">Deploy Automatizado</div>
              </div>
            </div>
          </div>

          {/* Right Visual: Interactive Simulated Pipeline Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-xl">
              {/* Window controls */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                  <span>studio-x09 ~ pipeline</span>
                </div>
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  ONLINE
                </span>
              </div>

              {/* Pipeline sequence visual */}
              <div className="mt-5 space-y-4 font-mono text-xs">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2 text-cyan-300">
                      <Zap className="h-3.5 w-3.5" /> 1. AI Studio Build
                    </span>
                    <span className="text-[11px] text-emerald-400">✓ Pronto</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Código React 19 + TypeScript + Vite compilado com sucesso.
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2 text-blue-300">
                      <Layers className="h-3.5 w-3.5" /> 2. GitHub Export
                    </span>
                    <span className="text-[11px] text-cyan-400">github.com/sgoliveira16</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Repositório versionado pronto para pull e controle de branch.
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2 text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" /> 3. Hostinger VPS
                    </span>
                    <span className="text-[11px] text-emerald-400">Nginx + SSL Ativo</span>
                  </div>
                  <div className="mt-2 rounded bg-black/80 p-2 text-[10px] text-emerald-400">
                    $ ssh root@vps &apos;cd /var/www/studio-x09 &amp;&amp; git pull &amp;&amp; npm run build&apos;
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs text-zinc-400">
                <span>Arquitetura de Produção</span>
                <button
                  onClick={onOpenDeployGuide}
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  <span>Ver comandos SSH</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
