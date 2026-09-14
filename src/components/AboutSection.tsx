import { TECH_STACK } from '../data/stack';
import { Shield, Zap, Terminal, CheckCircle, Code, Cpu, Server, Database } from 'lucide-react';

interface AboutSectionProps {
  onOpenDeployGuide: () => void;
}

export function AboutSection({ onOpenDeployGuide }: AboutSectionProps) {
  const pillars = [
    {
      title: 'Performance Zero Desperdício',
      desc: 'Nada de bundles pesados ou bibliotecas desnecessárias. Otimizamos cada byte para que seu site abra em menos de 0.5s.',
      icon: <Zap className="h-5 w-5 text-amber-400" />,
    },
    {
      title: 'Autonomia Total de Infraestrutura',
      desc: 'Adeus dependência de plataformas proprietárias com preços abusivos. Hospede seu código na sua própria VPS (Hostinger, AWS) sob seu controle.',
      icon: <Server className="h-5 w-5 text-cyan-400" />,
    },
    {
      title: 'Código Tipado & Manutenível',
      desc: 'TypeScript rigoroso, componentes desacoplados e testes visuais para que sua aplicação dure anos sem quebrar.',
      icon: <Code className="h-5 w-5 text-blue-400" />,
    },
    {
      title: 'Segurança & Deploy Contínuo',
      desc: 'Pipelines automatizados via Git/GitHub, SSL Let\'s Encrypt com renovação periódica e headers de proteção HTTP.',
      icon: <Shield className="h-5 w-5 text-emerald-400" />,
    },
  ];

  return (
    <section id="sobre" className="scroll-mt-24 border-t border-zinc-800/80 py-20 bg-zinc-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Manifesto */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              <span>04 // Manifesto Studio x09</span>
            </div>
            <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engenharia séria para quem valoriza velocidade e estética.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              O <strong className="text-white">Studio x09</strong> nasceu com a missão de eliminar o excesso e entregar softwares e websites com perfeição de engenharia. Acreditamos que um bom projeto digital deve unir beleza visual, fluidez imediata e infraestrutura confiável.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Seja criando uma aplicação do absoluto zero aqui no ambiente do AI Studio, enviando para o seu GitHub ou publicando na sua VPS Hostinger via SSH, você tem controle integral sobre cada linha de código e sobre a sua máquina.
            </p>

            {/* Pillars */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950">
                    {pillar.icon}
                  </div>
                  <h4 className="mt-3 font-['Space_Grotesk'] text-sm font-bold text-white">
                    {pillar.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Stack & Ecosystem */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                  Stack Tecnológica & Ferramentas
                </h3>
                <span className="font-mono text-xs text-cyan-400">
                  Ecosistema 2025
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Padrões consolidados na indústria global para desenvolvimento moderno:
              </p>

              {/* Tech items grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TECH_STACK.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-3.5 transition-all hover:border-zinc-700 hover:bg-zinc-850"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        {tech.name}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400 uppercase tracking-wider">{tech.category}</span>
                      <span className="text-cyan-400 font-medium">{tech.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action card for VPS deployment */}
            <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-blue-950/40 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-zinc-950">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                    Pronto para subir na sua VPS Hostinger?
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Acesse o guia com todos os comandos Nginx, SSL e scripts prontos.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onOpenDeployGuide}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-zinc-700 transition-colors"
                >
                  Abrir Guia de Comandos VPS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
