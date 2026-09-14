import { SERVICES } from '../data/services';
import { Code2, Palette, Server, Cpu, Check, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="h-6 w-6 text-cyan-400" />;
      case 'Palette':
        return <Palette className="h-6 w-6 text-pink-400" />;
      case 'Server':
        return <Server className="h-6 w-6 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="h-6 w-6 text-blue-400" />;
      default:
        return <Code2 className="h-6 w-6 text-cyan-400" />;
    }
  };

  return (
    <section id="servicos" className="scroll-mt-24 border-t border-zinc-800/80 py-20 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            <span>02 // Especialidades</span>
          </div>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Soluções que impulsionam o seu negócio
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Da concepção visual ao servidor em produção. Cada entrega do Studio x09 é arquitetada para velocidade, escalabilidade e longevidade.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 transition-all hover:border-zinc-700 hover:bg-zinc-900/90"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-950">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 font-mono text-[11px] text-zinc-400">
                    {service.badge}
                  </span>
                </div>

                <h3 className="mt-6 font-['Space_Grotesk'] text-xl font-bold text-white sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {service.description}
                </p>

                {/* Deliverables */}
                <div className="mt-6 border-t border-zinc-800/80 pt-6">
                  <div className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                    O que está incluso:
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {service.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Tech Tags & Action */}
              <div className="mt-8 border-t border-zinc-800/80 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {service.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-zinc-800/90 px-2 py-0.5 text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Solicitar Proposta</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
