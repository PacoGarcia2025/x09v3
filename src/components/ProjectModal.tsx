import { Project } from '../types';
import { X, ExternalLink, Github, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onContactForSimilar: (projectTitle: string) => void;
}

export function ProjectModal({ project, onClose, onContactForSimilar }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-400 backdrop-blur-md transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 w-full overflow-hidden bg-zinc-950">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-cyan-500/40 bg-cyan-950/80 px-2.5 py-1 font-mono text-xs font-semibold text-cyan-300">
                {project.categoryLabel}
              </span>
              <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 font-mono text-xs text-zinc-300">
                Ano: {project.year}
              </span>
            </div>
            <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold text-white sm:text-3xl">
              {project.title}
            </h2>
            <p className="text-xs text-zinc-400">Cliente: {project.client}</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 p-6 sm:p-8">
          {/* Key Metrics */}
          {project.metrics && (
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              {project.metrics.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="font-mono text-lg font-bold text-cyan-400 sm:text-xl">
                    {m.value}
                  </div>
                  <div className="text-[11px] text-zinc-400">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Long Description */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Visão Geral
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {project.longDescription}
            </p>
          </div>

          {/* Challenge & Solution */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4">
              <div className="text-xs font-semibold text-rose-400">O Desafio</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {project.challenge}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4">
              <div className="text-xs font-semibold text-emerald-400">A Solução</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Architecture Checklist */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Arquitetura & Engenharia
            </h4>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {project.architecture.map((arch, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{arch}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack badges */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Tecnologias Utilizadas
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-zinc-800 bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse justify-between gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center">
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Fechar Detalhes
            </button>

            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  <span>Ver GitHub</span>
                </a>
              )}
              <button
                onClick={() => {
                  onContactForSimilar(project.title);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-zinc-950 transition-all hover:bg-cyan-400 active:scale-95"
              >
                <span>Quero um projeto similar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
